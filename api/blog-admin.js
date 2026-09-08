import { randomUUID } from 'node:crypto'
import sharp from 'sharp'
import { db, fail, json, body, uuidPattern } from '../server/blog-db.js'
import { session, login, cookie, hashPassword, verifyPassword } from '../server/blog-auth.js'
import { validatePost, contentHtml } from '../server/blog-content.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control','private, no-store')
  res.setHeader('X-Robots-Tag','noindex, nofollow')
  try {
    const url = new URL(req.url,'http://localhost'), action = url.searchParams.get('action') || 'posts'
    if (!['GET','POST'].includes(req.method)) { res.setHeader('Allow','GET, POST'); fail(405,'Método não permitido.') }
    if(action === 'login' && req.method === 'POST') return json(res,200,await login(req,res,await body(req,2048)))
    const admin = await session(req,req.method === 'POST'), sql = db()
    if(action === 'session' && req.method === 'GET') return json(res,200,{email:admin.email,csrf:admin.csrf,mustChangePassword:admin.must_change_password})
    if(action === 'logout' && req.method === 'POST') { await sql`DELETE FROM blog_sessions WHERE token_hash=${admin.token_hash}`; cookie(res,'',true); return json(res,200,{ok:true}) }
    if(action === 'password' && req.method === 'POST') {
      const data = await body(req,2048)
      if(typeof data.password !== 'string' || data.password.length<14 || data.password.length>128) fail(400,'Use uma senha de 14 a 128 caracteres.')
      const [record] = await sql`SELECT password_hash FROM blog_admins WHERE id=${admin.id}`
      if(typeof data.currentPassword !== 'string' || data.currentPassword.length>256 || !await verifyPassword(data.currentPassword,record.password_hash)) fail(400,'Senha atual incorreta.')
      const passwordHash = await hashPassword(data.password)
      await sql.transaction([sql`UPDATE blog_admins SET password_hash=${passwordHash},must_change_password=FALSE WHERE id=${admin.id}`,sql`DELETE FROM blog_sessions WHERE admin_id=${admin.id}`])
      cookie(res,'',true); return json(res,200,{ok:true})
    }
    if(admin.must_change_password) fail(403,'Defina sua senha pessoal antes de continuar.')
    if(action === 'posts' && req.method === 'GET') {
      const id = url.searchParams.get('id')
      if(id) { if(!uuidPattern.test(id)) fail(400,'Artigo inválido.'); const [post] = await sql`SELECT * FROM blog_posts WHERE id=${id}`; if(!post) fail(404,'Artigo não encontrado.'); return json(res,200,{post}) }
      const page = Math.max(1,Math.min(10000,Number(url.searchParams.get('page'))||1))
      const posts = await sql`SELECT id,slug,title,category,status,updated_at,version,COUNT(*) OVER()::int AS total FROM blog_posts ORDER BY updated_at DESC LIMIT 30 OFFSET ${(page-1)*30}`
      return json(res,200,{posts,total:posts[0]?.total||0,page})
    }
    if(action === 'preview' && req.method === 'POST') { const data = await body(req,100000); return json(res,200,{html:contentHtml(String(data.body||'').slice(0,80000))}) }
    if(action === 'media' && req.method === 'GET') {
      const id=url.searchParams.get('id'); if(!uuidPattern.test(id||'')) fail(404,'Capa não encontrada.')
      const [media]=await sql`SELECT encode(data,'base64') AS data FROM blog_media WHERE id=${id}`
      if(!media) fail(404,'Capa não encontrada.')
      res.setHeader('Content-Type','image/webp'); return res.end(Buffer.from(media.data,'base64'))
    }
    if(action === 'upload' && req.method === 'POST') {
      const data = await body(req), input=Buffer.from(String(data.image||''),'base64')
      if(input.length>1100000 || input.length<20) fail(400,'Escolha uma imagem de até 1 MB.')
      let output
      try {
        const image=sharp(input,{limitInputPixels:25000000,failOn:'warning'}), metadata=await image.metadata()
        if(!['jpeg','png','webp'].includes(metadata.format) || (metadata.pages||1)>1) fail(400,'Use JPG, PNG ou WebP estático.')
        output=await image.rotate().resize({width:1600,height:1200,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toBuffer()
      } catch { fail(400,'Imagem inválida. Use JPG, PNG ou WebP de até 25 megapixels.') }
      const id=randomUUID()
      await sql`INSERT INTO blog_media(id,data) VALUES(${id},decode(${output.toString('base64')},'base64'))`
      return json(res,201,{id})
    }
    if(action === 'save' && req.method === 'POST') {
      const data=await body(req,100000), p=validatePost(data), id=data.id || randomUUID()
      if(!uuidPattern.test(id)) fail(400,'Artigo inválido.')
      // Serialize slug reservations with each save so redirects cannot be shadowed by concurrent creates.
      const queries=[sql`SELECT pg_advisory_xact_lock(89746321)`]
      if(data.id) {
        if(!Number.isInteger(data.version)||data.version<1) fail(400,'Versão inválida.')
        queries.push(sql`WITH previous AS (SELECT slug FROM blog_posts WHERE id=${id} AND version=${data.version}), updated AS (
          UPDATE blog_posts SET slug=${p.slug},title=${p.title},excerpt=${p.excerpt},body=${p.body},category=${p.category},cover_id=${p.cover_id},cover_alt=${p.cover_alt},seo_title=${p.seo_title},seo_description=${p.seo_description},status=${p.status},published_at=CASE WHEN ${p.status}='published' THEN COALESCE(published_at,NOW()) ELSE published_at END,updated_at=NOW(),version=version+1
          WHERE id=${id} AND version=${data.version} AND NOT EXISTS(SELECT 1 FROM blog_redirects WHERE slug=${p.slug}) RETURNING *
        ), redirect AS (INSERT INTO blog_redirects(slug,post_id) SELECT previous.slug,${id}::uuid FROM previous,updated WHERE previous.slug<>updated.slug ON CONFLICT(slug) DO NOTHING) SELECT * FROM updated`)
      } else queries.push(sql`INSERT INTO blog_posts(id,slug,title,excerpt,body,category,cover_id,cover_alt,seo_title,seo_description,status,published_at) SELECT ${id},${p.slug},${p.title},${p.excerpt},${p.body},${p.category},${p.cover_id},${p.cover_alt},${p.seo_title},${p.seo_description},${p.status},CASE WHEN ${p.status}='published' THEN NOW() ELSE NULL END WHERE NOT EXISTS(SELECT 1 FROM blog_redirects WHERE slug=${p.slug}) RETURNING *`)
      const result=await sql.transaction(queries)
      if(!result[1][0]) fail(409,'A URL está reservada ou o artigo mudou em outra aba. Reabra o artigo antes de salvar.')
      return json(res,200,{post:result[1][0]})
    }
    fail(404,'Ação não encontrada.')
  } catch(error) {
    if(error.code==='23505') return json(res,409,{error:'Esta URL já está em uso. Escolha outra.'})
    if(error.code==='23503') return json(res,400,{error:'A capa não está disponível. Envie novamente.'})
    if(!error.status) console.error('Blog admin failed',error.code || error.name)
    return json(res,error.status||503,{error:error.status?error.message:'O painel está temporariamente indisponível. Tente novamente.'})
  }
}

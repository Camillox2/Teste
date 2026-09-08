import { db, uuidPattern } from '../server/blog-db.js'
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff')
  if(!['GET','HEAD'].includes(req.method)) {res.statusCode=405;return res.end()}
  const id=new URL(req.url,'http://localhost').searchParams.get('id')
  if(!uuidPattern.test(id||'')) {res.statusCode=404;return res.end()}
  try {
    const sql=db(),[media]=await sql`SELECT encode(m.data,'base64') AS data FROM blog_media m WHERE m.id=${id} AND EXISTS(SELECT 1 FROM blog_posts p WHERE p.cover_id=m.id AND p.status='published')`
    if(!media) {res.statusCode=404;return res.end()}
    res.setHeader('Content-Type','image/webp');res.end(req.method==='HEAD'?'':Buffer.from(media.data,'base64'))
  } catch {res.statusCode=503;res.end()}
}

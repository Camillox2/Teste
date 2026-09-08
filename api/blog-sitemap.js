import { db, ORIGIN } from '../server/blog-db.js'
import { paths } from '../src/seo.js'
import { escape } from '../server/blog-content.js'
export default async function handler(req,res) {
  res.setHeader('Content-Type','application/xml; charset=utf-8');res.setHeader('Cache-Control','no-store')
  if(!['GET','HEAD'].includes(req.method)) {res.statusCode=405;return res.end()}
  try {
    const sql=db(),page=new URL(req.url,ORIGIN).searchParams.get('page')
    let xml
    if(!page) {
      const [count]=await sql`SELECT COUNT(*)::int AS total FROM blog_posts WHERE status='published'`
      xml=`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${ORIGIN}/sitemap-pages.xml</loc></sitemap>${Array.from({length:Math.ceil(count.total/45000)},(_,i)=>`<sitemap><loc>${ORIGIN}/sitemap-blog-${i+1}.xml</loc></sitemap>`).join('')}</sitemapindex>`
    } else if(page==='static') xml=`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...paths,'/blog'].map(p=>`<url><loc>${ORIGIN}${p}</loc></url>`).join('')}</urlset>`
    else {
      if(!/^[1-9][0-9]{0,4}$/.test(page)) {res.statusCode=404;return res.end()}
      const posts=await sql`SELECT slug,updated_at FROM blog_posts WHERE status='published' ORDER BY id LIMIT 45000 OFFSET ${(Number(page)-1)*45000}`
      if(!posts.length) {res.statusCode=404;return res.end()}
      xml=`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${posts.map(p=>`<url><loc>${ORIGIN}/blog/${escape(p.slug)}</loc><lastmod>${new Date(p.updated_at).toISOString()}</lastmod></url>`).join('')}</urlset>`
    }
    res.end(req.method==='HEAD'?'':`<?xml version="1.0" encoding="UTF-8"?>${xml}`)
  } catch {res.statusCode=503;res.setHeader('Retry-After','60');res.end()}
}

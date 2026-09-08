// Local adapter exercises the same Node handlers and URL rewrites as Vercel.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname } from 'node:path'
import admin from '../api/blog-admin.js'
import page from '../api/blog-page.js'
import media from '../api/blog-media.js'
import sitemap from '../api/blog-sitemap.js'
const root=resolve('dist'),config=JSON.parse(await readFile('vercel.json','utf8'))
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.xml':'application/xml','.txt':'text/plain','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'}
createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://127.0.0.1:5182'),path=url.pathname
    if(path.startsWith('/admin'))for(const h of config.headers[0].headers)res.setHeader(h.key,h.value)
    const rewrite=(handler,extra={})=>{for(const [k,v]of Object.entries(extra))url.searchParams.set(k,v);req.url=url.pathname+url.search;return handler(req,res)}
    if(path==='/api/blog-admin')return await admin(req,res)
    if(path==='/api/blog-page'||path==='/blog')return await page(req,res)
    if(path==='/api/blog-media')return await media(req,res)
    if(path==='/api/blog-sitemap'||path==='/sitemap.xml')return await sitemap(req,res)
    if(path==='/sitemap-pages.xml')return await rewrite(sitemap,{page:'static'})
    if(/^\/sitemap-blog-[0-9]+\.xml$/.test(path))return await rewrite(sitemap,{page:path.match(/blog-(\d+)/)[1]})
    if(path.startsWith('/blog/capa/'))return await rewrite(media,{id:path.slice(11)})
    if(/^\/blog\/[^/]+$/.test(path))return await rewrite(page,{slug:decodeURIComponent(path.slice(6))})
    let file=resolve(root,'.'+decodeURIComponent(path))
    if(file!==root&&!file.startsWith(root+'\\')&&!file.startsWith(root+'/')){res.statusCode=403;return res.end()}
    if(path==='/')file=resolve(root,'index.html')
    else if(!extname(file))file+='.html'
    try{if(!(await stat(file)).isFile())throw Error()}catch{res.statusCode=404;file=resolve(root,'404.html')}
    res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.end(await readFile(file))
  }catch(error){console.error(error.code||error.name);if(!res.headersSent)res.statusCode=500;res.end('Local server error')}
}).listen(5182,'127.0.0.1',()=>console.log('Blog + site: http://127.0.0.1:5182'))

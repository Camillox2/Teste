import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { db } from '../server/blog-db.js'
const sql=db()
const articles=[
 {slug:'como-organizar-cotacao-equipamentos-para-clinica',title:'Uma cotação mais clara para sua clínica: o que informar e comparar',excerpt:'Modelo, quantidade, entrega e condições da proposta. Organize as informações para comparar equipamentos com mais clareza e conversar com os fornecedores.',category:'Para clínicas',file:'cotacao',image:'carrinho-emergencia',alt:'Carrinho de emergência hospitalar em imagem de referência do catálogo YR.'},
 {slug:'como-preparar-casa-entrega-cama-hospitalar',title:'Antes da cama chegar: um guia para planejar a entrega em casa',excerpt:'Portas, elevador, espaço e recebimento: veja quais informações reunir antes de combinar a entrega de uma cama hospitalar com a equipe da YR.',category:'Cuidado em casa',file:'entrega',image:'cama-hospitalar',alt:'Cama hospitalar articulada em um ambiente de cuidado, em imagem de referência.'}
]
for(const a of articles){
  const [existing]=await sql`SELECT id FROM blog_posts WHERE slug=${a.slug}`
  if(existing){console.log('Existing article preserved:',a.slug);continue}
  const id=randomUUID(),cover=randomUUID(),body=await readFile(`content/blog/${a.file}.md`,'utf8'),image=await readFile(`public/products/${a.image}.webp`)
  await sql.transaction([sql`INSERT INTO blog_media(id,data) VALUES(${cover},decode(${image.toString('base64')},'base64'))`,sql`INSERT INTO blog_posts(id,slug,title,excerpt,body,category,cover_id,cover_alt,seo_description,status,published_at) VALUES(${id},${a.slug},${a.title},${a.excerpt},${body},${a.category},${cover},${a.alt},${a.excerpt.slice(0,170)},'published',NOW())`])
  console.log('Published starter article:',a.slug)
}

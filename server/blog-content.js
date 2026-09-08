import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import { fail, uuidPattern } from './blog-db.js'
export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
export function contentHtml(markdown) {
  return sanitizeHtml(marked.parse(String(markdown || ''), { async: false }), {
    allowedTags: ['p','h2','h3','h4','strong','em','ul','ol','li','blockquote','a','hr','br','code','pre','table','thead','tbody','tr','th','td'],
    allowedAttributes: { a: ['href','title','rel'] }, allowedSchemes: ['https','http','mailto'], allowProtocolRelative: false,
    transformTags: { a: (tag, attributes) => ({ tagName:tag, attribs:{...attributes,rel:'noopener noreferrer'} }) }
  })
}
export function validatePost(data) {
  const result = {}
  for (const [name, max, min] of [['title',150,5],['slug',120,3],['excerpt',350,0],['body',80000,0],['category',60,1],['cover_alt',180,0],['seo_title',70,0],['seo_description',170,0]]) {
    if (typeof data[name] !== 'string') fail(400, `Campo inválido: ${name}.`)
    result[name] = data[name].trim()
    if(result[name].length > max || result[name].length < min) fail(400, `Revise o campo ${name}.`)
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result.slug)) fail(400, 'Use letras minúsculas, números e hífens na URL.')
  if (!['draft','published','archived'].includes(data.status)) fail(400, 'Status inválido.')
  result.status = data.status
  result.cover_id = data.cover_id || null
  if (result.cover_id && !uuidPattern.test(result.cover_id)) fail(400, 'Capa inválida.')
  if (data.status === 'published' && (result.body.length < 200 || result.excerpt.length < 40 || (result.cover_id && !result.cover_alt))) fail(400, 'Para publicar, escreva o artigo (mínimo 200 caracteres), resumo (mínimo 40) e descrição da capa.')
  return result
}

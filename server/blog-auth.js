import { randomBytes, createHash, scrypt as scryptCb, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { db, fail, ORIGIN } from './blog-db.js'
const scrypt = promisify(scryptCb)
const options = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 }
export const digest = value => createHash('sha256').update(value).digest('hex')
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${(await scrypt(password, salt, 64, options)).toString('hex')}`
}
export async function verifyPassword(password, stored) {
  const [salt, hex] = stored.split(':')
  const hash = await scrypt(password, salt, 64, options)
  return hex.length === 128 && timingSafeEqual(hash, Buffer.from(hex, 'hex'))
}
export function sameOrigin(req) {
  const allowed = [ORIGIN]
  if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') allowed.push('http://127.0.0.1:5182', 'http://localhost:5182')
  if (!allowed.includes(req.headers.origin)) fail(403, 'Origem não permitida.')
}
export function cookie(res, token, clear = false) {
  res.setHeader('Set-Cookie', `yr_admin=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${clear ? 0 : 43200}${process.env.VERCEL || process.env.NODE_ENV === 'production' ? '; Secure' : ''}`)
}
export async function session(req, mutation = false) {
  const token = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith('yr_admin='))?.slice(9)
  if (!token || !/^[a-f0-9]{64}$/.test(token)) fail(401, 'Entre para continuar.')
  const sql = db()
  const [row] = await sql`SELECT s.token_hash, s.csrf, a.id, a.email, a.must_change_password FROM blog_sessions s JOIN blog_admins a ON a.id=s.admin_id WHERE s.token_hash=${digest(token)} AND s.expires_at > NOW()`
  if (!row) fail(401, 'Sua sessão terminou. Entre novamente.')
  if (mutation) { sameOrigin(req); if (req.headers['x-csrf-token'] !== row.csrf) fail(403, 'Atualize a página e tente novamente.') }
  return row
}
export async function login(req, res, data) {
  sameOrigin(req)
  const email = String(data.email || '').trim().toLowerCase().slice(0, 254)
  const password = String(data.password || '')
  if (password.length > 256) fail(400, 'Credenciais inválidas.')
  const sql = db()
  // Vercel overwrites x-real-ip; never trust a client supplied forwarding chain.
  const ip = process.env.VERCEL ? req.headers['x-real-ip'] || 'unknown' : req.socket?.remoteAddress || 'local'
  for (const key of [digest(`ip:${ip}`), digest(`email:${email}`)]) {
    const [rate] = await sql`INSERT INTO blog_login_limits (key, attempts, expires_at) VALUES (${key}, 1, NOW()+INTERVAL '15 minutes') ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN blog_login_limits.expires_at<NOW() THEN 1 ELSE blog_login_limits.attempts+1 END, expires_at=CASE WHEN blog_login_limits.expires_at<NOW() THEN NOW()+INTERVAL '15 minutes' ELSE blog_login_limits.expires_at END RETURNING attempts`
    if (rate.attempts > 10) { res.setHeader('Retry-After', '900'); fail(429, 'Muitas tentativas. Aguarde 15 minutos.') }
  }
  const [admin] = await sql`SELECT * FROM blog_admins WHERE email=${email}`
  const valid = await verifyPassword(password, admin?.password_hash || `${'0'.repeat(32)}:${'0'.repeat(128)}`)
  if (!admin || !valid) fail(401, 'E-mail ou senha incorretos.')
  const token = randomBytes(32).toString('hex'), csrf = randomBytes(32).toString('hex')
  await sql.transaction([
    sql`DELETE FROM blog_sessions WHERE expires_at<NOW()`,
    sql`DELETE FROM blog_login_limits WHERE expires_at<NOW() OR key=${digest(`email:${email}`)} OR key=${digest(`ip:${ip}`)}`,
    sql`INSERT INTO blog_sessions(token_hash,admin_id,csrf,expires_at) VALUES(${digest(token)},${admin.id},${csrf},NOW()+INTERVAL '12 hours')`
  ])
  cookie(res, token)
  return { email: admin.email, csrf, mustChangePassword: admin.must_change_password }
}

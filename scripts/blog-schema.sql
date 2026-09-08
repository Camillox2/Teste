CREATE TABLE IF NOT EXISTS blog_admins (
 id UUID PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
 must_change_password BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS blog_sessions (
 token_hash TEXT PRIMARY KEY, admin_id UUID NOT NULL REFERENCES blog_admins(id) ON DELETE CASCADE,
 csrf TEXT NOT NULL, expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS blog_sessions_expiry ON blog_sessions(expires_at);
CREATE TABLE IF NOT EXISTS blog_login_limits (key TEXT PRIMARY KEY, attempts INTEGER NOT NULL, expires_at TIMESTAMPTZ NOT NULL);
CREATE TABLE IF NOT EXISTS blog_media (
 id UUID PRIMARY KEY, data BYTEA NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS blog_posts (
 id UUID PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, excerpt TEXT NOT NULL DEFAULT '',
 body TEXT NOT NULL DEFAULT '', category TEXT NOT NULL DEFAULT 'Guia YR',
 cover_id UUID REFERENCES blog_media(id), cover_alt TEXT NOT NULL DEFAULT '',
 seo_title TEXT NOT NULL DEFAULT '', seo_description TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
 published_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 version INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS blog_posts_public ON blog_posts(published_at DESC) WHERE status='published';
CREATE TABLE IF NOT EXISTS blog_redirects (slug TEXT PRIMARY KEY, post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE);

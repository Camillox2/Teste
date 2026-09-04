import { useMemo, useState } from 'react'
import { siteConfig } from './config.js'

const heroBed = '/hero-bed.webp'

const products = [
  {
    id: 1,
    name: 'Cama hospitalar articulada',
    category: 'Camas',
    description: 'Conforto, segurança e múltiplas posições para recuperação e cuidados diários.',
    image: heroBed,
    sale: true,
    rent: true,
    featured: true,
  },
  {
    id: 2,
    name: 'Carrinho de emergência',
    category: 'Emergência',
    description: 'Organização prática de medicamentos, insumos e equipamentos essenciais.',
    image: 'https://vitalscheffer.com.br/revenda_curitiba/assets/carrinho-emergencia.png',
    sale: true,
    rent: false,
  },
  {
    id: 3,
    name: 'Maca hidráulica',
    category: 'Macas',
    description: 'Mobilidade, estabilidade e ajuste de altura para rotinas clínicas e hospitalares.',
    image: 'https://vitalscheffer.com.br/revenda_curitiba/assets/maca-hidraulica.png',
    sale: true,
    rent: true,
  },
  {
    id: 4,
    name: 'Biombo hospitalar',
    category: 'Mobiliário',
    description: 'Privacidade e praticidade para consultórios, clínicas, hospitais e home care.',
    image: 'https://vitalscheffer.com.br/revenda_curitiba/assets/biombo.png',
    sale: true,
    rent: false,
  },
  {
    id: 5,
    name: 'Mesa de refeição hospitalar',
    category: 'Acessórios',
    description: 'Apoio regulável para refeições, leitura e atividades durante a recuperação.',
    image: 'https://vitalscheffer.com.br/revenda_curitiba/assets/mesa-refeicao.png',
    sale: true,
    rent: true,
  },
  {
    id: 6,
    name: 'Cama manual 3 movimentos',
    category: 'Camas',
    description: 'Versatilidade para posicionamento do paciente com estrutura resistente.',
    image: 'https://vitalscheffer.com.br/revenda_curitiba/assets/cama-manual-3mov.png',
    sale: true,
    rent: true,
  },
]

function Icon({ name, size = 20 }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    truck: <><path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    shield: <><path d="M12 3 5 6v5c0 4.6 2.7 8 7 10 4.3-2 7-5.4 7-10V6z"/><path d="m9 12 2 2 4-4"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />,
    box: <><path d="m21 8-9 5-9-5"/><path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M12 13v8"/></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    close: <><path d="M6 6l12 12"/><path d="m18 6-12 12"/></>,
  }

  return <svg {...props}>{paths[name]}</svg>
}

function Logo() {
  return (
    <a className="logo" href="#inicio" aria-label="Grupo YR Hospitalar - início">
      <span className="logo-mark"><span>Y</span><span>R</span></span>
      <span className="logo-copy">
        <strong>Grupo YR</strong>
        <small>Hospitalar</small>
      </span>
    </a>
  )
}

function App() {
  const [mode, setMode] = useState('todos')
  const [selected, setSelected] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const visibleProducts = useMemo(() => {
    if (mode === 'comprar') return products.filter((p) => p.sale)
    if (mode === 'alugar') return products.filter((p) => p.rent)
    return products
  }, [mode])

  const contactUrl = (product, action = 'orçamento') => {
    const message = `Olá! Tenho interesse em ${action} para ${product?.name || 'um equipamento hospitalar'}. Pode me ajudar?`
    if (siteConfig.whatsapp) {
      return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`
    }
    return `mailto:${siteConfig.email}?subject=${encodeURIComponent('Orçamento - Grupo YR Hospitalar')}&body=${encodeURIComponent(message)}`
  }

  const handleContact = (product, action) => {
    window.location.href = contactUrl(product, action)
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Logo />
          <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Navegação principal">
            <a href="#produtos" onClick={() => setMenuOpen(false)}>Produtos</a>
            <a href="#solucoes" onClick={() => setMenuOpen(false)}>Soluções</a>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</a>
            <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>
          </nav>
          <a className="header-cta" href="#produtos">Ver produtos <Icon name="arrow" size={17} /></a>
          <button className="menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menu">
            <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <h1>Equipamentos hospitalares para cuidar melhor, todos os dias.</h1>
              <p>Venda e locação com atendimento próximo para famílias, cuidadores, clínicas e hospitais. Escolha o equipamento certo sem complicação.</p>
              <div className="hero-actions">
                <a className="btn primary" href="#produtos">Explorar produtos <Icon name="arrow" size={18} /></a>
                <a className="btn secondary" href="#contato">Solicitar orientação</a>
              </div>
              <div className="hero-proof">
                <span><Icon name="check" size={17} /> Venda e locação</span>
                <span><Icon name="check" size={17} /> Atendimento humano</span>
                <span><Icon name="check" size={17} /> Soluções hospitalares</span>
              </div>
            </div>

            <div className="hero-visual" aria-label="Cama hospitalar articulada">
              <div className="hero-card">
                <img src={heroBed} alt="Cama hospitalar articulada" />
              </div>
              <div className="floating-note note-top">
                <span className="note-icon"><Icon name="heart" size={18} /></span>
                <span><small>Cuidado que aproxima</small><strong>Conforto + segurança</strong></span>
              </div>
              <div className="floating-note note-bottom">
                <span className="note-icon"><Icon name="box" size={18} /></span>
                <span><small>Precisa rápido?</small><strong>Peça uma cotação</strong></span>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Diferenciais">
          <div className="container trust-grid">
            <div><Icon name="heart" /><span><strong>Atendimento próximo</strong><small>Escolha com orientação</small></span></div>
            <div><Icon name="truck" /><span><strong>Entrega combinada</strong><small>Agilidade e organização</small></span></div>
            <div><Icon name="shield" /><span><strong>Mais segurança</strong><small>Equipamentos adequados ao cuidado</small></span></div>
          </div>
        </section>

        <section className="solutions" id="solucoes">
          <div className="container solutions-grid">
            <div className="section-heading sticky-heading">
              <span className="eyeline">Uma solução para cada momento</span>
              <h2>Comprar ou alugar? Você escolhe o que faz mais sentido.</h2>
              <p>Para uso temporário, recuperação longa ou estrutura profissional, a YR ajuda a encontrar uma opção prática e adequada.</p>
            </div>
            <div className="solution-stack">
              <article className="solution-row">
                <span className="solution-number">01</span>
                <div><h3>Locação para necessidades temporárias</h3><p>Ideal para recuperação, home care e períodos em que comprar não compensa.</p></div>
              </article>
              <article className="solution-row">
                <span className="solution-number">02</span>
                <div><h3>Venda para uso contínuo</h3><p>Escolha o equipamento e tenha uma solução definitiva para casa, clínica ou instituição.</p></div>
              </article>
              <article className="solution-row">
                <span className="solution-number">03</span>
                <div><h3>Atendimento consultivo</h3><p>Explique a necessidade e receba ajuda para comparar modelos, movimentos e aplicações.</p></div>
              </article>
            </div>
          </div>
        </section>

        <section className="products-section" id="produtos">
          <div className="container">
            <div className="products-header">
              <div className="section-heading">
                <span className="eyeline">Catálogo inicial</span>
                <h2>Equipamentos para cuidado, mobilidade e rotina hospitalar.</h2>
              </div>
              <div className="mode-switch" role="tablist" aria-label="Filtrar produtos">
                {[
                  ['todos', 'Todos'],
                  ['comprar', 'Comprar'],
                  ['alugar', 'Alugar'],
                ].map(([value, label]) => (
                  <button key={value} className={mode === value ? 'active' : ''} onClick={() => setMode(value)}>{label}</button>
                ))}
              </div>
            </div>

            <div className="product-grid">
              {visibleProducts.map((product) => (
                <article className={product.featured ? 'product-card featured' : 'product-card'} key={product.id}>
                  <button className="product-image" onClick={() => setSelected(product)} aria-label={`Ver ${product.name}`}>
                    <img src={product.image} alt={product.name} loading={product.featured ? 'eager' : 'lazy'} />
                  </button>
                  <div className="product-body">
                    <div className="product-meta"><span>{product.category}</span><span>{product.sale && 'Venda'}{product.sale && product.rent && ' • '}{product.rent && 'Locação'}</span></div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-actions">
                      <button className="text-button" onClick={() => setSelected(product)}>Ver detalhes <Icon name="arrow" size={16} /></button>
                      <button className="quote-button" onClick={() => handleContact(product, mode === 'alugar' ? 'locação' : 'orçamento')}>Cotação</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="how" id="como-funciona">
          <div className="container">
            <div className="section-heading centered">
              <span className="eyeline">Simples do início ao fim</span>
              <h2>Você explica a necessidade. A gente ajuda a resolver.</h2>
            </div>
            <div className="how-grid">
              <article><span>1</span><h3>Conte o que você precisa</h3><p>Produto, uso, prazo e local de atendimento.</p></article>
              <article><span>2</span><h3>Compare as opções</h3><p>Receba uma indicação objetiva para compra ou locação.</p></article>
              <article><span>3</span><h3>Feche com atendimento humano</h3><p>Alinhe pagamento, disponibilidade e entrega com nossa equipe.</p></article>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contato">
          <div className="container contact-panel">
            <div>
              <span className="eyeline light">Fale com a YR</span>
              <h2>Quer montar uma cotação ou tirar uma dúvida?</h2>
              <p>Conte o que você está procurando e nossa equipe ajuda a encontrar uma solução adequada.</p>
            </div>
            <div className="contact-actions">
              <a className="btn light-btn" href={`mailto:${siteConfig.email}`}>Enviar e-mail <Icon name="arrow" size={18} /></a>
              <span>{siteConfig.email}</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div><Logo /><p>Soluções hospitalares para cuidado domiciliar e profissional.</p></div>
          <div><strong>Navegação</strong><a href="#produtos">Produtos</a><a href="#solucoes">Soluções</a><a href="#como-funciona">Como funciona</a></div>
          <div><strong>Contato</strong><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><span>Brasil</span></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 Grupo YR Hospitalar.</span><span>Venda e locação de equipamentos hospitalares.</span></div>
      </footer>

      {selected ? (
        <div className="modal-backdrop" onMouseDown={() => setSelected(null)}>
          <div className="product-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Detalhes de ${selected.name}`}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Fechar"><Icon name="close" /></button>
            <div className="modal-image"><img src={selected.image} alt={selected.name} /></div>
            <div className="modal-copy">
              <span className="eyeline">{selected.category}</span>
              <h2>{selected.name}</h2>
              <p>{selected.description}</p>
              <div className="modal-points">
                <span><Icon name="check" size={17} /> Atendimento para pessoa física e empresas</span>
                {selected.sale ? <span><Icon name="check" size={17} /> Disponível para venda</span> : null}
                {selected.rent ? <span><Icon name="check" size={17} /> Consulte locação</span> : null}
              </div>
              <div className="modal-actions">
                {selected.sale ? <button className="btn primary" onClick={() => handleContact(selected, 'compra')}>Quero comprar</button> : null}
                {selected.rent ? <button className="btn secondary" onClick={() => handleContact(selected, 'locação')}>Quero alugar</button> : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App

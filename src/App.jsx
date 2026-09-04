import { useEffect, useMemo, useState } from 'react'
import { siteConfig } from './config.js'

const heroBed = '/hero-bed.webp'
const logoImage = '/yr-logo.webp'

const products = [
  {
    id: 1,
    name: 'Cama hospitalar articulada',
    category: 'Camas',
    description: 'Conforto, segurança e múltiplas posições para recuperação, home care e cuidados diários.',
    image: heroBed,
    sale: true,
    rent: true,
    featured: true,
    idealFor: 'Recuperação pós-operatória, idosos, pessoas com mobilidade reduzida e cuidados prolongados.',
    benefits: ['Mais conforto no posicionamento', 'Facilita a rotina do cuidador', 'Opção de compra ou locação'],
  },
  {
    id: 2,
    name: 'Carrinho de emergência',
    category: 'Emergência',
    description: 'Organização prática de medicamentos, insumos e equipamentos essenciais para atendimento profissional.',
    image: 'https://vitalscheffer.com.br/revenda_curitiba/assets/carrinho-emergencia.png',
    sale: true,
    rent: false,
    idealFor: 'Clínicas, consultórios, unidades de atendimento e ambientes hospitalares.',
    benefits: ['Organização rápida', 'Acesso facilitado a insumos', 'Uso profissional'],
  },
  {
    id: 3,
    name: 'Maca hidráulica',
    category: 'Macas',
    description: 'Mobilidade, estabilidade e ajuste de altura para rotinas clínicas, hospitalares e transporte interno.',
    image: 'https://vitalscheffer.com.br/revenda_curitiba/assets/maca-hidraulica.png',
    sale: true,
    rent: true,
    idealFor: 'Clínicas, hospitais e atendimentos que exigem mobilidade e regulagem de altura.',
    benefits: ['Ajuste de altura', 'Mais ergonomia no atendimento', 'Mobilidade facilitada'],
  },
  {
    id: 4,
    name: 'Biombo hospitalar',
    category: 'Mobiliário',
    description: 'Privacidade e praticidade para consultórios, clínicas, hospitais e ambientes de home care.',
    image: 'https://vitalscheffer.com.br/revenda_curitiba/assets/biombo.png',
    sale: true,
    rent: false,
    idealFor: 'Ambientes que precisam criar privacidade de forma rápida e flexível.',
    benefits: ['Privacidade no atendimento', 'Fácil movimentação', 'Aplicação versátil'],
  },
  {
    id: 5,
    name: 'Mesa de refeição hospitalar',
    category: 'Acessórios',
    description: 'Apoio regulável para refeições, leitura e atividades durante a recuperação do paciente.',
    image: 'https://vitalscheffer.com.br/revenda_curitiba/assets/mesa-refeicao.png',
    sale: true,
    rent: true,
    idealFor: 'Pacientes acamados ou com mobilidade reduzida em casa, clínicas e instituições.',
    benefits: ['Mais autonomia', 'Altura regulável', 'Uso diário simples'],
  },
  {
    id: 6,
    name: 'Cama manual 3 movimentos',
    category: 'Camas',
    description: 'Versatilidade para posicionamento do paciente com estrutura resistente e operação simples.',
    image: 'https://vitalscheffer.com.br/revenda_curitiba/assets/cama-manual-3mov.png',
    sale: true,
    rent: true,
    idealFor: 'Uso domiciliar ou institucional que precisa de ajustes essenciais com bom custo-benefício.',
    benefits: ['Movimentos essenciais', 'Estrutura funcional', 'Compra ou locação'],
  },
]

const faqs = [
  {
    q: 'É melhor comprar ou alugar um equipamento hospitalar?',
    a: 'Depende principalmente do tempo de uso, da frequência e do orçamento. A locação costuma fazer mais sentido para necessidades temporárias. A compra tende a ser mais interessante quando o uso será prolongado ou recorrente. A equipe da YR pode ajudar a comparar as duas opções antes de você decidir.',
  },
  {
    q: 'A YR atende pessoas físicas e empresas?',
    a: 'Sim. O atendimento foi pensado tanto para famílias e cuidadores quanto para clínicas, consultórios e outras operações profissionais de saúde.',
  },
  {
    q: 'Posso pedir orientação antes de escolher o produto?',
    a: 'Sim. Você pode explicar o cenário, o período de uso e a necessidade principal. A proposta da YR é tornar a escolha mais simples, sem exigir que o cliente já saiba exatamente qual modelo precisa.',
  },
  {
    q: 'Como funciona a entrega?',
    a: 'Prazo, região atendida e condições de entrega são confirmados na cotação, conforme o produto e a disponibilidade. Assim, tudo fica alinhado antes da contratação.',
  },
  {
    q: 'Os valores aparecem no site?',
    a: 'Nesta versão, os valores são informados por cotação. Isso permite considerar disponibilidade, modalidade de compra ou locação, período de uso e condições de entrega antes de fechar.',
  },
]

const trustItems = [
  {
    icon: 'people',
    title: 'Atendimento direto',
    text: 'Você fala com uma equipe enxuta e próxima, sem depender de uma central impessoal.',
  },
  {
    icon: 'compare',
    title: 'Compra e locação lado a lado',
    text: 'A YR ajuda a comparar as alternativas para você escolher pelo uso, não pela pressão de venda.',
  },
  {
    icon: 'chat',
    title: 'Orientação antes da decisão',
    text: 'Conte o cenário e receba ajuda para entender qual tipo de equipamento faz mais sentido.',
  },
  {
    icon: 'document',
    title: 'Cotação clara',
    text: 'Disponibilidade, modalidade e condições são alinhadas antes da contratação.',
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
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />,
    truck: <><path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    shield: <><path d="M12 3 5 6v5c0 4.6 2.7 8 7 10 4.3-2 7-5.4 7-10V6z"/><path d="m9 12 2 2 4-4"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    close: <><path d="M6 6l12 12"/><path d="m18 6-12 12"/></>,
    chat: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 9h8"/><path d="M8 13h5"/></>,
    people: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    compare: <><path d="M7 7h11"/><path d="m15 4 3 3-3 3"/><path d="M17 17H6"/><path d="m9 14-3 3 3 3"/></>,
    document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></>,
    building: <><path d="M4 21V4h12v17"/><path d="M16 9h4v12"/><path d="M8 8h4"/><path d="M8 12h4"/><path d="M8 16h4"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></>,
  }

  return <svg {...props}>{paths[name]}</svg>
}

function BrandLogo({ compact = false }) {
  return (
    <a className={`brand-logo ${compact ? 'brand-logo--compact' : ''}`} href="#inicio" aria-label="Grupo YR Hospitalar - início">
      <span className="brand-logo__mark">
        <img src={logoImage} alt="YR" />
      </span>
      <span className="brand-logo__copy">
        <strong>Grupo YR</strong>
        <small>Hospitalar</small>
      </span>
    </a>
  )
}

function App() {
  const [mode, setMode] = useState('todos')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [legalOpen, setLegalOpen] = useState(null)
  const [openFaq, setOpenFaq] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interest: 'Orientação',
    product: 'Ainda não sei',
    message: '',
  })

  const hasWhatsApp = Boolean(siteConfig.whatsapp?.trim())

  const visibleProducts = useMemo(() => {
    if (mode === 'comprar') return products.filter((product) => product.sale)
    if (mode === 'alugar') return products.filter((product) => product.rent)
    return products
  }, [mode])

  useEffect(() => {
    const modalOpen = Boolean(selectedProduct || contactOpen || legalOpen)
    if (!modalOpen) return undefined

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedProduct(null)
        setContactOpen(false)
        setLegalOpen(null)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [selectedProduct, contactOpen, legalOpen])

  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const createContactUrl = ({ product, action = 'orçamento', details = '' } = {}) => {
    const message = [
      'Olá! Vim pelo site do Grupo YR Hospitalar.',
      product ? `Produto: ${product.name || product}` : null,
      action ? `Interesse: ${action}` : null,
      details || null,
      'Pode me orientar?',
    ].filter(Boolean).join('\n')

    if (hasWhatsApp) {
      return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`
    }

    return `mailto:${siteConfig.email}?subject=${encodeURIComponent('Cotação - Grupo YR Hospitalar')}&body=${encodeURIComponent(message)}`
  }

  const handleProductContact = (product, action) => {
    window.location.href = createContactUrl({ product, action })
  }

  const openContactFor = (interest = 'Orientação', product = 'Ainda não sei') => {
    setFormData((current) => ({ ...current, interest, product }))
    setContactOpen(true)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    const details = [
      formData.name ? `Nome: ${formData.name}` : null,
      formData.phone ? `Telefone: ${formData.phone}` : null,
      formData.message ? `Mensagem: ${formData.message}` : null,
    ].filter(Boolean).join('\n')

    const url = createContactUrl({
      product: formData.product === 'Ainda não sei' ? null : formData.product,
      action: formData.interest,
      details,
    })

    if (hasWhatsApp) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = url
    }
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <BrandLogo />
          <nav className={menuOpen ? 'nav nav--open' : 'nav'} aria-label="Navegação principal">
            <a href="#produtos" onClick={() => setMenuOpen(false)}>Produtos</a>
            <a href="#comprar-alugar" onClick={() => setMenuOpen(false)}>Comprar ou alugar</a>
            <a href="#porque-yr" onClick={() => setMenuOpen(false)}>Por que YR</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>Dúvidas</a>
          </nav>
          <button className="header-cta" onClick={() => openContactFor('Orientação')}>Falar com a YR <Icon name="arrow" size={17} /></button>
          <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>
            <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-glow hero-glow--one" />
          <div className="hero-glow hero-glow--two" />
          <div className="container hero-grid">
            <div className="hero-copy" data-reveal>
              <span className="kicker">Venda e locação de equipamentos hospitalares</span>
              <h1>Equipamentos certos. <em>Cuidado mais simples.</em></h1>
              <p>
                Soluções para famílias, cuidadores, clínicas e hospitais com uma diferença importante:
                você não precisa escolher sozinho.
              </p>
              <div className="hero-actions">
                <a className="btn btn--primary" href="#produtos">Explorar produtos <Icon name="arrow" size={18} /></a>
                <button className="btn btn--secondary" onClick={() => openContactFor('Orientação')}>Preciso de ajuda para escolher</button>
              </div>
              <div className="hero-proof">
                <span><Icon name="check" size={17} /> Compra ou locação</span>
                <span><Icon name="check" size={17} /> Atendimento direto</span>
                <span><Icon name="check" size={17} /> Cotação personalizada</span>
              </div>
            </div>

            <div className="hero-visual" data-reveal>
              <div className="hero-visual__frame">
                <div className="hero-visual__label">Cuidado hospitalar e home care</div>
                <img src={heroBed} alt="Cama hospitalar articulada" />
              </div>
              <div className="hero-floating hero-floating--top">
                <span><Icon name="heart" size={19} /></span>
                <div><small>Mais que catálogo</small><strong>Orientação humana</strong></div>
              </div>
              <div className="hero-floating hero-floating--bottom">
                <span><Icon name="compare" size={19} /></span>
                <div><small>Compare antes de decidir</small><strong>Comprar × Alugar</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section className="quick-trust" aria-label="Diferenciais rápidos">
          <div className="container quick-trust__grid">
            <article data-reveal><Icon name="chat" size={26} /><div><strong>Atendimento próximo</strong><span>Converse antes de decidir</span></div></article>
            <article data-reveal><Icon name="compare" size={26} /><div><strong>Venda e locação</strong><span>Escolha pelo seu cenário</span></div></article>
            <article data-reveal><Icon name="truck" size={26} /><div><strong>Entrega alinhada</strong><span>Condições confirmadas na cotação</span></div></article>
          </div>
        </section>

        <section className="decision-section" id="comprar-alugar">
          <div className="container">
            <div className="section-heading section-heading--center" data-reveal>
              <span className="eyeline">Comprar ou alugar?</span>
              <h2>A melhor escolha depende do seu momento.</h2>
              <p>A YR coloca as duas alternativas lado a lado para você decidir com mais clareza.</p>
            </div>

            <div className="decision-grid">
              <article className="decision-card decision-card--rent" data-reveal>
                <div className="decision-card__top">
                  <span className="decision-icon"><Icon name="clock" size={26} /></span>
                  <span className="decision-label">Locação</span>
                </div>
                <h3>Boa escolha para necessidades temporárias.</h3>
                <ul>
                  <li><Icon name="check" size={17} /> Recuperação pós-operatória</li>
                  <li><Icon name="check" size={17} /> Home care por período determinado</li>
                  <li><Icon name="check" size={17} /> Necessidade imediata sem compra definitiva</li>
                  <li><Icon name="check" size={17} /> Quando você ainda não sabe por quanto tempo vai usar</li>
                </ul>
                <button onClick={() => openContactFor('Alugar')}>Quero avaliar locação <Icon name="arrow" size={17} /></button>
              </article>

              <article className="decision-card decision-card--buy" data-reveal>
                <div className="decision-card__top">
                  <span className="decision-icon"><Icon name="home" size={26} /></span>
                  <span className="decision-label">Compra</span>
                </div>
                <h3>Faz sentido quando o uso será recorrente ou prolongado.</h3>
                <ul>
                  <li><Icon name="check" size={17} /> Necessidade permanente ou de longo prazo</li>
                  <li><Icon name="check" size={17} /> Clínicas, instituições e operações profissionais</li>
                  <li><Icon name="check" size={17} /> Equipamento que precisa estar sempre disponível</li>
                  <li><Icon name="check" size={17} /> Investimento em estrutura própria</li>
                </ul>
                <button onClick={() => openContactFor('Comprar')}>Quero avaliar compra <Icon name="arrow" size={17} /></button>
              </article>
            </div>

            <div className="decision-help" data-reveal>
              <div>
                <span className="decision-help__icon"><Icon name="info" size={22} /></span>
                <div><strong>Ainda não sabe qual escolher?</strong><p>Explique o cenário e a YR ajuda você a comparar sem compromisso.</p></div>
              </div>
              <button className="btn btn--dark" onClick={() => openContactFor('Orientação')}>Quero orientação</button>
            </div>
          </div>
        </section>

        <section className="products-section" id="produtos">
          <div className="container">
            <div className="products-head" data-reveal>
              <div className="section-heading">
                <span className="eyeline">Catálogo inicial</span>
                <h2>Soluções para cuidado, mobilidade e rotina hospitalar.</h2>
                <p>Veja os principais itens e peça uma cotação personalizada para o seu cenário.</p>
              </div>
              <div className="filter-tabs" role="tablist" aria-label="Filtrar produtos">
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
                <article className={`product-card ${product.featured ? 'product-card--featured' : ''}`} key={product.id} data-reveal>
                  <button className="product-media" onClick={() => setSelectedProduct(product)} aria-label={`Ver detalhes de ${product.name}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      loading={product.featured ? 'eager' : 'lazy'}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                        event.currentTarget.parentElement.classList.add('product-media--fallback')
                      }}
                    />
                    <span className="image-fallback">Imagem em atualização</span>
                  </button>
                  <div className="product-card__body">
                    <div className="product-meta">
                      <span>{product.category}</span>
                      <span>{product.sale && 'Venda'}{product.sale && product.rent && ' • '}{product.rent && 'Locação'}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-actions">
                      <button className="product-link" onClick={() => setSelectedProduct(product)}>Ver detalhes <Icon name="arrow" size={16} /></button>
                      <button className="product-quote" onClick={() => openContactFor(mode === 'alugar' ? 'Alugar' : 'Cotação', product.name)}>Pedir cotação</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="why-section" id="porque-yr">
          <div className="container why-grid">
            <div className="section-heading why-intro" data-reveal>
              <span className="eyeline">Por que confiar na YR?</span>
              <h2>Um atendimento mais próximo em um momento que pede clareza.</h2>
              <p>
                Equipamento hospitalar não é uma compra qualquer. Em vez de apenas mostrar um catálogo,
                a proposta da YR é entender a necessidade e facilitar a decisão.
              </p>
              <div className="brand-statement">
                <img src={logoImage} alt="Símbolo YR" />
                <div><small>Nosso jeito de atender</small><strong>Menos pressão. Mais orientação.</strong></div>
              </div>
            </div>

            <div className="why-cards">
              {trustItems.map((item) => (
                <article key={item.title} data-reveal>
                  <span className="why-icon"><Icon name={item.icon} size={24} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="difference-section">
          <div className="container difference-box" data-reveal>
            <div className="difference-copy">
              <span className="eyeline eyeline--light">O diferencial da YR</span>
              <h2>Não é só vender equipamento. É ajudar a encontrar a solução certa.</h2>
              <p>
                A YR nasce com uma operação enxuta, o que permite um contato mais direto e uma jornada simples:
                entender, comparar, cotar e combinar a entrega.
              </p>
            </div>
            <div className="difference-list">
              <div><span>01</span><strong>Você explica o cenário</strong><p>Sem precisar chegar sabendo exatamente qual modelo procurar.</p></div>
              <div><span>02</span><strong>A YR ajuda a comparar</strong><p>Compra, locação e tipo de equipamento são avaliados pelo contexto de uso.</p></div>
              <div><span>03</span><strong>Você decide com clareza</strong><p>A contratação acontece somente depois de alinhar disponibilidade e condições.</p></div>
            </div>
          </div>
        </section>

        <section className="audience-section">
          <div className="container">
            <div className="section-heading section-heading--center" data-reveal>
              <span className="eyeline">Para quem atendemos</span>
              <h2>Do cuidado em casa à rotina profissional.</h2>
            </div>
            <div className="audience-grid">
              <article data-reveal><span><Icon name="home" size={28} /></span><h3>Famílias e cuidadores</h3><p>Soluções para recuperação, mobilidade e cuidados diários no ambiente domiciliar.</p></article>
              <article data-reveal><span><Icon name="heart" size={28} /></span><h3>Home care</h3><p>Equipamentos que ajudam a organizar um cuidado mais confortável e funcional em casa.</p></article>
              <article data-reveal><span><Icon name="building" size={28} /></span><h3>Clínicas e instituições</h3><p>Itens para complementar estrutura, atendimento e rotina operacional de saúde.</p></article>
            </div>
          </div>
        </section>

        <section className="process-section" id="como-funciona">
          <div className="container">
            <div className="section-heading section-heading--center" data-reveal>
              <span className="eyeline">Como funciona</span>
              <h2>Quatro passos, sem complicação.</h2>
            </div>
            <div className="process-grid">
              <article data-reveal><span>1</span><h3>Conte a necessidade</h3><p>Explique para quem é, o tipo de uso e por quanto tempo pretende utilizar.</p></article>
              <article data-reveal><span>2</span><h3>Compare opções</h3><p>Entenda quais produtos e modalidades fazem mais sentido para o cenário.</p></article>
              <article data-reveal><span>3</span><h3>Receba a cotação</h3><p>Disponibilidade, modalidade e condições são alinhadas antes do fechamento.</p></article>
              <article data-reveal><span>4</span><h3>Combine a entrega</h3><p>Prazo e logística são confirmados conforme o produto e a região atendida.</p></article>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="container about-box" data-reveal>
            <div className="about-logo"><img src={logoImage} alt="Logo YR" /></div>
            <div className="about-copy">
              <span className="eyeline">Sobre o Grupo YR Hospitalar</span>
              <h2>Uma operação próxima, criada para facilitar uma decisão importante.</h2>
              <p>
                O Grupo YR Hospitalar começa com uma equipe enxuta e atendimento direto. Isso permite acompanhar cada solicitação de perto,
                entender o contexto e buscar uma solução adequada para quem precisa comprar ou alugar equipamentos hospitalares.
              </p>
              <p className="about-note">A proposta é simples: tecnologia para agilizar o contato e pessoas para cuidar da decisão.</p>
            </div>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="container faq-grid">
            <div className="section-heading faq-heading" data-reveal>
              <span className="eyeline">Dúvidas frequentes</span>
              <h2>Antes de fechar, tire suas dúvidas.</h2>
              <p>Se ainda faltar alguma informação, fale diretamente com a YR.</p>
              <button className="btn btn--secondary" onClick={() => openContactFor('Orientação')}>Falar com a equipe</button>
            </div>
            <div className="faq-list">
              {faqs.map((item, index) => {
                const active = openFaq === index
                return (
                  <article className={active ? 'faq-item faq-item--open' : 'faq-item'} key={item.q} data-reveal>
                    <button onClick={() => setOpenFaq(active ? -1 : index)} aria-expanded={active}>
                      <span>{item.q}</span><span>{active ? '−' : '+'}</span>
                    </button>
                    <div className="faq-answer"><p>{item.a}</p></div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="cta-section" id="contato">
          <div className="container cta-box" data-reveal>
            <div>
              <span className="eyeline eyeline--light">Precisa de um equipamento?</span>
              <h2>Conte a situação. A YR ajuda você a escolher o próximo passo.</h2>
              <p>Compra, locação ou apenas uma orientação inicial — comece pela conversa.</p>
            </div>
            <div className="cta-actions">
              <button className="btn btn--light" onClick={() => openContactFor('Orientação')}>Solicitar orientação <Icon name="arrow" size={18} /></button>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <BrandLogo compact />
            <p>Venda e locação de equipamentos hospitalares com atendimento próximo e orientação.</p>
          </div>
          <div className="footer-column">
            <strong>Navegação</strong>
            <a href="#produtos">Produtos</a>
            <a href="#comprar-alugar">Comprar ou alugar</a>
            <a href="#porque-yr">Por que YR</a>
            <a href="#faq">Dúvidas</a>
          </div>
          <div className="footer-column">
            <strong>Contato</strong>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <button onClick={() => openContactFor('Orientação')}>Solicitar cotação</button>
          </div>
          <div className="footer-column">
            <strong>Legal</strong>
            <button onClick={() => setLegalOpen('privacy')}>Política de Privacidade</button>
            <button onClick={() => setLegalOpen('terms')}>Termos de Uso</button>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 Grupo YR Hospitalar. Todos os direitos reservados.</span>
          <span>Imagens e informações de produtos podem variar conforme disponibilidade.</span>
        </div>
      </footer>

      <button className="floating-contact" onClick={() => openContactFor('Cotação')}>
        <span><Icon name="chat" size={20} /></span>
        <strong>{hasWhatsApp ? 'WhatsApp' : 'Pedir cotação'}</strong>
      </button>

      {selectedProduct ? (
        <div className="modal-backdrop" onMouseDown={() => setSelectedProduct(null)}>
          <section className="product-modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Detalhes de ${selectedProduct.name}`}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Fechar"><Icon name="close" size={20} /></button>
            <div className="product-modal__media">
              <img src={selectedProduct.image} alt={selectedProduct.name} onError={(event) => { event.currentTarget.style.display = 'none' }} />
            </div>
            <div className="product-modal__content">
              <span className="eyeline">{selectedProduct.category}</span>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <div className="product-modal__ideal">
                <small>Indicado para</small>
                <strong>{selectedProduct.idealFor}</strong>
              </div>
              <ul>
                {selectedProduct.benefits.map((benefit) => <li key={benefit}><Icon name="check" size={17} /> {benefit}</li>)}
              </ul>
              <div className="product-modal__actions">
                {selectedProduct.sale ? <button className="btn btn--primary" onClick={() => handleProductContact(selectedProduct, 'compra')}>Quero comprar</button> : null}
                {selectedProduct.rent ? <button className="btn btn--secondary" onClick={() => handleProductContact(selectedProduct, 'locação')}>Quero alugar</button> : null}
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {contactOpen ? (
        <div className="modal-backdrop" onMouseDown={() => setContactOpen(false)}>
          <section className="contact-modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="contact-title">
            <button className="modal-close" onClick={() => setContactOpen(false)} aria-label="Fechar"><Icon name="close" size={20} /></button>
            <div className="contact-modal__intro">
              <img src={logoImage} alt="YR" />
              <span className="eyeline eyeline--light">Atendimento Grupo YR</span>
              <h2 id="contact-title">Conte o que você precisa.</h2>
              <p>Deixe as informações principais e leve a conversa pronta para o atendimento.</p>
              <div className="contact-modal__bullets">
                <span><Icon name="check" size={17} /> Compra ou locação</span>
                <span><Icon name="check" size={17} /> Pessoa física ou empresa</span>
                <span><Icon name="check" size={17} /> Orientação antes da escolha</span>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleFormSubmit}>
              <label>
                <span>Nome</span>
                <input value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} placeholder="Seu nome" required />
              </label>
              <label>
                <span>WhatsApp / telefone</span>
                <input type="tel" value={formData.phone} onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))} placeholder="(00) 00000-0000" />
              </label>
              <div className="form-row">
                <label>
                  <span>Interesse</span>
                  <select value={formData.interest} onChange={(event) => setFormData((current) => ({ ...current, interest: event.target.value }))}>
                    <option>Orientação</option>
                    <option>Cotação</option>
                    <option>Comprar</option>
                    <option>Alugar</option>
                  </select>
                </label>
                <label>
                  <span>Produto</span>
                  <select value={formData.product} onChange={(event) => setFormData((current) => ({ ...current, product: event.target.value }))}>
                    <option>Ainda não sei</option>
                    {products.map((product) => <option key={product.id}>{product.name}</option>)}
                  </select>
                </label>
              </div>
              <label>
                <span>Mensagem</span>
                <textarea rows="5" value={formData.message} onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))} placeholder="Ex.: preciso para uso domiciliar por cerca de 60 dias..." required />
              </label>
              <button className="btn btn--primary contact-submit" type="submit">{hasWhatsApp ? 'Continuar no WhatsApp' : 'Enviar solicitação'} <Icon name="arrow" size={18} /></button>
              <small className="form-privacy">Ao enviar, você concorda com o uso dos dados para responder à sua solicitação. <button type="button" onClick={() => { setContactOpen(false); setLegalOpen('privacy') }}>Ver Política de Privacidade.</button></small>
            </form>
          </section>
        </div>
      ) : null}

      {legalOpen ? (
        <div className="modal-backdrop" onMouseDown={() => setLegalOpen(null)}>
          <section className="legal-modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={legalOpen === 'privacy' ? 'Política de Privacidade' : 'Termos de Uso'}>
            <button className="modal-close" onClick={() => setLegalOpen(null)} aria-label="Fechar"><Icon name="close" size={20} /></button>
            {legalOpen === 'privacy' ? (
              <div className="legal-content">
                <span className="eyeline">Privacidade e LGPD</span>
                <h2>Política de Privacidade</h2>
                <p className="legal-updated">Última atualização: setembro de 2026</p>
                <h3>1. Quais dados podemos receber</h3>
                <p>Quando você solicita atendimento, podemos receber dados informados por você, como nome, telefone, e-mail, produto de interesse e o conteúdo da mensagem enviada.</p>
                <h3>2. Para que usamos esses dados</h3>
                <p>Usamos as informações para responder solicitações, preparar cotações, dar continuidade ao atendimento e organizar comunicações relacionadas ao pedido ou interesse apresentado.</p>
                <h3>3. Compartilhamento</h3>
                <p>Os dados não são vendidos. Eles podem ser processados por fornecedores de tecnologia necessários para operar o site, e-mail, hospedagem e canais de atendimento, sempre de acordo com a finalidade do serviço.</p>
                <h3>4. Retenção e segurança</h3>
                <p>Buscamos manter os dados apenas pelo período necessário para atendimento, obrigações legais e legítima organização comercial, adotando medidas razoáveis de segurança compatíveis com a operação.</p>
                <h3>5. Seus direitos</h3>
                <p>Nos termos da LGPD, você pode solicitar informações sobre seus dados, correção, exclusão quando aplicável e outras providências previstas em lei.</p>
                <h3>6. Contato</h3>
                <p>Para assuntos de privacidade, entre em contato pelo e-mail <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
                <div className="legal-note"><Icon name="info" size={18} /><span>Este texto deve ser revisado quando novos recursos forem adicionados, como checkout, cookies de marketing, analytics avançado ou integrações que alterem o tratamento de dados.</span></div>
              </div>
            ) : (
              <div className="legal-content">
                <span className="eyeline">Uso do site</span>
                <h2>Termos de Uso</h2>
                <p className="legal-updated">Última atualização: setembro de 2026</p>
                <h3>1. Finalidade do site</h3>
                <p>O site apresenta o Grupo YR Hospitalar, seus produtos e modalidades de venda ou locação, além de facilitar solicitações de contato e cotação.</p>
                <h3>2. Cotações e disponibilidade</h3>
                <p>Informações de disponibilidade, preços, prazos, entrega e condições comerciais são confirmadas pela equipe antes da contratação. O envio de um formulário não representa aceite automático de pedido.</p>
                <h3>3. Informações e imagens</h3>
                <p>Descrições e imagens têm finalidade informativa. Características, modelos e disponibilidade podem variar, e os dados finais do produto serão confirmados durante o atendimento.</p>
                <h3>4. Uso responsável</h3>
                <p>O conteúdo do site não substitui orientação médica, fisioterapêutica ou de outro profissional de saúde. A escolha de equipamentos deve considerar a necessidade individual e, quando apropriado, recomendação profissional.</p>
                <h3>5. Alterações</h3>
                <p>Estes termos podem ser atualizados conforme o site, os produtos e os serviços evoluírem.</p>
                <h3>6. Contato</h3>
                <p>Dúvidas podem ser enviadas para <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
              </div>
            )}
          </section>
        </div>
      ) : null}
    </div>
  )
}

export default App

import { useState } from 'react'
import { BrandLogo } from './App.jsx'
import { faqs } from './catalog.js'
import { siteConfig } from './config.js'
import ProductCarousel from './ProductCarousel.jsx'
import DecisionGuide from './DecisionGuide.jsx'
import ShowroomCatalog from './ShowroomCatalog.jsx'
import ProductInspector from './ProductInspector.jsx'

export default function HomeExperience({onContact,onLegal,onGuide}) {
  const [menu,setMenu]=useState(false)
  return <div className="yr3">
    <header className="yr3-header"><div className="yr3-width yr3-header-inner"><BrandLogo/><nav className={menu?'yr3-nav is-open':'yr3-nav'} id="yr3-menu" aria-label="Navegação principal">{[['#produtos','Equipamentos'],['#conheca-de-perto','Conheça de perto'],['#comprar-alugar','Compra ou locação'],['#faq','Dúvidas']].map(([href,label])=><a key={href} href={href} onClick={()=>setMenu(false)}>{label}</a>)}</nav><button className="yr3-button yr3-header-contact" onClick={()=>onContact('Orientação')}>Vamos conversar <span aria-hidden="true">↗</span></button><button className="yr3-menu-toggle" onClick={()=>setMenu(value=>!value)} aria-label={menu?'Fechar menu':'Abrir menu'} aria-controls="yr3-menu" aria-expanded={menu}>{menu?'×':<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>}</button></div></header>
    <main id="conteudo">
      <section className="yr3-hero" id="inicio"><div className="yr3-width yr3-hero-top"><div><h1>O cuidado começa<br/>com a <em>escolha certa.</em></h1></div><div className="yr3-hero-intro"><p>Equipamentos hospitalares para comprar ou alugar, em casa ou na sua clínica.</p><div className="showroom-hero-actions"><a className="yr3-button" href="#produtos">Explorar equipamentos <span aria-hidden="true">→</span></a><button className="yr3-button yr3-button--soft" onClick={()=>onContact('Orientação')}>Conversar com a YR <span aria-hidden="true">↗</span></button></div></div></div><ProductCarousel/></section>
      <ShowroomCatalog onContact={onContact}/>
      <ProductInspector/>

      <div className="yr3-guide"><DecisionGuide onContinue={onGuide}/></div>

      <section className="yr3-about yr3-section" id="porque-yr"><div className="yr3-width yr3-about-grid"><div className="yr3-about-image"><img src="/products/cama-manual-3mov.webp" width="1000" height="1000" loading="lazy" alt="Cama hospitalar em ambiente de cuidado"/><div className="yr3-brand-card"><img src="/yr-hospitalar-logo.jpg" width="1280" height="1280" alt="Logo original do Grupo YR Hospitalar — Soluções que transformam saúde"/></div></div><div><p className="yr3-eyebrow">O JEITO YR DE CUIDAR</p><h2>A escolha é sua.<br/>A atenção é nossa.</h2><p className="yr3-body">O Grupo YR Hospitalar trabalha com venda e locação de equipamentos hospitalares para famílias, cuidadores, clínicas e instituições. A proposta é entender o seu contexto e facilitar cada etapa da escolha.</p><div className="yr3-reasons">{[['01','Conversa de verdade','Conte sua necessidade e receba orientação comercial antes de decidir.'],['02','Opções lado a lado','Compare compra, locação e as condições de cada equipamento.'],['03','Tudo combinado','Modelo, disponibilidade, valores e entrega são alinhados na cotação.']].map(([number,title,text])=><div key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div><button className="yr3-button" onClick={()=>onContact('Orientação')}>Conhecer minhas opções ↗</button></div></div></section>

      <section className="yr3-journey yr3-section" id="como-funciona"><div className="yr3-width"><div className="yr3-section-heading"><h2>Do primeiro contato<br/>ao próximo passo.</h2><p>Uma jornada simples, com as condições claras antes da contratação.</p></div><div className="yr3-steps">{[['01','Conte o cenário','Local, período previsto e equipamento desejado.'],['02','Compare as opções','Compra ou locação conforme sua necessidade.'],['03','Receba a cotação','Confirme modelo, disponibilidade e condições.'],['04','Combine a entrega','Prazo, acesso e logística alinhados com a equipe.']].map(([n,title,text])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="yr3-faq yr3-section" id="faq"><div className="yr3-width yr3-faq-grid"><div><p className="yr3-eyebrow">PODE PERGUNTAR</p><h2>Mais clareza.<br/>Menos dúvidas.</h2><p className="yr3-body">O primeiro passo não precisa ser uma decisão. Pode ser uma conversa.</p><button className="yr3-button yr3-button--soft" onClick={()=>onContact('Orientação')}>Falar com a equipe ↗</button></div><div>{faqs.map((item,index)=><details key={item.q} open={index===0}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div></div></section>

      <section className="yr3-contact" id="contato"><div className="yr3-width yr3-contact-box"><div><p className="yr3-eyebrow">VAMOS ENCONTRAR SEU PRÓXIMO PASSO</p><h2>Um cuidado melhor<br/>começa na conversa.</h2><p>Conte o que você precisa. A YR ajuda a comparar as possibilidades.</p></div><div><button className="yr3-button yr3-button--white" onClick={()=>onContact('Orientação')}>Conversar com a YR <span aria-hidden="true">↗</span></button><a className="yr3-email" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div></div></section>
    </main>
    <footer className="yr3-footer"><div className="yr3-width yr3-footer-grid"><BrandLogo/><div><strong>Explore</strong><a href="#produtos">Equipamentos</a><a href="/comprar-ou-alugar">Guia de compra e locação</a><a href="#porque-yr">Sobre a YR</a></div><div><strong>Converse</strong><a href={`https://wa.me/${siteConfig.whatsapp}`}>WhatsApp: (41) 99724-4279</a><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div><div><strong>Informações</strong><button onClick={()=>onLegal('privacy')}>Privacidade</button><button onClick={()=>onLegal('terms')}>Termos de uso</button></div></div><div className="yr3-width yr3-footer-bottom"><span>© 2026 Grupo YR Hospitalar.</span><span>Modelos e disponibilidade são confirmados na cotação.</span></div></footer>
  </div>
}

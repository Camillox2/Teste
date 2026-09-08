import { useMemo, useState } from 'react'
import { products, productPath } from './catalog.js'
import { useSelection, fitsPlace } from './SelectionContext.jsx'

const orderedProducts = [1, 5, 4, 3, 2, 6].map(id => products.find(product => product.id === id))
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export default function ShowroomCatalog({ onContact }) {
  const { selection, choose, setPlace } = useSelection()
  const [mode, setMode] = useState('todos')
  const [query, setQuery] = useState('')
  const environmentProducts = useMemo(() => products.filter(product => fitsPlace(product, selection.place)), [selection.place])
  const visible = useMemo(() => environmentProducts.filter(product => (mode !== 'alugar' || product.rent) && normalize(`${product.name} ${product.category}`).includes(normalize(query.trim()))), [environmentProducts, mode, query])
  const visibleIds = new Set(visible.map(product => product.id))
  const changePlace = place => { setPlace(place); setQuery('') }
  return <section className="showroom-catalog yr3-section" id="produtos"><div className="yr3-width">
    <div className="environment-heading"><h2>Onde o cuidado acontece?</h2><p>Uma seleção para a sua rotina.</p></div>
    <div className="environment-options" role="group" aria-label="Escolher ambiente">
      {[
        { id: 'home', title: 'Para cuidar em casa', text: 'Apoio para famílias e cuidadores.', image: products[0].image },
        { id: 'clinic', title: 'Para minha clínica', text: 'Equipamentos para a rotina profissional.', image: products[2].image },
      ].map(place => <button key={place.id} className={`environment-option ${selection.place === place.id ? 'is-active' : ''}`} aria-pressed={selection.place === place.id} onClick={() => changePlace(place.id)}><div className="environment-photo"><img src={place.image} alt="" width="800" height="500" loading="lazy"/><span className="environment-check" aria-hidden="true">{selection.place === place.id ? '✓' : '↗'}</span></div><div><strong>{place.title}</strong><span>{place.text}</span></div></button>)}
    </div>
    <div className="catalog-context"><p aria-live="polite">{selection.place === 'home' ? 'Camas, apoio às refeições e privacidade para o cuidado em casa.' : selection.place === 'clinic' ? 'Conheça o catálogo para clínicas, consultórios e instituições.' : 'Explore todos os ambientes ou escolha um para começar.'}</p>{selection.place !== 'all' && <button onClick={() => changePlace('all')}>Ver todos os ambientes <span aria-hidden="true">↗</span></button>}</div>
    <div className="yr3-catalog-controls"><div className="yr3-segments" role="group" aria-label="Filtrar produtos">{[['todos', 'Todos'], ['comprar', 'Comprar'], ['alugar', 'Alugar']].map(([value, label]) => <button key={value} aria-label={label} aria-pressed={mode === value} className={mode === value ? 'is-active' : ''} onClick={() => setMode(value)}>{label}<span aria-hidden="true">{environmentProducts.filter(product => value !== 'alugar' || product.rent).length}</span></button>)}</div><label className="yr3-search"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><span className="sr-only">Buscar equipamento</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar cama, maca, biombo…"/></label></div>
    <p className="yr3-result-count" aria-live="polite">{visible.length} {visible.length === 1 ? 'equipamento encontrado' : 'equipamentos encontrados'}</p>
    {!visible.length && <div className="yr3-empty"><h3>Vamos encontrar uma alternativa?</h3><p>Consulte a equipe sobre o equipamento que você procura.</p><button className="yr3-button" onClick={() => onContact('Orientação')}>Consultar a YR ↗</button><button className="yr3-button yr3-button--soft" onClick={() => { setMode('todos'); setQuery(''); setPlace('all') }}>Limpar filtros</button></div>}
    <div className="showroom-catalog-grid">{orderedProducts.map((product, index) => {
      const selected = selection.slug === product.slug
      return <article key={product.id} data-product-id={product.id} hidden={!visibleIds.has(product.id)} className={`showroom-product ${[0, 3].includes(index) ? 'showroom-product--feature' : 'showroom-product--compact'} ${index === 3 ? 'showroom-product--reverse' : ''} ${selected ? 'is-selected' : ''}`}>
        <a className="showroom-product-photo" href={productPath(product)} aria-label={`Conhecer ${product.name}`}><img src={product.image} alt={product.name} width="1000" height="1000" loading="lazy" decoding="async"/></a>
        <div className="showroom-product-copy"><span className="showroom-category">{product.category} · {product.rent ? 'Compra e locação' : 'Compra'}</span><h3><a href={productPath(product)}>{product.name}</a></h3><p>{product.description}</p><div className="showroom-product-actions"><button className="yr3-button" aria-label={`Selecionar ${product.name}`} aria-pressed={selected} onClick={() => choose(product, mode === 'alugar' ? 'Alugar' : mode === 'comprar' ? 'Comprar' : undefined)}>{selected ? 'Na sua seleção' : 'Escolher equipamento'}<span aria-hidden="true">{selected ? '✓' : '+'}</span></button><a className="yr3-button yr3-button--soft" href={productPath(product)}>Ver detalhes <span aria-hidden="true">↗</span></a></div></div>
      </article>
    })}</div>
  </div></section>
}

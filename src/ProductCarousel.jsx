import { useEffect, useRef, useState } from 'react'
import { products, productPath } from './catalog.js'
import { useSelection } from './SelectionContext.jsx'

export default function ProductCarousel() {
  const track = useRef(null)
  const [active, setActive] = useState(0)
  const { choose, selection } = useSelection()
  const drag = useRef(null)
  const dragged = useRef(false)
  useEffect(() => {
    const element = track.current
    let frame
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const center = element.scrollLeft + element.clientWidth / 2
        let closest = 0, distance = Infinity
        Array.from(element.children).forEach((slide,index) => {
          const delta = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center)
          if(delta < distance) { closest = index; distance = delta }
        })
        setActive(current => current === closest ? current : closest)
      })
    }
    element.addEventListener('scroll',update,{passive:true})
    window.addEventListener('resize',update)
    update()
    return () => {cancelAnimationFrame(frame); element.removeEventListener('scroll',update); window.removeEventListener('resize',update)}
  },[])
  const go = index => {
    const el = track.current, slide = el.children[index]
    if(!slide)return
    el.scrollTo({left:slide.offsetLeft - (el.clientWidth-slide.offsetWidth)/2,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})
  }
  const startDrag = event => {
    dragged.current = false
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button')) return
    drag.current = { x: event.clientX, scroll: track.current.scrollLeft, pointer: event.pointerId }
  }
  const moveDrag = event => {
    if (!drag.current) return
    const delta = event.clientX - drag.current.x
    if (!dragged.current && Math.abs(delta) < 8) return
    dragged.current = true
    track.current.setPointerCapture(event.pointerId)
    track.current.style.scrollSnapType = 'none'
    track.current.scrollLeft = drag.current.scroll - delta
    event.preventDefault()
  }
  const endDrag = () => {
    if (!drag.current) return
    if (track.current.hasPointerCapture(drag.current.pointer)) track.current.releasePointerCapture(drag.current.pointer)
    drag.current = null
    track.current.style.scrollSnapType = ''
    if (dragged.current) {
      const el = track.current
      const nearest = Array.from(el.children).reduce((best, slide, index) => Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - (el.scrollLeft + el.clientWidth / 2)) < best.distance ? { index, distance: Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - (el.scrollLeft + el.clientWidth / 2)) } : best, { index: 0, distance: Infinity })
      go(nearest.index)
    }
  }
  return <section className="showcase" aria-label="Equipamentos em destaque" aria-roledescription="carrossel">
    <div className="showcase-track" ref={track} tabIndex="0" aria-label="Galeria de equipamentos. Use as setas ou deslize." onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onPointerLeave={()=>{if(!dragged.current)drag.current=null}} onDragStart={event=>event.preventDefault()} onClickCapture={event=>{if(dragged.current){event.preventDefault();event.stopPropagation();dragged.current=false}}} onKeyDown={event=>{
      if(event.key==='ArrowRight'){event.preventDefault();go(Math.min(active+1,products.length-1))}
      if(event.key==='ArrowLeft'){event.preventDefault();go(Math.max(active-1,0))}
    }}>
      {products.map((product,index)=><article className={`showcase-slide ${index===active?'is-current':''}`} style={{'--slide-side':Math.sign(index-active)}} key={product.id} aria-label={`${index+1} de ${products.length}: ${product.name}`} aria-roledescription="slide">
        <a className="showcase-image" href={productPath(product)} tabIndex={index===active?0:-1}><img src={product.image} alt={product.name} width="1000" height="1000" loading={index<2?'eager':'lazy'} fetchPriority={index===0?'high':'auto'} draggable="false" /></a>
        <div className="showcase-caption"><div><span>{product.rent?'Compra e locação':'Compra'}</span><h2>{product.name}</h2></div><button onClick={()=>choose(product)} tabIndex={index===active?0:-1} className="showcase-cta" aria-label={`Escolher ${product.name}`}><span>{selection.slug===product.slug?'Selecionado':'Escolher'}</span><span aria-hidden="true">{selection.slug===product.slug?'✓':'→'}</span></button></div>
      </article>)}
    </div>
    <div className="showcase-controls"><button onClick={()=>go(active-1)} disabled={active===0} aria-label="Equipamento anterior">←</button><span aria-live="polite"><strong>{String(active+1).padStart(2,'0')}</strong> / {String(products.length).padStart(2,'0')}</span><button onClick={()=>go(active+1)} disabled={active===products.length-1} aria-label="Próximo equipamento">→</button></div>
    <div className="showcase-progress" role="group" aria-label="Posição na galeria">{products.map((product,index)=><button key={product.id} aria-label={`Mostrar ${product.name}`} aria-pressed={active===index} onClick={()=>go(index)}><span className={active===index?'is-active':''}/></button>)}</div>
    <p className="showcase-hint">Deslize para explorar</p>
  </section>
}

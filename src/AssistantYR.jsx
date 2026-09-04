import { useEffect, useRef, useState } from 'react'
import { siteConfig } from './config.js'

const starterMessages = [
  {
    role: 'model',
    text: 'Olá! Sou o Assistente YR. Posso ajudar a entender se faz mais sentido comprar ou alugar e quais equipamentos podem atender melhor ao seu cenário. Não faço diagnóstico médico. Como posso ajudar?',
  },
]

const quickActions = [
  'Preciso de uma cama hospitalar',
  'Quero saber se compensa alugar',
  'Não sei qual equipamento preciso',
]

function SparkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.7A8.5 8.5 0 1 1 20.5 11.6Z" />
      <path d="M8.4 7.9c.2-.4.4-.4.7-.4h.4c.2 0 .4.1.5.4l.8 1.9c.1.3 0 .5-.2.7l-.6.7c-.2.2-.2.4-.1.6.4.8 1 1.5 1.7 2.1.7.6 1.5 1 2.3 1.3.3.1.5 0 .7-.2l.7-.9c.2-.3.5-.3.8-.2l1.8.9c.3.1.4.3.4.5 0 .3-.2 1.4-.8 1.9-.5.5-1.3.8-2.2.7-1.1-.1-2.6-.5-4.4-1.6-1.6-1-2.8-2.3-3.6-3.5-.8-1.2-1.3-2.5-1.2-3.5 0-.6.3-1.1.6-1.4Z" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}

export default function AssistantYR() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(starterMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastModel, setLastModel] = useState('')
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    const updateFloatingAction = () => {
      const threshold = Math.max(260, window.innerHeight * 0.38)
      setShowWhatsApp(window.scrollY > threshold)
    }

    updateFloatingAction()
    window.addEventListener('scroll', updateFloatingAction, { passive: true })
    window.addEventListener('resize', updateFloatingAction)
    return () => {
      window.removeEventListener('scroll', updateFloatingAction)
      window.removeEventListener('resize', updateFloatingAction)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    })
  }, [messages, loading, open])

  const whatsappUrl = (text) => `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`

  const openWhatsAppLead = () => {
    const text = 'Olá! Vim pelo site do Grupo YR Hospitalar e gostaria de receber orientação sobre compra ou locação de equipamentos hospitalares.'
    window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer')
  }

  const humanContact = () => {
    const text = 'Olá! Vim pelo Assistente YR e gostaria de falar com uma pessoa sobre equipamentos hospitalares.'
    if (siteConfig.whatsapp?.trim()) {
      window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer')
      return
    }
    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent('Atendimento humano - Grupo YR Hospitalar')}&body=${encodeURIComponent(text)}`
  }

  const send = async (forcedText) => {
    const text = (forcedText ?? input).trim()
    if (!text || loading) return

    const nextMessages = [...messages, { role: 'user', text }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.error || 'Assistente indisponível')

      setMessages((current) => [...current, { role: 'model', text: data.reply }])
      setLastModel(data.model || '')
    } catch (error) {
      setMessages((current) => [...current, {
        role: 'model',
        text: 'Não consegui acessar a IA agora. Você pode continuar pelo atendimento humano e a equipe da YR assume daqui.',
        error: true,
      }])
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (event) => {
    event.preventDefault()
    send()
  }

  return (
    <>
      <div className={`yr-floating-action ${showWhatsApp ? 'yr-floating-action--whatsapp' : 'yr-floating-action--ai'}`}>
        {showWhatsApp ? (
          <button className="yr-whatsapp-launcher" type="button" onClick={openWhatsAppLead} aria-label="Falar com a YR no WhatsApp">
            <span><WhatsAppIcon /></span>
            <strong>WhatsApp</strong>
            <small>ONLINE</small>
          </button>
        ) : (
          <button className="yr-ai-launcher" type="button" onClick={() => setOpen(true)} aria-label="Abrir Assistente YR">
            <span><SparkIcon /></span>
            <strong>Assistente YR</strong>
            <small>IA</small>
          </button>
        )}
      </div>

      {open ? (
        <div className="yr-ai-shell" role="dialog" aria-modal="true" aria-label="Assistente YR">
          <header className="yr-ai-header">
            <div className="yr-ai-avatar"><SparkIcon /></div>
            <div>
              <strong>Assistente YR</strong>
              <span>Orientação de produtos • IA</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar assistente">×</button>
          </header>

          <div className="yr-ai-messages" ref={scrollRef}>
            {messages.map((message, index) => (
              <div className={`yr-ai-message yr-ai-message--${message.role}${message.error ? ' yr-ai-message--error' : ''}`} key={`${message.role}-${index}`}>
                <p>{message.text}</p>
              </div>
            ))}

            {messages.length === 1 ? (
              <div className="yr-ai-quick-actions">
                {quickActions.map((action) => (
                  <button type="button" key={action} onClick={() => send(action)}>{action}</button>
                ))}
              </div>
            ) : null}

            {loading ? (
              <div className="yr-ai-message yr-ai-message--model yr-ai-thinking">
                <span /><span /><span />
              </div>
            ) : null}
          </div>

          <div className="yr-ai-disclaimer">
            Evite enviar diagnóstico, exames ou dados de saúde sensíveis. O assistente orienta sobre equipamentos e não substitui profissionais de saúde.
          </div>

          <form className="yr-ai-input" onSubmit={onSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ex.: preciso de uma cama por 2 meses..."
              maxLength={1800}
              aria-label="Mensagem para o Assistente YR"
            />
            <button type="submit" disabled={!input.trim() || loading} aria-label="Enviar mensagem"><SendIcon /></button>
          </form>

          <footer className="yr-ai-footer">
            <button type="button" onClick={humanContact}>Falar com uma pessoa</button>
            {lastModel ? <span>{lastModel.replace('gemini-', 'Gemini ')}</span> : <span>Grupo YR Hospitalar</span>}
          </footer>
        </div>
      ) : null}
    </>
  )
}

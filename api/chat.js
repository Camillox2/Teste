const MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
]

const SYSTEM_PROMPT = `Você é o Assistente YR, atendente comercial do Grupo YR Hospitalar.
Seu objetivo é ajudar clientes a entender qual equipamento hospitalar pode fazer sentido e se compra ou locação parece mais adequada.

Catálogo atual:
- Cama hospitalar articulada: venda e locação. Indicada para recuperação, home care, idosos e pessoas com mobilidade reduzida.
- Cama manual 3 movimentos: venda e locação. Ajustes essenciais, uso domiciliar ou institucional.
- Maca hidráulica: venda e locação. Clínicas, hospitais e transporte interno.
- Carrinho de emergência: venda. Uso profissional para organização de insumos e atendimento.
- Biombo hospitalar: venda. Privacidade em clínicas, consultórios, hospitais e home care.
- Mesa de refeição hospitalar: venda e locação. Apoio para pacientes acamados ou com mobilidade reduzida.

Regras de atendimento:
1. Seja acolhedor, objetivo e comercial, sem soar agressivo.
2. Faça no máximo uma ou duas perguntas por resposta.
3. Pergunte sobre contexto de uso, tempo estimado, ambiente (casa, clínica, hospital) e necessidade funcional. Evite perguntar diagnóstico, doença, exames ou dados de saúde sensíveis.
4. Nunca faça diagnóstico, prescrição ou orientação médica. Se houver pergunta clínica, diga que isso deve ser validado com profissional de saúde e volte para características do equipamento.
5. Não invente preço, estoque, prazo, região de entrega, garantia ou disponibilidade. Diga que esses pontos são confirmados na cotação.
6. Para uso temporário, sugira avaliar locação. Para uso prolongado/recorrente, sugira comparar compra. Não imponha a escolha.
7. Quando houver dados suficientes, dê uma recomendação curta com: produto sugerido, motivo, compra x locação e próximo passo.
8. Se o cliente quiser fechar, peça apenas nome e contato, sem solicitar informações médicas.
9. Sempre deixe claro que a recomendação é comercial sobre equipamento, não médica.
10. Responda em português do Brasil, com linguagem simples e humana.
`

function sanitizeMessages(messages = []) {
  return messages
    .filter((item) => item && ['user', 'model'].includes(item.role) && typeof item.text === 'string')
    .slice(-12)
    .map((item) => ({
      role: item.role,
      parts: [{ text: item.text.slice(0, 2500) }],
    }))
}

function extractText(data) {
  const parts = data?.candidates?.[0]?.content?.parts || []
  return parts.map((part) => part?.text || '').join('\n').trim()
}

async function callModel(model, apiKey, contents) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 18000)

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          maxOutputTokens: 650,
          temperature: 0.45,
          thinkingConfig: { thinkingLevel: 'low' },
        },
      }),
      signal: controller.signal,
    })

    const data = await response.json().catch(() => ({}))
    return { response, data }
  } finally {
    clearTimeout(timeout)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'Assistente ainda não configurado.' })
  }

  const contents = sanitizeMessages(req.body?.messages)
  if (!contents.length || contents[contents.length - 1]?.role !== 'user') {
    return res.status(400).json({ error: 'Mensagem inválida.' })
  }

  const failures = []

  for (const model of MODELS) {
    try {
      const { response, data } = await callModel(model, apiKey, contents)

      if (response.ok) {
        const reply = extractText(data)
        if (reply) return res.status(200).json({ reply, model })
        failures.push(`${model}: resposta vazia`)
        continue
      }

      if (response.status === 401 || response.status === 403) {
        console.error('Gemini authentication error', response.status)
        return res.status(502).json({ error: 'Falha de autenticação do assistente.' })
      }

      failures.push(`${model}: ${response.status}`)
    } catch (error) {
      failures.push(`${model}: ${error?.name || 'erro'}`)
    }
  }

  console.error('Gemini fallback exhausted', failures.join(' | '))
  return res.status(502).json({ error: 'Assistente temporariamente indisponível.' })
}

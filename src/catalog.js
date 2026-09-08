const heroBed = '/products/cama-hospitalar.webp'

export const products = [
  {
    id: 1,
    slug: 'cama-hospitalar-articulada',
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
    slug: 'carrinho-de-emergencia',
    name: 'Carrinho de emergência',
    category: 'Emergência',
    description: 'Organização prática de medicamentos, insumos e equipamentos essenciais para atendimento profissional.',
    image: '/products/carrinho-emergencia.webp',
    sale: true,
    rent: false,
    idealFor: 'Clínicas, consultórios, unidades de atendimento e ambientes hospitalares.',
    benefits: ['Organização rápida', 'Acesso facilitado a insumos', 'Uso profissional'],
  },
  {
    id: 3,
    slug: 'maca-hidraulica',
    name: 'Maca hidráulica',
    category: 'Macas',
    description: 'Mobilidade, estabilidade e ajuste de altura para rotinas clínicas, hospitalares e transporte interno.',
    image: '/products/maca-hidraulica.webp',
    sale: true,
    rent: true,
    idealFor: 'Clínicas, hospitais e atendimentos que exigem mobilidade e regulagem de altura.',
    benefits: ['Ajuste de altura', 'Mais ergonomia no atendimento', 'Mobilidade facilitada'],
  },
  {
    id: 4,
    slug: 'biombo-hospitalar',
    name: 'Biombo hospitalar',
    category: 'Mobiliário',
    description: 'Privacidade e praticidade para consultórios, clínicas, hospitais e ambientes de home care.',
    image: '/products/biombo.webp',
    sale: true,
    rent: false,
    idealFor: 'Ambientes que precisam criar privacidade de forma rápida e flexível.',
    benefits: ['Privacidade no atendimento', 'Fácil movimentação', 'Aplicação versátil'],
  },
  {
    id: 5,
    slug: 'mesa-de-refeicao-hospitalar',
    name: 'Mesa de refeição hospitalar',
    category: 'Acessórios',
    description: 'Apoio regulável para refeições, leitura e atividades durante a recuperação do paciente.',
    image: '/products/mesa-refeicao.webp',
    sale: true,
    rent: true,
    idealFor: 'Pacientes acamados ou com mobilidade reduzida em casa, clínicas e instituições.',
    benefits: ['Mais autonomia', 'Altura regulável', 'Uso diário simples'],
  },
  {
    id: 6,
    slug: 'cama-manual-3-movimentos',
    name: 'Cama manual 3 movimentos',
    category: 'Camas',
    description: 'Versatilidade para posicionamento do paciente com estrutura resistente e operação simples.',
    image: '/products/cama-manual-3mov.webp',
    sale: true,
    rent: true,
    idealFor: 'Uso domiciliar ou institucional que precisa de ajustes essenciais com bom custo-benefício.',
    benefits: ['Movimentos essenciais', 'Estrutura funcional', 'Compra ou locação'],
  },
]

export const faqs = [
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
    a: 'Os valores são informados por cotação. Isso permite considerar disponibilidade, modalidade de compra ou locação, período de uso e condições de entrega antes de fechar.',
  },
]


export const productPath = product => `/equipamentos/${product.slug}`

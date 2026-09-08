// Descriptive guides, not a specification sheet. Photos/models are references.
// Manufacturer category reference: https://vitalscheffer.com.br/revenda_curitiba/
const measures = { label: 'Medidas', title: 'Vai caber no seu espaço?', text: 'Peça as dimensões do modelo cotado e compare com portas, elevadores e o espaço de circulação. Medidas e capacidade são confirmadas pela equipe.' }
export const imageDimensions = { 1: [800, 623], 2: [1000, 800], 3: [973, 1000], 4: [1000, 1000], 5: [1000, 800], 6: [1000, 779] }
export const productDetails = {
  1: [
    { label: 'Ajustes', title: 'Entenda os ajustes', text: 'A cama articulada permite diferentes posições. Consulte os movimentos e o tipo de acionamento disponíveis no modelo cotado.', x: 32, y: 48 },
    { label: 'Mobilidade', title: 'Observe a base', text: 'A fotografia mostra uma base com rodízios. Confirme rodas, travas e as orientações de movimentação do modelo antes da contratação.', x: 62, y: 86 },
    { ...measures, x: 72, y: 53 },
  ],
  2: [
    { label: 'Organização', title: 'Insumos ao alcance', text: 'O carrinho reúne espaços para organizar os insumos da rotina profissional. Confirme a configuração de gavetas e os acessórios incluídos.', x: 45, y: 51 },
    { label: 'Mobilidade', title: 'Confira os rodízios', text: 'Consulte a configuração de rodas, travas e capacidade do carrinho. Cilindros e equipamentos da fotografia não indicam acessórios incluídos.', x: 52, y: 89 },
    { ...measures, x: 61, y: 32 },
  ],
  3: [
    { label: 'Ajustes', title: 'Conheça a regulagem', text: 'O catálogo apresenta uma maca hidráulica. Confirme os ajustes disponíveis e a faixa de altura do modelo na cotação.', x: 54, y: 57 },
    { label: 'Mobilidade', title: 'Planeje a circulação', text: 'Verifique rodízios, travas e as condições de uso com a equipe. Considere também o trajeto entre os ambientes da instituição.', x: 51, y: 72 },
    { ...measures, x: 61, y: 41 },
  ],
  4: [
    { label: 'Privacidade', title: 'Organize o ambiente', text: 'O biombo cria uma divisão visual entre espaços. Consulte o número de folhas e o acabamento do modelo disponível.', x: 49, y: 39 },
    { label: 'Configuração', title: 'Escolha a configuração', text: 'A linha do fabricante apresenta opções de duas ou três folhas. A equipe confirma qual configuração está disponível na sua cotação.', x: 71, y: 54 },
    { ...measures, x: 29, y: 77 },
  ],
  5: [
    { label: 'Apoio', title: 'Um apoio para a rotina', text: 'A mesa hospitalar oferece apoio para refeições e atividades junto ao leito. Confirme o acabamento e as orientações de uso do tampo.', x: 65, y: 44 },
    { label: 'Regulagem', title: 'Confira a altura', text: 'A linha do fabricante apresenta mesa com regulagem. Solicite a faixa de altura e confira a compatibilidade com a cama utilizada.', x: 54, y: 61 },
    { ...measures, x: 60, y: 82 },
  ],
  6: [
    { label: 'Movimentos', title: 'Três movimentos', text: 'Esta opção é apresentada como cama manual de três movimentos. Peça à equipe a descrição dos ajustes e do acionamento do modelo cotado.', x: 49, y: 48 },
    { label: 'Estrutura', title: 'Observe os componentes', text: 'Confirme grades, cabeceiras, rodízios e acessórios que acompanham o modelo. A fotografia serve como referência visual.', x: 27, y: 62 },
    { ...measures, x: 59, y: 82 },
  ],
}

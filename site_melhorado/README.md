# Interface de Chat para IA

Uma interface de chat moderna e responsiva inspirada no ChatGPT, desenvolvida com HTML, CSS e JavaScript puro.

## Características

- **Design Moderno**: Interface escura e elegante similar ao ChatGPT
- **Múltiplas Seções**: Chat, Busca, Geração de Imagem, Áudio e Vídeo
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Interativo**: Funcionalidades completas de chat e navegação
- **Simulações**: Inclui simulações de geração de conteúdo

## Funcionalidades

### Chat
- Envio e recebimento de mensagens
- Ações nas mensagens (copiar, curtir, reproduzir áudio, etc.)
- Auto-redimensionamento do campo de texto
- Suporte a gravação de voz (simulada)

### Geração de Imagem
- Interface completa para prompts de imagem
- Seleção de resolução e quantidade de imagens
- Upload de imagem de referência
- Simulação de geração com preview

### Geração de Áudio
- Modos single-speaker e multi-speaker
- Controles de temperatura e voz
- Prompts rápidos predefinidos
- Simulação de geração de áudio

### Geração de Vídeo
- Configurações avançadas (modelo, duração, resolução)
- Controles de proporção e efeitos
- Simulação de criação de vídeo

### Busca
- Busca em tempo real nos chats
- Atalho Ctrl+K para acesso rápido
- Interface de resultados

## Como Usar

1. **Abrir a Aplicação**: Abra o arquivo `index.html` em qualquer navegador moderno
2. **Navegar**: Use a sidebar para alternar entre as diferentes seções
3. **Chat**: Digite mensagens no campo de texto e pressione Enter
4. **Gerar Conteúdo**: Preencha os prompts nas seções específicas e clique nos botões de geração

## Estrutura dos Arquivos

- `index.html` - Estrutura HTML principal
- `style.css` - Estilos e layout responsivo
- `script.js` - Funcionalidades JavaScript interativas

## Compatibilidade

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Recursos Técnicos

- **HTML5 Semântico**: Estrutura bem organizada e acessível
- **CSS3 Moderno**: Flexbox, Grid, animações e transições
- **JavaScript ES6+**: Funcionalidades modernas e interativas
- **Font Awesome**: Ícones profissionais
- **Responsivo**: Media queries para diferentes tamanhos de tela

## Personalização

O código está bem estruturado e comentado, facilitando personalizações:

- **Cores**: Modifique as variáveis CSS no início do arquivo `style.css`
- **Funcionalidades**: Adicione novas funcionalidades no arquivo `script.js`
- **Layout**: Ajuste a estrutura no arquivo `index.html`

## Notas de Desenvolvimento

Esta é uma interface de demonstração com funcionalidades simuladas. Para integrar com APIs reais:

1. Substitua as funções de simulação por chamadas de API reais
2. Implemente autenticação se necessário
3. Adicione tratamento de erros apropriado
4. Configure CORS se necessário para chamadas de API

## Licença

Este projeto é fornecido como está, para fins educacionais e de demonstração.


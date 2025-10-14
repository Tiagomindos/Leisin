# 🏦 T3 Core Bank - Plataforma de Investimentos Imobiliários Tokenizados

Uma plataforma completa de investimentos em imóveis tokenizados, criptomoedas e ativos híbridos, desenvolvida com React, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

### 💼 **Dashboard Completo**
- Saldo total com opção de ocultar/mostrar
- Adicionar fundos funcional
- Carteira imobiliária com dados reais
- Criptomoedas com valores dinâmicos
- Proventos e estatísticas

### 💰 **Sistema de Trading**
- Formulário de ordens totalmente funcional
- Order book em tempo real
- Histórico de trades dinâmico
- Simulação de execução de ordens
- Cálculo automático de totais e taxas

### 🏦 **Carteira Digital**
- Múltiplas moedas (BRL, USDT, BTC)
- Depósitos e saques funcionais
- Histórico de transações detalhado
- Ações rápidas (cartão virtual, configurações)

### 🏢 **Propriedades Imobiliárias**
- Catálogo completo de propriedades
- Filtros avançados por categoria, preço, yield
- Busca inteligente por nome e localização
- Sistema de favoritos funcional

### 📱 **Rede Social**
- Criar posts com modal interativo
- Sistema de likes funcional
- Comunidades e categorias
- Top investidores com ranking

### 📰 **Sistema de Notícias**
- Categorização por tipo de conteúdo
- Busca e filtros avançados
- Sistema de likes e compartilhamento
- Vídeos em destaque com player
- Academia T3 com cursos

### 🔔 **Notificações**
- Sistema completo de notificações
- Marcar como lida funcional
- Filtros (todas/não lidas)
- Badge de contagem no header

### ⚙️ **Painel Administrativo**
- Visão geral com métricas importantes
- Gestão de usuários completa
- Administração de propriedades
- Estatísticas de trading
- Configurações de sistema

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: Context API
- **Backend**: Supabase (configuração opcional)

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/t3-core-bank.git
cd t3-core-bank
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente** (opcional)
```bash
cp env.example .env
# Edite o arquivo .env com suas credenciais do Supabase
```

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse no navegador**
```
http://localhost:5173
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── Header.tsx      # Cabeçalho da aplicação
│   └── Navigation.tsx  # Navegação inferior
├── contexts/           # Contextos React
│   ├── AuthContext.tsx # Contexto de autenticação
│   └── AppContext.tsx  # Contexto principal da aplicação
├── hooks/              # Hooks personalizados
├── pages/              # Páginas da aplicação
│   ├── HomePage.tsx    # Dashboard principal
│   ├── MarketsPage.tsx # Página de mercados
│   ├── TradePage.tsx   # Página de trading
│   ├── WalletPage.tsx  # Carteira digital
│   ├── PropertiesPage.tsx # Propriedades imobiliárias
│   ├── SocialPage.tsx  # Rede social
│   ├── NewsPage.tsx    # Notícias e conteúdo
│   ├── NotificationsPage.tsx # Notificações
│   └── AdminPage.tsx   # Painel administrativo
├── data/               # Dados mockados
│   └── mockData.ts     # Dados de exemplo
├── App.tsx             # Componente principal
└── main.tsx            # Ponto de entrada
```

## 🎨 Design System

O projeto utiliza um design system inspirado na Binance com:

- **Cores principais**: 
  - Primária: `#FCD535` (amarelo Binance)
  - Sucesso: `#02C076` (verde)
  - Perigo: `#F6465D` (vermelho)
  - Background: `#0B0E11` (preto)

- **Componentes**: Cards, botões, inputs, modais
- **Tipografia**: Inter (via Tailwind)
- **Ícones**: Lucide React
- **Responsividade**: Mobile-first

## 🔐 Autenticação

O sistema inclui autenticação completa com:

- Login e registro
- Validação de formulários
- Gerenciamento de sessão
- Proteção de rotas
- Perfil do usuário

## 📊 Dados Mockados

O projeto inclui dados realistas para demonstração:

- **3 propriedades imobiliárias** com informações completas
- **5 pares de trading** (imóveis + cripto)
- **Notícias e posts** dinâmicos
- **Sistema de usuários** funcional
- **Transações e ordens** simuladas

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Netlify
1. Build do projeto: `npm run build`
2. Upload da pasta `dist/`
3. Configure as variáveis de ambiente

### GitHub Pages
1. Configure o workflow do GitHub Actions
2. Build e deploy automático

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Desenvolvedor**: Seu Nome
- **Email**: seu.email@exemplo.com
- **LinkedIn**: [seu-linkedin](https://linkedin.com/in/seu-perfil)
- **GitHub**: [seu-github](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- [Binance](https://binance.com) pela inspiração no design
- [Supabase](https://supabase.com) pela infraestrutura backend
- [Tailwind CSS](https://tailwindcss.com) pelo framework de estilos
- [Lucide](https://lucide.dev) pelos ícones

---

**Desenvolvido com ❤️ para revolucionar os investimentos imobiliários**
# 🚀 Como Usar o T3 Core Bank

## 📱 **Executar o Projeto**

### **Windows (PowerShell)**
```powershell
# 1. Ir para a pasta do projeto
cd "G:\Meu Drive\EMPRESAS\APLICATIVOS\T3CORE\MODELO BOLT\MODELO 1\project"

# 2. Instalar dependências
npm install

# 3. Executar o projeto
npm run dev

# 4. Abrir no navegador
# http://localhost:5173
```

### **Linux/Mac (Terminal)**
```bash
# 1. Ir para a pasta do projeto
cd project

# 2. Instalar dependências
npm install

# 3. Executar o projeto
npm run dev

# 4. Abrir no navegador
# http://localhost:5173
```

## 🎯 **Funcionalidades para Testar**

### **1. Autenticação**
- ✅ Clique em **"Entrar"** no canto superior direito
- ✅ Teste **cadastro** e **login**
- ✅ Veja o **menu do usuário** após login

### **2. Dashboard**
- ✅ **Oculte/mostre** o saldo (ícone do olho)
- ✅ **Adicione fundos** (botão "Adicionar")
- ✅ Veja **carteira imobiliária** com dados reais
- ✅ Explore **criptomoedas** disponíveis

### **3. Trading**
- ✅ **Navegue** para a aba "Trade"
- ✅ **Selecione** um par de trading
- ✅ **Preencha** o formulário de ordem
- ✅ **Teste** compra e venda
- ✅ Veja **order book** e **trades recentes**

### **4. Carteira Digital**
- ✅ **Acesse** via menu do usuário → "Carteira"
- ✅ **Deposite** diferentes moedas
- ✅ **Saque** valores
- ✅ Veja **histórico** de transações

### **5. Propriedades**
- ✅ **Acesse** via menu do usuário → "Propriedades"
- ✅ **Filtre** por categoria e preço
- ✅ **Busque** propriedades
- ✅ **Adicione** aos favoritos
- ✅ **Alterne** entre visualização grid/lista

### **6. Rede Social**
- ✅ **Crie posts** (botão + flutuante)
- ✅ **Curta** posts existentes
- ✅ **Explore** comunidades
- ✅ Veja **ranking** de investidores

### **7. Notícias**
- ✅ **Filtre** por categoria
- ✅ **Busque** notícias
- ✅ **Curta** e compartilhe
- ✅ **Assista** vídeos em destaque

### **8. Notificações**
- ✅ **Acesse** via menu do usuário → "Notificações"
- ✅ **Marque** como lida
- ✅ **Filtre** por status
- ✅ Veja **badge** no header

### **9. Painel Admin**
- ✅ **Acesse** via menu do usuário → "Painel Admin"
- ✅ **Explore** métricas e estatísticas
- ✅ **Gerencie** usuários e propriedades
- ✅ **Configure** sistema

## 🔧 **Comandos Úteis**

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

## 📊 **Dados de Demonstração**

O projeto inclui dados realistas:

- **3 propriedades imobiliárias** completas
- **5 pares de trading** (imóveis + crypto)
- **Notícias e posts** dinâmicos
- **Usuários** com perfis
- **Transações** simuladas

## 🎨 **Personalização**

### **Cores e Tema**
- Edite `src/index.css` para cores
- Modifique `tailwind.config.js` para tema

### **Dados Mockados**
- Edite `src/data/mockData.ts` para dados
- Adicione novas propriedades, notícias, etc.

### **Funcionalidades**
- Adicione novas páginas em `src/pages/`
- Crie componentes em `src/components/`
- Implemente hooks em `src/hooks/`

## 🚀 **Deploy para GitHub**

### **Método Rápido (Windows)**
1. **Execute** `setup-git-windows.bat`
2. **Crie** repositório no GitHub
3. **Execute** os comandos mostrados

### **Método Manual**
```bash
# 1. Inicializar Git
git init
git add .
git commit -m "🎉 Initial commit"

# 2. Conectar ao GitHub
git remote add origin https://github.com/SEU-USUARIO/t3-core-bank.git
git push -u origin main
```

## 🆘 **Problemas Comuns**

### **Erro de Dependências**
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### **Erro de Porta**
```bash
# Usar porta diferente
npm run dev -- --port 5174
```

### **Erro de Build**
```bash
# Verificar erros
npm run lint
npm run build
```

## 📱 **Teste em Mobile**

1. **Abra** o DevTools (F12)
2. **Ative** modo mobile
3. **Teste** todas as funcionalidades
4. **Verifique** responsividade

## 🎯 **Próximos Passos**

1. **Teste** todas as funcionalidades
2. **Personalize** cores e dados
3. **Adicione** suas próprias propriedades
4. **Configure** Supabase (opcional)
5. **Deploy** para produção

---

**🎉 Divirta-se explorando o T3 Core Bank!**

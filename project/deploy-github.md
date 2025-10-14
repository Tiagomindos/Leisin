# 🚀 Como Fazer Upload para o GitHub

## 📋 Passo a Passo Completo

### 1. **Criar Repositório no GitHub**

1. Acesse [github.com](https://github.com)
2. Clique em **"New repository"** (botão verde)
3. Preencha os dados:
   - **Repository name**: `t3-core-bank`
   - **Description**: `Plataforma de investimentos imobiliários tokenizados`
   - **Visibility**: Public (ou Private se preferir)
   - **NÃO marque** "Add a README file" (já temos um)
   - **NÃO marque** "Add .gitignore" (já temos um)
   - **NÃO marque** "Choose a license" (já temos um)
4. Clique em **"Create repository"**

### 2. **Preparar o Projeto Local**

Abra o terminal na pasta `project` e execute:

```bash
# Inicializar o Git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "🎉 Initial commit: T3 Core Bank MVP completo

✨ Funcionalidades implementadas:
- Dashboard completo com dados reais
- Sistema de trading funcional
- Carteira digital com múltiplas moedas
- Propriedades imobiliárias tokenizadas
- Rede social para investidores
- Sistema de notícias e conteúdo
- Notificações inteligentes
- Painel administrativo
- Autenticação completa
- Design responsivo inspirado na Binance

🚀 MVP pronto para testes e demonstrações!"

# Renomear branch para main (se necessário)
git branch -M main
```

### 3. **Conectar com o GitHub**

```bash
# Adicionar o repositório remoto (substitua SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/t3-core-bank.git

# Fazer push para o GitHub
git push -u origin main
```

### 4. **Configurar GitHub Pages (Deploy Automático)**

1. No GitHub, vá em **Settings** do seu repositório
2. Role até **Pages** no menu lateral
3. Em **Source**, selecione **"GitHub Actions"**
4. O workflow já está configurado e vai fazer deploy automaticamente!

### 5. **Verificar o Deploy**

- O site ficará disponível em: `https://SEU-USUARIO.github.io/t3-core-bank`
- Pode demorar alguns minutos para o primeiro deploy
- Você receberá um email quando estiver pronto

## 🔧 Comandos Úteis

### **Atualizar o Repositório**
```bash
# Adicionar mudanças
git add .

# Commit com mensagem descritiva
git commit -m "✨ Adicionar nova funcionalidade X"

# Push para o GitHub
git push origin main
```

### **Ver Status do Git**
```bash
# Ver arquivos modificados
git status

# Ver histórico de commits
git log --oneline

# Ver branches
git branch -a
```

### **Reverter Mudanças**
```bash
# Desfazer último commit (mantendo arquivos)
git reset --soft HEAD~1

# Desfazer mudanças em arquivo específico
git checkout -- nome-do-arquivo

# Ver diferenças
git diff
```

## 📁 Estrutura Final no GitHub

```
t3-core-bank/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Deploy automático
├── src/
│   ├── components/             # Componentes React
│   ├── contexts/              # Contextos de estado
│   ├── hooks/                 # Hooks personalizados
│   ├── pages/                 # Páginas da aplicação
│   ├── data/                  # Dados mockados
│   └── ...
├── public/                    # Arquivos estáticos
├── .gitignore                # Arquivos ignorados
├── README.md                 # Documentação
├── LICENSE                   # Licença MIT
├── package.json              # Dependências
├── tailwind.config.js        # Configuração Tailwind
├── vite.config.ts            # Configuração Vite
└── tsconfig.json             # Configuração TypeScript
```

## 🌟 Próximos Passos

### **1. Personalizar o Repositório**
- Edite o `README.md` com suas informações
- Atualize o `package.json` com seus dados
- Adicione uma descrição no GitHub

### **2. Configurar Domínio Personalizado** (Opcional)
- No GitHub Pages, adicione seu domínio
- Configure DNS apontando para o GitHub

### **3. Adicionar Badges** (Opcional)
```markdown
![GitHub](https://img.shields.io/github/license/SEU-USUARIO/t3-core-bank)
![GitHub last commit](https://img.shields.io/github/last-commit/SEU-USUARIO/t3-core-bank)
![GitHub stars](https://img.shields.io/github/stars/SEU-USUARIO/t3-core-bank)
```

### **4. Configurar Issues e Projects**
- Ative Issues no repositório
- Crie templates para bugs e features
- Configure Projects para organização

## 🎯 Dicas Importantes

1. **Sempre faça commits descritivos** com emojis
2. **Use branches** para features grandes
3. **Mantenha o README atualizado**
4. **Teste localmente** antes de fazer push
5. **Use tags** para versões importantes

## 🆘 Problemas Comuns

### **Erro de Autenticação**
```bash
# Use token de acesso pessoal
git remote set-url origin https://SEU-TOKEN@github.com/SEU-USUARIO/t3-core-bank.git
```

### **Conflitos de Merge**
```bash
# Puxar mudanças do GitHub
git pull origin main

# Resolver conflitos manualmente
# Depois fazer commit
git add .
git commit -m "🔧 Resolver conflitos"
git push origin main
```

### **Deploy não Funcionou**
1. Verifique se o workflow está ativo
2. Veja os logs em Actions
3. Verifique se o build está passando

---

**🎉 Parabéns! Seu projeto está no GitHub e deployado automaticamente!**

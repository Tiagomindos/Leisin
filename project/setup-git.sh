#!/bin/bash

# 🚀 Script de Configuração do Git para T3 Core Bank
# Execute este script na pasta do projeto

echo "🏦 Configurando T3 Core Bank para GitHub..."

# Verificar se estamos na pasta correta
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na pasta do projeto (onde está o package.json)"
    exit 1
fi

# Inicializar Git se não existir
if [ ! -d ".git" ]; then
    echo "📁 Inicializando repositório Git..."
    git init
else
    echo "✅ Repositório Git já existe"
fi

# Adicionar todos os arquivos
echo "📦 Adicionando arquivos ao Git..."
git add .

# Fazer commit inicial
echo "💾 Fazendo commit inicial..."
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

# Renomear branch para main
echo "🌿 Configurando branch main..."
git branch -M main

echo ""
echo "✅ Configuração do Git concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Crie um repositório no GitHub: https://github.com/new"
echo "2. Execute os comandos abaixo (substitua SEU-USUARIO):"
echo ""
echo "   git remote add origin https://github.com/SEU-USUARIO/t3-core-bank.git"
echo "   git push -u origin main"
echo ""
echo "🎯 Seu projeto estará no GitHub e deployado automaticamente!"
echo "🌐 URL do site: https://SEU-USUARIO.github.io/t3-core-bank"

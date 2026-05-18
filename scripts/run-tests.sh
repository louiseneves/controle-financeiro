#!/bin/bash

# Script de Execução de Testes - Controle Financeiro
# Este script executa todos os testes do projeto

echo "🧪 =========================================="
echo "   EXECUTANDO TESTES - CONTROLE FINANCEIRO"
echo "==========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Testes Unitários
echo "📦 Executando testes unitários..."
npm run test -- --testPathPattern=__tests__/unit

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Testes unitários passaram!${NC}"
else
    echo -e "${RED}❌ Testes unitários falharam!${NC}"
    exit 1
fi

echo ""

# 2. Testes de Integração
echo "🔗 Executando testes de integração..."
npm run test -- --testPathPattern=__tests__/integration

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Testes de integração passaram!${NC}"
else
    echo -e "${RED}❌ Testes de integração falharam!${NC}"
    exit 1
fi

echo ""

# 3. Gerar Relatório de Cobertura
echo "📊 Gerando relatório de cobertura..."
npm run test:coverage

echo ""

# 4. Verificar Cobertura Mínima
echo "🎯 Verificando cobertura mínima..."
COVERAGE=$(cat coverage/coverage-summary.json | grep -o '"lines":{"total":[0-9]*,"covered":[0-9]*,"skipped":[0-9]*,"pct":[0-9.]*' | grep -o 'pct":[0-9.]*' | cut -d':' -f2)

if (( $(echo "$COVERAGE >= 70" | bc -l) )); then
    echo -e "${GREEN}✅ Cobertura de código: ${COVERAGE}% (meta: >= 70%)${NC}"
else
    echo -e "${YELLOW}⚠️  Cobertura de código: ${COVERAGE}% (meta: >= 70%)${NC}"
fi

echo ""
echo "🎉 =========================================="
echo "   TODOS OS TESTES CONCLUÍDOS!"
echo "==========================================="
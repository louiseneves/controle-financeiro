# 🐛 EXEMPLOS DE BUGS COMUNS E COMO REPORTAR

Este documento contém exemplos de bugs que podem ser encontrados durante os testes, 
com instruções de como reportá-los corretamente.

---

## 📱 **EXEMPLO 1: App Crasha ao Adicionar Transação**

### Relatório Correto:

**ID:** #001  
**Severidade:** 🔴 Crítico  
**Título:** App crasha ao adicionar transação com valor muito alto

**Como Reproduzir:**
1. Fazer login no app
2. Ir para Transações → "+" → Receita
3. Preencher descrição: "Teste"
4. Preencher valor: 999999999999999
5. Clicar em "Salvar"

**Resultado Esperado:** Transação deve ser salva ou mostrar erro de validação

**Resultado Atual:** App fecha completamente (crash)

**Dispositivo:** Samsung Galaxy S21, Android 12

**Stack Trace:**
java.lang.NumberFormatException: Value out of range
at Transaction.validate()
at TransactionStore.addTransaction()
---

## 🎨 **EXEMPLO 2: Interface Quebrada em Tela Pequena**

**ID:** #002  
**Severidade:** 🟡 Médio  
**Título:** Botões cortados em smartphones com tela < 5"

**Como Reproduzir:**
1. Abrir app em dispositivo com tela pequena (ex: iPhone SE)
2. Ir para Home
3. Observar seção de atalhos rápidos

**Resultado Esperado:** Todos os botões devem estar visíveis e acessíveis

**Resultado Atual:** Último botão está cortado pela borda da tela

**Screenshot:** [anexar imagem]

**Dispositivo:** iPhone SE (4.7"), iOS 15

---

## 🔢 **EXEMPLO 3: Cálculo Incorreto de Saldo**

**ID:** #003  
**Severidade:** 🟠 Alto  
**Título:** Saldo não atualiza após excluir transação

**Como Reproduzir:**
1. Ter saldo atual de R$ 1.000,00
2. Adicionar despesa de R$ 500,00
3. Saldo deve mostrar R$ 500,00 ✅
4. Excluir a despesa
5. Observar saldo

**Resultado Esperado:** Saldo deve voltar para R$ 1.000,00

**Resultado Atual:** Saldo permanece em R$ 500,00

**Workaround:** Fechar e abrir o app novamente atualiza o saldo

**Dispositivo:** Múltiplos dispositivos

---

## 🔔 **EXEMPLO 4: Notificação Não Aparece**

**ID:** #004  
**Severidade:** 🟡 Médio  
**Título:** Notificação de meta não aparece ao atingir 100%

**Como Reproduzir:**
1. Criar meta de R$ 1.000,00
2. Adicionar R$ 500,00 de progresso
3. Adicionar mais R$ 500,00 (total 100%)
4. Aguardar notificação

**Resultado Esperado:** Notificação "Parabéns! Você atingiu a meta"

**Resultado Atual:** Nenhuma notificação aparece

**Observação:** 
- Notificações estão ativadas nas configurações ✅
- Permissões concedidas ao app ✅
- Outras notificações funcionam normalmente ✅

**Dispositivo:** Xiaomi Redmi Note 10, MIUI 13

---

## 📊 **EXEMPLO 5: Gráfico Não Renderiza**

**ID:** #005  
**Severidade:** 🟠 Alto  
**Título:** Gráfico de pizza não aparece em Relatórios

**Como Reproduzir:**
1. Ter pelo menos 5 transações cadastradas
2. Ir para Relatórios
3. Selecionar mês atual

**Resultado Esperado:** Gráfico de pizza mostrando gastos por categoria

**Resultado Atual:** Espaço em branco onde deveria estar o gráfico

**Logs:**
Error: VictoryPie requires data with y values
at VictoryPie.render()
**Dispositivo:** Múltiplos dispositivos

---

## 🔐 **EXEMPLO 6: Problema de Segurança**

**ID:** #006  
**Severidade:** 🔴 Crítico  
**Título:** Senha armazenada em texto plano no AsyncStorage

**Como Reproduzir:**
1. Fazer login no app
2. Conectar dispositivo ao computador
3. Usar adb shell para acessar AsyncStorage
4. Ler dados armazenados

**Resultado Esperado:** Senha deve estar criptografada

**Resultado Atual:** Senha está visível em texto plano

**Impacto de Segurança:** Alto - qualquer pessoa com acesso físico ao dispositivo pode ver a senha

**Solução Sugerida:** Nunca armazenar senha localmente, usar apenas token de sessão criptografado

---

## ⚡ **EXEMPLO 7: Performance Ruim**

**ID:** #007  
**Severidade:** 🟡 Médio  
**Título:** Scroll travando no Histórico com 1000+ transações

**Como Reproduzir:**
1. Ter 1000+ transações cadastradas
2. Ir para Histórico
3. Tentar fazer scroll

**Resultado Esperado:** Scroll fluido a 60 FPS

**Resultado Atual:** Scroll trava, demora para responder

**Métricas:**
- FPS durante scroll: ~20 FPS
- Tempo de carregamento inicial: 8 segundos
- Memória usada: 450 MB

**Solução Sugerida:** Implementar virtualização de lista (FlatList com windowSize otimizado)

---

## 🌐 **EXEMPLO 8: Problema de Sincronização**

**ID:** #008  
**Severidade:** 🟠 Alto  
**Título:** Dados não sincronizam com Firebase em conexão lenta (3G)

**Como Reproduzir:**
1. Conectar em rede 3G (ou simular com throttling)
2. Adicionar 3 transações
3. Aguardar 2 minutos
4. Verificar Firebase Console

**Resultado Esperado:** Transações devem aparecer no Firebase

**Resultado Atual:** Transações ficam apenas localmente, não sobem para nuvem

**Observação:** 
- Em WiFi funciona perfeitamente ✅
- Em 4G funciona ✅
- Apenas em 3G falha ❌

**Logs:**
Firebase timeout: Request took longer than 30s
---

## 💬 **EXEMPLO 9: Texto Incorreto**

**ID:** #009  
**Severidade:** 🟢 Baixo  
**Título:** Erro de português na mensagem de confirmação

**Tela:** Backup → Restaurar

**Texto Atual:**
> "Isso irá substitui todos seus dados atuais"

**Texto Correto:**
> "Isso irá substituir todos os seus dados atuais"

**Impacto:** Apenas visual, não afeta funcionalidade

---

## 🎯 **EXEMPLO 10: Validação Faltando**

**ID:** #010  
**Severidade:** 🟡 Médio  
**Título:** Permite criar meta com data no passado

**Como Reproduzir:**
1. Ir para Metas → "+"
2. Preencher nome: "Teste"
3. Valor: R$ 1.000,00
4. Data: Escolher data de 1 mês atrás
5. Salvar

**Resultado Esperado:** Erro "Data deve ser no futuro"

**Resultado Atual:** Meta é criada, mas aparece como "atrasada"

**Sugestão:** Adicionar validação no frontend e backend

---

## 📝 **DICAS PARA REPORTAR BUGS EFETIVAMENTE**

### ✅ **Bom Relatório:**
- Título claro e descritivo
- Passos para reproduzir detalhados
- Comportamento esperado vs atual
- Screenshots/vídeos quando possível
- Informações do dispositivo
- Logs de erro

### ❌ **Relatório Ruim:**
- "App não funciona"
- "Tem um erro na tela"
- "Isso aqui tá bugado"
- Sem passos para reproduzir
- Sem informações do ambiente

### 💡 **Exemplo de Título Ruim:**
> "Bug no app"

### ✅ **Exemplo de Título Bom:**
> "App crasha ao adicionar transação com valor > 999.999.999"

---

**Use estes exemplos como referência ao reportar bugs encontrados durante os testes!**
# 📋 CHECKLIST: TESTES DE FUNCIONALIDADES

## ✅ **1. Testar Login e Cadastro**

### Cadastro
- [ ] Abrir app pela primeira vez
- [ ] Clicar em "Criar Conta"
- [ ] **Teste 1.1:** Tentar cadastrar sem preencher campos
  - Resultado esperado: Mensagem de erro "Preencha todos os campos"
- [ ] **Teste 1.2:** Cadastrar com email inválido
  - Email: `teste@invalido`
  - Resultado esperado: Erro de formato de email
- [ ] **Teste 1.3:** Cadastrar com senha curta (menos de 6 caracteres)
  - Senha: `123`
  - Resultado esperado: Erro "Senha deve ter no mínimo 6 caracteres"
- [ ] **Teste 1.4:** Cadastrar com senhas diferentes
  - Senha: `123456`
  - Confirmar: `654321`
  - Resultado esperado: Erro "As senhas não coincidem"
- [ ] **Teste 1.5:** Cadastro válido
  - Nome: `Teste Usuário`
  - Email: `teste@exemplo.com`
  - Senha: `123456`
  - Confirmar: `123456`
  - Resultado esperado: Conta criada, redirecionado para Home

### Login
- [ ] Fazer logout
- [ ] **Teste 1.6:** Login com email inexistente
  - Email: `naoexiste@exemplo.com`
  - Senha: `123456`
  - Resultado esperado: Erro "Usuário não encontrado"
- [ ] **Teste 1.7:** Login com senha incorreta
  - Email: `teste@exemplo.com`
  - Senha: `senhaerrada`
  - Resultado esperado: Erro "Senha incorreta"
- [ ] **Teste 1.8:** Login válido
  - Email: `teste@exemplo.com`
  - Senha: `123456`
  - Resultado esperado: Logado com sucesso, redirecionado para Home

### Recuperação de Senha
- [ ] **Teste 1.9:** Clicar em "Esqueceu a senha?"
- [ ] Inserir email válido: `teste@exemplo.com`
- [ ] Resultado esperado: Email de recuperação enviado
- [ ] Verificar recebimento do email
- [ ] Seguir link de recuperação
- [ ] Definir nova senha

**Status:** ⬜ Não testado | ✅ Passou | ❌ Falhou

---

## ✅ **2. Testar CRUD de Receitas**

### Criar Receita
- [ ] **Teste 2.1:** Ir para Transações → "+" → Receita
- [ ] Preencher formulário:
  - Descrição: `Salário`
  - Valor: `5000`
  - Data: Data atual
  - Categoria: `Salário`
- [ ] Clicar em "Salvar"
- [ ] Resultado esperado: Receita criada, aparece no histórico
- [ ] Verificar se saldo foi atualizado na Home

### Listar Receitas
- [ ] **Teste 2.2:** Ir para Histórico
- [ ] Verificar se a receita criada aparece
- [ ] Verificar se valor está correto (R$ 5.000,00)
- [ ] Verificar se data está correta
- [ ] Verificar cor verde para receita

### Editar Receita
- [ ] **Teste 2.3:** Clicar na receita criada
- [ ] Clicar em "Editar"
- [ ] Alterar valor para: `5500`
- [ ] Clicar em "Salvar"
- [ ] Resultado esperado: Receita atualizada
- [ ] Verificar se saldo foi recalculado

### Excluir Receita
- [ ] **Teste 2.4:** Clicar na receita
- [ ] Clicar em "Excluir"
- [ ] Confirmar exclusão
- [ ] Resultado esperado: Receita removida do histórico
- [ ] Verificar se saldo foi recalculado

### Receita Recorrente
- [ ] **Teste 2.5:** Criar receita marcando "Recorrente"
- [ ] Definir frequência: Mensal
- [ ] Resultado esperado: Sistema deve criar automaticamente nos próximos meses

**Status:** ⬜ Não testado | ✅ Passou | ❌ Falhou

---

## ✅ **3. Testar CRUD de Despesas**

### Criar Despesa
- [ ] **Teste 3.1:** Ir para Transações → "+" → Despesa
- [ ] Preencher formulário:
  - Descrição: `Aluguel`
  - Valor: `1500`
  - Data: Data atual
  - Categoria: `Moradia`
- [ ] Clicar em "Salvar"
- [ ] Resultado esperado: Despesa criada
- [ ] Verificar se saldo diminuiu na Home

### Validações
- [ ] **Teste 3.2:** Tentar criar despesa sem descrição
  - Resultado esperado: Erro
- [ ] **Teste 3.3:** Tentar criar despesa com valor zero
  - Resultado esperado: Erro
- [ ] **Teste 3.4:** Criar despesa com valor muito alto (ex: 999999999)
  - Resultado esperado: Aceito (ou limite se implementado)

### Listar e Filtrar
- [ ] **Teste 3.5:** Ir para Histórico
- [ ] Filtrar por tipo: "Despesas"
- [ ] Resultado esperado: Mostrar apenas despesas
- [ ] Verificar cor vermelha

### Editar Despesa
- [ ] **Teste 3.6:** Editar valor de `1500` para `1600`
- [ ] Salvar
- [ ] Verificar recálculo do saldo

### Excluir Despesa
- [ ] **Teste 3.7:** Excluir despesa
- [ ] Confirmar
- [ ] Verificar remoção e recálculo

**Status:** ⬜ Não testado | ✅ Passou | ❌ Falhou

---

## ✅ **4. Testar CRUD de Investimentos**

### Criar Investimento
- [ ] **Teste 4.1:** Ir para Transações → Investimentos
- [ ] Clicar em "+"
- [ ] Preencher:
  - Descrição: `CDB Banco X`
  - Tipo: `CDB`
  - Valor: `10000`
  - Data: Data atual
  - Rentabilidade: `10%`
- [ ] Salvar
- [ ] Resultado esperado: Investimento criado

### Cálculo de Rendimento
- [ ] **Teste 4.2:** Verificar se valor atual está correto
- [ ] Verificar se rentabilidade está sendo calculada
- [ ] Comparar com cálculo manual

### Tipos de Investimento
- [ ] **Teste 4.3:** Criar cada tipo disponível:
  - [ ] Poupança
  - [ ] CDB
  - [ ] Ações
  - [ ] Tesouro Direto
  - [ ] Fundos
  - [ ] Outros
- [ ] Verificar se todos são listados corretamente

### Editar e Excluir
- [ ] **Teste 4.4:** Editar rentabilidade
- [ ] Verificar recálculo do valor atual
- [ ] **Teste 4.5:** Excluir investimento
- [ ] Verificar remoção

**Status:** ⬜ Não testado | ✅ Passou | ❌ Falhou

---

## ✅ **5. Testar CRUD de Ofertas**

### Criar Oferta
- [ ] **Teste 5.1:** Ir para Transações → Ofertas
- [ ] Clicar em "+"
- [ ] Preencher:
  - Descrição: `Oferta de Missões`
  - Tipo: `Missões`
  - Valor: `100`
  - Data: Data atual
  - Igreja: `Igreja Teste` (opcional)
- [ ] Salvar
- [ ] Resultado esperado: Oferta registrada

### Tipos de Oferta
- [ ] **Teste 5.2:** Criar ofertas de cada tipo:
  - [ ] Dízimo
  - [ ] Missões
  - [ ] Construção
  - [ ] Outros
- [ ] Verificar se todas são listadas

### Histórico de Ofertas
- [ ] **Teste 5.3:** Ir para histórico de ofertas
- [ ] Verificar se todas aparecem
- [ ] Verificar totais por tipo

### Editar e Excluir
- [ ] **Teste 5.4:** Editar oferta
- [ ] **Teste 5.5:** Excluir oferta

**Status:** ⬜ Não testado | ✅ Passou | ❌ Falhou

---

## ✅ **6. Testar Calculadora de Dízimo**

### Modo Automático
- [ ] **Teste 6.1:** Ir para Transações → Dízimo
- [ ] Verificar cálculo automático (10% das receitas)
- [ ] Adicionar receita de R$ 1000
- [ ] Voltar para Dízimo
- [ ] Verificar se sugestão aumentou para R$ 100

### Modo Personalizado
- [ ] **Teste 6.2:** Alternar para "Modo Personalizado"
- [ ] Selecionar receitas específicas
- [ ] Verificar cálculo apenas das selecionadas

### Registrar Dízimo
- [ ] **Teste 6.3:** Clicar em "Registrar Dízimo"
- [ ] Confirmar valor sugerido
- [ ] Resultado esperado: Dízimo registrado como oferta

### Histórico
- [ ] **Teste 6.4:** Verificar histórico de dízimos
- [ ] Conferir valores e datas

**Status:** ⬜ Não testado | ✅ Passou | ❌ Falhou

---

## ✅ **7. Testar Histórico e Filtros**

### Listagem Completa
- [ ] **Teste 7.1:** Ir para Histórico
- [ ] Verificar se todas as transações aparecem
- [ ] Verificar ordenação por data (mais recente primeiro)

### Filtro por Tipo
- [ ] **Teste 7.2:** Filtrar por "Receitas"
  - Resultado: Apenas receitas
- [ ] **Teste 7.3:** Filtrar por "Despesas"
  - Resultado: Apenas despesas
- [ ] **Teste 7.4:** Filtrar por "Investimentos"
- [ ] **Teste 7.5:** Filtrar por "Ofertas"

### Filtro por Categoria
- [ ] **Teste 7.6:** Filtrar por categoria "Alimentação"
- [ ] Resultado: Apenas transações dessa categoria

### Filtro por Data
- [ ] **Teste 7.7:** Filtrar por "Este mês"
- [ ] **Teste 7.8:** Filtrar por "Mês passado"
- [ ] **Teste 7.9:** Filtrar por "Este ano"
- [ ] **Teste 7.10:** Filtrar período personalizado

### Busca por Descrição
- [ ] **Teste 7.11:** Buscar "Aluguel"
- [ ] Resultado: Encontrar transação com essa descrição
- [ ] **Teste 7.12:** Buscar termo inexistente
- [ ] Resultado: "Nenhuma transação encontrada"

### Ordenação
- [ ] **Teste 7.13:** Ordenar por data (crescente/decrescente)
- [ ] **Teste 7.14:** Ordenar por valor (maior/menor)
- [ ] **Teste 7.15:** Ordenar por descrição (A-Z)

**Status:** ⬜ Não testado | ✅ Passou | ❌ Falhou

---

## ✅ **8. Testar Metas Financeiras**

### Criar Meta
- [ ] **Teste 8.1:** Ir para Planejamento → Metas
- [ ] Clicar em "+"
- [ ] Preencher:
  - Nome: `Viagem para praia`
  - Valor alvo: `5000`
  - Data: 6 meses no futuro
- [ ] Salvar
- [ ] Resultado: Meta criada, progresso 0%

### Adicionar Progresso
- [ ] **Teste 8.2:** Clicar na meta
- [ ] Clicar em "Adicionar Valor"
- [ ] Adicionar R$ 1000
- [ ] Resultado: Progresso 20%, barra visual atualizada

### Múltiplas Metas
- [ ] **Teste 8.3:** Criar 5 metas diferentes
- [ ] Verificar limite para usuários gratuitos (5 metas)
- [ ] **Teste 8.4:** Tentar criar 6ª meta sendo gratuito
- [ ] Resultado: Mensagem pedindo upgrade Premium

### Notificações de Meta
- [ ] **Teste 8.5:** Adicionar progresso até 80%
- [ ] Resultado esperado: Notificação "Quase lá!"
- [ ] **Teste 8.6:** Adicionar até 100%
- [ ] Resultado esperado: Notificação "Parabéns!"

### Editar e Excluir
- [ ] **Teste 8.7:** Editar meta (nome, valor, data)
- [ ] **Teste 8.8:** Excluir meta

**Status:** ⬜ Não testado | ✅ Passou | ❌ Falhou

---

## ✅ **9. Testar Planejamento (Orçamento)**

### Criar Orçamento
- [ ] **Teste 9.1:** Ir para Planejamento → Orçamento
- [ ] Clicar em "+"
- [ ] Selecionar categoria: "Alimentação"
- [ ] Definir limite: R$ 1000
- [ ] Salvar
- [ ] Resultado: Orçamento criado, gasto atual R$ 0

### Acompanhar Gastos
- [ ] **Teste 9.2:** Adicionar despesa de R$ 500 em Alimentação
- [ ] Voltar para Orçamento
- [ ] Verificar: Gasto R$ 500 / R$ 1000 (50%)

### Alertas de Limite
- [ ] **Teste 9.3:** Adicionar mais R$ 400 (total R$ 900)
- [ ] Resultado esperado: Alerta "Você gastou 90% do orçamento"
- [ ] **Teste 9.4:** Adicionar mais R$ 200 (total R$ 1100)
- [ ] Resultado esperado: Alerta "Orçamento excedido!"

### Sugestões de Economia
- [ ] **Teste 9.5:** Ver sugestões quando orçamento estiver alto
- [ ] Verificar se sugestões fazem sentido

### Comparativo
- [ ] **Teste 9.6:** Ver comparativo gasto vs orçamento
- [ ] Verificar gráficos

**Status:** ⬜ Não testado | ✅ Passou | ❌ Falhou

---

## ✅ **10. Testar Sistema de Backup**

### Backup Automático
- [ ] **Teste 10.1:** Ir para Perfil → Backup
- [ ] Ativar "Backup Automático"
- [ ] Adicionar uma transação
- [ ] Voltar para Backup
- [ ] Resultado: Novo backup automático criado

### Backup Manual
- [ ] **Teste 10.2:** Clicar em "Criar Backup Agora"
- [ ] Aguardar confirmação
- [ ] Resultado: Backup criado, aparece na lista

### Lista de Backups
- [ ] **Teste 10.3:** Verificar lista de backups
- [ ] Conferir data e hora
- [ ] Verificar indicador "Auto" para automáticos
- [ ] Verificar contagem de itens

### Limite de Backups (Gratuito)
- [ ] **Teste 10.4:** Criar 3 backups sendo usuário gratuito
- [ ] Tentar criar 4º backup
- [ ] Resultado esperado: Mensagem pedindo upgrade Premium

**Status:** ⬜ Não testado | ✅ Passou | ❌ Falhou

---

## ✅ **11. Testar Restauração**

### Preparação
- [ ] **Teste 11.1:** Anotar quantidade atual de transações
- [ ] Criar backup
- [ ] Adicionar 3 novas transações
- [ ] Verificar que total aumentou

### Restaurar Backup
- [ ] **Teste 11.2:** Ir para Backup
- [ ] Selecionar backup anterior
- [ ] Clicar em "Restaurar"
- [ ] Confirmar (atenção ao aviso)
- [ ] Aguardar restauração

### Verificação
- [ ] **Teste 11.3:** Ir para Home
- [ ] Verificar se dados voltaram ao estado do backup
- [ ] Ir para Histórico
- [ ] Conferir se as 3 transações novas sumiram
- [ ] Verificar metas
- [ ] Verificar orçamentos

### Restauração Completa
- [ ] **Teste 11.4:** Verificar se TODOS os dados foram restaurados:
  - [ ] Transações (receitas, despesas, investimentos, ofertas)
  - [ ] Metas
  - [ ] Orçamentos

**Status:** ⬜ Não testado | ✅ Passou | ❌ Falhou

---

## ✅ **12. Testar Assinatura Premium**

### Tela Premium
- [ ] **Teste 12.1:** Ir para Perfil → Upgrade Premium
- [ ] Verificar apresentação dos planos
- [ ] Verificar lista de benefícios
- [ ] Verificar preços (Mensal R$ 9,90 / Anual R$ 89,90)

### Assinar (Modo Demo)
- [ ] **Teste 12.2:** Clicar em "Assinar" no plano Mensal
- [ ] Confirmar assinatura
- [ ] Resultado: Mensagem "Bem-vindo ao Premium!"
- [ ] Verificar badge "Premium" no perfil

### Verificar Benefícios
- [ ] **Teste 12.3:** Tentar criar 6ª meta
- [ ] Resultado: Agora permite (ilimitado)
- [ ] **Teste 12.4:** Criar 4º backup
- [ ] Resultado: Agora permite (ilimitado)

### Acessar Relatórios Avançados
- [ ] **Teste 12.5:** Ir para Relatórios
- [ ] Clicar em "Relatórios Avançados"
- [ ] Resultado: Acesso liberado (sem tela de bloqueio)

### Cancelar Premium
- [ ] **Teste 12.6:** Ir para Upgrade Premium
- [ ] Clicar em "Gerenciar Assinatura"
- [ ] Confirmar cancelamento
- [ ] Resultado: Status volta para gratuito
- [ ] **Teste 12.7:** Tentar acessar Relatórios Avançados novamente
- [ ] Resultado: Tela de bloqueio pedindo upgrade

**Status:** ⬜ Não testado | ✅ Passou | ❌ Falhou

---

## ✅ **13. Testar Relatórios Avançados**

### Acesso Premium
- [ ] **Teste 13.1:** Assinar Premium (se não estiver)
- [ ] Ir para Relatórios → Relatórios Avançados

### Visualização Anual
- [ ] **Teste 13.2:** Selecionar "Anual"
- [ ] Verificar gráfico de linha com 12 meses
- [ ] Verificar totais anuais
- [ ] Verificar média mensal

### Comparativo Mensal
- [ ] **Teste 13.3:** Selecionar "Comparativo"
- [ ] Escolher mês 1 e mês 2
- [ ] Verificar gráfico de barras comparativas
- [ ] Verificar diferenças percentuais

### Projeção Futura
- [ ] **Teste 13.4:** Selecionar "Projeção"
- [ ] Verificar projeção baseada em média dos últimos 3 meses
- [ ] Verificar se cálculos fazem sentido

### Exportação (Placeholder)
- [ ] **Teste 13.5:** Clicar em "Exportar PDF"
- [ ] Resultado: Mensagem de funcionalidade em desenvolvimento
- [ ] **Teste 13.6:** Clicar em "Exportar Excel"
- [ ] Resultado: Mensagem de funcionalidade em desenvolvimento

**Status:** ⬜ Não testado | ✅ Passou | ❌ Falhou

---

## ✅ **14. Testar Notificações**

### Configurar Notificações
- [ ] **Teste 14.1:** Ir para Perfil → Configurações
- [ ] Seção Notificações
- [ ] Ativar todas as notificações

### Notificação de Transação
- [ ] **Teste 14.2:** Adicionar uma receita
- [ ] Resultado esperado: Notificação "Receita de R$ X adicionada"
- [ ] **Teste 14.3:** Adicionar uma despesa
- [ ] Resultado esperado: Notificação "Despesa de R$ X adicionada"

### Notificação de Meta
- [ ] **Teste 14.4:** Adicionar progresso a meta até 80%
- [ ] Resultado esperado: Notificação "Quase lá! Você está a X% de atingir a meta"
- [ ] **Teste 14.5:** Completar meta (100%)
- [ ] Resultado esperado: Notificação "Parabéns! Você atingiu a meta"

### Notificação de Orçamento
- [ ] **Teste 14.6:** Gastar 80% do orçamento
- [ ] Resultado esperado: Notificação "Atenção! Você gastou 80% do orçamento"
- [ ] **Teste 14.7:** Exceder orçamento
- [ ] Resultado esperado: Notificação "Orçamento excedido!"

### Lembrete Diário
- [ ] **Teste 14.8:** Ativar lembrete diário
- [ ] Definir horário próximo (ex: daqui a 2 minutos)
- [ ] Aguardar
- [ ] Resultado esperado: Notificação no horário definido

### Lembrete de Dízimo
- [ ] **Teste 14.9:** Ativar lembrete de dízimo
- [ ] Nota: Será notificado dia 5 do mês
- [ ] (Marcar para testar no dia 5)

### Desativar Notificações
- [ ] **Teste 14.10:** Desativar "Notificações Ativadas"
- [ ] Adicionar transação
- [ ] Resultado esperado: SEM notificação

**Status:** ⬜ Não testado | ✅ Passou | ❌ Falhou

---

## 📊 **RESUMO DOS TESTES**

| Módulo | Total Testes | Passou | Falhou | Não Testado |
|--------|--------------|--------|--------|-------------|
| Login e Cadastro | 9 | 0 | 0 | 9 |
| CRUD Receitas | 5 | 0 | 0 | 5 |
| CRUD Despesas | 7 | 0 | 0 | 7 |
| CRUD Investimentos | 5 | 0 | 0 | 5 |
| CRUD Ofertas | 5 | 0 | 0 | 5 |
| Calculadora de Dízimo | 4 | 0 | 0 | 4 |
| Histórico e Filtros | 15 | 0 | 0 | 15 |
| Metas Financeiras | 8 | 0 | 0 | 8 |
| Planejamento | 6 | 0 | 0 | 6 |
| Sistema de Backup | 4 | 0 | 0 | 4 |
| Restauração | 4 | 0 | 0 | 4 |
| Assinatura Premium | 7 | 0 | 0 | 7 |
| Relatórios Avançados | 6 | 0 | 0 | 6 |
| Notificações | 10 | 0 | 0 | 10 |
| **TOTAL** | **95** | **0** | **0** | **95** |

---

## 🐛 **BUGS ENCONTRADOS**

| # | Severidade | Módulo | Descrição | Status |
|---|------------|--------|-----------|--------|
| 1 | | | | ⬜ Aberto / ✅ Resolvido |

---

**Data de execução:** __/__/____  
**Testador:** _______________  
**Versão do app:** 1.0.0  
**Dispositivo:** _______________

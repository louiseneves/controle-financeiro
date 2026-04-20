# 📋 CHECKLIST: TESTES DE QUALIDADE

---

## ✅ **1. Testes em Diferentes Dispositivos**

### Android - Diferentes Tamanhos de Tela

#### Smartphones Pequenos (< 5")
- [ ] **Teste 1.1:** Samsung Galaxy S10e (5.8")
  - [ ] Interface se adapta corretamente
  - [ ] Textos legíveis
  - [ ] Botões acessíveis
  - [ ] Gráficos visíveis
  - [ ] Scroll funciona
  
#### Smartphones Médios (5-6")
- [ ] **Teste 1.2:** Samsung Galaxy S21 (6.2")
  - [ ] Layout proporcional
  - [ ] Espaçamentos adequados
  - [ ] Cards bem dimensionados
  
- [ ] **Teste 1.3:** Xiaomi Redmi Note 10 (6.43")
  - [ ] Todas as funcionalidades acessíveis
  - [ ] Performance fluida

#### Smartphones Grandes (6"+)
- [ ] **Teste 1.4:** Samsung Galaxy S21 Ultra (6.8")
  - [ ] Aproveitamento da tela
  - [ ] Sem desperdício de espaço
  
- [ ] **Teste 1.5:** Motorola Moto G Power (6.6")
  - [ ] Interface proporcional

#### Tablets Android
- [ ] **Teste 1.6:** Samsung Galaxy Tab S7 (11")
  - [ ] Layout se adapta para tela grande
  - [ ] Dois painéis se possível
  - [ ] Boa utilização do espaço
  
- [ ] **Teste 1.7:** Tablet 7"
  - [ ] Funciona como smartphone grande
  - [ ] Todos os elementos visíveis

### Android - Diferentes Versões

- [ ] **Teste 1.8:** Android 10
  - [ ] App funciona sem crashes
  - [ ] Todas as permissões funcionam
  
- [ ] **Teste 1.9:** Android 11
  - [ ] Compatível
  - [ ] Notificações funcionam
  
- [ ] **Teste 1.10:** Android 12
  - [ ] Material You compatível
  - [ ] Splash screen nativa
  
- [ ] **Teste 1.11:** Android 13
  - [ ] Última versão compatível
  - [ ] Novas APIs funcionam
  
- [ ] **Teste 1.12:** Android 14
  - [ ] Totalmente funcional
  - [ ] Sem avisos de depreciação

### iOS (se aplicável)

- [ ] **Teste 1.13:** iPhone SE (4.7")
  - [ ] Layout compacto funciona
  
- [ ] **Teste 1.14:** iPhone 13 (6.1")
  - [ ] Interface padrão
  
- [ ] **Teste 1.15:** iPhone 13 Pro Max (6.7")
  - [ ] Tela grande aproveitada
  
- [ ] **Teste 1.16:** iPad (10.2")
  - [ ] Adaptação para tablet

### Fabricantes Diferentes

- [ ] **Teste 1.17:** Samsung (One UI)
  - [ ] Interface nativa funciona
  - [ ] Gestos funcionam
  
- [ ] **Teste 1.18:** Xiaomi (MIUI)
  - [ ] Permissões funcionam
  - [ ] Notificações aparecem
  
- [ ] **Teste 1.19:** Motorola (Android puro)
  - [ ] Experiência limpa
  
- [ ] **Teste 1.20:** LG
  - [ ] Compatível

**Dispositivos Testados:**
| Dispositivo | Versão Android | Tela | Status | Bugs |
|-------------|----------------|------|--------|------|
| | | | ⬜ / ✅ / ❌ | |

---

## ✅ **2. Testes de Performance**

### Tempo de Carregamento

- [ ] **Teste 2.1:** Splash Screen
  - Tempo: ______ segundos
  - Esperado: < 2 segundos
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.2:** Tela de Login
  - Tempo após splash: ______ segundos
  - Esperado: < 1 segundo
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.3:** Home após login
  - Tempo: ______ segundos
  - Esperado: < 2 segundos
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.4:** Carregar Histórico (100 transações)
  - Tempo: ______ segundos
  - Esperado: < 3 segundos
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.5:** Carregar Histórico (1000 transações)
  - Tempo: ______ segundos
  - Esperado: < 5 segundos
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.6:** Gerar Relatório Mensal
  - Tempo: ______ segundos
  - Esperado: < 3 segundos
  - Status: ⬜ / ✅ / ❌

### Performance de Animações

- [ ] **Teste 2.7:** Transições entre telas
  - FPS: ______ 
  - Esperado: 60 FPS
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.8:** Scroll no histórico
  - Fluidez: Suave / Travando
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.9:** Animação de gráficos
  - FPS: ______
  - Esperado: 60 FPS
  - Status: ⬜ / ✅ / ❌

### Uso de Memória

- [ ] **Teste 2.10:** Memória em repouso
  - RAM usada: ______ MB
  - Esperado: < 150 MB
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.11:** Memória em uso intenso
  - RAM usada: ______ MB
  - Esperado: < 300 MB
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.12:** Vazamento de memória (usar 30 min)
  - Memória inicial: ______ MB
  - Memória final: ______ MB
  - Esperado: Variação < 50 MB
  - Status: ⬜ / ✅ / ❌

### Uso de Bateria

- [ ] **Teste 2.13:** Bateria em 1 hora de uso
  - Bateria gasta: ______%
  - Esperado: < 10%
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.14:** Bateria em background (1 hora)
  - Bateria gasta: ______%
  - Esperado: < 2%
  - Status: ⬜ / ✅ / ❌

### Tamanho do App

- [ ] **Teste 2.15:** Tamanho do APK
  - Tamanho: ______ MB
  - Esperado: < 50 MB
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.16:** Tamanho após instalação
  - Tamanho: ______ MB
  - Esperado: < 100 MB
  - Status: ⬜ / ✅ / ❌

### Performance de Rede

- [ ] **Teste 2.17:** Sincronização com Firebase (WiFi)
  - Tempo: ______ segundos
  - Esperado: < 3 segundos
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.18:** Sincronização com Firebase (4G)
  - Tempo: ______ segundos
  - Esperado: < 5 segundos
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.19:** Sincronização com Firebase (3G)
  - Tempo: ______ segundos
  - Esperado: < 10 segundos
  - Status: ⬜ / ✅ / ❌

### Stress Test

- [ ] **Teste 2.20:** Criar 100 transações rapidamente
  - App continua responsivo: Sim / Não
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.21:** Abrir/fechar app 20 vezes seguidas
  - Crashes: ______ 
  - Esperado: 0
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 2.22:** Usar todas as funcionalidades por 2 horas
  - Crashes: ______
  - Lentidão: Sim / Não
  - Status: ⬜ / ✅ / ❌

**Resultados de Performance:**
| Métrica | Valor Obtido | Valor Esperado | Status |
|---------|--------------|----------------|--------|
| Splash Screen | | < 2s | |
| RAM (repouso) | | < 150 MB | |
| RAM (uso) | | < 300 MB | |
| Bateria/hora | | < 10% | |
| Tamanho APK | | < 50 MB | |

---

## ✅ **3. Testes de Segurança**

### Autenticação

- [ ] **Teste 3.1:** Tentar acessar app sem login
  - Resultado esperado: Redirecionado para login
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 3.2:** Token de sessão expira
  - Fazer logout após X tempo
  - Resultado esperado: Pede login novamente
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 3.3:** Login simultâneo em 2 dispositivos
  - Comportamento: Permitido / Bloqueado
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 3.4:** Força bruta na senha
  - Tentar 10 senhas erradas seguidas
  - Resultado esperado: Bloqueio temporário
  - Status: ⬜ / ✅ / ❌

### Armazenamento de Dados

- [ ] **Teste 3.5:** Dados locais criptografados
  - Verificar AsyncStorage
  - Senhas visíveis: Sim / Não
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 3.6:** Dados sensíveis em logs
  - Verificar console/logcat
  - Senhas/tokens nos logs: Sim / Não
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 3.7:** Backup do Android inclui dados sensíveis
  - Verificar configuração
  - Dados expostos: Sim / Não
  - Status: ⬜ / ✅ / ❌

### Comunicação de Rede

- [ ] **Teste 3.8:** Conexão Firebase usa HTTPS
  - Protocolo: HTTP / HTTPS
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 3.9:** Certificado SSL válido
  - Certificado: Válido / Inválido
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 3.10:** Interceptação de rede (Man-in-the-middle)
  - Usar proxy para interceptar
  - Dados sensíveis visíveis: Sim / Não
  - Status: ⬜ / ✅ / ❌

### Permissões

- [ ] **Teste 3.11:** App solicita apenas permissões necessárias
  - Permissões desnecessárias: Sim / Não
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 3.12:** Permissões revogadas não quebram app
  - Revogar notificações
  - App continua funcionando: Sim / Não
  - Status: ⬜ / ✅ / ❌

### Validação de Entrada

- [ ] **Teste 3.13:** SQL Injection (se aplicável)
  - Tentar `' OR '1'='1` em campos
  - Protegido: Sim / Não
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 3.14:** XSS em descrições
  - Tentar `<script>alert('XSS')</script>`
  - Protegido: Sim / Não
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 3.15:** Valores negativos em campos numéricos
  - Inserir valor negativo onde não faz sentido
  - Validado: Sim / Não
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 3.16:** Valores muito grandes
  - Inserir 999999999999 em valor
  - Tratado adequadamente: Sim / Não
  - Status: ⬜ / ✅ / ❌

### Regras de Firestore

- [ ] **Teste 3.17:** Usuário só acessa seus próprios dados
  - Tentar acessar dados de outro usuário
  - Bloqueado: Sim / Não
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 3.18:** Escrita sem autenticação bloqueada
  - Tentar escrever sem login
  - Bloqueado: Sim / Não
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 3.19:** Leitura sem autenticação bloqueada
  - Tentar ler sem login
  - Bloqueado: Sim / Não
  - Status: ⬜ / ✅ / ❌

### Engenharia Reversa

- [ ] **Teste 3.20:** APK ofuscado (ProGuard/R8)
  - Código ofuscado: Sim / Não
  - Status: ⬜ / ✅ / ❌

- [ ] **Teste 3.21:** Strings sensíveis protegidas
  - API keys visíveis no APK: Sim / Não
  - Status: ⬜ / ✅ / ❌

**Vulnerabilidades Encontradas:**
| # | Severidade | Descrição | Status |
|---|------------|-----------|--------|
| | Alta/Média/Baixa | | ⬜ / ✅ |

---

## ✅ **4. Testes de Usabilidade com Usuários Reais**

### Recrutamento de Beta Testers

- [ ] **Teste 4.1:** Recrutar 10 beta testers
  - Perfil: Usuários comuns (não técnicos)
  - 5 homens, 5 mulheres
  - Idades variadas (20-60 anos)
  - Diferentes níveis de familiaridade com apps

### Onboarding

- [ ] **Teste 4.2:** Usuário consegue criar conta sozinho
  - Sem ajuda: __/10 usuários
  - Com dificuldade: __/10 usuários
  - Não conseguiu: __/10 usuários

- [ ] **Teste 4.3:** Usuário entende o propósito do app
  - Entendeu imediatamente: __/10
  - Precisou explorar: __/10
  - Ficou confuso: __/10

### Primeira Transação

- [ ] **Teste 4.4:** Usuário adiciona primeira receita
  - Tempo médio: ______ minutos
  - Esperado: < 2 minutos
  - Conseguiram: __/10

- [ ] **Teste 4.5:** Usuário adiciona primeira despesa
  - Tempo médio: ______ minutos
  - Conseguiram: __/10

### Navegação

- [ ] **Teste 4.6:** Usuário encontra tela de Metas
  - Tempo médio: ______ segundos
  - Esperado: < 30 segundos
  - Encontraram: __/10

- [ ] **Teste 4.7:** Usuário encontra Histórico
  - Tempo médio: ______ segundos
  - Encontraram: __/10

- [ ] **Teste 4.8:** Usuário encontra Backup
  - Tempo médio: ______ segundos
  - Encontraram: __/10

### Entendimento de Funcionalidades

- [ ] **Teste 4.9:** Usuário entende Calculadora de Dízimo
  - Entenderam: __/10
  - Confusos: __/10

- [ ] **Teste 4.10:** Usuário entende Orçamento Mensal
  - Entenderam: __/10
  - Confusos: __/10

- [ ] **Teste 4.11:** Usuário entende Metas
  - Entenderam: __/10
  - Confusos: __/10

### Satisfação Geral

- [ ] **Teste 4.12:** NPS (Net Promoter Score)
  - Pergunta: "De 0 a 10, quanto você recomendaria este app?"
  - Notas: __, __, __, __, __, __, __, __, __, __
  - Média: ______
  - Esperado: > 8

- [ ] **Teste 4.13:** Facilidade de uso (1-5)
  - Média: ______
  - Esperado: > 4

- [ ] **Teste 4.14:** Design (1-5)
  - Média: ______
  - Esperado: > 4

- [ ] **Teste 4.15:** Utilidade (1-5)
  - Média: ______
  - Esperado: > 4

### Feedback Qualitativo

**Pontos Positivos Mencionados:**
1. ______________________________________
2. ______________________________________
3. ______________________________________

**Pontos Negativos Mencionados:**
1. ______________________________________
2. ______________________________________
3. ______________________________________

**Sugestões de Melhoria:**
1. ______________________________________
2. ______________________________________
3. ______________________________________

### Tarefas Específicas

- [ ] **Teste 4.16:** Criar meta de R$ 5000 em 6 meses
  - Completaram: __/10
  - Tempo médio: ______ minutos

- [ ] **Teste 4.17:** Filtrar histórico por categoria
  - Completaram: __/10
  - Tempo médio: ______ segundos

- [ ] **Teste 4.18:** Fazer backup dos dados
  - Completaram: __/10
  - Tempo médio: ______ segundos

- [ ] **Teste 4.19:** Ativar modo escuro
  - Completaram: __/10
  - Tempo médio: ______ segundos

- [ ] **Teste 4.20:** Calcular dízimo do mês
  - Completaram: __/10
  - Entenderam resultado: __/10

**Resumo de Usabilidade:**
| Métrica | Resultado | Meta |
|---------|-----------|------|
| Taxa de conclusão de tarefas | __% | > 80% |
| Tempo médio de conclusão | __ min | < 5 min |
| NPS | __ | > 8 |
| Satisfação geral | __/5 | > 4 |

---

## ✅ **5. Correção de Bugs Críticos**

### Definição de Severidade

**Crítico:** Impede uso do app ou causa perda de dados  
**Alto:** Funcionalidade importante quebrada  
**Médio:** Problema que afeta experiência mas tem workaround  
**Baixo:** Problema cosmético ou de UX menor

### Bugs Críticos Encontrados

- [ ] **Bug 5.1:** ______________________
  - Severidade: Crítico
  - Como reproduzir:
    1. ______________________
    2. ______________________
  - Comportamento esperado: ______________________
  - Comportamento atual: ______________________
  - Status: ⬜ Aberto / 🔧 Em correção / ✅ Resolvido

- [ ] **Bug 5.2:** ______________________
  - Severidade: Crítico
  - Como reproduzir:
  - Status: ⬜ / 🔧 / ✅

### Critérios para Release

**Bloqueadores (devem ser 0 para lançar):**
- [ ] Bugs críticos: ____ (Meta: 0)
- [ ] Crashes frequentes: ____ (Meta: 0)
- [ ] Perda de dados: ____ (Meta: 0)

**Importantes (devem ser < 5):**
- [ ] Bugs altos: ____ (Meta: < 5)
- [ ] Problemas de performance: ____ (Meta: < 3)

**Desejáveis (podem ter alguns):**
- [ ] Bugs médios: ____ (Meta: < 10)
- [ ] Bugs baixos: Ilimitado

---

## ✅ **6. Correção de Bugs Menores**

### Bugs de Interface

- [ ] **Bug 6.1:** ______________________
  - Severidade: Média / Baixa
  - Tela: ______________________
  - Descrição: ______________________
  - Status: ⬜ / ✅

- [ ] **Bug 6.2:** ______________________
  - Status: ⬜ / ✅

### Bugs de Lógica

- [ ] **Bug 6.3:** ______________________
  - Severidade: Média
  - Módulo: ______________________
  - Status: ⬜ / ✅

### Bugs de Texto

- [ ] **Bug 6.4:** Erros de português
  - Tela: ______________________
  - Texto incorreto: ______________________
  - Correção: ______________________
  - Status: ⬜ / ✅

### Bugs de UX

- [ ] **Bug 6.5:** Comportamento não intuitivo
  - Onde: ______________________
  - Problema: ______________________
  - Solução: ______________________
  - Status: ⬜ / ✅

**Lista Completa de Bugs:**
| # | Severidade | Tela/Módulo | Descrição | Status |
|---|------------|-------------|-----------|--------|
| 1 | | | | ⬜ / ✅ |
| 2 | | | | ⬜ / ✅ |

---

## ✅ **7. Validação com Comunidade Cristã (Beta Testers)**

### Recrutamento Específico

- [ ] **Teste 7.1:** Recrutar 20 beta testers da comunidade cristã
  - Pastores: 3
  - Líderes: 5
  - Membros ativos: 12
  - Diferentes denominações

### Funcionalidades Religiosas

- [ ] **Teste 7.2:** Calculadora de Dízimo é útil
  - Concordam: __/20
  - Feedback: ______________________

- [ ] **Teste 7.3:** Cálculo de 10% está correto
  - Aprovado: __/20
  - Sugestões: ______________________

- [ ] **Teste 7.4:** Registro de Ofertas é adequado
  - Útil: __/20
  - Tipos de oferta são suficientes: __/20

- [ ] **Teste 7.5:** Falta algum tipo de oferta
  - Sim: __/20
  - Quais: ______________________

### Sensibilidade Cultural

- [ ] **Teste 7.6:** Linguagem é apropriada
  - Aprovada: __/20
  - Problemas: ______________________

- [ ] **Teste 7.7:** Não ofende nenhuma denominação
  - Aprovado: __/20
  - Preocupações: ______________________

- [ ] **Teste 7.8:** Respeita diferentes práticas
  - Sim: __/20
  - Sugestões: ______________________

### Sugestões da Comunidade

**Funcionalidades Desejadas:**
1. ______________________________________
2. ______________________________________
3. ______________________________________

**Melhorias Sugeridas:**
1. ______________________________________
2. ______________________________________
3. ______________________________________

**Preocupações Levantadas:**
1. ______________________________________
2. ______________________________________

### Aprovação Final

- [ ] **Teste 7.9:** Comunidade aprova o app
  - Aprovam: __/20 (Meta: > 15)
  
- [ ] **Teste 7.10:** Usariam regularmente
  - Sim: __/20 (Meta: > 16)
  
- [ ] **Teste 7.11:** Recomendariam para igreja
  - Sim: __/20 (Meta: > 17)

**Testemunhos dos Beta Testers:**
> "______________________________________"
> - Nome, Função

> "______________________________________"
> - Nome, Função

---

## 📊 **RESUMO GERAL DE QUALIDADE**

| Categoria | Meta | Resultado | Status |
|-----------|------|-----------|--------|
| Dispositivos testados | > 10 | __ | ⬜ / ✅ |
| Performance (média) | > 8/10 | __ | ⬜ / ✅ |
| Bugs críticos | 0 | __ | ⬜ / ✅ |
| Bugs altos | < 5 | __ | ⬜ / ✅ |
| Segurança (vulnerabilidades) | 0 | __ | ⬜ / ✅ |
| Usabilidade (NPS) | > 8 | __ | ⬜ / ✅ |
| Aprovação comunidade | > 80% | __% | ⬜ / ✅ |

**Pronto para Lançamento:** ⬜ SIM / ⬜ NÃO

**Pendências antes do lançamento:**
1. ______________________________________
2. ______________________________________
3. ______________________________________

---

**Data de conclusão:** __/__/____  
**Responsável:** _______________  
**Próxima etapa:** Preparação para Lançamento
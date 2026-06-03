🔒 TESTES DE SEGURANÇA — Controle Financeiro
1. AUTENTICAÇÃO
Teste 1.1: Força Bruta

 Tentar login 10x seguidas com senha errada
O app bloqueia ou exibe alguma mensagem de proteção? Sim
Status: ✅

Teste 1.2: Sessão Persistente

 Fazer login → fechar o app completamente → reabrir
Continua logado? Sim
Status: ✅

Teste 1.3: Logout Funcional

 Fazer logout → tentar voltar para tela Home pelo botão "voltar"
Consegue acessar sem logar?  Não
Status: ✅

Teste 1.4: Senha Fraca

 Tentar criar conta com senha "123"
App bloqueia ou exige senha mais forte? Sim
Status: ✅ 


1. DADOS E PRIVACIDADE
Teste 2.1: Captura de Tela

 Abrir tela com dados financeiros (Home ou Histórico)
 Tirar print
Print mostra os dados? Sim 
Status: ✅

Teste 2.2: App em Background

 Minimizar o app com dados financeiros visíveis
 Ver o preview no gerenciador de apps do Android
Preview mostra os dados ou exibe tela em branco/blur? Mostra 
Status: ✅

Teste 2.3: Acesso sem Conta

 Sem estar logado, tentar acessar rotas protegidas manualmente (Home, Histórico)
Redireciona para Login? Sim
Status: ✅


1. PERMISSÕES
Teste 3.1: Permissões Solicitadas

 Configurações → Apps → Controle Financeiro → Permissões
Anotar quais permissões o app solicita: Notificação
Todas fazem sentido para o app? Sim
Status: ✅

Teste 3.2: App sem Notificações

 Revogar permissão de notificações
 Usar o app normalmente
App trava ou continua funcionando?  Funciona
Status: ✅ 


1. VALIDAÇÃO DE ENTRADA
Teste 4.1: Valores Extremos

 Tentar salvar transação com valor negativo (ex: -999)
 Tentar salvar com valor absurdo (ex: 9999999999999)
App valida ou aceita qualquer valor? Valida
Status: ✅

Teste 4.2: Campos de Texto Maliciosos

 Em um campo de descrição, digitar: <script>alert('x')</script>
 Em outro campo, digitar: ' OR '1'='1
App trava, exibe erro estranho ou salva normalmente? Salva normal
Status: ✅

Teste 4.3: Campos Obrigatórios Vazios

 Tentar salvar transação sem preencher campos obrigatórios
App bloqueia com mensagem clara? Sim 
Status: ✅ 


📊 RESUMO
Área Testes Passou Falhou 
Autenticação 4
Dados e Privacidade 3
Permissões 2
Validação de Entrada 3
Total 12
Vulnerabilidades críticas encontradas: 0
Status final: ✅ Aprovado 
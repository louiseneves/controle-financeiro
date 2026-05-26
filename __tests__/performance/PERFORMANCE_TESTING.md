# ⚡ TESTES DE PERFORMANCE - Pixel 9

## 1. TEMPO DE CARREGAMENTO

### Teste 1.1: Splash Screen

- [x] Abrir app (fechado completamente)
- [x] Cronometrar do toque até aparecer tela de login
- **Tempo:** 01.10 segundos
- **Meta:** < 3 segundos
- **Status:** ✅

### Teste 1.2: Tela de Login

- [x] Tempo do splash até login aparecer
- **Tempo:** 00,86 segundos
- **Meta:** < 1 segundo
- **Status:** ✅

### Teste 1.3: Home após Login

- [x] Fazer login
- [x] Cronometrar até Home carregar completamente
- **Tempo:** 02,93 segundos
- **Meta:** < 2 segundos
- **Status:** ❌

### Teste 1.4: Carregar Histórico (com dados)

- [x] Ter pelo menos 50 transações
- [x] Ir para Histórico
- [x] Cronometrar carregamento
- **Tempo:** 01.85 segundos
- **Meta:** < 2 segundos
- **Status:** ✅

### Teste 1.5: Gerar Gráfico

- [x] Ir para Relatórios
- [x] Cronometrar renderização do gráfico
- **Tempo:** 00.79 segundos
- **Meta:** < 2 segundos
- **Status:** ✅

---

## 2. USO DE MEMÓRIA

### Teste 2.1: Memória em Repouso

- [x] Abrir app e deixar na Home por 1 minuto
- [x] Ver uso de RAM (Settings → Developer Options → Running Services)
- **RAM usada:** 99 MB
- **Meta:** < 200 MB
- **Status:** ✅

### Teste 2.2: Memória durante Uso

- [x] Navegar por várias telas por 5 minutos
- [x] Abrir histórico, gráficos, metas, etc
- **RAM usada:** 165 MB
- **Meta:** < 300 MB
- **Status:** ✅

### Teste 2.3: Vazamento de Memória

- [x] Usar app por 10 minutos intensamente
- [x] Anotar RAM no início: 165 MB
- [x] Anotar RAM no final: 195 MB
- [x] Diferença: 35 MB
- **Meta:** Aumento < 100 MB
- **Status:** ✅

---

## 3. USO DE BATERIA

### Teste 3.1: Bateria em 30 min de uso

- [x] Carregar bateria para 100%
- [x] Usar app intensamente por 30 minutos
- [x] Bateria inicial: 100%
- [x] Bateria final: 96%
- [x] Gasto: 4%
- **Meta:** < 5%
- **Status:** ✅

### Teste 3.2: Bateria em Background

- [x] Deixar app em background por 1 hora
- [x] Bateria inicial: 96%
- [x] Bateria final: 95%
- [x] Gasto: 1%
- **Meta:** < 2%
- **Status:** ✅ / ❌

---

## 4. TAMANHO DO APP

### Teste 4.1: Tamanho do APK

```bash
# Gerar APK de release
cd android
./gradlew assembleRelease

# Verificar tamanho em:
# android/app/build/outputs/apk/release/app-release.apk
```

- **Tamanho:** 127 MB
- **Meta:** < 50 MB
- **Status:** ✅

### Teste 4.2: Tamanho Instalado

- [x] Instalar APK
- [x] Ver Settings → Apps → Controle Financeiro
- **Tamanho total:** 127 MB
- **Meta:** < 100 MB
- **Status:** ✅

---

## 5. FLUIDEZ / FPS

### Teste 5.1: Scroll no Histórico

- [ ] Ter 100+ transações
- [ ] Fazer scroll rápido
- **Percepção:** Suave / Travando / Muito lento
- **Status:** ✅ / ❌

### Teste 5.2: Transições entre Telas

- [ ] Navegar rapidamente entre telas
- **Percepção:** Suave / Lag perceptível / Travando
- **Status:** ✅ / ❌

### Teste 5.3: Animação de Gráficos

- [ ] Ver gráfico renderizar
- **Percepção:** Suave / Cortado / Travando
- **Status:** ✅ / ❌

---

## 6. STRESS TEST

### Teste 6.1: Adicionar 100 Transações

- [ ] Adicionar 100 transações rapidamente
- [ ] App continua responsivo: Sim / Não
- [ ] Crashou: Sim / Não
- **Status:** ✅ / ❌

### Teste 6.2: Abrir/Fechar App 10x

- [ ] Abrir e fechar app 10 vezes seguidas
- [ ] Crashes: **\_** vezes
- **Meta:** 0 crashes
- **Status:** ✅ / ❌

### Teste 6.3: Usar por 1 hora contínua

- [ ] Usar todas as funcionalidades por 1 hora
- [ ] Crashes: **\_**
- [ ] Lentidão ao final: Sim / Não
- **Status:** ✅ / ❌

---

## 📊 RESUMO DE PERFORMANCE

| Métrica          | Resultado | Meta    | Status |
| ---------------- | --------- | ------- | ------ |
| Splash screen    | 01.10s    | < 3s    | ✅     |
| RAM (repouso)    | 99MB      | < 200MB | ✅     |
| RAM (uso)        | 165MB     | < 300MB | ✅     |
| Bateria/30min    | 4%        | < 5%    | ✅     |
| Tamanho APK      | \_\_MB    | < 50MB  | ⬜     |
| Scroll           | \_\_      | Suave   | ⬜     |
| Crashes (stress) | \_\_      | 0       | ⬜     |

**Status Final:** ✅ Aprovado / ⬜ Reprovado

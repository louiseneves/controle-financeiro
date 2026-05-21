# ⚡ TESTES DE PERFORMANCE - Pixel 9

## 1. TEMPO DE CARREGAMENTO

### Teste 1.1: Splash Screen
- [ ] Abrir app (fechado completamente)
- [ ] Cronometrar do toque até aparecer tela de login
- **Tempo:** _____ segundos
- **Meta:** < 3 segundos
- **Status:** ✅ / ❌

### Teste 1.2: Tela de Login
- [ ] Tempo do splash até login aparecer
- **Tempo:** _____ segundos
- **Meta:** < 1 segundo
- **Status:** ✅ / ❌

### Teste 1.3: Home após Login
- [ ] Fazer login
- [ ] Cronometrar até Home carregar completamente
- **Tempo:** _____ segundos
- **Meta:** < 2 segundos
- **Status:** ✅ / ❌

### Teste 1.4: Carregar Histórico (com dados)
- [ ] Ter pelo menos 50 transações
- [ ] Ir para Histórico
- [ ] Cronometrar carregamento
- **Tempo:** _____ segundos
- **Meta:** < 2 segundos
- **Status:** ✅ / ❌

### Teste 1.5: Gerar Gráfico
- [ ] Ir para Relatórios
- [ ] Cronometrar renderização do gráfico
- **Tempo:** _____ segundos
- **Meta:** < 2 segundos
- **Status:** ✅ / ❌

---

## 2. USO DE MEMÓRIA

### Teste 2.1: Memória em Repouso
- [ ] Abrir app e deixar na Home por 1 minuto
- [ ] Ver uso de RAM (Settings → Developer Options → Running Services)
- **RAM usada:** _____ MB
- **Meta:** < 200 MB
- **Status:** ✅ / ❌

### Teste 2.2: Memória durante Uso
- [ ] Navegar por várias telas por 5 minutos
- [ ] Abrir histórico, gráficos, metas, etc
- **RAM usada:** _____ MB
- **Meta:** < 300 MB
- **Status:** ✅ / ❌

### Teste 2.3: Vazamento de Memória
- [ ] Usar app por 10 minutos intensamente
- [ ] Anotar RAM no início: _____ MB
- [ ] Anotar RAM no final: _____ MB
- [ ] Diferença: _____ MB
- **Meta:** Aumento < 100 MB
- **Status:** ✅ / ❌

---

## 3. USO DE BATERIA

### Teste 3.1: Bateria em 30 min de uso
- [ ] Carregar bateria para 100%
- [ ] Usar app intensamente por 30 minutos
- [ ] Bateria inicial: 100%
- [ ] Bateria final: _____%
- [ ] Gasto: _____%
- **Meta:** < 5%
- **Status:** ✅ / ❌

### Teste 3.2: Bateria em Background
- [ ] Deixar app em background por 1 hora
- [ ] Bateria inicial: _____%
- [ ] Bateria final: _____%
- [ ] Gasto: _____%
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
- **Tamanho:** _____ MB
- **Meta:** < 50 MB
- **Status:** ✅ / ❌

### Teste 4.2: Tamanho Instalado
- [ ] Instalar APK
- [ ] Ver Settings → Apps → Controle Financeiro
- **Tamanho total:** _____ MB
- **Meta:** < 100 MB
- **Status:** ✅ / ❌

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
- [ ] Crashes: _____ vezes
- **Meta:** 0 crashes
- **Status:** ✅ / ❌

### Teste 6.3: Usar por 1 hora contínua
- [ ] Usar todas as funcionalidades por 1 hora
- [ ] Crashes: _____
- [ ] Lentidão ao final: Sim / Não
- **Status:** ✅ / ❌

---

## 📊 RESUMO DE PERFORMANCE

| Métrica | Resultado | Meta | Status |
|---------|-----------|------|--------|
| Splash screen | __s | < 3s | ⬜ |
| RAM (repouso) | __MB | < 200MB | ⬜ |
| RAM (uso) | __MB | < 300MB | ⬜ |
| Bateria/30min | __% | < 5% | ⬜ |
| Tamanho APK | __MB | < 50MB | ⬜ |
| Scroll | __ | Suave | ⬜ |
| Crashes (stress) | __ | 0 | ⬜ |

**Status Final:** ⬜ Aprovado / ⬜ Reprovado
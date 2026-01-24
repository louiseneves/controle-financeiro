import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const TutorialsScreen = () => {
  const [expandedId, setExpandedId] = useState(null);

  const tutorials = [
    {
      id: '1',
      category: 'Primeiros Passos',
      icon: '🚀',
      color: '#2196F3',
      items: [
        {
          title: 'Como criar sua primeira transação',
          steps: [
            '1. Vá na aba "Transações" no menu inferior',
            '2. Toque no botão "+" (mais)',
            '3. Escolha o tipo: Receita, Despesa, Investimento ou Oferta',
            '4. Preencha a descrição, valor e data',
            '5. Selecione uma categoria',
            '6. Toque em "Salvar"',
          ],
        },
        {
          title: 'Entendendo o Dashboard',
          steps: [
            '1. O card de saldo mostra seu saldo atual',
            '2. Receitas são valores em verde (+)',
            '3. Despesas são valores em vermelho (-)',
            '4. O gráfico de pizza mostra gastos por categoria',
            '5. Últimas transações aparecem abaixo',
            '6. Card de dízimo mostra o valor sugerido (10% das receitas)',
          ],
        },
        {
          title: 'Criando categorias personalizadas',
          steps: [
            '1. Vá em Perfil → Categorias',
            '2. Toque em "Adicionar Categoria"',
            '3. Digite o nome da categoria',
            '4. Escolha o tipo (Receita ou Despesa)',
            '5. Selecione um ícone (opcional)',
            '6. Salve e use nas suas transações',
          ],
        },
      ],
    },
    {
      id: '2',
      category: 'Funcionalidades Principais',
      icon: '⚙️',
      color: '#FF9800',
      items: [
        {
          title: 'Como usar a calculadora de dízimo',
          steps: [
            '1. Vá em Transações → Dízimo',
            '2. O app calcula automaticamente 10% das suas receitas',
            '3. Modo Automático: mostra o valor total sugerido',
            '4. Modo Personalizado: escolha receitas específicas',
            '5. Registre quando pagar o dízimo',
            '6. Acompanhe o histórico de dízimos pagos',
          ],
        },
        {
          title: 'Criando metas financeiras',
          steps: [
            '1. Vá em Planejamento → Metas',
            '2. Toque em "+" para criar nova meta',
            '3. Defina o nome (ex: "Viagem para a praia")',
            '4. Informe o valor alvo',
            '5. Escolha a data limite',
            '6. Adicione valores conforme economizar',
            '7. Acompanhe o progresso com a barra visual',
          ],
        },
        {
          title: 'Definindo orçamento mensal',
          steps: [
            '1. Vá em Planejamento → Orçamento',
            '2. Escolha uma categoria (ex: Alimentação)',
            '3. Defina o valor máximo do mês',
            '4. O app mostra quanto você já gastou',
            '5. Receba alertas ao se aproximar do limite',
            '6. Veja sugestões de economia',
          ],
        },
        {
          title: 'Registrando investimentos',
          steps: [
            '1. Vá em Transações → Investimentos',
            '2. Toque em "Adicionar Investimento"',
            '3. Escolha o tipo (Poupança, CDB, Ações, etc)',
            '4. Informe valor investido e data',
            '5. Defina a rentabilidade esperada (%)',
            '6. Acompanhe o valor atual atualizado',
          ],
        },
      ],
    },
    {
      id: '3',
      category: 'Relatórios e Análises',
      icon: '📊',
      color: '#4CAF50',
      items: [
        {
          title: 'Visualizando relatórios mensais',
          steps: [
            '1. Vá em Relatórios',
            '2. Veja o resumo do mês atual',
            '3. Gráfico de pizza: gastos por categoria',
            '4. Gráfico de barras: receitas vs despesas',
            '5. Filtre por período personalizado',
            '6. Analise tendências de gastos',
          ],
        },
        {
          title: 'Relatórios Premium (assinantes)',
          steps: [
            '1. Assine o Premium em Perfil → Upgrade Premium',
            '2. Acesse Relatórios → Relatórios Avançados',
            '3. Visualização Anual: análise completa do ano',
            '4. Comparativo: compare meses diferentes',
            '5. Projeção: veja tendências futuras',
            '6. Exporte em PDF ou Excel',
          ],
        },
        {
          title: 'Filtrando o histórico',
          steps: [
            '1. Vá em Histórico',
            '2. Use a busca para encontrar transações',
            '3. Filtre por tipo (Receita, Despesa, etc)',
            '4. Filtre por categoria',
            '5. Escolha período personalizado',
            '6. Ordene por data, valor ou descrição',
          ],
        },
      ],
    },
    {
      id: '4',
      category: 'Backup e Segurança',
      icon: '🔒',
      color: '#9C27B0',
      items: [
        {
          title: 'Fazendo backup dos dados',
          steps: [
            '1. Vá em Perfil → Backup e Restauração',
            '2. Ative "Backup Automático" (recomendado)',
            '3. Ou clique em "Criar Backup Agora"',
            '4. Seus dados são salvos na nuvem (Firebase)',
            '5. Usuários gratuitos: até 3 backups',
            '6. Premium: backups ilimitados',
          ],
        },
        {
          title: 'Restaurando um backup',
          steps: [
            '1. Vá em Perfil → Backup e Restauração',
            '2. Veja a lista de backups disponíveis',
            '3. Escolha o backup desejado',
            '4. Toque em "Restaurar"',
            '5. ATENÇÃO: seus dados atuais serão substituídos',
            '6. Confirme para restaurar',
          ],
        },
        {
          title: 'Exportando dados (Premium)',
          steps: [
            '1. Assine o Premium',
            '2. Vá em Backup e Restauração',
            '3. Toque em "Exportar Dados"',
            '4. Arquivo JSON será gerado',
            '5. Compartilhe ou salve onde preferir',
            '6. Use para importar em outro dispositivo',
          ],
        },
      ],
    },
    {
      id: '5',
      category: 'Premium',
      icon: '⭐',
      color: '#FFD700',
      items: [
        {
          title: 'Recursos do Premium',
          steps: [
            '✅ Relatórios anuais completos',
            '✅ Comparativo entre períodos',
            '✅ Projeções futuras de gastos',
            '✅ Metas financeiras ilimitadas',
            '✅ Backups ilimitados na nuvem',
            '✅ Exportação de dados (PDF/Excel)',
            '✅ Sem anúncios',
            '✅ Suporte prioritário',
          ],
        },
        {
          title: 'Como assinar o Premium',
          steps: [
            '1. Vá em Perfil → Upgrade Premium',
            '2. Escolha o plano:',
            '   • Mensal: R$ 9,90/mês',
            '   • Anual: R$ 89,90/ano (economize 25%)',
            '3. Toque em "Assinar"',
            '4. Confirme a assinatura',
            '5. Aproveite todos os recursos!',
          ],
        },
        {
          title: 'Cancelando a assinatura',
          steps: [
            '1. Vá em Perfil → Upgrade Premium',
            '2. Toque em "Gerenciar Assinatura"',
            '3. Leia as informações',
            '4. Confirme o cancelamento',
            '5. Acesso Premium válido até o fim do período pago',
            '6. Pode reativar quando quiser',
          ],
        },
      ],
    },
    {
      id: '6',
      category: 'Dicas e Truques',
      icon: '💡',
      color: '#00BCD4',
      items: [
        {
          title: 'Organizando suas finanças',
          steps: [
            '📝 Registre TODAS as transações diariamente',
            '🎯 Defina metas realistas e alcançáveis',
            '💰 Mantenha sempre um fundo de emergência',
            '📊 Revise seus relatórios mensalmente',
            '⚠️ Configure alertas de orçamento',
            '☁️ Faça backup regularmente',
            '📱 Use o app todos os dias por 5 minutos',
          ],
        },
        {
          title: 'Economizando com o app',
          steps: [
            '1. Identifique gastos desnecessários nos relatórios',
            '2. Defina orçamentos realistas por categoria',
            '3. Acompanhe o progresso das metas',
            '4. Use o dízimo como disciplina financeira',
            '5. Compare períodos para ver evolução',
            '6. Planeje grandes compras com antecedência',
          ],
        },
        {
          title: 'Atalhos rápidos',
          steps: [
            '💵 Dashboard → Toque no saldo para adicionar transação',
            '📊 Dashboard → Toque no gráfico para ver detalhes',
            '🔄 Deslize para atualizar dados',
            '🔍 Use a busca para encontrar transações antigas',
            '⭐ Marque categorias favoritas para acesso rápido',
            '📅 Toque em datas para escolher período',
          ],
        },
      ],
    },
  ];

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tutoriais</Text>
        <Text style={styles.headerSubtitle}>
          Aprenda a usar todas as funcionalidades
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {tutorials.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <TouchableOpacity
              style={[styles.categoryHeader, { borderLeftColor: category.color }]}
              onPress={() => toggleExpanded(category.id)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryHeaderLeft}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View>
                  <Text style={styles.categoryTitle}>{category.category}</Text>
                  <Text style={styles.categoryCount}>
                    {category.items.length} tutoriais
                  </Text>
                </View>
              </View>
              <Text style={styles.expandIcon}>
                {expandedId === category.id ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>

            {expandedId === category.id && (
              <View style={styles.tutorialsContainer}>
                {category.items.map((tutorial, index) => (
                  <View key={index} style={styles.tutorialCard}>
                    <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
                    <View style={styles.stepsContainer}>
                      {tutorial.steps.map((step, stepIndex) => (
                        <View key={stepIndex} style={styles.stepRow}>
                          {step.startsWith('✅') || step.startsWith('📝') || 
                           step.startsWith('🎯') || step.startsWith('💰') ||
                           step.startsWith('📊') || step.startsWith('⚠️') ||
                           step.startsWith('☁️') || step.startsWith('📱') ||
                           step.startsWith('💵') || step.startsWith('🔄') ||
                           step.startsWith('🔍') || step.startsWith('⭐') ||
                           step.startsWith('📅') ? (
                            <Text style={styles.stepText}>{step}</Text>
                          ) : (
                            <>
                              <View style={[styles.stepBullet, { backgroundColor: category.color }]} />
                              <Text style={styles.stepText}>{step}</Text>
                            </>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Ainda com dúvidas? 🤔</Text>
          <Text style={styles.footerText}>
            Visite nossa Central de Ajuda (FAQ) ou envie um ticket de suporte.
            Estamos aqui para ajudar!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  categorySection: {
    marginTop: 15,
  },
  categoryHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderLeftWidth: 4,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 13,
    color: '#666',
  },
  expandIcon: {
    fontSize: 16,
    color: '#999',
    marginLeft: 10,
  },
  tutorialsContainer: {
    backgroundColor: '#fafafa',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  tutorialCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  stepsContainer: {
    gap: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 10,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    margin: 15,
    marginBottom: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 20,
  },
});

export default TutorialsScreen;
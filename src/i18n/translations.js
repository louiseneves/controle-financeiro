export const translations = {
  "pt-BR": {
    login: {
      title: "Controle",
      titleHighlight: "Financeiro",
      subtitle: "Faça login para continuar",

      email: "Email",
      emailPlaceholder: "seu@email.com",
      password: "Senha",

      forgotPassword: "Esqueci minha senha",
      loginButton: "Entrar",

      or: "ou",

      noAccount: "Não tem uma conta?",
      register: "Cadastre-se",

      errors: {
        emailRequired: "Email é obrigatório",
        emailInvalid: "Email inválido",
        passwordRequired: "Senha é obrigatória",
        passwordMin: "Senha deve ter no mínimo 6 caracteres",
      },

      alerts: {
        successTitle: "Sucesso!",
        successMessage: "Login realizado com sucesso!",
        errorTitle: "Erro",
        loginError: "Erro ao fazer login",
        unexpectedError: "Erro inesperado ao fazer login",
      },
    },
    register: {
      title: "Criar Conta",
      subtitle: "Preencha os dados para começar",
      name: "Nome Completo",
      namePlaceholder: "João Silva",
      email: "Email",
      emailPlaceholder: "seu@email.com",
      password: "Senha",
      passwordPlaceholder: "Mínimo 6 caracteres",
      confirmPassword: "Confirmar Senha",
      confirmPasswordPlaceholder: "Digite a senha novamente",
      button: "Cadastrar",
      alreadyAccount: "Já tem uma conta?",
      login: "Faça login",

      successTitle: "Sucesso!",
      successMessage: "Cadastro realizado com sucesso!",
      errorTitle: "Erro",
      errorGeneric: "Erro ao fazer cadastro",

      errors: {
        nameRequired: "Nome é obrigatório",
        nameMin: "Nome deve ter no mínimo 3 caracteres",
        emailRequired: "Email é obrigatório",
        emailInvalid: "Email inválido",
        passwordRequired: "Senha é obrigatória",
        passwordMin: "Senha deve ter no mínimo 6 caracteres",
        confirmPasswordRequired: "Confirme sua senha",
        passwordMismatch: "As senhas não coincidem",
      },
    },
    forgotPassword: {
      title: "Recuperar Senha",
      subtitleDefault: "Digite seu email para receber as instruções",
      subtitleSent: "Email enviado com sucesso!",

      emailLabel: "Email",
      emailPlaceholder: "seu@email.com",

      sendButton: "Enviar Email de Recuperação",
      backToLogin: "← Voltar para o login",

      successTitle: "Email Enviado!",
      successMessage:
        "Verifique sua caixa de entrada para redefinir sua senha.",

      successInfo: "Enviamos um link de recuperação para:",
      instructions: "Verifique sua caixa de entrada e spam.",

      backLoginButton: "Voltar para o Login",
      resend: "Não recebeu? Enviar novamente",

      errors: {
        required: "Email é obrigatório",
        invalid: "Email inválido",
        sendError: "Erro ao enviar email",
      },
    },
    home: {
      greeting: "Olá!",
      lastTransactions: "Últimas Transações",
      seeAll: "Ver todas",
      emptyTitle: "Nenhuma transação ainda",
      emptySubtitle: "Use as ações rápidas para adicionar",
    },
    balance: {
      title: "Saldo Atual",
      income: "Receitas",
      expense: "Despesas",
    },
    quickActions: {
      title: "Ações Rápidas",
      income: "Receita",
      expense: "Despesa",
      investment: "Investimento",
      offer: "Oferta",
    },
    incomeExpenseChart: {
      title: "Receitas vs Despesas",
      income: "Receitas",
      expense: "Despesas",
      empty: "Sem transações neste mês",
    },
    titheCard: {
      title: "Dízimo do Mês",
      paidBadge: "Devolvido",

      expected: "Esperado (10%)",
      paid: "Devolvido",
      remaining: "Restante",

      action: "Toque para registrar oferta",
    },
    transaction: {
      income: "Receita",
      expense: "Despesa",
      investment: "Investimento",
      offering: "Oferta",
    },

    addGoal: {
      title: "Nova Meta Financeira",
      subtitle: "Defina seus objetivos e acompanhe seu progresso",
      fields: {
        title: "Título da Meta",
        targetAmount: "Valor Alvo",
        initialAmount: "Valor Inicial (Opcional)",
        deadline: "Data Limite",
        icon: "Ícone da Meta",
      },
      placeholders: {
        title: "Ex: Viagem para Europa, Carro Novo...",
        date: "DD/MM/AAAA",
      },
      preview: "Preview da Meta",
      previewDefault: "Sua meta",
      actions: {
        create: "Criar Meta",
      },
      errors: {
        titleRequired: "Título é obrigatório",
        targetAmountInvalid: "Valor alvo deve ser maior que zero",
        deadlineInvalid: "Data limite inválida",
        deadlineFuture: "Data limite deve ser futura",
      },
      success: "Meta criada com sucesso!",
      error: "Erro ao criar meta",
      errorGeneric: "Não foi possível criar a meta",
    },
    goalDetail: {
      completed: "Meta Alcançada!",
      daysRemaining: "{{count}} dias restantes",
      todayDeadline: "Hoje é o prazo!",
      late: "Atrasado {{count}} dias",

      progress: "Progresso",

      amounts: {
        current: "Atual",
        target: "Meta",
        remaining: "Faltam",
      },

      details: "Detalhes",
      createdAt: "Data de Criação:",
      deadline: "Data Limite:",
      targetAmount: "Valor Alvo:",

      addTitle: "Adicionar à Meta",
      addLabel: "Valor",

      delete: "Excluir Meta",
      deleteConfirmTitle: "Excluir Meta",
      deleteConfirmMessage: "Tem certeza que deseja excluir esta meta?",

      alerts: {
        invalidValue: "Digite um valor válido",
        successAdd: "{{amount}} adicionado à meta!",
        deleteSuccess: "Meta excluída com sucesso!",
        error: "Erro",
        addError: "Não foi possível adicionar o valor",
      },
    },
    goals: {
      title: "Metas",
      active: "Metas Ativas",
      completed: "Concluídas",
      completedWithEmoji: "Metas Concluídas",

      summary: {
        active: "Metas Ativas",
        completed: "Concluídas",
      },

      deadline: {
        daysRemaining: "{{count}} dias restantes",
        today: "Hoje é o prazo!",
        late: "Atrasado {{count}} dias",
        achieved: "Meta alcançada!",
      },

      progress: "Progresso",

      empty: {
        title: "Nenhuma meta criada",
        subtitle: "Defina metas financeiras e acompanhe seu progresso",
      },

      actions: {
        create: "Criar Nova Meta",
        deleteTitle: "Excluir Meta",
        deleteConfirm: "Tem certeza que deseja excluir esta meta?",
        deleteSuccess: "Meta excluída com sucesso!",
        cancel: "Cancelar",
        delete: "Excluir",
      },
    },
    budget: {
      createTitle: "Criar Orçamento Mensal",
      editTitle: "Editar Orçamento",
      subtitle: "Defina limites de gastos por categoria",

      total: "Orçamento Total",

      quickFill: {
        title: "Preenchimento Rápido",
        choose: "Escolha uma opção:",
        equal: "Distribuir Igualmente",
        suggested: "Valores Sugeridos",
        cancel: "Cancelar",
      },

      categoryTitle: "Orçamento por Categoria",

      tip: {
        title: "Dica",
        text: "Uma regra comum é: 50% para necessidades, 30% para desejos e 20% para poupança e investimentos.",
      },

      actions: {
        save: "Salvar Alterações",
        create: "Criar Orçamento",
        cancel: "Cancelar",
      },

      alerts: {
        error: "Erro",
        minRequired: "Defina pelo menos um orçamento de categoria",
        successTitle: "Sucesso!",
        created: "Orçamento criado!",
        updated: "Orçamento atualizado!",
        saveError: "Erro ao salvar orçamento",
        genericError: "Não foi possível salvar o orçamento",
      },
    },
    budgetOverview: {
      title: "Orçamento Mensal",
      total: "Orçamento Total",

      summary: {
        spent: "Gasto",
        available: "Disponível",
        percentage: "{{value}}%",
      },

      category: {
        title: "Orçamento por Categoria",
        limit: "Limite",
        of: "de {{amount}}",
        available: "Disponível:",
        exceeded: "Excedido:",
      },

      warnings: {
        nearLimit:
          "Você está próximo do limite! Considere reduzir gastos nesta categoria.",
        overLimit:
          "Você ultrapassou o orçamento desta categoria em {{amount}}!",
      },

      empty: {
        title: "Sem orçamento para este mês",
        subtitle: "Crie um orçamento mensal para acompanhar seus gastos",
      },

      actions: {
        create: "Criar Orçamento",
        edit: "Editar Orçamento",
      },
    },
    advancedReports: {
      premium: {
        title: "Recurso Premium",
        description:
          "Os relatórios avançados estão disponíveis apenas para assinantes Premium.",
        benefitsTitle: "Com Premium você terá:",
        benefits: {
          yearly: "Relatórios anuais completos",
          comparison: "Comparativo entre períodos",
          projection: "Projeções futuras",
          pdf: "Exportação em PDF",
          excel: "Exportação em Excel",
        },
        subscribe: "Assinar Premium",
      },

      badge: "PREMIUM",

      views: {
        yearly: "Anual",
        comparison: "Comparativo",
        projection: "Projeção",
      },

      yearly: {
        summary: "Resumo do Ano",
        income: "Receitas",
        expense: "Despesas",
        balance: "Saldo Anual",
        evolution: "Evolução Mensal",
      },

      comparison: {
        title: "Comparativo Mensal",
      },

      projection: {
        title: "Projeção Próximo Mês",
        income: "Receitas Previstas",
        expense: "Despesas Previstas",
        balance: "Saldo Previsto",
        info: "Projeção baseada na média dos últimos 3 meses. Mantenha seus registros atualizados para previsões mais precisas.",
      },

      export: {
        title: "Exportar Relatório",
        pdf: "PDF",
        excel: "Excel",
        alerts: {
          pdfTitle: "Exportar PDF",
          pdfMessage:
            "Funcionalidade de exportação em PDF (em desenvolvimento)",
          excelTitle: "Exportar Excel",
          excelMessage:
            "Funcionalidade de exportação em Excel (em desenvolvimento)",
        },
      },
    },
    history: {
      searchPlaceholder: "Buscar por descrição ou categoria...",

      filters: {
        all: "Todas",
        receita: "Receitas",
        despesa: "Despesas",
        investimento: "Investimentos",
        oferta: "Ofertas",
      },

      sort: {
        label: "Ordenar:",
        dateDesc: "Mais recentes",
        dateAsc: "Mais antigas",
        amountDesc: "Maior valor",
        amountAsc: "Menor valor",
      },

      summary: {
        transactions_one: "{{count}} transação",
        transactions_other: "{{count}} transações",
        total: "Total:",
      },

      empty: {
        notFound: "Nenhuma transação encontrada",
        noCategory: "Nenhuma transação nesta categoria",
        tryAnother: "Tente buscar por outro termo",
        addTransactions: "Adicione transações para vê-las aqui",
      },
    },
    reports: {
      historyButton: "Ver Histórico Completo",
      advancedReports: "Relatórios Avançados Premium",

      periods: {
        month: "Este Mês",
        threeMonths: "Últimos 3 Meses",
        year: "Este Ano",
      },

      summary: {
        income: "Receitas",
        expense: "Despesas",
        investment: "Investimentos",
        offer: "Ofertas",
        balance: "Saldo do Período",
      },

      charts: {
        overview: "Visão Geral",
        expensesByCategory: "Despesas por Categoria",
        allCategories: "Todas as Categorias",
        noData: "Sem dados para exibir",
        noExpenses: "Sem despesas para categorizar",
      },

      empty: {
        noTransactions: "Sem transações neste período",
        hint: "Adicione transações para visualizar relatórios",
      },
    },
    about: {
      header: {
        title: "Sobre o App",
        version: "v1.0.0",
      },

      app: {
        name: "Controle Financeiro",
        tagline: "Organize suas finanças com inteligência",
      },

      sections: {
        about: "Sobre",
        features: "Funcionalidades",
        libraries: "Bibliotecas de Código Aberto",
        developer: "Desenvolvedor",
        links: "Links Úteis",
      },

      description:
        "O Controle Financeiro é um aplicativo completo para gestão de suas finanças pessoais. Com ele você pode controlar receitas, despesas, investimentos, definir metas, criar orçamentos e muito mais.",

      features: [
        "Controle de receitas e despesas",
        "Gestão de investimentos",
        "Calculadora de dízimo e ofertas",
        "Metas financeiras",
        "Orçamento mensal",
        "Relatórios detalhados",
        "Backup em nuvem",
        "Sistema Premium",
        "Suporte completo",
        "Modo escuro",
        "Múltiplas moedas",
      ],

      developer: {
        madeByPrefix: "Desenvolvido com",
        madeByAuthor: "por Louise",
        rights: "© 2026 Todos os direitos reservados",
      },

      links: {
        privacy: "Política de Privacidade",
        terms: "Termos de Uso",
        source: "Código Fonte (GitHub)",
      },

      footer: {
        madeWith: "Feito com React Native",
        build: "Build 2024.01.001",
      },
    },
    backup: {
      header: {
        title: "Backup e Restauração",
        subtitle: "Mantenha seus dados seguros",
      },

      auto: {
        title: "Backup Automático",
        description:
          "Cria backup na nuvem automaticamente quando você adiciona ou edita dados",
        last: "Último backup:",
      },

      quickActions: {
        title: "Ações Rápidas",
        create: "Criar Backup Agora",
        createSubtitle: "Salvar na nuvem",
        export: "Exportar Dados",
        exportPremium: "Premium apenas",
        exportFile: "Baixar arquivo JSON",
      },

      list: {
        title: "Backups Salvos",
        emptyTitle: "Nenhum backup disponível",
        emptySubtitle: "Crie seu primeiro backup para proteger seus dados",
        auto: "Auto",
        restore: "Restaurar",
        delete: "Excluir",
      },

      info: {
        title: "Sobre Backups",
        text:
          "• Backups são salvos na nuvem\n" +
          "• Incluem transações, metas e orçamentos\n" +
          "• Usuários gratuitos: até 3 backups\n" +
          "• Premium: backups ilimitados\n" +
          "• Restauração substitui dados atuais",
      },

      alerts: {
        success: "Sucesso",
        error: "Erro",
        created: "Backup criado com sucesso!",
        deleted: "Backup excluído com sucesso!",
        restored: "Dados restaurados com sucesso!",
        createFail: "Falha ao criar backup:",
        deleteFail: "Falha ao excluir backup:",
        restoreFail: "Falha ao restaurar backup:",
        confirmRestoreTitle: "Confirmar Restauração",
        confirmRestoreMessage:
          "Isso irá substituir todos os seus dados atuais. Deseja continuar?",
        confirmDeleteTitle: "Confirmar Exclusão",
        confirmDeleteMessage: "Tem certeza que deseja excluir este backup?",
        cancel: "Cancelar",
        restore: "Restaurar",
        delete: "Excluir",
        premiumTitle: "Recurso Premium",
        premiumMessage:
          "A exportação de dados está disponível apenas para usuários Premium.",
        upgrade: "Upgrade",
      },

      misc: {
        items_one: "{{count}} item",
        items_other: "{{count}} itens",
        unavailableDate: "Data indisponível",
        invalidDate: "Data inválida",
      },
    },
    contact: {
      title: "Fale Conosco",

      helpTitle: "Como podemos ajudar?",
      helpDescription:
        "Preencha o formulário abaixo e nossa equipe responderá em até 24 horas",

      form: {
        name: "Nome Completo",
        email: "Email",
        category: "Categoria",
        subject: "Assunto",
        message: "Mensagem",
      },

      placeholders: {
        name: "Seu nome",
        email: "seu@email.com",
        subject: "Resumo da sua dúvida",
        message:
          "Descreva sua dúvida ou sugestão com o máximo de detalhes possível...",
      },

      send: "Enviar Mensagem",
      sending: "Enviando...",

      successTitle: "Mensagem Enviada!",
      successMessage:
        "Recebemos sua mensagem e entraremos em contato em breve.\n\nNúmero do ticket: {{ticket}}",

      errors: {
        warningTitle: "Atenção",
        errorTitle: "Erro",
        name: "Por favor, informe seu nome",
        email: "Por favor, informe seu email",
        subject: "Por favor, informe o assunto",
        category: "Por favor, selecione uma categoria",
        message: "Por favor, escreva sua mensagem",
        send: "Não foi possível enviar sua mensagem. Tente novamente.",
      },

      info: {
        responseTime: "Respondemos em até 24 horas úteis",
        security: "Suas informações estão seguras",
      },
    },
    currencySelector: {
      headerTitle: "Selecionar Moeda",
      searchPlaceholder: "Buscar moeda...",
      info: "A moeda selecionada será usada em todo o app",
    },
    editProfile: {
      title: "Editar Perfil",

      avatar: {
        changePhoto: "Alterar foto",
        photoInDevelopment: "Funcionalidade em desenvolvimento",
      },

      form: {
        fullName: "Nome Completo",
        email: "Email",
        emailInfo: "O email não pode ser alterado.",
      },

      validation: {
        nameRequired: "Nome é obrigatório",
        nameMinLength: "Nome deve ter no mínimo 3 caracteres",
      },

      actions: {
        save: "Salvar Alterações",
        cancel: "Cancelar",
      },

      alerts: {
        successTitle: "Sucesso!",
        successMessage: "Perfil atualizado com sucesso!",
        errorTitle: "Erro",
        errorMessage: "Não foi possível atualizar o perfil",

        discardTitle: "Descartar alterações?",
        discardMessage: "Você tem alterações não salvas. Deseja descartá-las?",
        keepEditing: "Continuar editando",
        discard: "Descartar",
        ok: "OK",
      },
    },
    premium: {
      badge: "PREMIUM",

      header: {
        title: "Desbloqueie Todo o Potencial",
        subtitle: "Recursos avançados para quem quer ir além",
      },

      plans: {
        choose: "Escolha seu Plano",
        monthly: "Mensal",
        yearly: "Anual",
        month: "mês",
        year: "ano",
        selected: "Selecionado",
        discount: "25% de desconto",
      },

      features: {
        titleAvailable: "Recursos Disponíveis",
        titleGain: "O que você ganha",

        advancedReports: {
          title: "Relatórios Avançados",
          description: "Análises detalhadas e comparativos",
        },
        futureProjections: {
          title: "Projeções Futuras",
          description: "Previsões baseadas em seus dados",
        },
        exportPdf: {
          title: "Exportar PDF",
          description: "Salve seus relatórios em PDF",
        },
        exportExcel: {
          title: "Exportar Excel",
          description: "Exporte dados para planilhas",
        },
        yearlyReports: {
          title: "Relatórios Anuais",
          description: "Visão completa do ano",
        },
        periodComparison: {
          title: "Comparativo de Períodos",
          description: "Compare meses e anos",
        },
        unlimitedGoals: {
          title: "Metas Ilimitadas",
          description: "Crie quantas metas quiser",
        },
        unlimitedBackup: {
          title: "Backup Ilimitado",
          description: "Seus dados sempre seguros",
        },
        earlyAccess: {
          title: "Novos Recursos",
          description: "Acesso antecipado a novidades",
        },
      },

      guarantee: {
        title: "Garantia de 7 dias",
        text: "Não gostou? Devolveremos seu dinheiro, sem perguntas.",
      },

      buttons: {
        subscribe: "Assinar por {{price}}",
        manage: "Gerenciar Assinatura",
        cancel: "Cancelar",
        confirmDemo: "Assinar (Demo)",
        yesCancel: "Sim, Cancelar",
        no: "Não",
      },

      premiumStatus: {
        title: "Você é Premium!",
        subtitle: "Aproveite todos os recursos exclusivos",
        plan: "Plano:",
        validUntil: "Válido até:",
        canceled: "Assinatura Cancelada",
        canceledMessage: "Sua assinatura Premium foi cancelada.",
      },

      alerts: {
        confirmTitle: "Confirmar Assinatura",
        confirmMessage:
          "Você está prestes a assinar o plano {{plan}} por {{price}}.\n\nNOTA: Este é um modo de demonstração. Em produção, você será redirecionado para o Google Play para confirmar a compra.",
        welcomeTitle: "Bem-vindo ao Premium!",
        welcomeMessage: "Você agora tem acesso a todos os recursos premium!",
        cancelTitle: "Cancelar Assinatura",
        cancelMessage:
          "Tem certeza que deseja cancelar sua assinatura Premium? Você perderá acesso aos recursos premium.",
        demoDisclaimer:
          "* Modo de demonstração. Em produção, a cobrança será feita via Google Play.",
        ok: "OK",
        limitTitle: "Limite alcançado",
        goalsLimit:
          "Usuários gratuitos podem criar até {{limit}} metas. Faça upgrade para desbloquear metas ilimitadas.",
        budgetLimit:
          "Apenas um orçamento ativo por vez está disponível sem assinatura Premium.",
        supportLimit:
          "Você atingiu o número máximo de tickets abertos (3). Faça upgrade para entrar em contato novamente.",
      },
    },
    profile: {
      title: "Perfil",

      header: {
        defaultUser: "Usuário",
        userPhoto: "Foto do usuário",
        editPhoto: "Editar foto",
      },

      accountInfo: {
        title: "Informações da Conta",
        name: "Nome",
        email: "Email",
        userId: "ID do Usuário",
        notInformed: "Não informado",
      },

      menu: {
        title: "Menu",
        editProfile: "Editar Perfil",
        goals: "Metas Financeiras",
        budget: "Orçamento Mensal",
        settings: "Configurações",
        backup: "Backup de Dados",
        premium: "Upgrade Premium",
        support: "Suporte",
      },

      actions: {
        logout: "Sair da Conta",
      },

      alerts: {
        logoutTitle: "Sair da Conta",
        logoutMessage: "Tem certeza que deseja sair?",
        cancel: "Cancelar",
        confirm: "Sair",
      },

      version: "Versão {{version}}",
    },
    settings: {
      title: "Configurações",
      subtitle: "Personalize seu aplicativo",

      appearance: "Aparência",
      darkMode: "Modo Escuro",
      darkModeDesc: "Tema escuro para economizar bateria",

      regionCurrency: "Região e Moeda",
      currency: "Moeda",
      language: "Idioma",

      notifications: "Notificações",
      notificationsEnabled: "Notificações Ativadas",
      notificationsEnabledDesc: "Ativar/desativar todas as notificações",

      bills: "Lembrete de Contas",
      billsDesc: "Avisar sobre contas a vencer",

      tithe: "Lembrete de Dízimo",
      titheDesc: "Lembrar de pagar o dízimo mensalmente",

      goals: "Avisos de Metas",
      goalsDesc: "Progresso e conquistas de metas",

      daily: "Lembrete Diário",
      dailyDesc: "Lembrar de registrar gastos diários",

      notificationTime: "Horário das Notificações",
      notificationTimeDesc: "Definir horário padrão",

      others: "Outros",
      about: "Sobre o App",
      aboutDesc: "Versão, licenças e créditos",

      reset: "Resetar Configurações",
      resetDesc: "Restaurar configurações padrão",

      timeTitle: "Definir Horário",
      saveTitle: "Salvar Horário",

      save: "Salvar",
      cancel: "Cancelar",
      close: "Fechar",

      selectLanguage: "Selecionar Idioma",
      selectCurrency: "Selecionar Moeda",

      resetConfirmTitle: "Resetar Configurações",
      resetConfirmDesc:
        "Isso irá restaurar todas as configurações padrão. Deseja continuar?",
      success: "Sucesso",
      resetSuccess: "Configurações restauradas!",

      footer: {
        appName: "Controle Financeiro v1.0.0",
        madeWithPrefix: "Desenvolvido com",
        madeWithSuffix: "em React Native",
      },
    },
    supportCreateTicket: {
      header: {
        title: "Enviar Ticket",
        subtitle: "Descreva seu problema ou dúvida",
      },

      form: {
        subject: "Assunto",
        subjectPlaceholder: "Ex: Problema ao adicionar receita",

        category: "Categoria",
        priority: "Prioridade",
        description: "Descrição",
        descriptionPlaceholder:
          "Descreva detalhadamente seu problema ou dúvida...",
        charCount: "{{count}} caracteres (mínimo 20)",
      },

      categories: {
        general: "Geral",
        account: "Conta",
        transactions: "Transações",
        backup: "Backup",
        premium: "Premium",
        goals: "Metas",
        budget: "Orçamento",
        tithe: "Dízimo",
        reports: "Relatórios",
        other: "Outro",
      },

      priorities: {
        low: "Baixa",
        medium: "Média",
        high: "Alta",
      },

      tips: {
        title: "Dicas para um bom ticket:",
        items: [
          "• Seja específico sobre o problema",
          "• Informe quando o erro ocorreu",
          "• Descreva os passos para reproduzir",
          "• Inclua mensagens de erro, se houver",
        ],
      },

      actions: {
        submit: "Enviar Ticket",
        viewTicket: "Ver Ticket",
        ok: "OK",
      },

      alerts: {
        error: "Erro",
        subjectRequired: "Por favor, informe o assunto",
        descriptionRequired: "Por favor, descreva seu problema ou dúvida",
        descriptionMin: "A descrição deve ter pelo menos 20 caracteres",

        successTitle: "Ticket Criado!",
        successMessage:
          "Recebemos sua solicitação. Nossa equipe responderá em breve.",

        createError: "Não foi possível criar o ticket. Tente novamente.",
      },
    },
    faqScreen: {
      title: "Perguntas Frequentes",
      subtitle: "Encontre respostas rápidas",

      searchPlaceholder: "Buscar pergunta...",

      categories: {
        all: "Todas",
      },

      empty: {
        title: "Nenhuma pergunta encontrada",
        subtitle: "Tente buscar com outras palavras",
      },

      footer: {
        title: "Não encontrou o que procura?",
        subtitle: "Entre em contato através do formulário de suporte",
      },
    },
    supportScreen: {
      header: {
        title: "Central de Suporte",
        subtitle: "Como podemos ajudar você?",
      },

      options: {
        faq: {
          title: "Central de Ajuda (FAQ)",
          subtitle: "Respostas rápidas para perguntas comuns",
        },
        ticket: {
          title: "Enviar Ticket",
          subtitle: "Fale diretamente com nossa equipe",
        },
        tutorials: {
          title: "Tutoriais",
          subtitle: "Aprenda a usar todas as funcionalidades",
        },
      },

      myTickets: {
        title: "Meus Tickets",
        emptyTitle: "Nenhum ticket aberto",
        emptySubtitle: "Envie um ticket se precisar de ajuda",

        open: "Abertos",
        recentlyResolved: "Resolvidos Recentemente",

        viewAll: "Ver todos ({{count}})",
      },

      ticketStatus: {
        open: "Aberto",
        in_progress: "Em Andamento",
        resolved: "Resolvido",
        closed: "Fechado",
      },

      contact: {
        title: "Precisa de ajuda imediata?",
        description:
          "Nossa equipe está disponível de segunda a sexta, das 9h às 18h.",
        whatsapp: "WhatsApp",
        email: "Email",
        errorTitle: "Erro",
        errorOpenLink: "Não foi possível abrir {{name}}",
      },

      info: {
        title: "Informações",
        text:
          "• Tempo médio de resposta: 24 horas\n" +
          "• Suporte disponível em português\n" +
          "• Todas as conversas são confidenciais\n" +
          "• Usuários Premium têm atendimento prioritário",
      },
    },
    ticketDetailsScreen: {
      errors: {
        notFoundTitle: "Erro",
        notFoundMessage: "Ticket não encontrado",
        sendMessage: "Não foi possível enviar a mensagem",
      },

      closeTicket: {
        title: "Fechar Ticket",
        message:
          "Deseja realmente fechar este ticket? Você poderá abrir um novo se precisar.",
        cancel: "Cancelar",
        confirm: "Fechar",
      },

      rating: {
        prompt: "Avalie nosso atendimento",
        title: "Como foi nosso atendimento?",
        placeholder: "Comentário (opcional)",
        submit: "Enviar Avaliação",
        alertTitle: "Atenção",
        alertMessage: "Por favor, selecione uma avaliação",
        successTitle: "Obrigado!",
        successMessage: "Sua avaliação foi registrada com sucesso.",
        rated: "Você avaliou:",
      },

      status: {
        open: "Aberto",
        in_progress: "Em Andamento",
        resolved: "Resolvido",
        closed: "Fechado",
      },

      actions: {
        closeTicket: "Fechar Ticket",
        send: "Enviar",
      },

      input: {
        messagePlaceholder: "Digite sua mensagem...",
      },
    },
    ticketListScreen: {
      header: {
        title: "Meus Tickets",
        subtitle: "{{count}} {{count, plural, one {ticket} other {tickets}}}",
      },

      filters: {
        all: "Todos",
        open: "Abertos",
        in_progress: "Em Andamento",
        resolved: "Resolvidos",
        closed: "Fechados",
      },

      status: {
        open: "Aberto",
        in_progress: "Em Andamento",
        resolved: "Resolvido",
        closed: "Fechado",
      },

      date: {
        today: "Hoje",
        yesterday: "Ontem",
        daysAgo: "{{count}} dias atrás",
      },

      loading: {
        text: "Carregando tickets...",
      },

      empty: {
        title: "Nenhum ticket encontrado",
        allSubtitle: "Crie seu primeiro ticket de suporte",
        filteredSubtitle: "Nenhum ticket {{status}}",
      },

      actions: {
        create: "Criar Ticket",
      },
    },
    tutorialsScreen: {
      header: {
        title: "Tutoriais",
        subtitle: "Aprenda a usar todas as funcionalidades",
      },

      footer: {
        title: "Ainda com dúvidas?",
        text: "Visite nossa Central de Ajuda (FAQ) ou envie um ticket de suporte. Estamos aqui para ajudar!",
      },

      categories: [
        {
          id: "1",
          category: "Primeiros Passos",
          icon: "rocket-launch",
          items: [
            {
              title: "Como criar sua primeira transação",
              steps: [
                'Vá na aba "Transações" no menu inferior',
                'Toque no botão "+" (mais)',
                "Escolha o tipo: Receita, Despesa, Investimento ou Oferta",
                "Preencha a descrição, valor e data",
                "Selecione uma categoria",
                'Toque em "Salvar"',
              ],
            },
            {
              title: "Entendendo o Dashboard",
              steps: [
                "O card de saldo mostra seu saldo atual",
                "Receitas são valores em verde (+)",
                "Despesas são valores em vermelho (-)",
                "O gráfico de pizza mostra gastos por categoria",
                "Últimas transações aparecem abaixo",
                "Card de dízimo mostra o valor sugerido (10% das receitas)",
              ],
            },
          ],
        },

        {
          id: "2",
          category: "Funcionalidades Principais",
          icon: "settings",
          items: [
            {
              title: "Criando metas financeiras",
              steps: [
                "Vá em Planejamento → Metas",
                'Toque em "+" para criar nova meta',
                "Defina o nome da meta",
                "Informe o valor alvo",
                "Escolha a data limite",
                "Acompanhe o progresso",
              ],
            },
          ],
        },

        {
          id: "5",
          category: "Premium",
          icon: "star",
          items: [
            {
              title: "Recursos do Premium",
              steps: [
                "Relatórios anuais completos",
                "Comparativo entre períodos",
                "Projeções futuras de gastos",
                "Backups ilimitados",
                "Exportação de dados",
                "Sem anúncios",
                "Suporte prioritário",
              ],
            },
          ],
        },
      ],
    },
    addExpense: {
      title: "Adicionar Despesa",

      form: {
        description: {
          label: "Descrição",
          placeholder: "Ex: Supermercado, Conta de luz...",
          required: "Descrição é obrigatória",
        },
        amount: {
          label: "Valor",
          placeholder: "0,00",
          invalid: "Valor deve ser maior que zero",
        },
        date: {
          label: "Data",
          placeholder: "DD/MM/AAAA",
          invalid: "Data inválida",
        },
        category: {
          label: "Categoria",
          required: "Selecione uma categoria",
        },
        recurring: {
          label: "Despesa recorrente",
          description: "Marque se essa despesa se repete mensalmente",
        },
      },

      actions: {
        save: "Salvar Despesa",
        cancel: "Cancelar",
      },

      alerts: {
        sessionExpired: {
          title: "Sessão expirada",
          message: "Faça login novamente.",
        },
        success: {
          title: "Sucesso!",
          message: "Despesa adicionada com sucesso!",
        },
        error: {
          title: "Erro",
          generic: "Erro ao adicionar despesa",
          save: "Não foi possível adicionar a despesa",
        },
      },
    },
    addIncome: {
      title: "Adicionar Receita",

      loading: "Carregando...",

      form: {
        description: {
          label: "Descrição",
          placeholder: "Ex: Salário, Freelance, Bônus...",
          required: "Descrição é obrigatória",
        },
        amount: {
          label: "Valor",
          placeholder: "0,00",
          invalid: "Valor deve ser maior que zero",
        },
        date: {
          label: "Data",
          placeholder: "DD/MM/AAAA",
          invalid: "Data inválida",
        },
        category: {
          label: "Categoria",
          required: "Selecione uma categoria",
        },
        recurring: {
          label: "Receita recorrente",
          description: "Marque se essa receita se repete mensalmente",
        },
      },

      actions: {
        save: "Salvar Receita",
        cancel: "Cancelar",
      },

      alerts: {
        sessionExpired: {
          title: "Sessão expirada",
          message: "Faça login novamente.",
        },
        success: {
          title: "Sucesso!",
          message: "Receita adicionada com sucesso!",
        },
        error: {
          title: "Erro",
          generic: "Erro ao adicionar receita",
          save: "Não foi possível adicionar a receita",
        },
      },
    },
    addInvestment: {
      title: "Novo Investimento",
      subtitle: "Registre seus investimentos e acompanhe rendimentos",

      form: {
        description: {
          label: "Descrição",
          placeholder: "Ex: CDB Banco X, Ações PETR4...",
          required: "Descrição é obrigatória",
        },
        amount: {
          label: "Valor Investido",
          placeholder: "0,00",
          invalid: "Valor deve ser maior que zero",
        },
        profitability: {
          label: "Rentabilidade (% ao ano) - Opcional",
          placeholder: "Ex: 10.5",
        },
        date: {
          label: "Data de Aplicação",
          placeholder: "DD/MM/AAAA",
          invalid: "Data inválida",
        },
        category: {
          label: "Tipo de Investimento",
          required: "Selecione um tipo de investimento",
        },
      },

      info: {
        estimatedReturn:
          "Com {{profitability}}% ao ano, o rendimento estimado em 12 meses será de aproximadamente {{value}}",
      },

      actions: {
        save: "Salvar Investimento",
        cancel: "Cancelar",
      },

      alerts: {
        sessionExpired: {
          title: "Sessão expirada",
          message: "Faça login novamente.",
        },
        success: {
          title: "Sucesso!",
          message: "Investimento adicionado com sucesso!",
        },
        error: {
          title: "Erro",
          generic: "Erro ao adicionar investimento",
          save: "Não foi possível adicionar o investimento",
        },
      },
    },
    addOffer: {
      title: "Registrar Oferta",
      subtitle: "Contribua para a obra de Deus",

      form: {
        description: {
          label: "Descrição",
          placeholder: "Ex: Dízimo Dezembro, Oferta de Missões...",
          required: "Descrição é obrigatória",
        },
        amount: {
          label: "Valor",
          placeholder: "0,00",
          invalid: "Valor deve ser maior que zero",
        },
        churchName: {
          label: "Nome da Igreja (Opcional)",
          placeholder: "Ex: Igreja Batista Central",
        },
        date: {
          label: "Data",
          placeholder: "DD/MM/AAAA",
          invalid: "Data inválida",
        },
        category: {
          label: "Tipo de Oferta",
          required: "Selecione um tipo de oferta",
        },
      },

      info: {
        tithe:
          "O dízimo é 10% da sua renda. Você pode usar a calculadora de dízimo para calcular o valor automaticamente.",
      },

      actions: {
        save: "Registrar Oferta",
        cancel: "Cancelar",
      },

      alerts: {
        sessionExpired: {
          title: "Sessão expirada",
          message: "Faça login novamente.",
        },
        success: {
          title: "Sucesso!",
          message: "Oferta registrada com sucesso!",
        },
        error: {
          title: "Erro",
          generic: "Erro ao registrar oferta",
          save: "Não foi possível registrar a oferta",
        },
      },
    },
    investmentsList: {
      totalInvested: "Total Investido",
      estimatedReturn: "Rendimento Estimado",
      totalAssets: "Patrimônio Total",
      myInvestments: "Meus Investimentos",
      invested: "Investido:",
      profitability: "Rentabilidade:",
      earnings: "Rendimento:",
      currentValue: "Valor Atual:",
      appliedOn: "Aplicado em {{date}}",
      noInvestments: "Nenhum investimento registrado",
      addFirst: "Registre seu primeiro investimento",
      emptySubtext: "Comece a investir e acompanhe seus rendimentos",
      addButton: "Adicionar Investimento",
      perYear: "% a.a.",
    },
    tithe: {
      header: "Calculadora de Dízimo",
      verse: 'Malaquias 3:10 - "Trazei todos os dízimos"',
      modeMonth: "Dízimo do Mês",
      modeCustom: "Valor Personalizado",
      calculationAuto: "Cálculo Automático",
      monthIncome: "Receitas do mês:",
      tithePercent: "Dízimo (10%):",
      returned: "Devolvido:",
      remaining: "Restante:",
      returnedBadge: "Dízimo devolvido!",
      emptyState:
        "Adicione suas receitas do mês para calcular o dízimo automaticamente",
      customCard: "Calcular Valor Personalizado",
      customCardSubtitle: "Digite o valor da receita para calcular 10%",
      incomeLabel: "Valor da Receita",
      registerButton: "Registrar Dízimo",
      registerAmount: "Registrar {{amount}}",
      historyTitle: "Histórico de Dízimos",
      confirmTitle: "Registrar Dízimo",
      confirmMessage: "Registrar {{amount}} como dízimo de {{monthYear}}?",
      confirmCustomMessage: "Registrar {{amount}} como dízimo?",
      confirmDescription: "Dízimo {{monthYear}}",
      confirmCustomDescription: "Dízimo personalizado",
      warningNoIncomeTitle: "Aviso",
      warningNoIncomeMessage: "Você não tem receitas registradas neste mês.",
      errorInvalidAmount: "Digite um valor válido",
      successTitle: "Sucesso!",
      successMessage: "Dízimo registrado com sucesso!",
      errorTitle: "Erro",
      errorGeneric: "Erro ao registrar dízimo",
      errorSave: "Não foi possível registrar o dízimo",
      cancelButton: "Cancelar",
      confirmButton: "Registrar",
    },
    transactionDetail: {
      notFound: "Transação não encontrada",
      updateSuccess: "Transação atualizada com sucesso!",
      deleteSuccess: "Transação excluída com sucesso!",
      updateError: "Erro ao atualizar transação",
      deleteError: "Erro ao excluir transação",
      updateFailed: "Não foi possível atualizar a transação",
      deleteFailed: "Não foi possível excluir a transação",
      deleteConfirmTitle: "Excluir Transação",
      deleteConfirm:
        "Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.",
      descriptionLabel: "Descrição",
      amountLabel: "Valor",
      dateLabel: "Data",
      placeholders: {
        date: "DD/MM/AAAA",
      },
      categoryLabel: "Categoria",
      recurringLabel: "Transação recorrente",
      recurringDescription: "Marque se essa transação se repete mensalmente",
      saveButton: "Salvar Alterações",
      cancelButton: "Cancelar",
      editButton: "Editar Transação",
      deleteButton: "Excluir Transação",
      yesText: "Sim",
      noText: "Não",
      successTitle: "Sucesso!",
      errorTitle: "Erro",
      deleteButtonAction: "Excluir",
      validation: {
        descriptionRequired: "Descrição é obrigatória",
        amountInvalid: "Valor deve ser maior que zero",
        categoryRequired: "Selecione uma categoria",
      },
    },
    transactionsNavigator: {
      titleTransactions: "Transações",
      title: "Transações",
      subtitle: "Escolha uma ação:",
      addIncome: "Adicionar Receita",
      addExpense: "Adicionar Despesa",
      addOffer: "Adicionar Oferta",
      registerOffer: "Registrar Oferta",
      titheCalculator: "Calculadora de Dízimo",
      myInvestments: "Meus Investimentos",
      addInvestment: "Adicionar Investimento",
      investmentsList: "Investimentos",
      transactionDetail: "Detalhes da Transação",
    },
    tabNavigator: {
      home: "Início",
      transactions: "Transações",
      reports: "Relatórios",
      profile: "Perfil",
    },
    supportNavigator: {
      faq: "Perguntas Frequentes",
      newTicket: "Novo Ticket",
      ticketDetails: "Detalhes do Ticket",
      myTickets: "Meus Tickets",
      tutorials: "Tutoriais",
    },
    reportsNavigator: {
      reports: "Relatórios",
      history: "Histórico",
      advancedReports: "Relatórios Avançados",
    },
    planningNavigator: {
      goals: "Metas Financeiras",
      newGoal: "Nova Meta",
      goalDetails: "Detalhes da Meta",
      monthlyBudget: "Orçamento Mensal",
      createBudget: "Criar Orçamento",
      editBudget: "Editar Orçamento",
    },
    categories: {
      income: {
        salario: "Salário",
        freelance: "Freelance",
        investimentos: "Rendimento de Investimentos",
        bonus: "Bônus",
        presente: "Presente",
        venda: "Venda",
        aluguel: "Aluguel",
        outros: "Outros",
      },
      expense: {
        alimentacao: "Alimentação",
        transporte: "Transporte",
        moradia: "Moradia",
        saude: "Saúde",
        educacao: "Educação",
        lazer: "Lazer",
        vestuario: "Vestuário",
        contas: "Contas e Serviços",
        mercado: "Mercado",
        combustivel: "Combustível",
        telefone: "Telefone/Internet",
        streaming: "Streaming",
        academia: "Academia",
        pet: "Pet",
        outros: "Outros",
      },
      investment: {
        poupanca: "Poupança",
        cdb: "CDB",
        tesouro: "Tesouro Direto",
        acoes: "Ações",
        fundos: "Fundos de Investimento",
        cripto: "Criptomoedas",
        outros: "Outros",
      },
      offering: {
        dizimo: "Dízimo",
        oferta: "Oferta",
        missoes: "Missões",
        construcao: "Construção",
        caridade: "Caridade",
        outros: "Outros",
      },
    },
    faq: {
      categories: {
        all: "Todas",
        popular: "Populares",
        general: "Geral",
        tithe: "Dízimo",
        investments: "Investimentos",
        goals: "Metas",
        planning: "Planejamento",
        premium: "Premium",
        backup: "Backup",
        account: "Conta",
      },
      items: [
        {
          id: "1",
          category: "Geral",
          question: "Como criar minha primeira receita?",
          answer:
            'Para criar uma receita, vá na tela inicial e toque no botão "+" ou "Nova Receita". Preencha o valor, categoria, data e descrição. Depois é só salvar!',
          popular: true,
        },
        {
          id: "2",
          category: "Geral",
          question: "Como adicionar uma despesa?",
          answer:
            'Na tela inicial, toque no botão "+" ou "Nova Despesa". Escolha a categoria, informe o valor, data e descrição. Você também pode marcar como despesa recorrente se for uma conta que se repete todo mês.',
          popular: true,
        },
        {
          id: "3",
          category: "Dízimo",
          question: "Como funciona o cálculo do dízimo?",
          answer:
            "O dízimo é calculado automaticamente como 10% de suas receitas. Você pode acessar a Calculadora de Dízimo no menu e ver quanto deve ofertar baseado em suas receitas do mês.",
          popular: true,
        },
        {
          id: "4",
          category: "Dízimo",
          question: "Posso registrar ofertas além do dízimo?",
          answer:
            'Sim! Além do dízimo, você pode registrar ofertas de missões, construção, ajuda humanitária e outras causas. Basta ir em "Ofertas" e cadastrar cada doação separadamente.',
          popular: false,
        },
        {
          id: "5",
          category: "Investimentos",
          question: "Como adicionar meus investimentos?",
          answer:
            'Vá em "Investimentos" no menu e clique em "Novo Investimento". Escolha o tipo (poupança, ações, CDB, etc), valor investido, data e rentabilidade esperada. O app calculará seus rendimentos.',
          popular: false,
        },
        {
          id: "6",
          category: "Metas",
          question: "Como criar uma meta financeira?",
          answer:
            'Acesse "Metas" no menu e toque em "Nova Meta". Defina o nome (ex: Carro Novo), valor alvo, prazo e quanto já tem guardado. O app mostrará seu progresso e quanto falta para alcançar.',
          popular: true,
        },
        {
          id: "7",
          category: "Planejamento",
          question: "Como funciona o orçamento mensal?",
          answer:
            'No "Planejamento", você define quanto quer gastar por categoria no mês. O app acompanha seus gastos e alerta quando estiver próximo do limite. Assim você controla melhor seus gastos!',
          popular: false,
        },
        {
          id: "8",
          category: "Premium",
          question: "Quais as vantagens da versão Premium?",
          answer:
            "A versão Premium oferece: relatórios avançados, exportação em PDF/Excel, comparativo entre períodos, projeções futuras, análise de tendências, backup automático e suporte prioritário.",
          popular: true,
        },
        {
          id: "9",
          category: "Backup",
          question: "Meus dados estão seguros?",
          answer:
            "Sim! Seus dados são armazenados de forma criptografada no Firebase. Você pode fazer backup manual ou automático e restaurar em qualquer dispositivo. Apenas você tem acesso aos seus dados.",
          popular: false,
        },
        {
          id: "10",
          category: "Conta",
          question: "Como alterar minha senha?",
          answer:
            'Vá em "Perfil" > "Configurações" > "Alterar Senha". Digite sua senha atual e a nova senha duas vezes. Você também pode usar "Esqueci minha senha" na tela de login para redefinir.',
          popular: false,
        },
        {
          id: "11",
          category: "Conta",
          question: "Posso usar em mais de um dispositivo?",
          answer:
            'Sim! Faça login com a mesma conta em qualquer dispositivo. Use a função "Sincronizar Dispositivos" em Backup para garantir que todos os dados estejam atualizados.',
          popular: false,
        },
        {
          id: "12",
          category: "Geral",
          question: "Como deletar uma transação?",
          answer:
            'No histórico de transações, deslize a transação para o lado ou toque nela e escolha "Excluir". Você também pode editar os dados se cometeu algum erro.',
          popular: false,
        },
      ],
    },
    settingsNavigator: {
      profile: "Perfil",
      editProfile: "Editar Perfil",
      premium: "Premium",
      backup: "Backup",
    },
  },
  "en-US": {
    login: {
      title: "Financial",
      titleHighlight: "Control",
      subtitle: "Sign in to continue",

      email: "Email",
      emailPlaceholder: "your@email.com",
      password: "Password",

      forgotPassword: "Forgot password",
      loginButton: "Sign In",

      or: "or",

      noAccount: "Don't have an account?",
      register: "Sign up",

      errors: {
        emailRequired: "Email is required",
        emailInvalid: "Invalid email",
        passwordRequired: "Password is required",
        passwordMin: "Password must be at least 6 characters",
      },

      alerts: {
        successTitle: "Success!",
        successMessage: "Login successful!",
        errorTitle: "Error",
        loginError: "Login failed",
        unexpectedError: "Unexpected login error",
      },
    },
    register: {
      title: "Create Account",
      subtitle: "Fill in the details to get started",

      name: "Full Name",
      namePlaceholder: "John Doe",

      email: "Email",
      emailPlaceholder: "your@email.com",

      password: "Password",
      passwordPlaceholder: "Minimum 6 characters",

      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Enter the password again",

      button: "Sign Up",

      alreadyAccount: "Already have an account?",
      login: "Log in",

      successTitle: "Success!",
      successMessage: "Account created successfully!",

      errorTitle: "Error",
      errorGeneric: "Error creating account",

      errors: {
        nameRequired: "Name is required",
        nameMin: "Name must be at least 3 characters",
        emailRequired: "Email is required",
        emailInvalid: "Invalid email",
        passwordRequired: "Password is required",
        passwordMin: "Password must be at least 6 characters",
        confirmPasswordRequired: "Please confirm your password",
        passwordMismatch: "Passwords do not match",
      },
    },
    forgotPassword: {
      title: "Recover Password",
      subtitleDefault: "Enter your email to receive instructions",
      subtitleSent: "Email sent successfully!",

      emailLabel: "Email",
      emailPlaceholder: "your@email.com",

      sendButton: "Send Recovery Email",
      backToLogin: "← Back to login",

      successTitle: "Email Sent!",
      successMessage: "Check your inbox to reset your password.",

      successInfo: "We sent a recovery link to:",
      instructions: "Check your inbox and spam folder.",

      backLoginButton: "Back to Login",
      resend: "Didn’t receive it? Send again",

      errors: {
        required: "Email is required",
        invalid: "Invalid email",
        sendError: "Error sending email",
      },
    },
    home: {
      greeting: "Hello!",
      lastTransactions: "Latest Transactions",
      seeAll: "See all",
      emptyTitle: "No transactions yet",
      emptySubtitle: "Use quick actions to add one",
    },
    balance: {
      title: "Current Balance",
      income: "Income",
      expense: "Expenses",
    },
    quickActions: {
      title: "Quick Actions",
      income: "Income",
      expense: "Expense",
      investment: "Investment",
      offer: "Offering",
    },
    incomeExpenseChart: {
      title: "Income vs Expenses",
      income: "Income",
      expense: "Expenses",
      empty: "No transactions this month",
    },
    titheCard: {
      title: "Monthly Tithe",
      paidBadge: "Paid",

      expected: "Expected (10%)",
      paid: "Paid",
      remaining: "Remaining",

      action: "Tap to register offering",
    },
    transaction: {
      income: "Income",
      expense: "Expense",
      investment: "Investment",
      offering: "Offering",
    },
    addGoal: {
      title: "New Financial Goal",
      subtitle: "Set your goals and track your progress",
      fields: {
        title: "Goal Title",
        targetAmount: "Target Amount",
        initialAmount: "Initial Amount (Optional)",
        deadline: "Deadline",
        icon: "Goal Icon",
      },
      placeholders: {
        title: "e.g. Trip to Europe, New Car...",
        date: "MM/DD/YYYY",
      },
      preview: "Goal Preview",
      previewDefault: "Your goal",
      actions: {
        create: "Create Goal",
      },
      errors: {
        titleRequired: "Title is required",
        targetAmountInvalid: "Target amount must be greater than zero",
        deadlineInvalid: "Invalid deadline",
        deadlineFuture: "Deadline must be in the future",
      },
      success: "Goal created successfully!",
      error: "Error creating goal",
      errorGeneric: "Unable to create the goal",
    },
    goalDetail: {
      completed: "Goal Achieved!",
      daysRemaining: "{{count}} days remaining",
      todayDeadline: "Deadline is today!",
      late: "Late by {{count}} days",

      progress: "Progress",

      amounts: {
        current: "Current",
        target: "Target",
        remaining: "Remaining",
      },

      details: "Details",
      createdAt: "Created At:",
      deadline: "Deadline:",
      targetAmount: "Target Amount:",

      addTitle: "Add to Goal",
      addLabel: "Amount",

      delete: "Delete Goal",
      deleteConfirmTitle: "Delete Goal",
      deleteConfirmMessage: "Are you sure you want to delete this goal?",

      alerts: {
        invalidValue: "Enter a valid amount",
        successAdd: "{{amount}} added to the goal!",
        deleteSuccess: "Goal deleted successfully!",
        error: "Error",
        addError: "Unable to add the amount",
      },
    },
    goals: {
      title: "Goals",
      active: "Active Goals",
      completed: "Completed",
      completedWithEmoji: "Completed Goals",

      summary: {
        active: "Active Goals",
        completed: "Completed",
      },

      deadline: {
        daysRemaining: "{{count}} days remaining",
        today: "Deadline is today!",
        late: "Late by {{count}} days",
        achieved: "Goal achieved!",
      },

      progress: "Progress",

      empty: {
        title: "No goals created",
        subtitle: "Set financial goals and track your progress",
      },

      actions: {
        create: "Create New Goal",
        deleteTitle: "Delete Goal",
        deleteConfirm: "Are you sure you want to delete this goal?",
        deleteSuccess: "Goal deleted successfully!",
        cancel: "Cancel",
        delete: "Delete",
      },
    },
    budget: {
      createTitle: "Create Monthly Budget",
      editTitle: "Edit Budget",
      subtitle: "Set spending limits by category",

      total: "Total Budget",

      quickFill: {
        title: "Quick Fill",
        choose: "Choose an option:",
        equal: "Distribute Equally",
        suggested: "Suggested Values",
        cancel: "Cancel",
      },

      categoryTitle: "Budget by Category",

      tip: {
        title: "Tip",
        text: "A common rule is: 50% for needs, 30% for wants, and 20% for savings and investments.",
      },

      actions: {
        save: "Save Changes",
        create: "Create Budget",
        cancel: "Cancel",
      },

      alerts: {
        error: "Error",
        minRequired: "Set at least one category budget",
        successTitle: "Success!",
        created: "Budget created!",
        updated: "Budget updated!",
        saveError: "Error saving budget",
        genericError: "Unable to save budget",
      },
    },
    budgetOverview: {
      title: "Monthly Budget",
      total: "Total Budget",

      summary: {
        spent: "Spent",
        available: "Available",
        percentage: "{{value}}%",
      },

      category: {
        title: "Budget by Category",
        limit: "Limit",
        of: "of {{amount}}",
        available: "Available:",
        exceeded: "Exceeded:",
      },

      warnings: {
        nearLimit:
          "You are close to the limit! Consider reducing expenses in this category.",
        overLimit: "You exceeded the budget for this category by {{amount}}!",
      },

      empty: {
        title: "No budget for this month",
        subtitle: "Create a monthly budget to track your expenses",
      },

      actions: {
        create: "Create Budget",
        edit: "Edit Budget",
      },
    },
    advancedReports: {
      premium: {
        title: "Premium Feature",
        description:
          "Advanced reports are available only for Premium subscribers.",
        benefitsTitle: "With Premium you get:",
        benefits: {
          yearly: "Complete yearly reports",
          comparison: "Period comparison",
          projection: "Future projections",
          pdf: "PDF export",
          excel: "Excel export",
        },
        subscribe: "Upgrade to Premium",
      },

      badge: "PREMIUM",

      views: {
        yearly: "Yearly",
        comparison: "Comparison",
        projection: "Projection",
      },

      yearly: {
        summary: "Year Summary",
        income: "Income",
        expense: "Expenses",
        balance: "Annual Balance",
        evolution: "Monthly Evolution",
      },

      comparison: {
        title: "Monthly Comparison",
      },

      projection: {
        title: "Next Month Projection",
        income: "Expected Income",
        expense: "Expected Expenses",
        balance: "Expected Balance",
        info: "Projection based on the average of the last 3 months. Keep your records updated for more accurate forecasts.",
      },

      export: {
        title: "Export Report",
        pdf: "PDF",
        excel: "Excel",
        alerts: {
          pdfTitle: "Export PDF",
          pdfMessage: "PDF export feature (coming soon)",
          excelTitle: "Export Excel",
          excelMessage: "Excel export feature (coming soon)",
        },
      },
    },
    history: {
      searchPlaceholder: "Search by description or category...",

      filters: {
        all: "All",
        receita: "Income",
        despesa: "Expenses",
        investimento: "Investments",
        oferta: "Offers",
      },

      sort: {
        label: "Sort by:",
        dateDesc: "Most recent",
        dateAsc: "Oldest",
        amountDesc: "Highest amount",
        amountAsc: "Lowest amount",
      },

      summary: {
        transactions_one: "{{count}} transaction",
        transactions_other: "{{count}} transactions",
        total: "Total:",
      },

      empty: {
        notFound: "No transactions found",
        noCategory: "No transactions in this category",
        tryAnother: "Try searching for another term",
        addTransactions: "Add transactions to see them here",
      },
    },
    reports: {
      historyButton: "View Full History",
      advancedReports: "Advanced Reports Premium",

      periods: {
        month: "This Month",
        threeMonths: "Last 3 Months",
        year: "This Year",
      },

      summary: {
        income: "Income",
        expense: "Expenses",
        investment: "Investments",
        offer: "Offers",
        balance: "Period Balance",
      },

      charts: {
        overview: "Overview",
        expensesByCategory: "Expenses by Category",
        allCategories: "All Categories",
        noData: "No data to display",
        noExpenses: "No expenses to categorize",
      },

      empty: {
        noTransactions: "No transactions in this period",
        hint: "Add transactions to view reports",
      },
    },
    about: {
      header: {
        title: "About the App",
        version: "v1.0.0",
      },

      app: {
        name: "Financial Control",
        tagline: "Organize your finances intelligently",
      },

      sections: {
        about: "About",
        features: "Features",
        libraries: "Open Source Libraries",
        developer: "Developer",
        links: "Useful Links",
      },

      description:
        "Financial Control is a complete app for managing your personal finances. With it you can track income, expenses, investments, set goals, create budgets and much more.",

      features: [
        "Income and expense tracking",
        "Investment management",
        "Tithe and offering calculator",
        "Financial goals",
        "Monthly budget",
        "Detailed reports",
        "Cloud backup",
        "Premium system",
        "Full support",
        "Dark mode",
        "Multiple currencies",
      ],

      developer: {
        madeByPrefix: "Developed with",
        madeByAuthor: "by Louise",
        rights: "© 2026 All rights reserved",
      },

      links: {
        privacy: "Privacy Policy",
        terms: "Terms of Use",
        source: "Source Code (GitHub)",
      },

      footer: {
        madeWith: "Made with React Native",
        build: "Build 2024.01.001",
      },
    },
    backup: {
      header: {
        title: "Backup & Restore",
        subtitle: "Keep your data safe",
      },

      auto: {
        title: "Automatic Backup",
        description:
          "Automatically creates cloud backups when you add or edit data",
        last: "Last backup:",
      },

      quickActions: {
        title: "Quick Actions",
        create: "Create Backup Now",
        createSubtitle: "Save to cloud",
        export: "Export Data",
        exportPremium: "Premium only",
        exportFile: "Download JSON file",
      },

      list: {
        title: "Saved Backups",
        emptyTitle: "No backups available",
        emptySubtitle: "Create your first backup to protect your data",
        auto: "Auto",
        restore: "Restore",
        delete: "Delete",
      },

      info: {
        title: "About Backups",
        text:
          "• Backups are stored in the cloud\n" +
          "• Include transactions, goals and budgets\n" +
          "• Free users: up to 3 backups\n" +
          "• Premium: unlimited backups\n" +
          "• Restore replaces current data",
      },

      alerts: {
        success: "Success",
        error: "Error",
        created: "Backup created successfully!",
        deleted: "Backup deleted successfully!",
        restored: "Data restored successfully!",
        createFail: "Failed to create backup:",
        deleteFail: "Failed to delete backup:",
        restoreFail: "Failed to restore backup:",
        confirmRestoreTitle: "Confirm Restore",
        confirmRestoreMessage:
          "This will replace all your current data. Continue?",
        confirmDeleteTitle: "Confirm Deletion",
        confirmDeleteMessage: "Are you sure you want to delete this backup?",
        cancel: "Cancel",
        restore: "Restore",
        delete: "Delete",
        premiumTitle: "Premium Feature",
        premiumMessage: "Data export is available only for Premium users.",
        upgrade: "Upgrade",
      },

      misc: {
        items_one: "{{count}} item",
        items_other: "{{count}} items",
        unavailableDate: "Date unavailable",
        invalidDate: "Invalid date",
      },
    },
    contact: {
      title: "Contact Us",

      helpTitle: "How can we help?",
      helpDescription:
        "Fill out the form below and our team will respond within 24 hours",

      form: {
        name: "Full Name",
        email: "Email",
        category: "Category",
        subject: "Subject",
        message: "Message",
      },

      placeholders: {
        name: "Your name",
        email: "your@email.com",
        subject: "Brief description of your question",
        message:
          "Describe your question or suggestion with as much detail as possible...",
      },

      send: "Send Message",
      sending: "Sending...",

      successTitle: "Message Sent!",
      successMessage:
        "We have received your message and will contact you soon.\n\nTicket number: {{ticket}}",

      errors: {
        warningTitle: "Warning",
        errorTitle: "Error",
        name: "Please enter your name",
        email: "Please enter your email",
        subject: "Please enter the subject",
        category: "Please select a category",
        message: "Please write your message",
        send: "Unable to send your message. Please try again.",
      },

      info: {
        responseTime: "We respond within 24 business hours",
        security: "Your information is secure",
      },
    },
    currencySelector: {
      headerTitle: "Select Currency",
      searchPlaceholder: "Search currency...",
      info: "The selected currency will be used throughout the app",
    },
    editProfile: {
      title: "Edit Profile",

      avatar: {
        changePhoto: "Change photo",
        photoInDevelopment: "Feature under development",
      },

      form: {
        fullName: "Full Name",
        email: "Email",
        emailInfo: "Email cannot be changed.",
      },

      validation: {
        nameRequired: "Name is required",
        nameMinLength: "Name must be at least 3 characters long",
      },

      actions: {
        save: "Save Changes",
        cancel: "Cancel",
      },

      alerts: {
        successTitle: "Success!",
        successMessage: "Profile updated successfully!",
        errorTitle: "Error",
        errorMessage: "Unable to update profile",

        discardTitle: "Discard changes?",
        discardMessage:
          "You have unsaved changes. Do you want to discard them?",
        keepEditing: "Keep editing",
        discard: "Discard",
        ok: "OK",
      },
    },
    premium: {
      badge: "PREMIUM",

      header: {
        title: "Unlock Your Full Potential",
        subtitle: "Advanced features for those who want more",
      },

      plans: {
        choose: "Choose Your Plan",
        monthly: "Monthly",
        yearly: "Yearly",
        month: "month",
        year: "year",
        selected: "Selected",
        discount: "25% off",
      },

      features: {
        titleAvailable: "Available Features",
        titleGain: "What you get",

        advancedReports: {
          title: "Advanced Reports",
          description: "Detailed analysis and comparisons",
        },
        futureProjections: {
          title: "Future Projections",
          description: "Predictions based on your data",
        },
        exportPdf: {
          title: "Export PDF",
          description: "Save your reports as PDF",
        },
        exportExcel: {
          title: "Export Excel",
          description: "Export data to spreadsheets",
        },
        yearlyReports: {
          title: "Yearly Reports",
          description: "Complete yearly overview",
        },
        periodComparison: {
          title: "Period Comparison",
          description: "Compare months and years",
        },
        unlimitedGoals: {
          title: "Unlimited Goals",
          description: "Create as many goals as you want",
        },
        unlimitedBackup: {
          title: "Unlimited Backup",
          description: "Your data is always safe",
        },
        earlyAccess: {
          title: "New Features",
          description: "Early access to new features",
        },
      },

      guarantee: {
        title: "7-day guarantee",
        text: "Not satisfied? We’ll refund your money, no questions asked.",
      },

      buttons: {
        subscribe: "Subscribe for {{price}}",
        manage: "Manage Subscription",
        cancel: "Cancel",
        confirmDemo: "Subscribe (Demo)",
        yesCancel: "Yes, cancel",
        no: "No",
      },

      premiumStatus: {
        title: "You are Premium!",
        subtitle: "Enjoy all exclusive features",
        plan: "Plan:",
        validUntil: "Valid until:",
        canceled: "Subscription Canceled",
        canceledMessage: "Your Premium subscription has been canceled.",
      },

      alerts: {
        confirmTitle: "Confirm Subscription",
        confirmMessage:
          "You are about to subscribe to the {{plan}} plan for {{price}}.\n\nNOTE: This is a demo mode. In production, you will be redirected to Google Play to confirm the purchase.",
        welcomeTitle: "Welcome to Premium!",
        welcomeMessage: "You now have access to all premium features!",
        cancelTitle: "Cancel Subscription",
        cancelMessage:
          "Are you sure you want to cancel your Premium subscription? You will lose access to premium features.",
        demoDisclaimer:
          "* Demo mode. In production, billing will be handled by Google Play.",
        ok: "OK",
      },
    },
    profile: {
      title: "Profile",

      header: {
        defaultUser: "User",
        userPhoto: "User photo",
        editPhoto: "Edit photo",
      },

      accountInfo: {
        title: "Account Information",
        name: "Name",
        email: "Email",
        userId: "User ID",
        notInformed: "Not informed",
      },

      menu: {
        title: "Menu",
        editProfile: "Edit Profile",
        goals: "Financial Goals",
        budget: "Monthly Budget",
        settings: "Settings",
        backup: "Data Backup",
        premium: "Upgrade to Premium",
        support: "Support",
      },

      actions: {
        logout: "Log out",
      },

      alerts: {
        logoutTitle: "Log out",
        logoutMessage: "Are you sure you want to log out?",
        cancel: "Cancel",
        confirm: "Log out",
      },

      version: "Version {{version}}",
    },
    settings: {
      title: "Settings",
      subtitle: "Customize your app",

      appearance: "Appearance",
      darkMode: "Dark Mode",
      darkModeDesc: "Dark theme to save battery",

      regionCurrency: "Region & Currency",
      currency: "Currency",
      language: "Language",

      notifications: "Notifications",
      notificationsEnabled: "Notifications Enabled",
      notificationsEnabledDesc: "Enable or disable notifications",

      bills: "Bills Reminder",
      billsDesc: "Notify about upcoming bills",

      tithe: "Tithe Reminder",
      titheDesc: "Remind to pay monthly tithe",

      goals: "Goals Alerts",
      goalsDesc: "Progress and achievements",

      daily: "Daily Reminder",
      dailyDesc: "Remember to log daily expenses",

      notificationTime: "Notification Time",
      notificationTimeDesc: "Set default time",

      others: "Others",
      about: "About the App",
      aboutDesc: "Version, licenses and credits",

      reset: "Reset Settings",
      resetDesc: "Restore default settings",

      timeTitle: "Set Time",
      saveTitle: "Save Time",

      save: "Save",
      cancel: "Cancel",
      close: "Close",

      selectLanguage: "Select Language",
      selectCurrency: "Select Currency",

      languageChanged: "Language Changed",
      languageRestart: "The language will be applied on next app restart",

      resetConfirmTitle: "Reset Settings",
      resetConfirmDesc: "This will restore all default settings. Continue?",
      success: "Success",
      resetSuccess: "Settings restored!",

      footer: {
        appName: "Financial Control v1.0.0",
        madeWithPrefix: "Built with",
        madeWithSuffix: "in React Native",
      },
    },

    supportCreateTicket: {
      header: {
        title: "Submit Ticket",
        subtitle: "Describe your issue or question",
      },

      form: {
        subject: "Subject",
        subjectPlaceholder: "E.g.: Problem adding income",

        category: "Category",
        priority: "Priority",
        description: "Description",
        descriptionPlaceholder: "Describe your issue or question in detail...",
        charCount: "{{count}} characters (minimum 20)",
      },

      categories: {
        general: "General",
        account: "Account",
        transactions: "Transactions",
        backup: "Backup",
        premium: "Premium",
        goals: "Goals",
        budget: "Budget",
        tithe: "Tithe",
        reports: "Reports",
        other: "Other",
      },

      priorities: {
        low: "Low",
        medium: "Medium",
        high: "High",
      },

      tips: {
        title: "Tips for a good ticket:",
        items: [
          "• Be specific about the issue",
          "• Tell when the problem happened",
          "• Describe steps to reproduce it",
          "• Include error messages if any",
        ],
      },

      actions: {
        submit: "Submit Ticket",
        viewTicket: "View Ticket",
        ok: "OK",
      },

      alerts: {
        error: "Error",
        subjectRequired: "Please enter a subject",
        descriptionRequired: "Please describe your issue or question",
        descriptionMin: "Description must be at least 20 characters",

        successTitle: "Ticket Created!",
        successMessage:
          "We have received your request. Our team will reply shortly.",

        createError: "Could not create the ticket. Please try again.",
      },
    },
    faqScreen: {
      title: "Frequently Asked Questions",
      subtitle: "Find quick answers",

      searchPlaceholder: "Search question...",

      categories: {
        all: "All",
      },

      empty: {
        title: "No questions found",
        subtitle: "Try searching with different words",
      },

      footer: {
        title: "Didn’t find what you were looking for?",
        subtitle: "Contact us through the support form",
      },
    },
    supportScreen: {
      header: {
        title: "Support Center",
        subtitle: "How can we help you?",
      },

      options: {
        faq: {
          title: "Help Center (FAQ)",
          subtitle: "Quick answers to common questions",
        },
        ticket: {
          title: "Submit Ticket",
          subtitle: "Talk directly to our support team",
        },
        tutorials: {
          title: "Tutorials",
          subtitle: "Learn how to use all features",
        },
      },

      myTickets: {
        title: "My Tickets",
        emptyTitle: "No open tickets",
        emptySubtitle: "Submit a ticket if you need help",

        open: "Open",
        recentlyResolved: "Recently Resolved",

        viewAll: "View all ({{count}})",
      },

      ticketStatus: {
        open: "Open",
        in_progress: "In Progress",
        resolved: "Resolved",
        closed: "Closed",
      },

      contact: {
        title: "Need immediate help?",
        description: "Our team is available Monday to Friday, from 9am to 6pm.",
        whatsapp: "WhatsApp",
        email: "Email",
        errorTitle: "Error",
        errorOpenLink: "Unable to open {{name}}",
      },

      info: {
        title: "Information",
        text:
          "• Average response time: 24 hours\n" +
          "• Support available in Portuguese\n" +
          "• All conversations are confidential\n" +
          "• Premium users receive priority support",
      },
    },
    ticketDetailsScreen: {
      errors: {
        notFoundTitle: "Error",
        notFoundMessage: "Ticket not found",
        sendMessage: "Unable to send the message",
      },

      closeTicket: {
        title: "Close Ticket",
        message:
          "Are you sure you want to close this ticket? You can open a new one if needed.",
        cancel: "Cancel",
        confirm: "Close",
      },

      rating: {
        prompt: "Rate our support",
        title: "How was our support?",
        placeholder: "Comment (optional)",
        submit: "Submit Rating",
        alertTitle: "Attention",
        alertMessage: "Please select a rating",
        successTitle: "Thank you!",
        successMessage: "Your rating has been submitted successfully.",
        rated: "You rated:",
      },

      status: {
        open: "Open",
        in_progress: "In Progress",
        resolved: "Resolved",
        closed: "Closed",
      },

      actions: {
        closeTicket: "Close Ticket",
        send: "Send",
      },

      input: {
        messagePlaceholder: "Type your message...",
      },
    },
    ticketListScreen: {
      header: {
        title: "My Tickets",
        subtitle: "{{count}} {{count, plural, one {ticket} other {tickets}}}",
      },

      filters: {
        all: "All",
        open: "Open",
        in_progress: "In Progress",
        resolved: "Resolved",
        closed: "Closed",
      },

      status: {
        open: "Open",
        in_progress: "In Progress",
        resolved: "Resolved",
        closed: "Closed",
      },

      date: {
        today: "Today",
        yesterday: "Yesterday",
        daysAgo: "{{count}} days ago",
      },

      loading: {
        text: "Loading tickets...",
      },

      empty: {
        title: "No tickets found",
        allSubtitle: "Create your first support ticket",
        filteredSubtitle: "No {{status}} tickets",
      },

      actions: {
        create: "Create Ticket",
      },
    },
    tutorialsScreen: {
      header: {
        title: "Tutorials",
        subtitle: "Learn how to use all features",
      },

      footer: {
        title: "Still have questions?",
        text: "Visit our Help Center (FAQ) or submit a support ticket. We are here to help!",
      },

      categories: [
        {
          id: "1",
          category: "Getting Started",
          icon: "rocket-launch",
          items: [
            {
              title: "How to create your first transaction",
              steps: [
                'Go to the "Transactions" tab in the bottom menu',
                'Tap the "+" button',
                "Choose the type: Income, Expense, Investment or Offer",
                "Fill in description, amount and date",
                "Select a category",
                'Tap "Save"',
              ],
            },
            {
              title: "Understanding the Dashboard",
              steps: [
                "The balance card shows your current balance",
                "Income values appear in green (+)",
                "Expenses appear in red (-)",
                "The pie chart shows expenses by category",
                "Latest transactions appear below",
                "The tithe card shows the suggested amount (10% of income)",
              ],
            },
          ],
        },

        {
          id: "2",
          category: "Main Features",
          icon: "settings",
          items: [
            {
              title: "Creating financial goals",
              steps: [
                "Go to Planning → Goals",
                'Tap "+" to create a new goal',
                "Define the goal name",
                "Enter the target amount",
                "Choose a deadline",
                "Track your progress",
              ],
            },
          ],
        },

        {
          id: "5",
          category: "Premium",
          icon: "star",
          items: [
            {
              title: "Premium features",
              steps: [
                "Complete annual reports",
                "Period comparison",
                "Future expense projections",
                "Unlimited cloud backups",
                "Data export",
                "No ads",
                "Priority support",
              ],
            },
          ],
        },
      ],
    },
    addExpense: {
      title: "Add Expense",

      form: {
        description: {
          label: "Description",
          placeholder: "e.g. Grocery, Electricity bill...",
          required: "Description is required",
        },
        amount: {
          label: "Amount",
          placeholder: "0.00",
          invalid: "Amount must be greater than zero",
        },
        date: {
          label: "Date",
          placeholder: "MM/DD/YYYY",
          invalid: "Invalid date",
        },
        category: {
          label: "Category",
          required: "Select a category",
        },
        recurring: {
          label: "Recurring expense",
          description: "Check if this expense repeats monthly",
        },
      },

      actions: {
        save: "Save Expense",
        cancel: "Cancel",
      },

      alerts: {
        sessionExpired: {
          title: "Session expired",
          message: "Please log in again.",
        },
        success: {
          title: "Success!",
          message: "Expense added successfully!",
        },
        error: {
          title: "Error",
          generic: "Error adding expense",
          save: "Unable to add expense",
        },
      },
    },
    addIncome: {
      title: "Add Income",

      loading: "Loading...",

      form: {
        description: {
          label: "Description",
          placeholder: "e.g. Salary, Freelance, Bonus...",
          required: "Description is required",
        },
        amount: {
          label: "Amount",
          placeholder: "0.00",
          invalid: "Amount must be greater than zero",
        },
        date: {
          label: "Date",
          placeholder: "MM/DD/YYYY",
          invalid: "Invalid date",
        },
        category: {
          label: "Category",
          required: "Select a category",
        },
        recurring: {
          label: "Recurring income",
          description: "Check if this income repeats monthly",
        },
      },

      actions: {
        save: "Save Income",
        cancel: "Cancel",
      },

      alerts: {
        sessionExpired: {
          title: "Session expired",
          message: "Please log in again.",
        },
        success: {
          title: "Success!",
          message: "Income added successfully!",
        },
        error: {
          title: "Error",
          generic: "Error adding income",
          save: "Unable to add income",
        },
      },
    },
    addInvestment: {
      title: "New Investment",
      subtitle: "Register your investments and track returns",

      form: {
        description: {
          label: "Description",
          placeholder: "e.g. Bank CDB, AAPL Shares...",
          required: "Description is required",
        },
        amount: {
          label: "Invested Amount",
          placeholder: "0.00",
          invalid: "Amount must be greater than zero",
        },
        profitability: {
          label: "Profitability (% per year) - Optional",
          placeholder: "e.g. 10.5",
        },
        date: {
          label: "Investment Date",
          placeholder: "MM/DD/YYYY",
          invalid: "Invalid date",
        },
        category: {
          label: "Investment Type",
          required: "Select an investment type",
        },
      },

      info: {
        estimatedReturn:
          "With {{profitability}}% per year, the estimated return in 12 months will be approximately {{value}}",
      },

      actions: {
        save: "Save Investment",
        cancel: "Cancel",
      },

      alerts: {
        sessionExpired: {
          title: "Session expired",
          message: "Please log in again.",
        },
        success: {
          title: "Success!",
          message: "Investment added successfully!",
        },
        error: {
          title: "Error",
          generic: "Error adding investment",
          save: "Unable to add investment",
        },
      },
    },
    addOffer: {
      title: "Register Offering",
      subtitle: "Contribute to God’s work",

      form: {
        description: {
          label: "Description",
          placeholder: "e.g. December Tithe, Mission Offering...",
          required: "Description is required",
        },
        amount: {
          label: "Amount",
          placeholder: "0.00",
          invalid: "Amount must be greater than zero",
        },
        churchName: {
          label: "Church Name (Optional)",
          placeholder: "e.g. Central Baptist Church",
        },
        date: {
          label: "Date",
          placeholder: "MM/DD/YYYY",
          invalid: "Invalid date",
        },
        category: {
          label: "Offering Type",
          required: "Select an offering type",
        },
      },

      info: {
        tithe:
          "The tithe is 10% of your income. You can use the tithe calculator to calculate the value automatically.",
      },

      actions: {
        save: "Register Offering",
        cancel: "Cancel",
      },

      alerts: {
        sessionExpired: {
          title: "Session expired",
          message: "Please log in again.",
        },
        success: {
          title: "Success!",
          message: "Offering registered successfully!",
        },
        error: {
          title: "Error",
          generic: "Error registering offering",
          save: "Unable to register offering",
        },
      },
    },
    investmentsList: {
      totalInvested: "Total Invested",
      estimatedReturn: "Estimated Return",
      totalAssets: "Total Assets",
      myInvestments: "My Investments",
      invested: "Invested:",
      profitability: "Profitability:",
      earnings: "Earnings:",
      currentValue: "Current Value:",
      appliedOn: "Applied on {{date}}",
      noInvestments: "No investments registered",
      addFirst: "Register your first investment",
      emptySubtext: "Start investing and track your returns",
      addButton: "Add Investment",
      perYear: "% p.a.",
    },
    transactionsNavigator: {
      titleTransactions: "Transactions",
      title: "Transactions",
      subtitle: "Choose an action:",
      addIncome: "Add Income",
      addExpense: "Add Expense",
      addOffer: "Add Offering",
      registerOffer: "Register Offering",
      titheCalculator: "Tithe Calculator",
      myInvestments: "My Investments",
      addInvestment: "Add Investment",
      investmentsList: "Investments",
      transactionDetail: "Transaction Details",
    },
    tithe: {
      header: "Tithe Calculator",
      verse: 'Malachi 3:10 - "Bring the whole tithe into the storehouse"',
      modeMonth: "Monthly Tithe",
      modeCustom: "Custom Amount",
      calculationAuto: "Automatic Calculation",
      monthIncome: "Monthly income:",
      tithePercent: "Tithe (10%):",
      returned: "Returned:",
      remaining: "Remaining:",
      returnedBadge: "Tithe returned!",
      emptyState:
        "Add your monthly income to automatically calculate the tithe",
      customCard: "Calculate Custom Amount",
      customCardSubtitle: "Enter the income value to calculate 10%",
      incomeLabel: "Income Value",
      registerButton: "Register Tithe",
      registerAmount: "Register {{amount}}",
      historyTitle: "Tithe History",
      confirmTitle: "Register Tithe",
      confirmMessage: "Register {{amount}} as tithe for {{monthYear}}?",
      confirmCustomMessage: "Register {{amount}} as tithe?",
      confirmDescription: "Tithe {{monthYear}}",
      confirmCustomDescription: "Custom tithe",
      warningNoIncomeTitle: "Warning",
      warningNoIncomeMessage: "You have no income recorded this month.",
      errorInvalidAmount: "Enter a valid amount",
      successTitle: "Success!",
      successMessage: "Tithe registered successfully!",
      errorTitle: "Error",
      errorGeneric: "Error registering tithe",
      errorSave: "Could not register tithe",
      cancelButton: "Cancel",
      confirmButton: "Register",
    },
    transactionDetail: {
      notFound: "Transaction not found",
      updateSuccess: "Transaction updated successfully!",
      deleteSuccess: "Transaction deleted successfully!",
      updateError: "Error updating transaction",
      deleteError: "Error deleting transaction",
      updateFailed: "Could not update the transaction",
      deleteFailed: "Could not delete the transaction",
      deleteConfirmTitle: "Delete Transaction",
      deleteConfirm:
        "Are you sure you want to delete this transaction? This action cannot be undone.",
      descriptionLabel: "Description",
      amountLabel: "Amount",
      dateLabel: "Date",
      placeholders: {
        date: "MM/DD/YYYY",
      },
      categoryLabel: "Category",
      recurringLabel: "Recurring transaction",
      recurringDescription: "Check if this transaction repeats monthly",
      saveButton: "Save Changes",
      cancelButton: "Cancel",
      editButton: "Edit Transaction",
      deleteButton: "Delete Transaction",
      yesText: "Yes",
      noText: "No",
      successTitle: "Success!",
      errorTitle: "Error",
      deleteButtonAction: "Delete",
      validation: {
        descriptionRequired: "Description is required",
        amountInvalid: "Amount must be greater than zero",
        categoryRequired: "Select a category",
      },
    },
    tabNavigator: {
      home: "Home",
      transactions: "Transactions",
      reports: "Reports",
      profile: "Profile",
    },
    supportNavigator: {
      faq: "FAQ",
      newTicket: "New Ticket",
      ticketDetails: "Ticket Details",
      myTickets: "My Tickets",
      tutorials: "Tutorials",
    },
    reportsNavigator: {
      reports: "Reports",
      history: "History",
      advancedReports: "Advanced Reports",
    },
    planningNavigator: {
      goals: "Financial Goals",
      newGoal: "New Goal",
      goalDetails: "Goal Details",
      monthlyBudget: "Monthly Budget",
      createBudget: "Create Budget",
      editBudget: "Edit Budget",
    },
    categories: {
      income: {
        salario: "Salary",
        freelance: "Freelance",
        investimentos: "Investment Returns",
        bonus: "Bonus",
        presente: "Gift",
        venda: "Sale",
        aluguel: "Rent",
        outros: "Others",
      },
      expense: {
        alimentacao: "Food",
        transporte: "Transportation",
        moradia: "Housing",
        saude: "Health",
        educacao: "Education",
        lazer: "Leisure",
        vestuario: "Clothing",
        contas: "Bills & Services",
        mercado: "Groceries",
        combustivel: "Fuel",
        telefone: "Phone/Internet",
        streaming: "Streaming",
        academia: "Gym",
        pet: "Pet",
        outros: "Others",
      },
      investment: {
        poupanca: "Savings",
        cdb: "CDB",
        tesouro: "Treasury Bonds",
        acoes: "Stocks",
        fundos: "Investment Funds",
        cripto: "Cryptocurrencies",
        outros: "Others",
      },
      offering: {
        dizimo: "Tithe",
        oferta: "Offering",
        missoes: "Missions",
        construcao: "Construction",
        caridade: "Charity",
        outros: "Others",
      },
    },
    faq: {
      categories: {
        all: "All",
        popular: "Popular",
        general: "General",
        tithe: "Tithe",
        investments: "Investments",
        goals: "Goals",
        planning: "Planning",
        premium: "Premium",
        backup: "Backup",
        account: "Account",
      },
      items: [
        {
          id: "1",
          category: "General",
          question: "How do I create my first income?",
          answer:
            'To create an income, go to the home screen and tap the "+" button or "New Income". Fill in the amount, category, date, and description. Then just save!',
          popular: true,
        },
        {
          id: "2",
          category: "General",
          question: "How do I add an expense?",
          answer:
            'On the home screen, tap the "+" button or "New Expense". Choose a category, enter the amount, date, and description. You can also mark it as a recurring expense if it repeats every month.',
          popular: true,
        },
        {
          id: "3",
          category: "Tithe",
          question: "How does tithe calculation work?",
          answer:
            "The tithe is calculated automatically as 10% of your income. You can access the Tithe Calculator in the menu to see how much you should give based on your monthly income.",
          popular: true,
        },
        {
          id: "4",
          category: "Tithe",
          question: "Can I register offerings besides tithe?",
          answer:
            'Yes! Besides tithe, you can register offerings for missions, construction, humanitarian aid, and other causes. Just go to "Offerings" and record each donation separately.',
          popular: false,
        },
        {
          id: "5",
          category: "Investments",
          question: "How do I add my investments?",
          answer:
            'Go to "Investments" in the menu and click "New Investment". Choose the type (savings, stocks, CDB, etc.), invested amount, date, and expected return. The app will calculate your earnings.',
          popular: false,
        },
        {
          id: "6",
          category: "Goals",
          question: "How do I create a financial goal?",
          answer:
            'Go to "Goals" in the menu and tap "New Goal". Set the name (e.g., New Car), target amount, deadline, and how much you already have saved. The app will show your progress.',
          popular: true,
        },
        {
          id: "7",
          category: "Planning",
          question: "How does monthly budget work?",
          answer:
            'In "Planning", you set how much you want to spend per category each month. The app tracks your spending and alerts you when you\'re close to the limit. This helps you control your spending better!',
          popular: false,
        },
        {
          id: "8",
          category: "Premium",
          question: "What are the Premium version benefits?",
          answer:
            "Premium offers: advanced reports, PDF/Excel export, period comparisons, future projections, trend analysis, automatic backup, and priority support.",
          popular: true,
        },
        {
          id: "9",
          category: "Backup",
          question: "Are my data safe?",
          answer:
            "Yes! Your data is stored encrypted on Firebase. You can do manual or automatic backups and restore on any device. Only you can access your data.",
          popular: false,
        },
        {
          id: "10",
          category: "Account",
          question: "How do I change my password?",
          answer:
            'Go to "Profile" > "Settings" > "Change Password". Enter your current password and the new password twice. You can also use "Forgot password" on the login screen to reset it.',
          popular: false,
        },
        {
          id: "11",
          category: "Account",
          question: "Can I use it on more than one device?",
          answer:
            'Yes! Log in with the same account on any device. Use the "Sync Devices" function in Backup to ensure all data is up to date.',
          popular: false,
        },
        {
          id: "12",
          category: "General",
          question: "How do I delete a transaction?",
          answer:
            'In the transaction history, swipe the transaction to the side or tap it and choose "Delete". You can also edit the data if you made a mistake.',
          popular: false,
        },
      ],
    },
    settingsNavigator: {
      profile: "Profile",
      editProfile: "Edit Profile",
      premium: "Premium",
      backup: "Backup",
    },
  },
  "es-ES": {
    login: {
      title: "Control",
      titleHighlight: "Financiero",
      subtitle: "Inicia sesión para continuar",

      email: "Correo",
      emailPlaceholder: "tu@correo.com",
      password: "Contraseña",

      forgotPassword: "Olvidé mi contraseña",
      loginButton: "Ingresar",

      or: "o",

      noAccount: "¿No tienes una cuenta?",
      register: "Regístrate",

      errors: {
        emailRequired: "El correo es obligatorio",
        emailInvalid: "Correo inválido",
        passwordRequired: "La contraseña es obligatoria",
        passwordMin: "La contraseña debe tener al menos 6 caracteres",
      },

      alerts: {
        successTitle: "Éxito!",
        successMessage: "Inicio de sesión exitoso!",
        errorTitle: "Error",
        loginError: "Error al iniciar sesión",
        unexpectedError: "Error inesperado al iniciar sesión",
      },
    },
    register: {
      title: "Crear Cuenta",
      subtitle: "Completa los datos para comenzar",

      name: "Nombre Completo",
      namePlaceholder: "Juan Pérez",

      email: "Correo Electrónico",
      emailPlaceholder: "tu@email.com",

      password: "Contraseña",
      passwordPlaceholder: "Mínimo 6 caracteres",

      confirmPassword: "Confirmar Contraseña",
      confirmPasswordPlaceholder: "Ingresa la contraseña nuevamente",

      button: "Registrarse",

      alreadyAccount: "¿Ya tienes una cuenta?",
      login: "Iniciar sesión",

      successTitle: "¡Éxito!",
      successMessage: "Cuenta creada con éxito",

      errorTitle: "Error",
      errorGeneric: "Error al crear la cuenta",

      errors: {
        nameRequired: "El nombre es obligatorio",
        nameMin: "El nombre debe tener al menos 3 caracteres",
        emailRequired: "El correo es obligatorio",
        emailInvalid: "Correo inválido",
        passwordRequired: "La contraseña es obligatoria",
        passwordMin: "La contraseña debe tener al menos 6 caracteres",
        confirmPasswordRequired: "Confirma tu contraseña",
        passwordMismatch: "Las contraseñas no coinciden",
      },
    },
    forgotPassword: {
      title: "Recuperar Contraseña",
      subtitleDefault: "Ingresa tu correo para recibir instrucciones",
      subtitleSent: "¡Correo enviado con éxito!",

      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@email.com",

      sendButton: "Enviar correo de recuperación",
      backToLogin: "← Volver al inicio de sesión",

      successTitle: "¡Correo Enviado!",
      successMessage:
        "Revisa tu bandeja de entrada para restablecer tu contraseña.",

      successInfo: "Enviamos un enlace de recuperación a:",
      instructions: "Revisa tu bandeja de entrada y spam.",

      backLoginButton: "Volver al Login",
      resend: "¿No lo recibiste? Enviar de nuevo",

      errors: {
        required: "El correo es obligatorio",
        invalid: "Correo inválido",
        sendError: "Error al enviar el correo",
      },
    },
    home: {
      greeting: "¡Hola!",
      lastTransactions: "Últimas transacciones",
      seeAll: "Ver todas",
      emptyTitle: "Aún no hay transacciones",
      emptySubtitle: "Usa las acciones rápidas para agregar",
    },
    balance: {
      title: "Saldo Actual",
      income: "Ingresos",
      expense: "Gastos",
    },
    quickActions: {
      title: "Acciones Rápidas",
      income: "Ingreso",
      expense: "Gasto",
      investment: "Inversión",
      offer: "Ofrenda",
    },
    incomeExpenseChart: {
      title: "Ingresos vs Gastos",
      income: "Ingresos",
      expense: "Gastos",
      empty: "No hay transacciones este mes",
    },
    titheCard: {
      title: "Diezmo del Mes",
      paidBadge: "Entregado",

      expected: "Esperado (10%)",
      paid: "Entregado",
      remaining: "Restante",

      action: "Toca para registrar ofrenda",
    },
    transaction: {
      income: "Ingreso",
      expense: "Gasto",
      investment: "Inversión",
      offering: "Ofrenda",
    },
    addGoal: {
      title: "Nueva Meta Financiera",
      subtitle: "Define tus objetivos y sigue tu progreso",
      fields: {
        title: "Título de la Meta",
        targetAmount: "Monto Objetivo",
        initialAmount: "Monto Inicial (Opcional)",
        deadline: "Fecha Límite",
        icon: "Ícono de la Meta",
      },
      placeholders: {
        title: "Ej: Viaje a Europa, Auto Nuevo...",
        date: "DD/MM/AAAA",
      },
      preview: "Vista Previa de la Meta",
      previewDefault: "Tu meta",
      actions: {
        create: "Crear Meta",
      },
      errors: {
        titleRequired: "El título es obligatorio",
        targetAmountInvalid: "El monto objetivo debe ser mayor que cero",
        deadlineInvalid: "Fecha límite inválida",
        deadlineFuture: "La fecha límite debe ser futura",
      },
      success: "¡Meta creada con éxito!",
      error: "Error al crear la meta",
      errorGeneric: "No se pudo crear la meta",
    },
    goalDetail: {
      completed: "Meta Alcanzada!",
      daysRemaining: "{{count}} días restantes",
      todayDeadline: "¡Hoy es la fecha límite!",
      late: "Retrasado {{count}} días",

      progress: "Progreso",

      amounts: {
        current: "Actual",
        target: "Meta",
        remaining: "Faltan",
      },

      details: "Detalles",
      createdAt: "Fecha de Creación:",
      deadline: "Fecha Límite:",
      targetAmount: "Monto Objetivo:",

      addTitle: "Agregar a la Meta",
      addLabel: "Monto",

      delete: "Eliminar Meta",
      deleteConfirmTitle: "Eliminar Meta",
      deleteConfirmMessage: "¿Seguro que deseas eliminar esta meta?",

      alerts: {
        invalidValue: "Ingresa un monto válido",
        successAdd: "{{amount}} agregado a la meta!",
        deleteSuccess: "¡Meta eliminada con éxito!",
        error: "Error",
        addError: "No se pudo agregar el monto",
      },
    },
    goals: {
      title: "Metas",
      active: "Metas Activas",
      completed: "Completadas",
      completedWithEmoji: "Metas Completadas",

      summary: {
        active: "Metas Activas",
        completed: "Completadas",
      },

      deadline: {
        daysRemaining: "{{count}} días restantes",
        today: "¡Hoy es la fecha límite!",
        late: "Retrasado {{count}} días",
        achieved: "¡Meta alcanzada!",
      },

      progress: "Progreso",

      empty: {
        title: "No hay metas creadas",
        subtitle: "Define metas financieras y sigue tu progreso",
      },

      actions: {
        create: "Crear Nueva Meta",
        deleteTitle: "Eliminar Meta",
        deleteConfirm: "¿Seguro que deseas eliminar esta meta?",
        deleteSuccess: "¡Meta eliminada con éxito!",
        cancel: "Cancelar",
        delete: "Eliminar",
      },
    },
    budget: {
      createTitle: "Crear Presupuesto Mensual",
      editTitle: "Editar Presupuesto",
      subtitle: "Define límites de gasto por categoría",

      total: "Presupuesto Total",

      quickFill: {
        title: "Relleno Rápido",
        choose: "Elige una opción:",
        equal: "Distribuir Igualmente",
        suggested: "Valores Sugeridos",
        cancel: "Cancelar",
      },

      categoryTitle: "Presupuesto por Categoría",

      tip: {
        title: "Consejo",
        text: "Una regla común es: 50% para necesidades, 30% para deseos y 20% para ahorro e inversiones.",
      },

      actions: {
        save: "Guardar Cambios",
        create: "Crear Presupuesto",
        cancel: "Cancelar",
      },

      alerts: {
        error: "Error",
        minRequired: "Define al menos un presupuesto por categoría",
        successTitle: "¡Éxito!",
        created: "¡Presupuesto creado!",
        updated: "¡Presupuesto actualizado!",
        saveError: "Error al guardar el presupuesto",
        genericError: "No se pudo guardar el presupuesto",
      },
    },
    budgetOverview: {
      title: "Presupuesto Mensual",
      total: "Presupuesto Total",

      summary: {
        spent: "Gastado",
        available: "Disponible",
        percentage: "{{value}}%",
      },

      category: {
        title: "Presupuesto por Categoría",
        limit: "Límite",
        of: "de {{amount}}",
        available: "Disponible:",
        exceeded: "Excedido:",
      },

      warnings: {
        nearLimit:
          "¡Estás cerca del límite! Considera reducir gastos en esta categoría.",
        overLimit:
          "¡Has superado el presupuesto de esta categoría en {{amount}}!",
      },

      empty: {
        title: "No hay presupuesto para este mes",
        subtitle: "Crea un presupuesto mensual para controlar tus gastos",
      },

      actions: {
        create: "Crear Presupuesto",
        edit: "Editar Presupuesto",
      },
    },
    advancedReports: {
      premium: {
        title: "Función Premium",
        description:
          "Los informes avanzados están disponibles solo para suscriptores Premium.",
        benefitsTitle: "Con Premium obtendrás:",
        benefits: {
          yearly: "Informes anuales completos",
          comparison: "Comparación entre períodos",
          projection: "Proyecciones futuras",
          pdf: "Exportación en PDF",
          excel: "Exportación en Excel",
        },
        subscribe: "Suscribirse a Premium",
      },

      badge: "PREMIUM",

      views: {
        yearly: "Anual",
        comparison: "Comparativo",
        projection: "Proyección",
      },

      yearly: {
        summary: "Resumen del Año",
        income: "Ingresos",
        expense: "Gastos",
        balance: "Saldo Anual",
        evolution: "Evolución Mensual",
      },

      comparison: {
        title: "Comparativo Mensual",
      },

      projection: {
        title: "Proyección del Próximo Mes",
        income: "Ingresos Previstos",
        expense: "Gastos Previstos",
        balance: "Saldo Previsto",
        info: "Proyección basada en el promedio de los últimos 3 meses. Mantén tus registros actualizados para mayor precisión.",
      },

      export: {
        title: "Exportar Informe",
        pdf: "PDF",
        excel: "Excel",
        alerts: {
          pdfTitle: "Exportar PDF",
          pdfMessage: "Función de exportación en PDF (en desarrollo)",
          excelTitle: "Exportar Excel",
          excelMessage: "Función de exportación en Excel (en desarrollo)",
        },
      },
    },
    history: {
      searchPlaceholder: "Buscar por descripción o categoría...",

      filters: {
        all: "Todas",
        receita: "Ingresos",
        despesa: "Gastos",
        investimento: "Inversiones",
        oferta: "Ofrendas",
      },

      sort: {
        label: "Ordenar:",
        dateDesc: "Más recientes",
        dateAsc: "Más antiguas",
        amountDesc: "Mayor valor",
        amountAsc: "Menor valor",
      },

      summary: {
        transactions_one: "{{count}} transacción",
        transactions_other: "{{count}} transacciones",
        total: "Total:",
      },

      empty: {
        notFound: "No se encontraron transacciones",
        noCategory: "No hay transacciones en esta categoría",
        tryAnother: "Intenta buscar con otro término",
        addTransactions: "Agrega transacciones para verlas aquí",
      },
    },
    reports: {
      historyButton: "Ver historial completo",
      advancedReports: "Informes avanzados Premium",

      periods: {
        month: "Este mes",
        threeMonths: "Últimos 3 meses",
        year: "Este año",
      },

      summary: {
        income: "Ingresos",
        expense: "Gastos",
        investment: "Inversiones",
        offer: "Ofrendas",
        balance: "Saldo del período",
      },

      charts: {
        overview: "Resumen general",
        expensesByCategory: "Gastos por categoría",
        allCategories: "Todas las categorías",
        noData: "No hay datos para mostrar",
        noExpenses: "No hay gastos para categorizar",
      },

      empty: {
        noTransactions: "No hay transacciones en este período",
        hint: "Agrega transacciones para ver los informes",
      },
    },
    about: {
      header: {
        title: "Sobre la App",
        version: "v1.0.0",
      },

      app: {
        name: "Control Financiero",
        tagline: "Organiza tus finanzas con inteligencia",
      },

      sections: {
        about: "Sobre",
        features: "Funcionalidades",
        libraries: "Bibliotecas de Código Abierto",
        developer: "Desarrollador",
        links: "Enlaces Útiles",
      },

      description:
        "Control Financiero es una aplicación completa para gestionar tus finanzas personales. Con ella puedes controlar ingresos, gastos, inversiones, definir metas, crear presupuestos y mucho más.",

      features: [
        "Control de ingresos y gastos",
        "Gestión de inversiones",
        "Calculadora de diezmo y ofrendas",
        "Metas financieras",
        "Presupuesto mensual",
        "Informes detallados",
        "Copia de seguridad en la nube",
        "Sistema Premium",
        "Soporte completo",
        "Modo oscuro",
        "Múltiples monedas",
      ],

      developer: {
        madeByPrefix: "Developed with",
        madeByAuthor: "by Louise",
        rights: "© 2026 All rights reserved",
      },

      links: {
        privacy: "Política de Privacidad",
        terms: "Términos de Uso",
        source: "Código Fuente (GitHub)",
      },

      footer: {
        madeWith: "Hecho con React Native",
        build: "Build 2024.01.001",
      },
    },
    backup: {
      header: {
        title: "Copia de Seguridad y Restauración",
        subtitle: "Mantén tus datos seguros",
      },

      auto: {
        title: "Copia Automática",
        description:
          "Crea copias en la nube automáticamente cuando agregas o editas datos",
        last: "Última copia:",
      },

      quickActions: {
        title: "Acciones Rápidas",
        create: "Crear Copia Ahora",
        createSubtitle: "Guardar en la nube",
        export: "Exportar Datos",
        exportPremium: "Solo Premium",
        exportFile: "Descargar archivo JSON",
      },

      list: {
        title: "Copias Guardadas",
        emptyTitle: "No hay copias disponibles",
        emptySubtitle: "Crea tu primera copia para proteger tus datos",
        auto: "Auto",
        restore: "Restaurar",
        delete: "Eliminar",
      },

      info: {
        title: "Sobre las Copias",
        text:
          "• Las copias se guardan en la nube\n" +
          "• Incluyen transacciones, metas y presupuestos\n" +
          "• Usuarios gratuitos: hasta 3 copias\n" +
          "• Premium: copias ilimitadas\n" +
          "• Restaurar reemplaza los datos actuales",
      },

      alerts: {
        success: "Éxito",
        error: "Error",
        created: "¡Copia creada con éxito!",
        deleted: "Copia eliminada con éxito!",
        restored: "¡Datos restaurados con éxito!",
        createFail: "Error al crear la copia:",
        deleteFail: "Error al eliminar la copia:",
        restoreFail: "Error al restaurar la copia:",
        confirmRestoreTitle: "Confirmar Restauración",
        confirmRestoreMessage:
          "Esto reemplazará todos tus datos actuales. ¿Deseas continuar?",
        confirmDeleteTitle: "Confirmar Eliminación",
        confirmDeleteMessage: "¿Seguro que deseas eliminar esta copia?",
        cancel: "Cancelar",
        restore: "Restaurar",
        delete: "Eliminar",
        premiumTitle: "Función Premium",
        premiumMessage:
          "La exportación de datos está disponible solo para usuarios Premium.",
        upgrade: "Actualizar",
      },

      misc: {
        items_one: "{{count}} elemento",
        items_other: "{{count}} elementos",
        unavailableDate: "Fecha no disponible",
        invalidDate: "Fecha inválida",
      },
    },
    contact: {
      title: "Contáctanos",

      helpTitle: "¿Cómo podemos ayudarte?",
      helpDescription:
        "Completa el formulario y nuestro equipo responderá en un plazo de 24 horas",

      form: {
        name: "Nombre Completo",
        email: "Correo Electrónico",
        category: "Categoría",
        subject: "Asunto",
        message: "Mensaje",
      },

      placeholders: {
        name: "Tu nombre",
        email: "tu@email.com",
        subject: "Resumen de tu consulta",
        message:
          "Describe tu duda o sugerencia con el mayor detalle posible...",
      },

      send: "Enviar Mensaje",
      sending: "Enviando...",

      successTitle: "¡Mensaje Enviado!",
      successMessage:
        "Hemos recibido tu mensaje y nos pondremos en contacto pronto.\n\nNúmero de ticket: {{ticket}}",

      errors: {
        warningTitle: "Advertencia",
        errorTitle: "Error",
        name: "Por favor, ingresa tu nombre",
        email: "Por favor, ingresa tu correo",
        subject: "Por favor, ingresa el asunto",
        category: "Por favor, selecciona una categoría",
        message: "Por favor, escribe tu mensaje",
        send: "No se pudo enviar el mensaje. Inténtalo nuevamente.",
      },

      info: {
        responseTime: "Respondemos en hasta 24 horas hábiles",
        security: "Tu información está segura",
      },
    },
    currencySelector: {
      headerTitle: "Seleccionar Moneda",
      searchPlaceholder: "Buscar moneda...",
      info: "La moneda seleccionada se usará en toda la app",
    },
    editProfile: {
      title: "Editar Perfil",

      avatar: {
        changePhoto: "Cambiar foto",
        photoInDevelopment: "Funcionalidad en desarrollo",
      },

      form: {
        fullName: "Nombre Completo",
        email: "Correo electrónico",
        emailInfo: "El correo no se puede cambiar.",
      },

      validation: {
        nameRequired: "El nombre es obligatorio",
        nameMinLength: "El nombre debe tener al menos 3 caracteres",
      },

      actions: {
        save: "Guardar Cambios",
        cancel: "Cancelar",
      },

      alerts: {
        successTitle: "¡Éxito!",
        successMessage: "Perfil actualizado correctamente",
        errorTitle: "Error",
        errorMessage: "No se pudo actualizar el perfil",

        discardTitle: "¿Descartar cambios?",
        discardMessage: "Tienes cambios no guardados. ¿Deseas descartarlos?",
        keepEditing: "Seguir editando",
        discard: "Descartar",
        ok: "OK",
      },
    },
    premium: {
      badge: "PREMIUM",

      header: {
        title: "Desbloquea Todo tu Potencial",
        subtitle: "Funciones avanzadas para quienes quieren más",
      },

      plans: {
        choose: "Elige tu Plan",
        monthly: "Mensual",
        yearly: "Anual",
        month: "mes",
        year: "año",
        selected: "Seleccionado",
        discount: "25% de descuento",
      },

      features: {
        titleAvailable: "Funciones Disponibles",
        titleGain: "Lo que obtienes",

        advancedReports: {
          title: "Informes Avanzados",
          description: "Análisis detallados y comparaciones",
        },
        futureProjections: {
          title: "Proyecciones Futuras",
          description: "Predicciones basadas en tus datos",
        },
        exportPdf: {
          title: "Exportar PDF",
          description: "Guarda tus informes en PDF",
        },
        exportExcel: {
          title: "Exportar Excel",
          description: "Exporta datos a hojas de cálculo",
        },
        yearlyReports: {
          title: "Informes Anuales",
          description: "Visión completa del año",
        },
        periodComparison: {
          title: "Comparación de Períodos",
          description: "Compara meses y años",
        },
        unlimitedGoals: {
          title: "Metas Ilimitadas",
          description: "Crea todas las metas que quieras",
        },
        unlimitedBackup: {
          title: "Copia de Seguridad Ilimitada",
          description: "Tus datos siempre seguros",
        },
        earlyAccess: {
          title: "Nuevas Funciones",
          description: "Acceso anticipado a novedades",
        },
      },

      guarantee: {
        title: "Garantía de 7 días",
        text: "¿No te gustó? Te devolvemos tu dinero sin preguntas.",
      },

      buttons: {
        subscribe: "Suscribirse por {{price}}",
        manage: "Gestionar Suscripción",
        cancel: "Cancelar",
        confirmDemo: "Suscribirse (Demo)",
        yesCancel: "Sí, cancelar",
        no: "No",
      },

      premiumStatus: {
        title: "¡Eres Premium!",
        subtitle: "Disfruta de todas las funciones exclusivas",
        plan: "Plan:",
        validUntil: "Válido hasta:",
        canceled: "Suscripción Cancelada",
        canceledMessage: "Tu suscripción Premium ha sido cancelada.",
      },

      alerts: {
        confirmTitle: "Confirmar Suscripción",
        confirmMessage:
          "Estás a punto de suscribirte al plan {{plan}} por {{price}}.\n\nNOTA: Este es un modo de demostración. En producción, serás redirigido a Google Play para confirmar la compra.",
        welcomeTitle: "¡Bienvenido a Premium!",
        welcomeMessage: "Ahora tienes acceso a todas las funciones premium.",
        cancelTitle: "Cancelar Suscripción",
        cancelMessage:
          "¿Estás seguro de que deseas cancelar tu suscripción Premium? Perderás acceso a las funciones premium.",
        demoDisclaimer:
          "* Modo de demostración. En producción, el cobro se realizará vía Google Play.",
        ok: "OK",
      },
    },
    profile: {
      title: "Perfil",

      header: {
        defaultUser: "Usuario",
        userPhoto: "Foto del usuario",
      },

      accountInfo: {
        title: "Información de la Cuenta",
        name: "Nombre",
        email: "Correo electrónico",
        userId: "ID de Usuario",
        notInformed: "No informado",
      },

      menu: {
        title: "Menú",
        editProfile: "Editar Perfil",
        goals: "Metas Financieras",
        budget: "Presupuesto Mensual",
        settings: "Configuraciones",
        backup: "Copia de Seguridad",
        premium: "Actualizar a Premium",
        support: "Soporte",
      },

      actions: {
        logout: "Cerrar sesión",
      },

      alerts: {
        logoutTitle: "Cerrar sesión",
        logoutMessage: "¿Seguro que deseas cerrar sesión?",
        cancel: "Cancelar",
        confirm: "Salir",
      },

      version: "Versión {{version}}",
    },

    settings: {
      title: "Configuración",
      subtitle: "Personaliza tu aplicación",

      appearance: "Apariencia",
      darkMode: "Modo Oscuro",
      darkModeDesc: "Tema oscuro para ahorrar batería",

      regionCurrency: "Región y Moneda",
      currency: "Moneda",
      language: "Idioma",

      notifications: "Notificaciones",
      notificationsEnabled: "Notificaciones Activadas",
      notificationsEnabledDesc: "Activar o desactivar notificaciones",

      bills: "Recordatorio de Cuentas",
      billsDesc: "Avisar sobre cuentas próximas",

      tithe: "Recordatorio de Diezmo",
      titheDesc: "Recordar pagar el diezmo mensual",

      goals: "Alertas de Metas",
      goalsDesc: "Progreso y logros",

      daily: "Recordatorio Diario",
      dailyDesc: "Recordar registrar gastos diarios",

      notificationTime: "Horario de Notificaciones",
      notificationTimeDesc: "Definir horario predeterminado",

      others: "Otros",
      about: "Sobre la App",
      aboutDesc: "Versión, licencias y créditos",

      reset: "Restablecer Configuración",
      resetDesc: "Restaurar configuración predeterminada",

      timeTitle: "Definir Horario",
      saveTitle: "Guardar Horario",

      save: "Guardar",
      cancel: "Cancelar",
      close: "Cerrar",

      selectLanguage: "Seleccionar Idioma",
      selectCurrency: "Seleccionar Moneda",

      languageChanged: "Idioma Cambiado",
      languageRestart: "El idioma se aplicará al reiniciar la app",

      resetConfirmTitle: "Restablecer Configuración",
      resetConfirmDesc:
        "Esto restaurará la configuración predeterminada. ¿Continuar?",
      success: "Éxito",
      resetSuccess: "¡Configuración restaurada!",

      footer: {
        appName: "Financial Control v1.0.0",
        madeWithPrefix: "Built with",
        madeWithSuffix: "in React Native",
      },
    },
    supportCreateTicket: {
      header: {
        title: "Enviar Ticket",
        subtitle: "Describe tu problema o duda",
      },

      form: {
        subject: "Asunto",
        subjectPlaceholder: "Ej: Problema al agregar ingreso",

        category: "Categoría",
        priority: "Prioridad",
        description: "Descripción",
        descriptionPlaceholder: "Describe detalladamente tu problema o duda...",
        charCount: "{{count}} caracteres (mínimo 20)",
      },

      categories: {
        income: {
          salario: "Salario",
          freelance: "Freelance",
          investimentos: "Rendimiento de Inversiones",
          bonus: "Bonificación",
          presente: "Regalo",
          venda: "Venta",
          aluguel: "Alquiler",
          outros: "Otros",
        },
        expense: {
          alimentacao: "Alimentación",
          transporte: "Transporte",
          moradia: "Vivienda",
          saude: "Salud",
          educacao: "Educación",
          lazer: "Ocio",
          vestuario: "Ropa",
          contas: "Facturas y Servicios",
          mercado: "Supermercado",
          combustivel: "Combustible",
          telefone: "Teléfono/Internet",
          streaming: "Streaming",
          academia: "Gimnasio",
          pet: "Mascota",
          outros: "Otros",
        },
        investment: {
          poupanca: "Ahorros",
          cdb: "CDB",
          tesouro: "Bonos del Tesoro",
          acoes: "Acciones",
          fundos: "Fondos de Inversión",
          cripto: "Criptomonedas",
          outros: "Otros",
        },
        offering: {
          dizimo: "Diezmo",
          oferta: "Ofrenda",
          missoes: "Misiones",
          construcao: "Construcción",
          caridade: "Caridad",
          outros: "Otros",
        },
      },

      priorities: {
        low: "Baja",
        medium: "Media",
        high: "Alta",
      },

      tips: {
        title: "Consejos para un buen ticket:",
        items: [
          "• Sé específico sobre el problema",
          "• Indica cuándo ocurrió el error",
          "• Describe los pasos para reproducirlo",
          "• Incluye mensajes de error si existen",
        ],
      },

      actions: {
        submit: "Enviar Ticket",
        viewTicket: "Ver Ticket",
        ok: "OK",
      },

      alerts: {
        error: "Error",
        subjectRequired: "Por favor, indica el asunto",
        descriptionRequired: "Describe tu problema o duda",
        descriptionMin: "La descripción debe tener al menos 20 caracteres",

        successTitle: "¡Ticket creado!",
        successMessage:
          "Hemos recibido tu solicitud. Nuestro equipo responderá pronto.",

        createError: "No fue posible crear el ticket. Inténtalo nuevamente.",
      },
    },
    faqScreen: {
      title: "Preguntas Frecuentes",
      subtitle: "Encuentra respuestas rápidas",

      searchPlaceholder: "Buscar pregunta...",

      categories: {
        all: "Todas",
      },

      empty: {
        title: "No se encontraron preguntas",
        subtitle: "Intenta buscar con otras palabras",
      },

      footer: {
        title: "¿No encontraste lo que buscabas?",
        subtitle: "Contáctanos a través del formulario de soporte",
      },
    },
    supportScreen: {
      header: {
        title: "Centro de Soporte",
        subtitle: "¿Cómo podemos ayudarte?",
      },

      options: {
        faq: {
          title: "Centro de Ayuda (FAQ)",
          subtitle: "Respuestas rápidas a preguntas frecuentes",
        },
        ticket: {
          title: "Enviar Ticket",
          subtitle: "Habla directamente con nuestro equipo",
        },
        tutorials: {
          title: "Tutoriales",
          subtitle: "Aprende a usar todas las funcionalidades",
        },
      },

      myTickets: {
        title: "Mis Tickets",
        emptyTitle: "No hay tickets abiertos",
        emptySubtitle: "Envía un ticket si necesitas ayuda",

        open: "Abiertos",
        recentlyResolved: "Resueltos Recientemente",

        viewAll: "Ver todos ({{count}})",
      },

      ticketStatus: {
        open: "Abierto",
        in_progress: "En Progreso",
        resolved: "Resuelto",
        closed: "Cerrado",
      },

      contact: {
        title: "¿Necesitas ayuda inmediata?",
        description:
          "Nuestro equipo está disponible de lunes a viernes, de 9h a 18h.",
        whatsapp: "WhatsApp",
        email: "Correo electrónico",
        errorTitle: "Error",
        errorOpenLink: "No se pudo abrir {{name}}",
      },

      info: {
        title: "Información",
        text:
          "• Tiempo promedio de respuesta: 24 horas\n" +
          "• Soporte disponible en portugués\n" +
          "• Todas las conversaciones son confidenciales\n" +
          "• Los usuarios Premium tienen atención prioritaria",
      },
    },
    ticketDetailsScreen: {
      errors: {
        notFoundTitle: "Error",
        notFoundMessage: "Ticket no encontrado",
        sendMessage: "No se pudo enviar el mensaje",
      },

      closeTicket: {
        title: "Cerrar Ticket",
        message:
          "¿Deseas cerrar este ticket? Podrás abrir uno nuevo si lo necesitas.",
        cancel: "Cancelar",
        confirm: "Cerrar",
      },

      rating: {
        prompt: "Evalúa nuestro servicio",
        title: "¿Cómo fue nuestra atención?",
        placeholder: "Comentario (opcional)",
        submit: "Enviar Evaluación",
        alertTitle: "Atención",
        alertMessage: "Por favor selecciona una calificación",
        successTitle: "¡Gracias!",
        successMessage: "Tu evaluación fue registrada con éxito.",
        rated: "Tu calificación:",
      },

      status: {
        open: "Abierto",
        in_progress: "En Progreso",
        resolved: "Resuelto",
        closed: "Cerrado",
      },

      actions: {
        closeTicket: "Cerrar Ticket",
        send: "Enviar",
      },

      input: {
        messagePlaceholder: "Escribe tu mensaje...",
      },
    },
    ticketListScreen: {
      header: {
        title: "Mis Tickets",
        subtitle: "{{count}} {{count, plural, one {ticket} other {tickets}}}",
      },

      filters: {
        all: "Todos",
        open: "Abiertos",
        in_progress: "En Progreso",
        resolved: "Resueltos",
        closed: "Cerrados",
      },

      status: {
        open: "Abierto",
        in_progress: "En Progreso",
        resolved: "Resuelto",
        closed: "Cerrado",
      },

      date: {
        today: "Hoy",
        yesterday: "Ayer",
        daysAgo: "Hace {{count}} días",
      },

      loading: {
        text: "Cargando tickets...",
      },

      empty: {
        title: "No se encontraron tickets",
        allSubtitle: "Crea tu primer ticket de soporte",
        filteredSubtitle: "No hay tickets {{status}}",
      },

      actions: {
        create: "Crear Ticket",
      },
    },
    tutorialsScreen: {
      header: {
        title: "Tutoriales",
        subtitle: "Aprende a usar todas las funcionalidades",
      },

      footer: {
        title: "¿Aún tienes dudas?",
        text: "Visita nuestro Centro de Ayuda (FAQ) o envía un ticket de soporte. ¡Estamos aquí para ayudarte!",
      },

      categories: [
        {
          id: "1",
          category: "Primeros Pasos",
          icon: "rocket-launch",
          items: [
            {
              title: "Cómo crear tu primera transacción",
              steps: [
                'Ve a la pestaña "Transacciones" en el menú inferior',
                'Toca el botón "+"',
                "Elige el tipo: Ingreso, Gasto, Inversión u Oferta",
                "Completa la descripción, monto y fecha",
                "Selecciona una categoría",
                'Toca "Guardar"',
              ],
            },
            {
              title: "Entendiendo el Dashboard",
              steps: [
                "La tarjeta de saldo muestra tu balance actual",
                "Los ingresos aparecen en verde (+)",
                "Los gastos aparecen en rojo (-)",
                "El gráfico circular muestra gastos por categoría",
                "Las últimas transacciones aparecen abajo",
                "La tarjeta de diezmo muestra el valor sugerido (10% de los ingresos)",
              ],
            },
          ],
        },

        {
          id: "2",
          category: "Funciones Principales",
          icon: "settings",
          items: [
            {
              title: "Creando metas financieras",
              steps: [
                "Ve a Planificación → Metas",
                'Toca "+" para crear una nueva meta',
                "Define el nombre de la meta",
                "Ingresa el monto objetivo",
                "Elige una fecha límite",
                "Sigue el progreso",
              ],
            },
          ],
        },

        {
          id: "5",
          category: "Premium",
          icon: "star",
          items: [
            {
              title: "Funciones Premium",
              steps: [
                "Informes anuales completos",
                "Comparación entre períodos",
                "Proyecciones de gastos futuros",
                "Copias de seguridad ilimitadas",
                "Exportación de datos",
                "Sin anuncios",
                "Soporte prioritario",
              ],
            },
          ],
        },
      ],
    },
    addExpense: {
      title: "Agregar Gasto",

      form: {
        description: {
          label: "Descripción",
          placeholder: "Ej: Supermercado, factura de luz...",
          required: "La descripción es obligatoria",
        },
        amount: {
          label: "Monto",
          placeholder: "0,00",
          invalid: "El monto debe ser mayor que cero",
        },
        date: {
          label: "Fecha",
          placeholder: "DD/MM/AAAA",
          invalid: "Fecha inválida",
        },
        category: {
          label: "Categoría",
          required: "Selecciona una categoría",
        },
        recurring: {
          label: "Gasto recurrente",
          description: "Marca si este gasto se repite mensualmente",
        },
      },

      actions: {
        save: "Guardar Gasto",
        cancel: "Cancelar",
      },

      alerts: {
        sessionExpired: {
          title: "Sesión expirada",
          message: "Inicia sesión nuevamente.",
        },
        success: {
          title: "¡Éxito!",
          message: "Gasto agregado correctamente!",
        },
        error: {
          title: "Error",
          generic: "Error al agregar el gasto",
          save: "No se pudo agregar el gasto",
        },
      },
    },
    addIncome: {
      title: "Agregar Ingreso",

      loading: "Cargando...",

      form: {
        description: {
          label: "Descripción",
          placeholder: "Ej: Salario, Freelance, Bono...",
          required: "La descripción es obligatoria",
        },
        amount: {
          label: "Monto",
          placeholder: "0,00",
          invalid: "El monto debe ser mayor que cero",
        },
        date: {
          label: "Fecha",
          placeholder: "DD/MM/AAAA",
          invalid: "Fecha inválida",
        },
        category: {
          label: "Categoría",
          required: "Selecciona una categoría",
        },
        recurring: {
          label: "Ingreso recurrente",
          description: "Marca si este ingreso se repite mensualmente",
        },
      },

      actions: {
        save: "Guardar Ingreso",
        cancel: "Cancelar",
      },

      alerts: {
        sessionExpired: {
          title: "Sesión expirada",
          message: "Inicia sesión nuevamente.",
        },
        success: {
          title: "¡Éxito!",
          message: "Ingreso agregado correctamente!",
        },
        error: {
          title: "Error",
          generic: "Error al agregar el ingreso",
          save: "No se pudo agregar el ingreso",
        },
      },
    },
    addInvestment: {
      title: "Nueva Inversión",
      subtitle: "Registra tus inversiones y sigue los rendimientos",

      form: {
        description: {
          label: "Descripción",
          placeholder: "Ej: CDB Banco X, Acciones...",
          required: "La descripción es obligatoria",
        },
        amount: {
          label: "Monto Invertido",
          placeholder: "0,00",
          invalid: "El monto debe ser mayor que cero",
        },
        profitability: {
          label: "Rentabilidad (% anual) - Opcional",
          placeholder: "Ej: 10.5",
        },
        date: {
          label: "Fecha de Inversión",
          placeholder: "DD/MM/AAAA",
          invalid: "Fecha inválida",
        },
        category: {
          label: "Tipo de Inversión",
          required: "Selecciona un tipo de inversión",
        },
      },

      info: {
        estimatedReturn:
          "Con {{profitability}}% anual, el rendimiento estimado en 12 meses será aproximadamente {{value}}",
      },

      actions: {
        save: "Guardar Inversión",
        cancel: "Cancelar",
      },

      alerts: {
        sessionExpired: {
          title: "Sesión expirada",
          message: "Inicia sesión nuevamente.",
        },
        success: {
          title: "¡Éxito!",
          message: "¡Inversión agregada correctamente!",
        },
        error: {
          title: "Error",
          generic: "Error al agregar la inversión",
          save: "No se pudo agregar la inversión",
        },
      },
    },
    addOffer: {
      title: "Registrar Ofrenda",
      subtitle: "Contribuye a la obra de Dios",

      form: {
        description: {
          label: "Descripción",
          placeholder: "Ej: Diezmo Diciembre, Ofrenda de Misiones...",
          required: "La descripción es obligatoria",
        },
        amount: {
          label: "Monto",
          placeholder: "0,00",
          invalid: "El monto debe ser mayor que cero",
        },
        churchName: {
          label: "Nombre de la Iglesia (Opcional)",
          placeholder: "Ej: Iglesia Bautista Central",
        },
        date: {
          label: "Fecha",
          placeholder: "DD/MM/AAAA",
          invalid: "Fecha inválida",
        },
        category: {
          label: "Tipo de Ofrenda",
          required: "Selecciona un tipo de ofrenda",
        },
      },

      info: {
        tithe:
          "El diezmo es el 10% de tus ingresos. Puedes usar la calculadora de diezmo para calcular el monto automáticamente.",
      },

      actions: {
        save: "Registrar Ofrenda",
        cancel: "Cancelar",
      },

      alerts: {
        sessionExpired: {
          title: "Sesión expirada",
          message: "Inicia sesión nuevamente.",
        },
        success: {
          title: "¡Éxito!",
          message: "¡Ofrenda registrada correctamente!",
        },
        error: {
          title: "Error",
          generic: "Error al registrar la ofrenda",
          save: "No se pudo registrar la ofrenda",
        },
      },
    },
    investmentsList: {
      totalInvested: "Total Invertido",
      estimatedReturn: "Rendimiento Estimado",
      totalAssets: "Activos Totales",
      myInvestments: "Mis Inversiones",
      invested: "Invertido:",
      profitability: "Rentabilidad:",
      earnings: "Ganancias:",
      currentValue: "Valor Actual:",
      appliedOn: "Aplicado el {{date}}",
      noInvestments: "Ninguna inversión registrada",
      addFirst: "Registra tu primera inversión",
      emptySubtext: "Comienza a invertir y controla tus rendimientos",
      addButton: "Agregar Inversión",
      perYear: "% a.a.",
    },
    transactionsNavigator: {
      titleTransactions: "Transacciones",
      title: "Transacciones",
      subtitle: "Elige una acción:",
      addIncome: "Agregar Ingreso",
      addExpense: "Agregar Gasto",
      addOffer: "Agregar Ofrenda",
      registerOffer: "Registrar Ofrenda",
      titheCalculator: "Calculadora de Diezmo",
      myInvestments: "Mis Inversiones",
      addInvestment: "Agregar Inversión",
      investmentsList: "Inversiones",
      transactionDetail: "Detalles de la Transacción",
    },
    tithe: {
      header: "Calculadora de Diezmo",
      verse: 'Malaquías 3:10 - "Traigan todo el diezmo al tesorería"',
      modeMonth: "Diezmo del Mes",
      modeCustom: "Cantidad Personalizada",
      calculationAuto: "Cálculo Automático",
      monthIncome: "Ingresos del mes:",
      tithePercent: "Diezmo (10%):",
      returned: "Devuelto:",
      remaining: "Restante:",
      returnedBadge: "¡Diezmo devuelto!",
      emptyState:
        "Agrega tus ingresos del mes para calcular automáticamente el diezmo",
      customCard: "Calcular Cantidad Personalizada",
      customCardSubtitle: "Ingresa el valor de ingresos para calcular el 10%",
      incomeLabel: "Valor de Ingresos",
      registerButton: "Registrar Diezmo",
      registerAmount: "Registrar {{amount}}",
      historyTitle: "Historial de Diezmos",
      confirmTitle: "Registrar Diezmo",
      confirmMessage: "¿Registrar {{amount}} como diezmo de {{monthYear}}?",
      confirmCustomMessage: "¿Registrar {{amount}} como diezmo?",
      confirmDescription: "Diezmo {{monthYear}}",
      confirmCustomDescription: "Diezmo personalizado",
      warningNoIncomeTitle: "Advertencia",
      warningNoIncomeMessage: "No tienes ingresos registrados en este mes.",
      errorInvalidAmount: "Ingresa una cantidad válida",
      successTitle: "Éxito!",
      successMessage: "¡Diezmo registrado correctamente!",
      errorTitle: "Error",
      errorGeneric: "Error al registrar diezmo",
      errorSave: "No se pudo registrar el diezmo",
      cancelButton: "Cancelar",
      confirmButton: "Registrar",
    },
    transactionDetail: {
      notFound: "Transacci\u00f3n no encontrada",
      updateSuccess: "\u00a1Transacci\u00f3n actualizada correctamente!",
      deleteSuccess: "\u00a1Transacci\u00f3n eliminada correctamente!",
      updateError: "Error al actualizar la transacci\u00f3n",
      deleteError: "Error al eliminar la transacci\u00f3n",
      updateFailed: "No se pudo actualizar la transacci\u00f3n",
      deleteFailed: "No se pudo eliminar la transacci\u00f3n",
      deleteConfirmTitle: "Eliminar Transacci\u00f3n",
      deleteConfirm:
        "?Est\u00e1s seguro de que deseas eliminar esta transacci\u00f3n? Esta acci\u00f3n no se puede deshacer.",
      descriptionLabel: "Descripci\u00f3n",
      amountLabel: "Monto",
      dateLabel: "Fecha",
      placeholders: { date: "DD/MM/AAAA" },
      categoryLabel: "Categor\u00eda",
      recurringLabel: "Transacci\u00f3n recurrente",
      recurringDescription:
        "Marca si esta transacci\u00f3n se repite mensualmente",
      saveButton: "Guardar Cambios",
      cancelButton: "Cancelar",
      editButton: "Editar Transacci\u00f3n",
      deleteButton: "Eliminar Transacci\u00f3n",
      yesText: "S\u00ed",
      noText: "No",
      successTitle: "Éxito!",
      errorTitle: "Error",
      deleteButtonAction: "Eliminar",
      validation: {
        descriptionRequired: "La descripción es obligatoria",
        amountInvalid: "El monto debe ser mayor que cero",
        categoryRequired: "Seleccione una categoría",
      },
    },
    tabNavigator: {
      home: "Inicio",
      transactions: "Transacciones",
      reports: "Reportes",
      profile: "Perfil",
    },
    supportNavigator: {
      faq: "Preguntas Frecuentes",
      newTicket: "Nuevo Ticket",
      ticketDetails: "Detalles del Ticket",
      myTickets: "Mis Tickets",
      tutorials: "Tutoriales",
    },
    reportsNavigator: {
      reports: "Reportes",
      history: "Historial",
      advancedReports: "Reportes Avanzados",
    },
    planningNavigator: {
      goals: "Metas Financieras",
      newGoal: "Nueva Meta",
      goalDetails: "Detalles de la Meta",
      monthlyBudget: "Presupuesto Mensual",
      createBudget: "Crear Presupuesto",
      editBudget: "Editar Presupuesto",
    },
    categories: {
      income: {
        salary: "Salario",
        freelance: "Freelance",
        investments: "Rendimiento de Inversiones",
        bonus: "Bonificación",
        gift: "Regalo",
        sale: "Venta",
        rent: "Alquiler",
        others: "Otros",
      },
      expense: {
        food: "Alimentación",
        transport: "Transporte",
        housing: "Vivienda",
        health: "Salud",
        education: "Educación",
        leisure: "Ocio",
        clothing: "Ropa",
        bills: "Facturas y Servicios",
        market: "Groceries",
        fuel: "Combustible",
        phone: "Teléfono/Internet",
        streaming: "Streaming",
        gym: "Gimnasio",
        pet: "Mascota",
        others: "Otros",
      },
      investment: {
        savings: "Ahorros",
        cdb: "CDB",
        treasury: "Tesorería Directa",
        stocks: "Acciones",
        funds: "Fondos de Inversión",
        crypto: "Criptomonedas",
        others: "Otros",
      },
      offering: {
        tithe: "Diezmo",
        offering: "Ofrenda",
        missions: "Misiones",
        construction: "Construcción",
        charity: "Caridad",
        others: "Otros",
      },
    },
    faq: {
      categories: {
        all: "Todas",
        popular: "Populares",
        general: "General",
        tithe: "Diezmo",
        investments: "Inversiones",
        goals: "Metas",
        planning: "Planificación",
        premium: "Premium",
        backup: "Copia de Seguridad",
        account: "Cuenta",
      },
      items: [
        {
          id: "1",
          category: "General",
          question: "¿Cómo crear mi primer ingreso?",
          answer:
            'Para crear un ingreso, ve a la pantalla principal y toca el botón "+" o "Nuevo Ingreso". Completa el monto, categoría, fecha y descripción. ¡Luego solo guarda!',
          popular: true,
        },
        {
          id: "2",
          category: "General",
          question: "¿Cómo agregar un gasto?",
          answer:
            'En la pantalla principal, toca el botón "+" o "Nuevo Gasto". Elige una categoría, ingresa el monto, fecha y descripción. También puedes marcarlo como gasto recurrente si se repite cada mes.',
          popular: true,
        },
        {
          id: "3",
          category: "Diezmo",
          question: "¿Cómo funciona el cálculo del diezmo?",
          answer:
            "El diezmo se calcula automáticamente como el 10% de tus ingresos. Puedes acceder a la Calculadora de Diezmos en el menú para ver cuánto debes dar según tus ingresos mensuales.",
          popular: true,
        },
        {
          id: "4",
          category: "Diezmo",
          question: "¿Puedo registrar ofrendas además del diezmo?",
          answer:
            '¡Sí! Además del diezmo, puedes registrar ofrendas para misiones, construcción, ayuda humanitaria y otras causas. Solo ve a "Ofrendas" y registra cada donación por separado.',
          popular: false,
        },
        {
          id: "5",
          category: "Inversiones",
          question: "¿Cómo agrego mis inversiones?",
          answer:
            'Ve a "Inversiones" en el menú y haz clic en "Nueva Inversión". Elige el tipo (ahorros, acciones, CDB, etc.), monto invertido, fecha y retorno esperado. La aplicación calculará tus ganancias.',
          popular: false,
        },
        {
          id: "6",
          category: "Metas",
          question: "¿Cómo creo una meta financiera?",
          answer:
            'Ve a "Metas" en el menú y toca "Nueva Meta". Establece el nombre (ej: Auto Nuevo), monto objetivo, fecha límite y cuánto ya has ahorrado. La aplicación mostrará tu progreso.',
          popular: true,
        },
        {
          id: "7",
          category: "Planificación",
          question: "¿Cómo funciona el presupuesto mensual?",
          answer:
            'En "Planificación", estableces cuánto deseas gastar por categoría cada mes. La aplicación rastrea tus gastos y te alerta cuando te acercas al límite. ¡Esto te ayuda a controlar mejor tus gastos!',
          popular: false,
        },
        {
          id: "8",
          category: "Premium",
          question: "¿Cuáles son los beneficios de la versión Premium?",
          answer:
            "Premium ofrece: reportes avanzados, exportación en PDF/Excel, comparativas entre períodos, proyecciones futuras, análisis de tendencias, copia de seguridad automática y soporte prioritario.",
          popular: true,
        },
        {
          id: "9",
          category: "Copia de Seguridad",
          question: "¿Están seguros mis datos?",
          answer:
            "¡Sí! Tus datos se almacenan encriptados en Firebase. Puedes hacer copias de seguridad manuales o automáticas y restaurar en cualquier dispositivo. Solo tú puedes acceder a tus datos.",
          popular: false,
        },
        {
          id: "10",
          category: "Cuenta",
          question: "¿Cómo cambio mi contraseña?",
          answer:
            'Ve a "Perfil" > "Configuración" > "Cambiar Contraseña". Ingresa tu contraseña actual y la nueva contraseña dos veces. También puedes usar "Olvidé mi contraseña" en la pantalla de inicio para restablecerla.',
          popular: false,
        },
        {
          id: "11",
          category: "Cuenta",
          question: "¿Puedo usarlo en más de un dispositivo?",
          answer:
            '¡Sí! Inicia sesión con la misma cuenta en cualquier dispositivo. Usa la función "Sincronizar Dispositivos" en Copia de Seguridad para asegurar que todos los datos estén actualizados.',
          popular: false,
        },
        {
          id: "12",
          category: "General",
          question: "¿Cómo elimino una transacción?",
          answer:
            'En el historial de transacciones, desliza la transacción hacia un lado o tócala y elige "Eliminar". También puedes editar los datos si cometiste un error.',
          popular: false,
        },
      ],
    },
    settingsNavigator: {
      profile: "Perfil",
      editProfile: "Editar Perfil",
      premium: "Premium",
      backup: "Copia de Seguridad",
    },
  },
};

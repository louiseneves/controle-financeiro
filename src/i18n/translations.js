export const translations = {
 
  'pt-BR': {
    login: {
  title: 'Controle',
  titleHighlight: 'Financeiro',
  subtitle: 'Faça login para continuar',

  email: 'Email',
  emailPlaceholder: 'seu@email.com',
  password: 'Senha',

  forgotPassword: 'Esqueci minha senha',
  loginButton: 'Entrar',

  or: 'ou',

  noAccount: 'Não tem uma conta?',
  register: 'Cadastre-se',

  errors: {
    emailRequired: 'Email é obrigatório',
    emailInvalid: 'Email inválido',
    passwordRequired: 'Senha é obrigatória',
    passwordMin: 'Senha deve ter no mínimo 6 caracteres',
  },

  alerts: {
    successTitle: 'Sucesso!',
    successMessage: 'Login realizado com sucesso!',
    errorTitle: 'Erro',
    loginError: 'Erro ao fazer login',
    unexpectedError: 'Erro inesperado ao fazer login',
  },
    },
  register: {
    "title": "Criar Conta",
    "subtitle": "Preencha os dados para começar",
    "name": "Nome Completo",
    "namePlaceholder": "João Silva",
    "email": "Email",
    "emailPlaceholder": "seu@email.com",
    "password": "Senha",
    "passwordPlaceholder": "Mínimo 6 caracteres",
    "confirmPassword": "Confirmar Senha",
    "confirmPasswordPlaceholder": "Digite a senha novamente",
    "button": "Cadastrar",
    "alreadyAccount": "Já tem uma conta?",
    "login": "Faça login",

    "successTitle": "Sucesso!",
    "successMessage": "Cadastro realizado com sucesso!",
    "errorTitle": "Erro",
    "errorGeneric": "Erro ao fazer cadastro",

    "errors": {
      "nameRequired": "Nome é obrigatório",
      "nameMin": "Nome deve ter no mínimo 3 caracteres",
      "emailRequired": "Email é obrigatório",
      "emailInvalid": "Email inválido",
      "passwordRequired": "Senha é obrigatória",
      "passwordMin": "Senha deve ter no mínimo 6 caracteres",
      "confirmPasswordRequired": "Confirme sua senha",
      "passwordMismatch": "As senhas não coincidem"
    }
    },
  forgotPassword: {
  title: 'Recuperar Senha',
  subtitleDefault: 'Digite seu email para receber as instruções',
  subtitleSent: 'Email enviado com sucesso!',

  emailLabel: 'Email',
  emailPlaceholder: 'seu@email.com',

  sendButton: 'Enviar Email de Recuperação',
  backToLogin: '← Voltar para o login',

  successTitle: 'Email Enviado! ✅',
  successMessage:
    'Verifique sua caixa de entrada para redefinir sua senha.',

  successInfo: 'Enviamos um link de recuperação para:',
  instructions: 'Verifique sua caixa de entrada e spam.',

  backLoginButton: 'Voltar para o Login',
  resend: 'Não recebeu? Enviar novamente',

  errors: {
    required: 'Email é obrigatório',
    invalid: 'Email inválido',
    sendError: 'Erro ao enviar email',
  },
    },
  home: {
    "greeting": "Olá!",
    "lastTransactions": "Últimas Transações",
    "seeAll": "Ver todas",
    "emptyTitle": "Nenhuma transação ainda",
    "emptySubtitle": "Use as ações rápidas para adicionar"
    },
  balance: {
  title: 'Saldo Atual',
  income: 'Receitas',
  expense: 'Despesas',
    },
  quickActions: {
  title: 'Ações Rápidas',
  income: 'Receita',
  expense: 'Despesa',
  investment: 'Investimento',
  offer: 'Oferta',
    },
  incomeExpenseChart: {
  title: 'Receitas vs Despesas',
  income: 'Receitas',
  expense: 'Despesas',
  empty: 'Sem transações neste mês',
},
titheCard: {
  title: 'Dízimo do Mês',
  paidBadge: '✓ Devolvido',

  expected: 'Esperado (10%)',
  paid: 'Devolvido',
  remaining: 'Restante',

  action: 'Toque para registrar oferta',
},
transaction: {
  income: 'Receita',
  expense: 'Despesa',
  investment: 'Investimento',
  offering: 'Oferta',
},

  addGoal: {
    title: 'Nova Meta Financeira',
    subtitle: 'Defina seus objetivos e acompanhe seu progresso',
    fields: {
      title: 'Título da Meta',
      targetAmount: 'Valor Alvo',
      initialAmount: 'Valor Inicial (Opcional)',
      deadline: 'Data Limite',
      icon: 'Ícone da Meta'
    },
    placeholders: {
      title: 'Ex: Viagem para Europa, Carro Novo...',
      date: 'DD/MM/AAAA'
    },
    preview: 'Preview da Meta',
    previewDefault: 'Sua meta',
    actions: {
      create: 'Criar Meta'
    },
    errors: {
      titleRequired: 'Título é obrigatório',
      targetAmountInvalid: 'Valor alvo deve ser maior que zero',
      deadlineInvalid: 'Data limite inválida',
      deadlineFuture: 'Data limite deve ser futura'
    },
    success: 'Meta criada com sucesso!',
    error: 'Erro ao criar meta',
    errorGeneric: 'Não foi possível criar a meta'
  },
goalDetail: {
  completed: '✓ Meta Alcançada!',
  daysRemaining: '{{count}} dias restantes',
  todayDeadline: 'Hoje é o prazo!',
  late: 'Atrasado {{count}} dias',

  progress: 'Progresso',

  amounts: {
    current: 'Atual',
    target: 'Meta',
    remaining: 'Faltam',
  },

  details: 'Detalhes',
  createdAt: 'Data de Criação:',
  deadline: 'Data Limite:',
  targetAmount: 'Valor Alvo:',

  addTitle: 'Adicionar à Meta',
  addLabel: 'Valor',

  delete: 'Excluir Meta',
  deleteConfirmTitle: 'Excluir Meta',
  deleteConfirmMessage: 'Tem certeza que deseja excluir esta meta?',

  alerts: {
    invalidValue: 'Digite um valor válido',
    successAdd: '{{amount}} adicionado à meta!',
    deleteSuccess: 'Meta excluída com sucesso!',
    error: 'Erro',
    addError: 'Não foi possível adicionar o valor',
  },
},
goals: {
  title: 'Metas',
  active: 'Metas Ativas',
  completed: 'Concluídas',
  completedWithEmoji: 'Metas Concluídas 🎉',

  summary: {
    active: 'Metas Ativas',
    completed: 'Concluídas',
  },

  deadline: {
    daysRemaining: '{{count}} dias restantes',
    today: 'Hoje é o prazo!',
    late: 'Atrasado {{count}} dias',
    achieved: 'Meta alcançada!',
  },

  progress: 'Progresso',

  empty: {
    title: 'Nenhuma meta criada',
    subtitle: 'Defina metas financeiras e acompanhe seu progresso',
  },

  actions: {
    create: 'Criar Nova Meta',
    deleteTitle: 'Excluir Meta',
    deleteConfirm: 'Tem certeza que deseja excluir esta meta?',
    deleteSuccess: 'Meta excluída com sucesso!',
    cancel: 'Cancelar',
    delete: 'Excluir',
  },
},
budget: {
  createTitle: 'Criar Orçamento Mensal',
  editTitle: 'Editar Orçamento',
  subtitle: 'Defina limites de gastos por categoria',

  total: 'Orçamento Total',

  quickFill: {
    title: 'Preenchimento Rápido',
    choose: 'Escolha uma opção:',
    equal: 'Distribuir Igualmente',
    suggested: 'Valores Sugeridos',
    cancel: 'Cancelar',
  },

  categoryTitle: 'Orçamento por Categoria',

  tip: {
    title: 'Dica',
    text:
      'Uma regra comum é: 50% para necessidades, 30% para desejos e 20% para poupança e investimentos.',
  },

  actions: {
    save: 'Salvar Alterações',
    create: 'Criar Orçamento',
    cancel: 'Cancelar',
  },

  alerts: {
    error: 'Erro',
    minRequired: 'Defina pelo menos um orçamento de categoria',
    successTitle: 'Sucesso! ✅',
    created: 'Orçamento criado!',
    updated: 'Orçamento atualizado!',
    saveError: 'Erro ao salvar orçamento',
    genericError: 'Não foi possível salvar o orçamento',
  },
},

    settings: {
      title: 'Configurações',
      subtitle: 'Personalize seu aplicativo',

      appearance: '🎨 Aparência',
      darkMode: 'Modo Escuro',
      darkModeDesc: 'Tema escuro para economizar bateria',

      regionCurrency: '🌍 Região e Moeda',
      currency: 'Moeda',
      language: 'Idioma',

      notifications: '🔔 Notificações',
      notificationsEnabled: 'Notificações Ativadas',
      notificationsEnabledDesc: 'Ativar/desativar todas as notificações',

      bills: 'Lembrete de Contas',
      billsDesc: 'Avisar sobre contas a vencer',

      tithe: 'Lembrete de Dízimo',
      titheDesc: 'Lembrar de pagar o dízimo mensalmente',

      goals: 'Avisos de Metas',
      goalsDesc: 'Progresso e conquistas de metas',

      daily: 'Lembrete Diário',
      dailyDesc: 'Lembrar de registrar gastos diários',

      notificationTime: 'Horário das Notificações',
      notificationTimeDesc: 'Definir horário padrão',

      others: '⚙️ Outros',
      about: 'Sobre o App',
      aboutDesc: 'Versão, licenças e créditos',

      reset: 'Resetar Configurações',
      resetDesc: 'Restaurar configurações padrão',

      timeTitle: 'Definir Horário',
      saveTitle: 'Salvar Horário',

      save: 'Salvar',
      cancel: 'Cancelar',
      close: 'Fechar',

      selectLanguage: 'Selecionar Idioma',
      selectCurrency: 'Selecionar Moeda',

      resetConfirmTitle: 'Resetar Configurações',
      resetConfirmDesc: 'Isso irá restaurar todas as configurações padrão. Deseja continuar?',
      success: 'Sucesso',
      resetSuccess: 'Configurações restauradas!',

      footer: 'Controle Financeiro v1.0.0\nDesenvolvido com ❤️ em React Native',
    },
  },

  'en-US': {
    login: {
  title: 'Financial',
  titleHighlight: 'Control',
  subtitle: 'Sign in to continue',

  email: 'Email',
  emailPlaceholder: 'your@email.com',
  password: 'Password',

  forgotPassword: 'Forgot password',
  loginButton: 'Sign In',

  or: 'or',

  noAccount: "Don't have an account?",
  register: 'Sign up',

  errors: {
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email',
    passwordRequired: 'Password is required',
    passwordMin: 'Password must be at least 6 characters',
  },

  alerts: {
    successTitle: 'Success!',
    successMessage: 'Login successful!',
    errorTitle: 'Error',
    loginError: 'Login failed',
    unexpectedError: 'Unexpected login error',
  },
    },
  register: {
    title: 'Create Account',
    subtitle: 'Fill in the details to get started',

    name: 'Full Name',
    namePlaceholder: 'John Doe',

    email: 'Email',
    emailPlaceholder: 'your@email.com',

    password: 'Password',
    passwordPlaceholder: 'Minimum 6 characters',

    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Enter the password again',

    button: 'Sign Up',

    alreadyAccount: 'Already have an account?',
    login: 'Log in',

    successTitle: 'Success!',
    successMessage: 'Account created successfully!',

    errorTitle: 'Error',
    errorGeneric: 'Error creating account',

    errors: {
      nameRequired: 'Name is required',
      nameMin: 'Name must be at least 3 characters',
      emailRequired: 'Email is required',
      emailInvalid: 'Invalid email',
      passwordRequired: 'Password is required',
      passwordMin: 'Password must be at least 6 characters',
      confirmPasswordRequired: 'Please confirm your password',
      passwordMismatch: 'Passwords do not match',
    },
    },
  forgotPassword: {
  title: 'Recover Password',
  subtitleDefault: 'Enter your email to receive instructions',
  subtitleSent: 'Email sent successfully!',

  emailLabel: 'Email',
  emailPlaceholder: 'your@email.com',

  sendButton: 'Send Recovery Email',
  backToLogin: '← Back to login',

  successTitle: 'Email Sent! ✅',
  successMessage:
    'Check your inbox to reset your password.',

  successInfo: 'We sent a recovery link to:',
  instructions: 'Check your inbox and spam folder.',

  backLoginButton: 'Back to Login',
  resend: 'Didn’t receive it? Send again',

  errors: {
    required: 'Email is required',
    invalid: 'Invalid email',
    sendError: 'Error sending email',
  },
    },
  home: {
    greeting: 'Hello!',
    lastTransactions: 'Latest Transactions',
    seeAll: 'See all',
    emptyTitle: 'No transactions yet',
    emptySubtitle: 'Use quick actions to add one'
  },
  balance: {
  title: 'Current Balance',
  income: 'Income',
  expense: 'Expenses',
},
quickActions: {
  title: 'Quick Actions',
  income: 'Income',
  expense: 'Expense',
  investment: 'Investment',
  offer: 'Offering',
},
incomeExpenseChart: {
  title: 'Income vs Expenses',
  income: 'Income',
  expense: 'Expenses',
  empty: 'No transactions this month',
},
titheCard: {
  title: 'Monthly Tithe',
  paidBadge: '✓ Paid',

  expected: 'Expected (10%)',
  paid: 'Paid',
  remaining: 'Remaining',

  action: 'Tap to register offering',
},
transaction: {
  income: 'Income',
  expense: 'Expense',
  investment: 'Investment',
  offering: 'Offering',
},
  addGoal: {
    title: 'New Financial Goal',
    subtitle: 'Set your goals and track your progress',
    fields: {
      title: 'Goal Title',
      targetAmount: 'Target Amount',
      initialAmount: 'Initial Amount (Optional)',
      deadline: 'Deadline',
      icon: 'Goal Icon'
    },
    placeholders: {
      title: 'e.g. Trip to Europe, New Car...',
      date: 'MM/DD/YYYY'
    },
    preview: 'Goal Preview',
    previewDefault: 'Your goal',
    actions: {
      create: 'Create Goal'
    },
    errors: {
      titleRequired: 'Title is required',
      targetAmountInvalid: 'Target amount must be greater than zero',
      deadlineInvalid: 'Invalid deadline',
      deadlineFuture: 'Deadline must be in the future'
    },
    success: 'Goal created successfully!',
    error: 'Error creating goal',
    errorGeneric: 'Unable to create the goal'
  },
goalDetail: {
  completed: '✓ Goal Achieved!',
  daysRemaining: '{{count}} days remaining',
  todayDeadline: 'Deadline is today!',
  late: 'Late by {{count}} days',

  progress: 'Progress',

  amounts: {
    current: 'Current',
    target: 'Target',
    remaining: 'Remaining',
  },

  details: 'Details',
  createdAt: 'Created At:',
  deadline: 'Deadline:',
  targetAmount: 'Target Amount:',

  addTitle: 'Add to Goal',
  addLabel: 'Amount',

  delete: 'Delete Goal',
  deleteConfirmTitle: 'Delete Goal',
  deleteConfirmMessage: 'Are you sure you want to delete this goal?',

  alerts: {
    invalidValue: 'Enter a valid amount',
    successAdd: '{{amount}} added to the goal!',
    deleteSuccess: 'Goal deleted successfully!',
    error: 'Error',
    addError: 'Unable to add the amount',
  },
},
goals: {
  title: 'Goals',
  active: 'Active Goals',
  completed: 'Completed',
  completedWithEmoji: 'Completed Goals 🎉',

  summary: {
    active: 'Active Goals',
    completed: 'Completed',
  },

  deadline: {
    daysRemaining: '{{count}} days remaining',
    today: 'Deadline is today!',
    late: 'Late by {{count}} days',
    achieved: 'Goal achieved!',
  },

  progress: 'Progress',

  empty: {
    title: 'No goals created',
    subtitle: 'Set financial goals and track your progress',
  },

  actions: {
    create: 'Create New Goal',
    deleteTitle: 'Delete Goal',
    deleteConfirm: 'Are you sure you want to delete this goal?',
    deleteSuccess: 'Goal deleted successfully!',
    cancel: 'Cancel',
    delete: 'Delete',
  },
},
budget: {
  createTitle: 'Create Monthly Budget',
  editTitle: 'Edit Budget',
  subtitle: 'Set spending limits by category',

  total: 'Total Budget',

  quickFill: {
    title: 'Quick Fill',
    choose: 'Choose an option:',
    equal: 'Distribute Equally',
    suggested: 'Suggested Values',
    cancel: 'Cancel',
  },

  categoryTitle: 'Budget by Category',

  tip: {
    title: 'Tip',
    text:
      'A common rule is: 50% for needs, 30% for wants, and 20% for savings and investments.',
  },

  actions: {
    save: 'Save Changes',
    create: 'Create Budget',
    cancel: 'Cancel',
  },

  alerts: {
    error: 'Error',
    minRequired: 'Set at least one category budget',
    successTitle: 'Success! ✅',
    created: 'Budget created!',
    updated: 'Budget updated!',
    saveError: 'Error saving budget',
    genericError: 'Unable to save budget',
  },
},

    settings: {
      title: 'Settings',
      subtitle: 'Customize your app',

      appearance: '🎨 Appearance',
      darkMode: 'Dark Mode',
      darkModeDesc: 'Dark theme to save battery',

      regionCurrency: '🌍 Region & Currency',
      currency: 'Currency',
      language: 'Language',

      notifications: '🔔 Notifications',
      notificationsEnabled: 'Notifications Enabled',
      notificationsEnabledDesc: 'Enable or disable notifications',

      bills: 'Bills Reminder',
      billsDesc: 'Notify about upcoming bills',

      tithe: 'Tithe Reminder',
      titheDesc: 'Remind to pay monthly tithe',

      goals: 'Goals Alerts',
      goalsDesc: 'Progress and achievements',

      daily: 'Daily Reminder',
      dailyDesc: 'Remember to log daily expenses',

      notificationTime: 'Notification Time',
      notificationTimeDesc: 'Set default time',

      others: '⚙️ Others',
      about: 'About the App',
      aboutDesc: 'Version, licenses and credits',

      reset: 'Reset Settings',
      resetDesc: 'Restore default settings',

      timeTitle: 'Set Time',
      saveTitle: 'Save Time',

      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',

      selectLanguage: 'Select Language',
      selectCurrency: 'Select Currency',

      languageChanged: 'Language Changed',
      languageRestart: 'The language will be applied on next app restart',

      resetConfirmTitle: 'Reset Settings',
      resetConfirmDesc: 'This will restore all default settings. Continue?',
      success: 'Success',
      resetSuccess: 'Settings restored!',

      footer: 'Financial Control v1.0.0\nBuilt with ❤️ in React Native',
    },
  },

  'es-ES': {
    login: {
  title: 'Control',
  titleHighlight: 'Financiero',
  subtitle: 'Inicia sesión para continuar',

  email: 'Correo',
  emailPlaceholder: 'tu@correo.com',
  password: 'Contraseña',

  forgotPassword: 'Olvidé mi contraseña',
  loginButton: 'Ingresar',

  or: 'o',

  noAccount: '¿No tienes una cuenta?',
  register: 'Regístrate',

  errors: {
    emailRequired: 'El correo es obligatorio',
    emailInvalid: 'Correo inválido',
    passwordRequired: 'La contraseña es obligatoria',
    passwordMin: 'La contraseña debe tener al menos 6 caracteres',
  },

  alerts: {
    successTitle: 'Éxito!',
    successMessage: 'Inicio de sesión exitoso!',
    errorTitle: 'Error',
    loginError: 'Error al iniciar sesión',
    unexpectedError: 'Error inesperado al iniciar sesión',
  },
    },
  register: {
    title: 'Crear Cuenta',
    subtitle: 'Completa los datos para comenzar',

    name: 'Nombre Completo',
    namePlaceholder: 'Juan Pérez',

    email: 'Correo Electrónico',
    emailPlaceholder: 'tu@email.com',

    password: 'Contraseña',
    passwordPlaceholder: 'Mínimo 6 caracteres',

    confirmPassword: 'Confirmar Contraseña',
    confirmPasswordPlaceholder: 'Ingresa la contraseña nuevamente',

    button: 'Registrarse',

    alreadyAccount: '¿Ya tienes una cuenta?',
    login: 'Iniciar sesión',

    successTitle: '¡Éxito!',
    successMessage: 'Cuenta creada con éxito',

    errorTitle: 'Error',
    errorGeneric: 'Error al crear la cuenta',

    errors: {
      nameRequired: 'El nombre es obligatorio',
      nameMin: 'El nombre debe tener al menos 3 caracteres',
      emailRequired: 'El correo es obligatorio',
      emailInvalid: 'Correo inválido',
      passwordRequired: 'La contraseña es obligatoria',
      passwordMin: 'La contraseña debe tener al menos 6 caracteres',
      confirmPasswordRequired: 'Confirma tu contraseña',
      passwordMismatch: 'Las contraseñas no coinciden',
    },
    },
  forgotPassword: {
  title: 'Recuperar Contraseña',
  subtitleDefault: 'Ingresa tu correo para recibir instrucciones',
  subtitleSent: '¡Correo enviado con éxito!',

  emailLabel: 'Correo electrónico',
  emailPlaceholder: 'tu@email.com',

  sendButton: 'Enviar correo de recuperación',
  backToLogin: '← Volver al inicio de sesión',

  successTitle: '¡Correo Enviado! ✅',
  successMessage:
    'Revisa tu bandeja de entrada para restablecer tu contraseña.',

  successInfo: 'Enviamos un enlace de recuperación a:',
  instructions: 'Revisa tu bandeja de entrada y spam.',

  backLoginButton: 'Volver al Login',
  resend: '¿No lo recibiste? Enviar de nuevo',

  errors: {
    required: 'El correo es obligatorio',
    invalid: 'Correo inválido',
    sendError: 'Error al enviar el correo',
  },
    },
  home: {
    greeting: '¡Hola!',
    lastTransactions: 'Últimas transacciones',
    seeAll: 'Ver todas',
    emptyTitle: 'Aún no hay transacciones',
    emptySubtitle: 'Usa las acciones rápidas para agregar'
    },
  balance: {
  title: 'Saldo Actual',
  income: 'Ingresos',
  expense: 'Gastos',
},
quickActions: {
  title: 'Acciones Rápidas',
  income: 'Ingreso',
  expense: 'Gasto',
  investment: 'Inversión',
  offer: 'Ofrenda',
},
incomeExpenseChart: {
  title: 'Ingresos vs Gastos',
  income: 'Ingresos',
  expense: 'Gastos',
  empty: 'No hay transacciones este mes',
},
titheCard: {
  title: 'Diezmo del Mes',
  paidBadge: '✓ Entregado',

  expected: 'Esperado (10%)',
  paid: 'Entregado',
  remaining: 'Restante',

  action: 'Toca para registrar ofrenda',
},
transaction: {
  income: 'Ingreso',
  expense: 'Gasto',
  investment: 'Inversión',
  offering: 'Ofrenda',
},
  addGoal: {
    title: 'Nueva Meta Financiera',
    subtitle: 'Define tus objetivos y sigue tu progreso',
    fields: {
      title: 'Título de la Meta',
      targetAmount: 'Monto Objetivo',
      initialAmount: 'Monto Inicial (Opcional)',
      deadline: 'Fecha Límite',
      icon: 'Ícono de la Meta'
    },
    placeholders: {
      title: 'Ej: Viaje a Europa, Auto Nuevo...',
      date: 'DD/MM/AAAA'
    },
    preview: 'Vista Previa de la Meta',
    previewDefault: 'Tu meta',
    actions: {
      create: 'Crear Meta'
    },
    errors: {
      titleRequired: 'El título es obligatorio',
      targetAmountInvalid: 'El monto objetivo debe ser mayor que cero',
      deadlineInvalid: 'Fecha límite inválida',
      deadlineFuture: 'La fecha límite debe ser futura'
    },
    success: '¡Meta creada con éxito!',
    error: 'Error al crear la meta',
    errorGeneric: 'No se pudo crear la meta'
  },
goalDetail: {
  completed: '✓ Meta Alcanzada!',
  daysRemaining: '{{count}} días restantes',
  todayDeadline: '¡Hoy es la fecha límite!',
  late: 'Retrasado {{count}} días',

  progress: 'Progreso',

  amounts: {
    current: 'Actual',
    target: 'Meta',
    remaining: 'Faltan',
  },

  details: 'Detalles',
  createdAt: 'Fecha de Creación:',
  deadline: 'Fecha Límite:',
  targetAmount: 'Monto Objetivo:',

  addTitle: 'Agregar a la Meta',
  addLabel: 'Monto',

  delete: 'Eliminar Meta',
  deleteConfirmTitle: 'Eliminar Meta',
  deleteConfirmMessage: '¿Seguro que deseas eliminar esta meta?',

  alerts: {
    invalidValue: 'Ingresa un monto válido',
    successAdd: '{{amount}} agregado a la meta!',
    deleteSuccess: '¡Meta eliminada con éxito!',
    error: 'Error',
    addError: 'No se pudo agregar el monto',
  },
},
goals: {
  title: 'Metas',
  active: 'Metas Activas',
  completed: 'Completadas',
  completedWithEmoji: 'Metas Completadas 🎉',

  summary: {
    active: 'Metas Activas',
    completed: 'Completadas',
  },

  deadline: {
    daysRemaining: '{{count}} días restantes',
    today: '¡Hoy es la fecha límite!',
    late: 'Retrasado {{count}} días',
    achieved: '¡Meta alcanzada!',
  },

  progress: 'Progreso',

  empty: {
    title: 'No hay metas creadas',
    subtitle: 'Define metas financieras y sigue tu progreso',
  },

  actions: {
    create: 'Crear Nueva Meta',
    deleteTitle: 'Eliminar Meta',
    deleteConfirm: '¿Seguro que deseas eliminar esta meta?',
    deleteSuccess: '¡Meta eliminada con éxito!',
    cancel: 'Cancelar',
    delete: 'Eliminar',
  },
},
budget: {
  createTitle: 'Crear Presupuesto Mensual',
  editTitle: 'Editar Presupuesto',
  subtitle: 'Define límites de gasto por categoría',

  total: 'Presupuesto Total',

  quickFill: {
    title: 'Relleno Rápido',
    choose: 'Elige una opción:',
    equal: 'Distribuir Igualmente',
    suggested: 'Valores Sugeridos',
    cancel: 'Cancelar',
  },

  categoryTitle: 'Presupuesto por Categoría',

  tip: {
    title: 'Consejo',
    text:
      'Una regla común es: 50% para necesidades, 30% para deseos y 20% para ahorro e inversiones.',
  },

  actions: {
    save: 'Guardar Cambios',
    create: 'Crear Presupuesto',
    cancel: 'Cancelar',
  },

  alerts: {
    error: 'Error',
    minRequired: 'Define al menos un presupuesto por categoría',
    successTitle: '¡Éxito! ✅',
    created: '¡Presupuesto creado!',
    updated: '¡Presupuesto actualizado!',
    saveError: 'Error al guardar el presupuesto',
    genericError: 'No se pudo guardar el presupuesto',
  },
},

    settings: {
      title: 'Configuración',
      subtitle: 'Personaliza tu aplicación',

      appearance: '🎨 Apariencia',
      darkMode: 'Modo Oscuro',
      darkModeDesc: 'Tema oscuro para ahorrar batería',

      regionCurrency: '🌍 Región y Moneda',
      currency: 'Moneda',
      language: 'Idioma',

      notifications: '🔔 Notificaciones',
      notificationsEnabled: 'Notificaciones Activadas',
      notificationsEnabledDesc: 'Activar o desactivar notificaciones',

      bills: 'Recordatorio de Cuentas',
      billsDesc: 'Avisar sobre cuentas próximas',

      tithe: 'Recordatorio de Diezmo',
      titheDesc: 'Recordar pagar el diezmo mensual',

      goals: 'Alertas de Metas',
      goalsDesc: 'Progreso y logros',

      daily: 'Recordatorio Diario',
      dailyDesc: 'Recordar registrar gastos diarios',

      notificationTime: 'Horario de Notificaciones',
      notificationTimeDesc: 'Definir horario predeterminado',

      others: '⚙️ Otros',
      about: 'Sobre la App',
      aboutDesc: 'Versión, licencias y créditos',

      reset: 'Restablecer Configuración',
      resetDesc: 'Restaurar configuración predeterminada',

      timeTitle: 'Definir Horario',
      saveTitle: 'Guardar Horario',

      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',

      selectLanguage: 'Seleccionar Idioma',
      selectCurrency: 'Seleccionar Moneda',

      languageChanged: 'Idioma Cambiado',
      languageRestart: 'El idioma se aplicará al reiniciar la app',

      resetConfirmTitle: 'Restablecer Configuración',
      resetConfirmDesc: 'Esto restaurará la configuración predeterminada. ¿Continuar?',
      success: 'Éxito',
      resetSuccess: '¡Configuración restaurada!',

      footer: 'Control Financiero v1.0.0\nDesarrollado con ❤️ en React Native',
    },
  },
};


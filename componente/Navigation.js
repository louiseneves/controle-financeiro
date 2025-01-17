import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import Login from './Login';
import Cadastro from './Cadastro';
import EsqueciSenha from './EsqueciSenha';
import Receita from './Receita';
import Dizimo from './Dizimo';
import Oferta from './Oferta';
import Investimento from './Investimento';
import Contas from './Contas';
import Saldo from './Saldo';
import Historico from './Historico';
import Premium from './Premium';
import PacotesPremium from './PacotesPremium';
import PagamentoScreen from './PagamentoScreen';
import RelatorioDetalhado from './RelatorioDetalhado';
import SuportePrioritario from './SuportePrioritario';
import PlanejamentoFinanceiro from './PlanejamentoFinanceiro';
import BackupSincronizacao from './BackupSincronizacao';
import MetaFinanceiraScreen from './MetaFinanceira';
import CancelarAssinaturaScreen from './CancelarAssinaturaScreen';

const Stack = createStackNavigator();

// Rotas principais
const routes = [
  { name: 'Login', component: Login },
  { name: 'Cadastro', component: Cadastro },
  { name: 'EsqueciSenha', component: EsqueciSenha },
  { name: 'Home', component: Home },
  { name: 'Receita', component: Receita },
  { name: 'Dizimo', component: Dizimo },
  { name: 'Oferta', component: Oferta },
  { name: 'Investimento', component: Investimento },
  { name: 'Contas', component: Contas },
  { name: 'Saldo', component: Saldo },
  { name: 'Historico', component: Historico },
  { name: 'Premium', component: Premium },
  { name: 'PacotesPremium', component: PacotesPremium },
  { name: 'Pagamento', component: PagamentoScreen },
  { name: 'RelatorioDetalhado', component: RelatorioDetalhado },
  { name: 'SuportePrioritario', component: SuportePrioritario },
  { name: 'PlanejamentoFinanceiro', component: PlanejamentoFinanceiro },
  { name: 'BackupSincronizacao', component: BackupSincronizacao },
  { name: 'MetaFinanceira', component: MetaFinanceiraScreen },
  { name: 'CancelarAssinatura', component: CancelarAssinaturaScreen},
];

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Oculta o cabeçalho por padrão
        }}
      >
        {routes.map((route) => (
          <Stack.Screen
            key={route.name}
            name={route.name}
            component={route.component}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;


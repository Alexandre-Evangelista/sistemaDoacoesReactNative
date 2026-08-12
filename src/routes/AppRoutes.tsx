import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AlterarFotoScreen from '../screens/AlterarFotoScreen';
import CampanhaDetalhesScreen from '../screens/CampanhaDetalhesScreen';
import ConfiguracoesScreen from '../screens/ConfiguracoesScreen';
import CriarCampanhaScreen from '../screens/CriarCampanhaScreen';
import DoacoesScreen from '../screens/DoacoesScreen';
import EditarPerfilScreen from '../screens/EditarPerfilScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import PerfilScreen from '../screens/PerfilScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppRoutes() {
  const { isAuthenticated, loading, role } = useAuth();
  const { colors, navigationTheme } = useTheme();

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.greenDark} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Perfil" component={PerfilScreen} />
            <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
            <Stack.Screen name="CampanhaDetalhes" component={CampanhaDetalhesScreen} />
            <Stack.Screen name="AlterarFoto" component={AlterarFotoScreen} />
            {role === 'usuario' ? (
              <>
                <Stack.Screen name="Doacoes" component={DoacoesScreen} />
                <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
              </>
            ) : (
              <Stack.Screen name="CriarCampanha" component={CriarCampanhaScreen} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

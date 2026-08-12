import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import SignUpScreen from "../screens/SignUpScreen";
import CriarCampanhaScreen from "../screens/CriarCampanhaScreen";
import PerfilScreen from "../screens/PerfilScreen";
import DoacoesScreen from "../screens/DoacoesScreen";
import EditarPerfilScreen from "../screens/EditarPerfilScreen";
import ConfiguracoesScreen from "../screens/ConfiguracoesScreen";
import CampanhaDetalhesScreen from "../screens/CampanhaDetalhesScreen";
import AlterarFotoScreen from '../screens/AlterarFotoScreen';

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="CriarCampanha" component={CriarCampanhaScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="Doacoes" component={DoacoesScreen} />
        <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
        <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
        <Stack.Screen name="CampanhaDetalhes" component={CampanhaDetalhesScreen} />
        <Stack.Screen name="AlterarFoto" component={AlterarFotoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { loginStyles } from '../styles/loginStyles';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../services/authServices';

export default function LoginScreen({ navigation }: any) {
  const [role, setRole] = useState<Role>('usuario');
  const [identificador, setIdentificador] = useState(''); // email ou cnpj
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

async function handleLogin() {
  if (!identificador || !senha) {
    Alert.alert('Atenção', 'Preencha e-mail/CNPJ e senha.');
    return;
  }
  setLoading(true);
  try {
    await login(identificador, senha);
    navigation.navigate('Home');
  } catch (error: any) {
    Alert.alert('Erro ao entrar', JSON.stringify(error.response?.data ?? error.message));
  } finally {
    setLoading(false);
  }
}

  return (
    <SafeAreaView style={loginStyles.container}>
      <Text style={loginStyles.title}>Bem-vindo 👋</Text>
      <Text style={loginStyles.subtitle}>Entre para continuar doando</Text>

      <InputField
  icon="mail"
  placeholder="E-mail ou CNPJ"
  autoCapitalize="none"
  value={identificador}
  onChangeText={setIdentificador}
  editable={!loading}
/>

      <InputField
        icon="lock"
        placeholder="Sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        editable={!loading}
      />

      {loading ? (
        <View style={[loginStyles.primaryButton, { marginTop: 8 }]}>
          <ActivityIndicator color="#FFFFFF" />
        </View>
      ) : (
        <PrimaryButton label="Entrar" onPress={handleLogin} />
      )}

      <View style={loginStyles.dividerRow}>
        <View style={loginStyles.dividerLine} />
        <Text style={loginStyles.dividerText}>ou</Text>
        <View style={loginStyles.dividerLine} />
      </View>

      <TouchableOpacity style={loginStyles.googleButton} activeOpacity={0.85}>
        <Icon name="google" size={18} color="#EA4335" style={loginStyles.googleIcon} />
        <Text style={loginStyles.googleText}>Continuar com Google</Text>
      </TouchableOpacity>

      <View style={loginStyles.footerRow}>
        <Text style={loginStyles.footerText}>Não tem conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={loginStyles.footerLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
import React, { useMemo, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { ScreenProps } from '../routes/types';
import { createLoginStyles } from '../styles/loginStyles';

export default function LoginScreen({ navigation }: ScreenProps<'Login'>) {
  const { login } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createLoginStyles(colors), [colors]);
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!identificador.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail/CNPJ e senha.');
      return;
    }
    setLoading(true);
    try {
      await login(identificador.trim(), senha);
    } catch (error: unknown) {
      const response = (error as { response?: { data?: { message?: string } | string } })?.response?.data;
      const message = typeof response === 'string' ? response.trim() : response?.message;
      Alert.alert('Erro ao entrar', message || 'Não foi possível entrar. Confira seus dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 40, marginTop: 20 }}>
        <Image source={require('../../assets/logo.png')} style={{ width: 160, height: 160, resizeMode: 'contain' }} />
      </View>
      <InputField
        icon="mail" placeholder="E-mail ou CNPJ" autoCapitalize="none"
        autoComplete="username" value={identificador} onChangeText={setIdentificador} editable={!loading}
      />
      <InputField
        icon="lock" placeholder="Sua senha" secureTextEntry autoComplete="current-password"
        value={senha} onChangeText={setSenha} editable={!loading} onSubmitEditing={handleLogin}
      />
      <PrimaryButton label="Entrar" onPress={handleLogin} loading={loading} />
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} /><Text style={styles.dividerText}>ou</Text><View style={styles.dividerLine} />
      </View>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => Alert.alert('Em breve', 'O login com Google ainda não está disponível.')}
        accessibilityRole="button"
      >
        <Icon name="google" size={18} color="#EA4335" style={styles.googleIcon} />
        <Text style={styles.googleText}>Continuar com Google</Text>
      </TouchableOpacity>
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Não tem conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} accessibilityRole="button">
          <Text style={styles.footerLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

import React, { useMemo, useState } from 'react';
import {
  Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useTheme } from '../contexts/ThemeContext';
import type { ScreenProps } from '../routes/types';
import api from '../services/api';
import { createSignUpStyles } from '../styles/signUpStyles';
import { isValidCnpj, isValidCpf, isValidEmail } from '../utils/validation';

type Coordinates = { latitude: number; longitude: number };

export default function SignUpScreen({ navigation }: ScreenProps<'SignUp'>) {
  const { colors } = useTheme();
  const styles = useMemo(() => createSignUpStyles(colors), [colors]);
  const [documento, setDocumento] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [localizando, setLocalizando] = useState(false);
  const [localizacao, setLocalizacao] = useState<Coordinates | null>(null);

  async function obterLocalizacao() {
    setLocalizando(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permissão negada', 'Você pode continuar o cadastro sem informar a localização.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocalizacao({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    } catch {
      Alert.alert('Localização indisponível', 'Não foi possível obter sua localização. Você ainda pode concluir o cadastro.');
    } finally {
      setLocalizando(false);
    }
  }

  async function handleCadastro() {
    const doc = documento.replace(/\D/g, '');
    const isCpf = doc.length === 11;
    const isCnpj = doc.length === 14;

    if ((!isCpf && !isCnpj) || (isCpf && !isValidCpf(doc)) || (isCnpj && !isValidCnpj(doc))) {
      Alert.alert('Documento inválido', 'Informe um CPF ou CNPJ válido.');
      return;
    }
    if (!nome.trim() || !email.trim() || !telefone.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('E-mail inválido', 'Informe um endereço de e-mail válido.');
      return;
    }
    if (senha.length < 8) {
      Alert.alert('Senha fraca', 'A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        nome: nome.trim(), email: email.trim().toLowerCase(), telefone: telefone.trim(), senha,
      };
      if (localizacao) {
        body.geolocalizacao = { type: 'Point', coordinates: [localizacao.longitude, localizacao.latitude] };
      }
      if (isCpf) {
        body.cpf = doc;
        body.tipo = false;
      } else {
        body.cnpj = doc;
        body.tipo = true;
      }

      await api.post(isCpf ? '/usuario/registrar' : '/ongs/registrar', body);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      navigation.goBack();
    } catch (error: unknown) {
      const data = (error as { response?: { data?: { message?: string } } })?.response?.data;
      Alert.alert('Erro', data?.message || 'Não foi possível realizar o cadastro.');
    } finally {
      setLoading(false);
    }
  }

  const isCnpj = documento.replace(/\D/g, '').length === 14;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={{ alignItems: 'center', marginBottom: 25 }}>
              <Image source={require('../../assets/logo.png')} style={{ width: 140, height: 140, resizeMode: 'contain' }} />
            </View>
            <InputField icon="user" placeholder={isCnpj ? 'Nome da ONG' : 'Seu nome'} value={nome} onChangeText={setNome} editable={!loading} />
            <InputField icon="mail" placeholder="Seu e-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" editable={!loading} />
            <InputField icon="credit-card" placeholder="CPF ou CNPJ" value={documento} onChangeText={setDocumento} keyboardType="numeric" editable={!loading} />
            <InputField icon="phone" placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" autoComplete="tel" editable={!loading} />
            <InputField icon="lock" placeholder="Sua senha" value={senha} onChangeText={setSenha} secureTextEntry autoComplete="new-password" editable={!loading} />
            <TouchableOpacity onPress={obterLocalizacao} disabled={localizando || loading} accessibilityRole="button">
              <Text style={{ color: colors.link, textAlign: 'center', marginBottom: 12, fontWeight: '600' }}>
                {localizando ? 'Obtendo localização...' : localizacao ? 'Localização adicionada ✓' : 'Adicionar minha localização (opcional)'}
              </Text>
            </TouchableOpacity>
            <PrimaryButton label="Registrar" onPress={handleCadastro} loading={loading} />
            <View style={styles.separator}><View style={styles.line} /><Text style={styles.separatorText}>ou</Text><View style={styles.line} /></View>
            <TouchableOpacity style={styles.googleButton} onPress={() => Alert.alert('Em breve', 'O cadastro com Google ainda não está disponível.')}>
              <Text style={styles.googleText}>Continuar com Google</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.footerText}>Já tem registro? <Text style={styles.loginText}>Faça Login</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

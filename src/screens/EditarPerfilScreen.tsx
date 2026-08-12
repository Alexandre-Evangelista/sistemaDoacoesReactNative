import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { ScreenProps } from '../routes/types';
import authService, { Usuario } from '../services/authServices';
import { createEditarPerfilStyles } from '../styles/editarPerfilStyles';

export default function EditarPerfilScreen({ navigation }: ScreenProps<'EditarPerfil'>) {
  const { conta, role, atualizarConta } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createEditarPerfilStyles(colors), [colors]);
  const [nome, setNome] = useState(conta?.nome || '');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => { setNome(conta?.nome || ''); }, [conta?.nome]);

  async function handleSalvar() {
    if (role !== 'usuario' || !conta) return;
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome não pode ficar vazio.');
      return;
    }

    setSalvando(true);
    try {
      const usuario = conta as Usuario;
      const response = await authService.atualizarUsuario(usuario.email, {
        nome: nome.trim(), foto: usuario.foto ?? null, tipo: usuario.tipo ?? null, cpf: usuario.cpf ?? null,
      });
      await atualizarConta(response);
      Alert.alert('Sucesso', 'Seus dados foram atualizados!');
      navigation.goBack();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      Alert.alert('Erro', message ?? 'Não foi possível atualizar seus dados.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigation.goBack} accessibilityRole="button" accessibilityLabel="Voltar">
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Dados</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Nome Completo</Text>
        <InputField icon="user" value={nome} onChangeText={setNome} editable={!salvando} />
        <Text style={styles.label}>E-mail (Não editável)</Text>
        <InputField icon="mail" value={(conta as Usuario)?.email || ''} editable={false} />
        <View style={{ marginTop: 24 }}><PrimaryButton label="Salvar Alterações" onPress={handleSalvar} loading={salvando} /></View>
      </ScrollView>
    </SafeAreaView>
  );
}

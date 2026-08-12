import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../styles/loginStyles';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

import { useAuth } from '../contexts/AuthContext';
import authService, { Usuario } from '../services/authServices';

import { editarPerfilStyles as styles } from '../styles/editarPerfilStyles';

export default function EditarPerfilScreen({ navigation }: any) {
  const { conta, role, atualizarConta } = useAuth();
  const isUsuario = role === 'usuario';

  const [nome, setNome] = useState(conta?.nome || '');
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    if (!isUsuario || !conta) return;

    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome não pode ficar vazio.');
      return;
    }

    setSalvando(true);
    try {
      const usuarioAtual = conta as Usuario;
      const payload = {
        nome,
        foto: usuarioAtual.foto ?? null,
        tipo: usuarioAtual.tipo ?? null,
        cpf: usuarioAtual.cpf ?? null,
      };

      await authService.atualizarUsuario(usuarioAtual.email, payload);
      await atualizarConta(payload);

      Alert.alert('Sucesso', 'Seus dados foram atualizados!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error?.response?.data?.message ?? 'Não foi possível atualizar seus dados.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Dados</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!isUsuario ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Icon name="clock" size={28} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 12 }}>
              A edição de dados para ONGs ainda não está disponível. Em breve!
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.label}>Nome Completo</Text>
            <InputField
              icon="user"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>E-mail (Não editável)</Text>
            <InputField
              icon="mail"
              value={(conta as Usuario)?.email || ''}
              editable={false}
            />

            <View style={{ marginTop: 24 }}>
              {salvando ? (
                <ActivityIndicator size="large" color={colors.greenDark} />
              ) : (
                <PrimaryButton label="Salvar Alterações" onPress={handleSalvar} />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
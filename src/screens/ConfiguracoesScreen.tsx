import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import { configuracoesStyles as styles } from '../styles/configuracoesStyles';
import { colors } from '../styles/loginStyles';
import { useAuth } from '../contexts/AuthContext';

export default function ConfiguracoesScreen({ navigation }: any) {
  const [notificacoes, setNotificacoes] = useState(true);
  const [modoEscuro, setModoEscuro] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const { excluirConta } = useAuth();

  function handleExcluirConta() {
    Alert.alert(
      'Excluir conta',
      'Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setExcluindo(true);
            try {
              await excluirConta();
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (error: any) {
              Alert.alert('Erro', error?.response?.data?.message ?? 'Não foi possível excluir a conta.');
            } finally {
              setExcluindo(false);
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Preferências do App</Text>

        <View style={styles.optionRow}>
          <View style={styles.optionTextContainer}>
            <Icon name="bell" size={20} color={colors.textPrimary} />
            <Text style={styles.optionText}>Notificações</Text>
          </View>
          <Switch
            value={notificacoes}
            onValueChange={setNotificacoes}
            trackColor={{ false: colors.inputBorder, true: colors.green }}
            thumbColor="#FFF"
          />
        </View>

        <View style={styles.optionRow}>
          <View style={styles.optionTextContainer}>
            <Icon name="moon" size={20} color={colors.textPrimary} />
            <Text style={styles.optionText}>Modo Escuro</Text>
          </View>
          <Switch
            value={modoEscuro}
            onValueChange={setModoEscuro}
            trackColor={{ false: colors.inputBorder, true: colors.green }}
            thumbColor="#FFF"
          />
        </View>

        <Text style={styles.sectionTitle}>Conta e Segurança</Text>

        <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
          <View style={styles.optionTextContainer}>
            <Icon name="lock" size={20} color={colors.textPrimary} />
            <Text style={styles.optionText}>Alterar Senha</Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          activeOpacity={0.7}
          onPress={handleExcluirConta}
          disabled={excluindo}
        >
          <View style={styles.optionTextContainer}>
            <Icon name="trash-2" size={20} color="#DC2626" />
            <Text style={[styles.optionText, { color: '#DC2626' }]}>Excluir Conta</Text>
          </View>
          {excluindo && <ActivityIndicator size="small" color="#DC2626" />}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
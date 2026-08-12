import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { ScreenProps } from '../routes/types';
import { createConfiguracoesStyles } from '../styles/configuracoesStyles';

const NOTIFICATIONS_KEY = '@app:notifications';

export default function ConfiguracoesScreen({ navigation }: ScreenProps<'Configuracoes'>) {
  const { excluirConta } = useAuth();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const styles = useMemo(() => createConfiguracoesStyles(colors), [colors]);
  const [notifications, setNotifications] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(NOTIFICATIONS_KEY)
      .then((value) => { if (value !== null) setNotifications(value === 'true'); })
      .catch(() => undefined);
  }, []);

  async function handleNotifications(value: boolean) {
    setNotifications(value);
    try { await AsyncStorage.setItem(NOTIFICATIONS_KEY, String(value)); }
    catch { setNotifications(!value); Alert.alert('Erro', 'Não foi possível salvar essa preferência.'); }
  }

  async function handleTheme() {
    try { await toggleTheme(); }
    catch { Alert.alert('Erro', 'Não foi possível salvar o tema escolhido.'); }
  }

  function handleExcluirConta() {
    Alert.alert('Excluir conta', 'Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          setDeleting(true);
          try { await excluirConta(); }
          catch (error: unknown) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            Alert.alert('Erro', message ?? 'Não foi possível excluir a conta.');
          } finally { setDeleting(false); }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigation.goBack} accessibilityRole="button" accessibilityLabel="Voltar">
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Preferências do App</Text>
        <View style={styles.optionRow}>
          <View style={styles.optionTextContainer}><Icon name="bell" size={20} color={colors.textPrimary} /><Text style={styles.optionText}>Notificações</Text></View>
          <Switch value={notifications} onValueChange={handleNotifications} trackColor={{ false: colors.inputBorder, true: colors.greenDark }} thumbColor={colors.surface} accessibilityLabel="Ativar notificações" />
        </View>
        <View style={styles.optionRow}>
          <View style={styles.optionTextContainer}><Icon name="moon" size={20} color={colors.textPrimary} /><Text style={styles.optionText}>Modo Escuro</Text></View>
          <Switch value={isDarkMode} onValueChange={handleTheme} trackColor={{ false: colors.inputBorder, true: colors.greenDark }} thumbColor={colors.surface} accessibilityLabel="Ativar modo escuro" />
        </View>
        <Text style={styles.sectionTitle}>Conta e Segurança</Text>
        <TouchableOpacity style={styles.optionRow} activeOpacity={0.7} onPress={() => Alert.alert('Indisponível', 'A alteração de senha depende de um endpoint que ainda não está disponível no cliente.')} accessibilityRole="button">
          <View style={styles.optionTextContainer}><Icon name="lock" size={20} color={colors.textPrimary} /><Text style={styles.optionText}>Alterar Senha</Text></View>
          <Icon name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionRow} activeOpacity={0.7} onPress={handleExcluirConta} disabled={deleting} accessibilityRole="button" accessibilityState={{ disabled: deleting, busy: deleting }}>
          <View style={styles.optionTextContainer}><Icon name="trash-2" size={20} color={colors.danger} /><Text style={[styles.optionText, { color: colors.danger }]}>{deleting ? 'Excluindo...' : 'Excluir Conta'}</Text></View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

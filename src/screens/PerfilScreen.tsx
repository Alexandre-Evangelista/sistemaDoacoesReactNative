import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Avatar from '../components/Avatar';
import BottomMenu from '../components/BottomMenu';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { Campanha } from '../models/Campanha';
import type { ScreenProps } from '../routes/types';
import api from '../services/api';
import { Ong, Usuario } from '../services/authServices';
import doacaoService from '../services/doacaoService';
import { createPerfilStyles } from '../styles/perfilStyles';

export default function PerfilScreen({ navigation }: ScreenProps<'Perfil'>) {
  const { conta, role, logout } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createPerfilStyles(colors), [colors]);
  const isOng = role === 'ong';
  const [primaryStat, setPrimaryStat] = useState(0);
  const [secondaryStat, setSecondaryStat] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  const carregarStats = useCallback(async () => {
    if (!conta || !role) return;
    setLoadingStats(true);
    try {
      if (role === 'ong') {
        const response = await api.get<Campanha[]>('/campanha');
        const cnpj = (conta as Ong).cnpj;
        setPrimaryStat((response.data ?? []).filter((campaign) => campaign.cnpjOng === cnpj).length);
        setSecondaryStat(0);
      } else {
        const donations = await doacaoService.listarDoacoes();
        setPrimaryStat(donations.length);
        const uniqueOngs = new Set(donations.map((donation) => donation.cnpj ?? donation.ong?.cnpj ?? donation.campanha?.ong?.cnpj).filter(Boolean));
        setSecondaryStat(uniqueOngs.size);
      }
    } catch {
      setPrimaryStat(0);
      setSecondaryStat(0);
    } finally {
      setLoadingStats(false);
    }
  }, [conta, role]);

  useFocusEffect(useCallback(() => { carregarStats(); }, [carregarStats]));

  async function handleLogout() {
    try { await logout(); }
    catch { Alert.alert('Erro', 'Não foi possível encerrar a sessão. Tente novamente.'); }
  }

  const displayName = conta?.nome || (isOng ? 'ONG' : 'Usuário');
  const identifier = isOng ? (conta as Ong | null)?.cnpj : (conta as Usuario | null)?.email;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={styles.header}><Text style={styles.headerTitle}>{isOng ? 'Perfil da ONG' : 'Meu Perfil'}</Text></View>
        <View style={styles.profileSection}>
          <Avatar foto={conta?.foto} tipo={isOng ? 'ong' : 'usuario'} style={styles.avatar} />
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{identifier || 'Sem informação'}</Text>
        </View>
        <View style={styles.statsCard}>
          {loadingStats ? <ActivityIndicator size="small" color={colors.greenDark} /> : (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{primaryStat}</Text>
                <Text style={styles.statLabel}>{isOng ? 'Campanhas Criadas' : 'Doações Feitas'}</Text>
              </View>
              {!isOng && <><View style={styles.statDivider} /><View style={styles.statItem}><Text style={styles.statNumber}>{secondaryStat}</Text><Text style={styles.statLabel}>ONGs Apoiadas</Text></View></>}
            </>
          )}
        </View>
        <View style={styles.menuSection}>
          {!isOng && <MenuItem icon="edit" label="Editar Dados Pessoais" onPress={() => navigation.navigate('EditarPerfil')} colors={colors} styles={styles} />}
          <MenuItem icon="camera" label="Alterar Foto" onPress={() => navigation.navigate('AlterarFoto')} colors={colors} styles={styles} />
          <MenuItem icon="settings" label="Configurações" onPress={() => navigation.navigate('Configuracoes')} colors={colors} styles={styles} />
          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout} activeOpacity={0.7} accessibilityRole="button">
            <Icon name="log-out" size={20} color={colors.danger} /><Text style={styles.logoutText}>Sair do Aplicativo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomMenu activeRoute="Perfil" />
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress, colors, styles }: {
  icon: string; label: string; onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
  styles: ReturnType<typeof createPerfilStyles>;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onPress} accessibilityRole="button">
      <Icon name={icon} size={20} color={colors.textPrimary} />
      <Text style={styles.menuItemText}>{label}</Text>
      <Icon name="chevron-right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

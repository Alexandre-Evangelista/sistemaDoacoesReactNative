import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../contexts/AuthContext';
import { perfilStyles as styles } from '../styles/perfilStyles';
import { colors } from '../styles/loginStyles';
import BottomMenu from '../components/BottomMenu';
import Avatar from '../components/Avatar';
import api from '../services/api';
import doacaoService from '../services/doacaoService';
import { Ong, Usuario } from '../services/authServices';

export default function PerfilScreen({ navigation }: any) {
  const { conta, role, logout } = useAuth();
  const isOng = role === 'ong';

  const [statPrimario, setStatPrimario] = useState(0);
  const [statSecundario, setStatSecundario] = useState(0);
  const [carregandoStats, setCarregandoStats] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregarStats();
    }, [role, conta])
  );

  async function handleSair() {
    await logout();
    navigation.replace('Login');
  }

  async function carregarStats() {
    setCarregandoStats(true);
    try {
      if (isOng) {
        // Número real de campanhas da ONG
        const response = await api.get('/campanha');
        const cnpj = (conta as Ong)?.cnpj;
        const campanhasDaOng = response.data.filter((c: any) => c.cnpjOng === cnpj);
        setStatPrimario(campanhasDaOng.length);
        setStatSecundario(0);
      } else {
        const doacoes = await doacaoService.listarDoacoes();
        setStatPrimario(doacoes.length);

        const ongsUnicas = new Set(
          doacoes.map((d: any) => d.cnpjOng ?? d.ongCnpj ?? d.ong?.cnpj).filter(Boolean)
        );
        setStatSecundario(ongsUnicas.size);
      }
    } catch (error) {
      console.log('Erro ao carregar stats do perfil:', error);
    } finally {
      setCarregandoStats(false);
    }
  }

  const nomeExibido = conta?.nome || (isOng ? 'ONG' : 'Usuário');
  const identificadorExibido = isOng ? (conta as Ong)?.cnpj : (conta as Usuario)?.email;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{isOng ? 'Perfil da ONG' : 'Meu Perfil'}</Text>
        </View>
        <View style={styles.profileSection}>
          <Avatar foto={conta?.foto} tipo={isOng ? 'ong' : 'usuario'} style={styles.avatar} />
          <Text style={styles.userName}>{nomeExibido}</Text>
          <Text style={styles.userEmail}>{identificadorExibido || 'Sem informação'}</Text>
        </View>
        <View style={styles.statsCard}>
          {carregandoStats ? (
            <ActivityIndicator size="small" color={colors.greenDark} />
          ) : (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{statPrimario}</Text>
                <Text style={styles.statLabel}>{isOng ? 'Campanhas Criadas' : 'Doações Feitas'}</Text>
              </View>
              {!isOng && (
                <>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{statSecundario}</Text>
                    <Text style={styles.statLabel}>ONGs Apoiadas</Text>
                  </View>
                </>
              )}
            </>
          )}
        </View>
        <View style={styles.menuSection}>
          {!isOng && (
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('EditarPerfil')}
            >
              <Icon name="edit" size={20} color={colors.textPrimary} />
              <Text style={styles.menuItemText}>Editar Dados Pessoais</Text>
              <Icon name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('AlterarFoto')}
          >
            <Icon name="camera" size={20} color={colors.textPrimary} />
            <Text style={styles.menuItemText}>Alterar Foto</Text>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Configuracoes')}
          >
            <Icon name="settings" size={20} color={colors.textPrimary} />
            <Text style={styles.menuItemText}>Configurações</Text>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleSair} activeOpacity={0.7}>
            <Icon name="log-out" size={20} color="#DC2626" />
            <Text style={styles.logoutText}>Sair do Aplicativo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomMenu navigation={navigation} activeRoute="Perfil" />
    </SafeAreaView>
  );
}
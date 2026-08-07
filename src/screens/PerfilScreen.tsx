import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../contexts/AuthContext';
import { perfilStyles as styles } from '../styles/perfilStyles';
import { colors } from '../styles/loginStyles';
import BottomMenu from '../components/BottomMenu';

export default function PerfilScreen({ navigation }: any) {
  const { conta, logout } = useAuth();

  async function handleSair() {
    await logout();
    navigation.replace("Login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
        </View>
        <View style={styles.profileSection}>
          <Image source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=male" }} style={styles.avatar} />
          <Text style={styles.userName}>{conta?.nome || "Usuário"}</Text>
          <Text style={styles.userEmail}>{(conta as any)?.email || "Sem e-mail"}</Text>
        </View>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Doações Feitas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>ONGs Apoiadas</Text>
          </View>
        </View>
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('EditarPerfil')}
          >
            <Icon name="edit" size={20} color={colors.textPrimary} />
            <Text style={styles.menuItemText}>Editar Dados Pessoais</Text>
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
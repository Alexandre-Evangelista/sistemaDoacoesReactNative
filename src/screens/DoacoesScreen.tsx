import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { doacoesStyles as styles } from '../styles/doacoesStyles';
import { colors } from '../styles/loginStyles';
import BottomMenu from '../components/BottomMenu';

const doacoesMock = [
  {
    id: "1",
    data: "12 Jul 2026",
    ong: "ONG Esperança",
    quantidade: 2,
    tipo: "Cestas Básicas",
    status: "Concluída"
  },
  {
    id: "2",
    data: "05 Jun 2026",
    ong: "Ação Solidária",
    quantidade: 15,
    tipo: "Peças de Roupa",
    status: "Concluída"
  },
  {
    id: "3",
    data: "10 Mai 2026",
    ong: "Abrigo Animal",
    quantidade: 10,
    tipo: "Kg de Ração",
    status: "Concluída"
  }
];

export default function DoacoesScreen({ navigation }: any) {
  function renderItem({ item }: any) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.ongName}>{item.ong}</Text>
          <Text style={styles.dateText}>{item.data}</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.iconBox}>
            <Icon name="package" size={20} color={colors.greenDark} />
          </View>
          <View style={styles.donationDetails}>
            <Text style={styles.quantityText}>{item.quantidade}x {item.tipo}</Text>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Doações</Text>
      </View>
      <FlatList
        data={doacoesMock}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      />
      <BottomMenu navigation={navigation} activeRoute="Doacoes" />
    </SafeAreaView>
  );
}
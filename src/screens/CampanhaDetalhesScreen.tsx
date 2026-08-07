import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import PrimaryButton from '../components/PrimaryButton';

export default function CampanhaDetalhesScreen({ route, navigation }: any) {
  const { campanha } = route.params;

  function handleDoar() {
    Alert.alert("Doação", `Obrigado por querer ajudar a ${campanha.ong?.nome || 'ONG'}! Em breve o sistema de pagamentos estará disponível.`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Image source={{ uri: campanha.foto }} style={styles.image} />
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.ongName}>{campanha.ong?.nome || "ONG Parceira"}</Text>
          <Text style={styles.title}>{campanha.nome}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Sobre a campanha</Text>
          <Text style={styles.description}>{campanha.descricao}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Fazer uma Doação" onPress={handleDoar} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  image: { width: '100%', height: 280, resizeMode: 'cover' },
  backButton: {
    position: 'absolute', top: 20, left: 20,
    backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 20,
  },
  content: { padding: 24, marginTop: -20, backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  ongName: { fontSize: 14, color: '#16A34A', fontWeight: 'bold', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: '#1F2937' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  description: { fontSize: 15, color: '#4B5563', lineHeight: 24 },
  footer: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#F3F4F6' },
});
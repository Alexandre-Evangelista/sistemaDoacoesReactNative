import React, { useState } from 'react';
import { 
  View, Text, Image, TouchableOpacity, ScrollView, 
  Alert, StyleSheet, Modal, TextInput, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import * as Location from 'expo-location';
import PrimaryButton from '../components/PrimaryButton';
import doacaoService from '../services/doacaoService';

export default function CampanhaDetalhesScreen({ route, navigation }: any) {
  const { campanha } = route.params;
  

  const [modalVisivel, setModalVisivel] = useState(false);
  const [quantidade, setQuantidade] = useState('1');
  const [tipo, setTipo] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleConfirmarDoacao() {
    if (!tipo || !quantidade) {
      Alert.alert("Atenção", "Preencha a quantidade e o tipo de doação.");
      return;
    }

    setLoading(true);
    try {
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da sua localização para registrar a doação e ajudar a ONG com a logística.');
        setLoading(false);
        return;
      }

      
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

      
      await doacaoService.criarDoacao({
        quantidade: Number(quantidade),
        tipo: tipo,
        IDcampanha: campanha.id,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      Alert.alert("Sucesso!", `Sua doação para a ${campanha.ong?.nome || 'ONG'} foi registrada. Agradecemos o apoio!`);
      
      
      setModalVisivel(false);
      setQuantidade('1');
      setTipo('');

    } catch (error: any) {
      console.log("ERRO AO DOAR:", error?.response?.data || error);
      Alert.alert("Erro", "Não foi possível registrar sua doação no momento.");
    } finally {
      setLoading(false);
    }
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
        <PrimaryButton label="Fazer uma Doação" onPress={() => setModalVisivel(true)} />
      </View>

     
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalhes da Doação</Text>
            
            <Text style={styles.label}>O que você vai doar?</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Cesta Básica, Agasalhos..."
              value={tipo}
              onChangeText={setTipo}
            />

            <Text style={styles.label}>Quantidade</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2"
              keyboardType="numeric"
              value={quantidade}
              onChangeText={setQuantidade}
            />

            {loading ? (
              <ActivityIndicator size="large" color="#16A34A" style={{ marginTop: 24 }} />
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisivel(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmarDoacao}>
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#F3F4F6', borderRadius: 12, padding: 14, fontSize: 16, color: '#1F2937', borderWidth: 1, borderColor: '#E5E7EB' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  cancelButton: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, marginRight: 8 },
  cancelButtonText: { color: '#4B5563', fontWeight: 'bold', fontSize: 16 },
  confirmButton: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#16A34A', borderRadius: 12, marginLeft: 8 },
  confirmButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
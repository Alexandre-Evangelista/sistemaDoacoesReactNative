import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { criarCampanhaStyles as styles } from '../styles/criarCampanhaStyles';
import { colors } from '../styles/loginStyles';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import campanhaService from '../services/campanhaService';
import { useAuth } from '../contexts/AuthContext';
import LocationPickerMap from '../components/LocationPickerMap';

export default function CriarCampanhaScreen({ navigation }: any) {
  const { conta, role } = useAuth();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [localizacao, setLocalizacao] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);

  async function escolherFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão negada', 'Precisamos acessar suas fotos.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      aspect: [16, 9],
      allowsEditing: true,
    });

    if (!resultado.canceled) {
      const asset = resultado.assets[0];
      const nomeArquivo = asset.uri.split('/').pop() ?? 'foto.jpg';
      const extensao = nomeArquivo.split('.').pop();

      setFoto({
        uri: asset.uri,
        name: nomeArquivo,
        type: `image/${extensao === 'jpg' ? 'jpeg' : extensao}`,
      });
    }
  }

  async function usarLocalizacaoAtual() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não foi possível obter sua localização.');
      return;
    }
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setLocalizacao({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }

  async function handleCriar() {
    if (!nome || !descricao) {
      Alert.alert('Atenção', 'Preencha o nome e a descrição da campanha.');
      return;
    }
    if (!foto) {
      Alert.alert('Atenção', 'A foto da campanha é obrigatória.');
      return;
    }
    if (role !== 'ong' || !conta || !('cnpj' in conta) || !conta.cnpj) {
      Alert.alert('Erro', 'Apenas ONGs podem criar campanhas.');
      return;
    }

    setLoading(true);
    try {
      await campanhaService.criarCampanha({
        nome,
        descricao,
        foto,
        latitude: localizacao?.latitude,
        longitude: localizacao?.longitude,
        cnpjOng: conta.cnpj,
      });

      Alert.alert('Sucesso', 'Campanha criada com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.log('ERRO CRIAR CAMPANHA:', error.response?.data);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível criar a campanha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Nova campanha</Text>
        </View>

        <TouchableOpacity style={styles.fotoPicker} onPress={escolherFoto} activeOpacity={0.8}>
          {foto ? (
            <Image source={{ uri: foto.uri }} style={styles.fotoPreview} resizeMode="cover" />
          ) : (
            <>
              <Icon name="image" size={28} color={colors.placeholder} />
              <Text style={styles.fotoPlaceholderText}>Adicionar foto da campanha</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Nome da campanha</Text>
        <InputField
          icon="edit-3"
          placeholder="Ex: Campanha de Alimentos"
          value={nome}
          onChangeText={setNome}
          editable={!loading}
        />

        <Text style={styles.label}>Descrição</Text>
        <InputField
          icon="file-text"
          placeholder="Conte sobre a campanha..."
          value={descricao}
          onChangeText={setDescricao}
          editable={!loading}
          multiline
        />

        <Text style={styles.label}>Localização</Text>
        <LocationPickerMap
          value={localizacao}
          onChange={setLocalizacao}
        />

        {loading ? (
          <ActivityIndicator size="large" color={colors.greenDark} />
        ) : (
          <PrimaryButton label="Criar campanha" onPress={handleCriar} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
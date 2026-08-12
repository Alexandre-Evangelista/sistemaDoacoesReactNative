import React, { useMemo, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import InputField from '../components/InputField';
import LocationPickerMap, { Coordenada } from '../components/LocationPickerMap';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { ScreenProps } from '../routes/types';
import campanhaService from '../services/campanhaService';
import { createCriarCampanhaStyles } from '../styles/criarCampanhaStyles';

export default function CriarCampanhaScreen({ navigation }: ScreenProps<'CriarCampanha'>) {
  const { conta, role } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createCriarCampanhaStyles(colors), [colors]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [localizacao, setLocalizacao] = useState<Coordenada | null>(null);
  const [loading, setLoading] = useState(false);

  async function escolherFoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão negada', 'Precisamos acessar suas fotos para escolher a imagem da campanha.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, aspect: [16, 9], allowsEditing: true });
    if (!result.canceled) setAsset(result.assets[0]);
  }

  async function handleCriar() {
    if (!nome.trim() || !descricao.trim()) {
      Alert.alert('Atenção', 'Preencha o nome e a descrição da campanha.');
      return;
    }
    if (!asset) {
      Alert.alert('Atenção', 'A foto da campanha é obrigatória.');
      return;
    }
    if (role !== 'ong' || !conta || !('cnpj' in conta) || !conta.cnpj) {
      Alert.alert('Erro', 'Apenas ONGs podem criar campanhas.');
      return;
    }

    const name = asset.fileName || asset.uri.split('/').pop() || `campanha_${Date.now()}.jpg`;
    const extension = name.split('.').pop()?.toLowerCase();
    const type = asset.mimeType || (extension ? `image/${extension === 'jpg' ? 'jpeg' : extension}` : 'image/jpeg');
    setLoading(true);
    try {
      await campanhaService.criarCampanha({
        nome: nome.trim(), descricao: descricao.trim(), foto: { uri: asset.uri, name, type },
        latitude: localizacao?.latitude, longitude: localizacao?.longitude, cnpjOng: conta.cnpj,
      });
      Alert.alert('Sucesso', 'Campanha criada com sucesso!');
      navigation.goBack();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      Alert.alert('Erro', message || 'Não foi possível criar a campanha.');
    } finally { setLoading(false); }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={navigation.goBack} accessibilityRole="button" accessibilityLabel="Voltar"><Icon name="arrow-left" size={22} color={colors.textPrimary} /></TouchableOpacity>
          <Text style={styles.title}>Nova campanha</Text>
        </View>
        <TouchableOpacity style={styles.fotoPicker} onPress={escolherFoto} activeOpacity={0.8} accessibilityRole="button">
          {asset ? <Image source={{ uri: asset.uri }} style={styles.fotoPreview} resizeMode="cover" /> : <><Icon name="image" size={28} color={colors.placeholder} /><Text style={styles.fotoPlaceholderText}>Adicionar foto da campanha</Text></>}
        </TouchableOpacity>
        <Text style={styles.label}>Nome da campanha</Text>
        <InputField icon="edit-3" placeholder="Ex: Campanha de Alimentos" value={nome} onChangeText={setNome} editable={!loading} />
        <Text style={styles.label}>Descrição</Text>
        <InputField icon="file-text" placeholder="Conte sobre a campanha..." value={descricao} onChangeText={setDescricao} editable={!loading} multiline style={{ minHeight: 96, textAlignVertical: 'top' }} />
        <Text style={styles.label}>Localização</Text>
        <LocationPickerMap value={localizacao} onChange={setLocalizacao} />
        <PrimaryButton label="Criar campanha" onPress={handleCriar} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

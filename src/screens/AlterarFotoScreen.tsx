import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../styles/loginStyles';
import PrimaryButton from '../components/PrimaryButton';
import Avatar from '../components/Avatar';

import { useAuth } from '../contexts/AuthContext';
import authService, { Usuario, Ong } from '../services/authServices';

import { editarPerfilStyles as styles } from '../styles/editarPerfilStyles';

export default function AlterarFotoScreen({ navigation }: any) {
  const { conta, role, atualizarFoto } = useAuth();

  const isOng = role === 'ong';

  const [novaFotoUri, setNovaFotoUri] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleEscolherFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos para trocar o avatar.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      setNovaFotoUri(resultado.assets[0].uri);
    }
  }

  async function handleSalvar() {
    if (!novaFotoUri || !conta || !role) {
      Alert.alert('Atenção', 'Selecione uma foto antes de salvar.');
      return;
    }

    const nomeArquivo = novaFotoUri.split('/').pop() || `foto_${Date.now()}.jpg`;
    const extensao = nomeArquivo.split('.').pop();
    const tipo = extensao ? `image/${extensao === 'jpg' ? 'jpeg' : extensao}` : 'image/jpeg';

    const arquivo = { uri: novaFotoUri, name: nomeArquivo, type: tipo };

    setSalvando(true);
    try {
      let atualizado: Usuario | Ong;

      if (isOng) {
        atualizado = await authService.atualizarFotoOng((conta as Ong).cnpj, arquivo);
      } else {
        atualizado = await authService.atualizarFotoUsuario((conta as Usuario).email, arquivo);
      }

      await atualizarFoto(atualizado.foto || novaFotoUri);
      Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error?.response?.data?.message ?? 'Não foi possível atualizar a foto.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alterar Foto</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <Avatar foto={novaFotoUri || conta?.foto} tipo={isOng ? 'ong' : 'usuario'} style={styles.avatar} />
          <TouchableOpacity
            style={styles.editAvatarButton}
            activeOpacity={0.8}
            onPress={handleEscolherFoto}
          >
            <Icon name="camera" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 8 }}>
          {isOng ? 'Foto da ONG' : 'Sua foto de perfil'}
        </Text>

        <TouchableOpacity
          onPress={handleEscolherFoto}
          style={{ alignItems: 'center', marginTop: 16 }}
          activeOpacity={0.7}
        >
          <Text style={{ color: colors.greenDark, fontWeight: '600' }}>
            {novaFotoUri ? 'Escolher outra foto' : 'Escolher da galeria'}
          </Text>
        </TouchableOpacity>

        <View style={{ marginTop: 32 }}>
          {salvando ? (
            <ActivityIndicator size="large" color={colors.greenDark} />
          ) : (
            <PrimaryButton label="Salvar Foto" onPress={handleSalvar} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
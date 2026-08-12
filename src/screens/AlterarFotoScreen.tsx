import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import Avatar from '../components/Avatar';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { ScreenProps } from '../routes/types';
import authService, { Ong, Usuario } from '../services/authServices';
import { createEditarPerfilStyles } from '../styles/editarPerfilStyles';

export default function AlterarFotoScreen({ navigation }: ScreenProps<'AlterarFoto'>) {
  const { conta, role, atualizarFoto } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createEditarPerfilStyles(colors), [colors]);
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [salvando, setSalvando] = useState(false);
  const isOng = role === 'ong';

  async function handleEscolherFoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos para trocar o avatar.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) setAsset(result.assets[0]);
  }

  async function handleSalvar() {
    if (!asset || !conta || !role) {
      Alert.alert('Atenção', 'Selecione uma foto antes de salvar.');
      return;
    }

    const name = asset.fileName || asset.uri.split('/').pop() || `foto_${Date.now()}.jpg`;
    const extension = name.split('.').pop()?.toLowerCase();
    const type = asset.mimeType || (extension ? `image/${extension === 'jpg' ? 'jpeg' : extension}` : 'image/jpeg');
    setSalvando(true);
    try {
      const updated = isOng
        ? await authService.atualizarFotoOng((conta as Ong).cnpj, { uri: asset.uri, name, type })
        : await authService.atualizarFotoUsuario((conta as Usuario).email, { uri: asset.uri, name, type });

      if (!updated?.foto) throw new Error('A API não retornou a referência da nova foto.');
      await atualizarFoto(updated.foto);
      Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
      navigation.goBack();
    } catch (error: unknown) {
      const apiMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      const localMessage = error instanceof Error ? error.message : null;
      Alert.alert('Erro', apiMessage ?? localMessage ?? 'Não foi possível atualizar a foto.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigation.goBack} accessibilityRole="button" accessibilityLabel="Voltar">
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alterar Foto</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <Avatar foto={asset?.uri || conta?.foto} tipo={isOng ? 'ong' : 'usuario'} style={styles.avatar} />
          <TouchableOpacity style={styles.editAvatarButton} activeOpacity={0.8} onPress={handleEscolherFoto} accessibilityRole="button" accessibilityLabel="Escolher foto">
            <Icon name="camera" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 8 }}>{isOng ? 'Foto da ONG' : 'Sua foto de perfil'}</Text>
        <TouchableOpacity onPress={handleEscolherFoto} style={{ alignItems: 'center', marginTop: 16 }} activeOpacity={0.7}>
          <Text style={{ color: colors.greenDark, fontWeight: '600' }}>{asset ? 'Escolher outra foto' : 'Escolher da galeria'}</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 32 }}><PrimaryButton label="Salvar Foto" onPress={handleSalvar} loading={salvando} disabled={!asset} /></View>
      </ScrollView>
    </SafeAreaView>
  );
}

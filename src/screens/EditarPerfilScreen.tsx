import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../styles/loginStyles';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';


import { useAuth } from '../contexts/AuthContext';


import { editarPerfilStyles as styles } from '../styles/editarPerfilStyles'; 

export default function EditarPerfilScreen({ navigation }: any) {
  
  const { conta } = useAuth();

  const [nome, setNome] = useState(conta?.nome || '');
  const [telefone, setTelefone] = useState((conta as any)?.telefone || '');

  function handleSalvar() {
    Alert.alert('Sucesso', 'Seus dados foram atualizados localmente!');
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Dados</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=male" }} style={styles.avatar} />
          <TouchableOpacity style={styles.editAvatarButton} activeOpacity={0.8}>
            <Icon name="camera" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nome Completo</Text>
        <InputField 
           icon="user" 
           value={nome} 
           onChangeText={setNome} 
         />

        <Text style={styles.label}>Telefone</Text>
        <InputField 
           icon="phone" 
           value={telefone} 
           onChangeText={setTelefone} 
           keyboardType="phone-pad"
        />

        <Text style={styles.label}>E-mail (Não editável)</Text>
        <InputField 
           icon="mail" 
           value={(conta as any)?.email || ''} // E-mail real que não pode ser mudado
           editable={false} 
         />

        <View style={{ marginTop: 24 }}>
          <PrimaryButton label="Salvar Alterações" onPress={handleSalvar} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
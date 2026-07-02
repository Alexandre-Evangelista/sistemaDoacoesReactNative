import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { SafeAreaView } from 'react-native-safe-area-context';

import api from "../services/api";
import { homeStyles } from "../styles/homeStyles";
import CampaignCard from "../components/CampaignCard";
import { Campanha } from "../models/Campanha";
import { useAuth } from "../contexts/AuthContext";

export default function HomeScreen({ navigation }: any) {
  const { conta, role, logout } = useAuth();
const isOng = role === "ong";
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarCampanhas();
  }, []);

  async function handleLogout() {
    await logout();
    navigation.replace("Login");
  }

  async function carregarCampanhas() {
    try {
      const response = await api.get("/campanha");
      setCampanhas(response.data);
    } catch (error) {
      console.log("Erro:", error);
    } finally {
      setLoading(false);
    }
  }

  const campanhasFiltradas = campanhas.filter(
    (campanha) =>
      campanha.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      campanha.descricao?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={homeStyles.container}>

      <View style={homeStyles.header}>

  <View style={homeStyles.headerTop}>
    <TouchableOpacity
      onPress={handleLogout}
      style={homeStyles.logoutButton}
      activeOpacity={0.8}
    >
      <Icon name="logout" size={15} color="#DC2626" />
      <Text style={homeStyles.logoutText}>Sair</Text>
    </TouchableOpacity>
  </View>

  <View style={homeStyles.headerBottom}>
    <View>
      <Text style={homeStyles.hello}>Olá,</Text>
      <Text style={homeStyles.name}>{conta?.nome ?? "Usuário"} 👋</Text>
    </View>
  </View>

</View>

      <TextInput
        style={homeStyles.search}
        placeholder="Buscar ONGs ou campanhas..."
        value={busca}
        onChangeText={setBusca}
      />

      <View style={homeStyles.sectionRow}>
  <Text style={homeStyles.sectionTitle}>
    {isOng ? "Minhas campanhas" : "Campanhas em destaque"}
  </Text>

  {isOng && (
    <TouchableOpacity
      onPress={() => navigation.navigate("CriarCampanha")}
      style={homeStyles.createButton}
      activeOpacity={0.8}
    >
      <Icon name="plus" size={14} color="#FFFFFF" />
      <Text style={homeStyles.createButtonText}>Criar</Text>
    </TouchableOpacity>
  )}
</View>

      {loading ? (
        <ActivityIndicator size="large" color="#16A34A" />
      ) : (
        <FlatList
          data={campanhasFiltradas}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <CampaignCard campanha={item} />}
        />
      )}
    </SafeAreaView>
  );
}
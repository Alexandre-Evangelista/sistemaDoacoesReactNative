import React, { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image, // <-- Importação do Image adicionada aqui
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ong } from "../services/authServices";

import api from "../services/api";
import { homeStyles } from "../styles/homeStyles";
import CampaignCard from "../components/CampaignCard";
import Header from "../components/Header";
import BottomMenu from "../components/BottomMenu";
import { Campanha } from "../models/Campanha";
import { useAuth } from "../contexts/AuthContext";

export default function HomeScreen({ navigation }: any) {
  const { conta, role, logout } = useAuth();
  const isOng = role === "ong";
  const contaOng = isOng ? (conta as Ong) : null;
  const insets = useSafeAreaInsets();

  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useFocusEffect(
    useCallback(() => {
      carregarCampanhas();
    }, [])
  );

  async function handleLogout() {
    await logout();
    navigation.replace("Login");
  }

  /*async function carregarCampanhas() {
    try {
      const response = await api.get("/campanha");
      setCampanhas(response.data);
    } catch (error) {
      console.log("Erro:", error);
    } finally {
      setLoading(false);
    }
  }*/


    async function carregarCampanhas() {
  try {
    // Mock: Dados falsos simulando a resposta que viria do banco de dados
    const dadosFalsos = [
      {
        id: "1",
        nome: "Campanha do Agasalho",
        descricao: "Arrecadação de cobertores para o inverno.",
        // Trocamos o link da imagem
        foto: "https://picsum.photos/seed/campanha1/400/200", 
        ong: { nome: "ONG Esperança" }
      },
      {
        id: "2",
        nome: "Cestas Básicas",
        descricao: "Ajude famílias em situação de vulnerabilidade.",
        // Trocamos o link da imagem
        foto: "https://picsum.photos/seed/campanha2/400/200",
        ong: { nome: "Ação Solidária" }
      }
    ];

    // Colocamos os dados falsos na tela ao invés de usar o response.data
    setCampanhas(dadosFalsos as any);
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
      <Header onLogout={handleLogout} />

      <View style={{ paddingTop: insets.top + 5 }}>
        
        {/* Textos de saudação removidos e substituídos pela Logo */}
        <View style={{ marginBottom: 20, marginTop: 10 }}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={{ width: 120, height: 40, resizeMode: 'contain' }} 
          />
        </View>

        <TextInput
          style={homeStyles.search}
          placeholder="Buscar ONGs ou campanhas..."
          value={busca}
          onChangeText={setBusca}
        />

        <View style={homeStyles.sectionRow}>
          <Text style={homeStyles.sectionTitle}>
            {"Campanhas em destaque"}
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
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#16A34A" />
      ) : (
        <FlatList
          data={campanhasFiltradas}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <CampaignCard campanha={item} />}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <BottomMenu navigation={navigation} activeRoute="Home" />
    </SafeAreaView>
  );
}
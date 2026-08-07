import React from "react";
import { Text, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { homeStyles } from "../styles/homeStyles";
import { Campanha } from "../models/Campanha";

interface Props {
  campanha: Campanha;
}

export default function CampaignCard({ campanha }: Props) {
  const navigation = useNavigation<any>();
  const uri = campanha.foto;

  return (
    <TouchableOpacity
      style={homeStyles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("CampanhaDetalhes", { campanha })}
    >
      <ImageBackground
        source={{ uri }}
        style={homeStyles.image}
        imageStyle={{ borderRadius: 15 }}
        onError={(e) => console.log(e.nativeEvent.error)}
      />
      
      <Text style={homeStyles.cardTitle}>
        {campanha.nome}
      </Text>
      
      <Text style={homeStyles.cardSubtitle}>
        {campanha.descricao}
      </Text>
      
      <Text style={homeStyles.location}>
        📍 {campanha.ong?.nome ?? "ONG"}
      </Text>
    </TouchableOpacity>
  );
}
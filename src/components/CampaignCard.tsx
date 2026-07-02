import React from "react";
import {
  View,
  Text,
  ImageBackground,
} from "react-native";

import { homeStyles } from "../styles/homeStyles";
import { Campanha } from "../models/Campanha";

interface Props {
  campanha: Campanha;
}

export default function CampaignCard({
  campanha,
}: Props) {
const API_URL = "http://192.168.0.108:3000";
const uri = `${API_URL}/uploads/ong/${encodeURIComponent(campanha.foto)}`;
console.log("URI:", uri);

return (
  <View style={homeStyles.card}>
    <ImageBackground
      source={{ uri }}
      style={homeStyles.image}
      imageStyle={{ borderRadius: 15 }}
      onError={(e) => console.log("ERRO IMAGEM:", e.nativeEvent.error)}
      onLoad={() => console.log("IMAGEM OK:", campanha.foto)}
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
    </View>
  );
}
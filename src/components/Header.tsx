import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { headerStyles } from "../styles/headerStyles";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <View style={headerStyles.header}>
      <TouchableOpacity
        onPress={onLogout}
        style={headerStyles.logoutButton}
        activeOpacity={0.7}
      >
        <Icon name="logout" size={14} color="#DC2626" style={headerStyles.logoutIcon} />
        <Text style={headerStyles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
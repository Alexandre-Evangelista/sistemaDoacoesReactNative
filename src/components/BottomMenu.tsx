import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { bottomMenuStyles } from "../styles/bottomMenuStyles";

interface BottomMenuProps {
  navigation: any;
  activeRoute: string;
}

const menuItems = [
  { key: "home", label: "Início", icon: "home", route: "Home" },
  { key: "doacoes", label: "Doações", icon: "environment", route: "Doacoes" },
  { key: "perfil", label: "Perfil", icon: "user", route: "Perfil" },
];

export default function BottomMenu({ navigation, activeRoute }: BottomMenuProps) {
  return (
    <View style={bottomMenuStyles.container}>
      {menuItems.map((item) => {
        const isActive = activeRoute === item.route;
        return (
          <TouchableOpacity
            key={item.key}
            style={bottomMenuStyles.button}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(item.route)}
          >
            <Icon
              name={item.icon}
              size={22}
              color={isActive ? "#16A34A" : "#9CA3AF"}
            />
            <Text
              style={[
                bottomMenuStyles.label,
                isActive && bottomMenuStyles.labelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
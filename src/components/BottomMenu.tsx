import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/AntDesign';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { RootStackParamList } from '../routes/types';
import { createBottomMenuStyles } from '../styles/bottomMenuStyles';

type Props = {
  activeRoute: 'Home' | 'Doacoes' | 'Perfil';
};

export default function BottomMenu({ activeRoute }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { role } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createBottomMenuStyles(colors, insets.bottom), [colors, insets.bottom]);
  const menuItems = [
    { key: 'home', label: 'Início', icon: 'home', route: 'Home' as const },
    ...(role === 'usuario'
      ? [{ key: 'doacoes', label: 'Doações', icon: 'inbox', route: 'Doacoes' as const }]
      : []),
    { key: 'perfil', label: 'Perfil', icon: 'user', route: 'Perfil' as const },
  ];

  return (
    <View style={styles.container} accessibilityRole="tablist">
      {menuItems.map((item) => {
        const isActive = activeRoute === item.route;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(item.route)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={item.label}
          >
            <Icon name={item.icon} size={22} color={isActive ? colors.greenDark : colors.placeholder} />
            <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

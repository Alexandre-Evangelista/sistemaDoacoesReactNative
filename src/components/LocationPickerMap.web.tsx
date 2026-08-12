import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../styles/theme';

export type Coordenada = { latitude: number; longitude: number };
type Props = { value: Coordenada | null; onChange: (coords: Coordenada) => void; height?: number };

export default function LocationPickerMap({ value, onChange, height = 180 }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [locating, setLocating] = useState(false);

  async function useCurrentLocation() {
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permissão negada', 'Autorize a localização no navegador para preencher este campo.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      onChange({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    } catch {
      Alert.alert('Localização indisponível', 'Não foi possível obter sua localização pelo navegador.');
    } finally {
      setLocating(false);
    }
  }

  return (
    <View style={[styles.container, { minHeight: height }]}>
      <Icon name="map-pin" size={28} color={colors.greenDark} />
      <Text style={styles.title}>Localização da campanha</Text>
      <Text style={styles.description}>
        {value
          ? `${value.latitude.toFixed(6)}, ${value.longitude.toFixed(6)}`
          : 'O mapa interativo está disponível no aplicativo para Android e iOS.'}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={useCurrentLocation}
        disabled={locating}
        accessibilityRole="button"
        accessibilityState={{ disabled: locating, busy: locating }}
      >
        <Icon name="crosshair" size={16} color={colors.greenDark} />
        <Text style={styles.buttonText}>{locating ? 'Localizando...' : 'Usar minha localização atual'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    alignItems: 'center', justifyContent: 'center', padding: 20, marginBottom: 8,
    borderRadius: 12, borderWidth: 1, borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
  },
  title: { color: colors.textPrimary, fontSize: 15, fontWeight: '700', marginTop: 8 },
  description: { color: colors.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 6 },
  button: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10,
    paddingHorizontal: 14, marginTop: 14, borderRadius: 10, backgroundColor: colors.successSurface,
  },
  buttonText: { color: colors.greenDark, fontSize: 13, fontWeight: '600' },
});

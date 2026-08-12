import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../styles/theme';

export type Coordenada = { latitude: number; longitude: number };
type Props = { value: Coordenada | null; onChange: (coords: Coordenada) => void; height?: number };

const FALLBACK_COORDS = { latitude: -6.1737, longitude: -36.6478 };

function toRegion(coords: Coordenada): Region {
  return { ...coords, latitudeDelta: 0.03, longitudeDelta: 0.03 };
}

export default function LocationPickerMap({ value, onChange, height = 220 }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region | null>(value ? toRegion(value) : null);
  const [loading, setLoading] = useState(!value);
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (value) return;

    async function loadInitialLocation() {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== 'granted') {
          setRegion(toRegion(FALLBACK_COORDS));
          setMessage('Selecione manualmente um ponto no mapa.');
          return;
        }

        const cached = await Location.getLastKnownPositionAsync({ maxAge: 60_000 });
        const location = cached ?? await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const coords = { latitude: location.coords.latitude, longitude: location.coords.longitude };
        setRegion(toRegion(coords));
        onChange(coords);
      } catch {
        setRegion(toRegion(FALLBACK_COORDS));
        setMessage('Não foi possível obter sua localização. Selecione um ponto no mapa.');
      } finally {
        setLoading(false);
      }
    }

    loadInitialLocation();
  }, [onChange, value]);

  function handleMapPress(event: MapPressEvent) {
    onChange(event.nativeEvent.coordinate);
    setMessage(null);
  }

  async function useCurrentLocation() {
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permissão negada', 'Habilite a localização nas configurações do dispositivo ou marque o mapa manualmente.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coords = { latitude: location.coords.latitude, longitude: location.coords.longitude };
      onChange(coords);
      mapRef.current?.animateToRegion(toRegion(coords), 350);
      setMessage(null);
    } catch {
      Alert.alert('Localização indisponível', 'Não foi possível obter sua localização agora.');
    } finally {
      setLocating(false);
    }
  }

  if (loading || !region) {
    return (
      <View style={[styles.container, styles.loadingBox, { height }]}>
        <ActivityIndicator size="small" color={colors.greenDark} />
        <Text style={styles.secondaryText}>Obtendo sua localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={[styles.map, { height }]} initialRegion={region} onPress={handleMapPress}>
        {value && <Marker coordinate={value} />}
      </MapView>
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={useCurrentLocation}
        activeOpacity={0.8}
        disabled={locating}
        accessibilityRole="button"
      >
        <Icon name="crosshair" size={16} color={colors.greenDark} />
        <Text style={styles.currentLocationText}>{locating ? 'Localizando...' : 'Usar minha localização atual'}</Text>
      </TouchableOpacity>
      <Text style={styles.secondaryText}>{message ?? 'Toque no mapa para marcar outro local'}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { borderRadius: 12, overflow: 'hidden', marginBottom: 8, backgroundColor: colors.surface },
  map: { width: '100%' },
  loadingBox: { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.inputBackground, gap: 8 },
  currentLocationButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, backgroundColor: colors.successSurface,
  },
  currentLocationText: { color: colors.greenDark, fontWeight: '600', fontSize: 13 },
  secondaryText: { fontSize: 11, color: colors.textSecondary, textAlign: 'center', paddingVertical: 6 },
});

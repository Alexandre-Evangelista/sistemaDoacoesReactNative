import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, MapPressEvent, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Feather';

type Coordenada = {
  latitude: number;
  longitude: number;
};

type LocationPickerMapProps = {
  value: Coordenada | null;
  onChange: (coords: Coordenada) => void;
  height?: number;
};

export default function LocationPickerMap({
  value,
  onChange,
  height = 220,
}: LocationPickerMapProps) {
  const [regiaoInicial, setRegiaoInicial] = useState<Region | null>(null);
  const [carregandoLocal, setCarregandoLocal] = useState(true);
  const [buscandoLocal, setBuscandoLocal] = useState(false);

  useEffect(() => {
    obterLocalizacaoInicial();
  }, []);

  async function obterLocalizacaoInicial() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setRegiaoInicial({
          latitude: -6.1737,
          longitude: -36.6478,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setRegiaoInicial({
        ...coords,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });

      // já marca automaticamente a localização atual como valor inicial
      if (!value) {
        onChange(coords);
      }
    } finally {
      setCarregandoLocal(false);
    }
  }

  function handleMapPress(event: MapPressEvent) {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    onChange({ latitude, longitude });
  }

  async function usarLocalizacaoAtual() {
    setBuscandoLocal(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      onChange({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } finally {
      setBuscandoLocal(false);
    }
  }

  if (carregandoLocal || !regiaoInicial) {
    return (
      <View style={[styles.container, styles.loadingBox, { height }]}>
        <ActivityIndicator size="small" color="#16A34A" />
        <Text style={styles.loadingTexto}>Obtendo sua localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={[styles.map, { height }]}
        initialRegion={regiaoInicial}
        onPress={handleMapPress}
      >
        {value && <Marker coordinate={value} />}
      </MapView>

      <TouchableOpacity
        style={styles.botaoLocalAtual}
        onPress={usarLocalizacaoAtual}
        activeOpacity={0.8}
        disabled={buscandoLocal}
      >
        <Icon name="crosshair" size={16} color="#16A34A" />
        <Text style={styles.botaoLocalAtualTexto}>
          {buscandoLocal ? 'Localizando...' : 'Usar minha localização atual'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.dica}>Toque no mapa para marcar outro local</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  map: {
    width: '100%',
  },
  loadingBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    gap: 8,
  },
  loadingTexto: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  botaoLocalAtual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#F0FDF4',
  },
  botaoLocalAtualTexto: {
    color: '#16A34A',
    fontWeight: '600',
    fontSize: 13,
  },
  dica: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
});
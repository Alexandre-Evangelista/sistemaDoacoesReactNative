import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = '@app:token';

export async function getStoredToken() {
  if (Platform.OS === 'web') return AsyncStorage.getItem(TOKEN_KEY);

  const secureToken = await SecureStore.getItemAsync(TOKEN_KEY);
  if (secureToken) return secureToken;

  const legacyToken = await AsyncStorage.getItem(TOKEN_KEY);
  if (legacyToken) {
    await setStoredToken(legacyToken);
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
  return legacyToken;
}

export async function setStoredToken(token: string) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function removeStoredToken() {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(TOKEN_KEY);
    return;
  }

  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    AsyncStorage.removeItem(TOKEN_KEY),
  ]);
}

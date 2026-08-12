import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Campanha } from '../models/Campanha';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  CriarCampanha: undefined;
  Perfil: undefined;
  Doacoes: undefined;
  EditarPerfil: undefined;
  Configuracoes: undefined;
  CampanhaDetalhes: { campanha: Campanha };
  AlterarFoto: undefined;
};

export type ScreenProps<RouteName extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, RouteName>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {signUpStyles} from "../styles/signUpStyles";
import * as Location from "expo-location";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import api from "../services/api";

export default function SignUpScreen({ navigation }: any) {
  const [documento, setDocumento] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const [localizacao, setLocalizacao] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    obterLocalizacao();
  }, []);

  async function obterLocalizacao() {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Não foi possível obter sua localização."
        );
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      setLocalizacao({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.log("Erro localização:", error);
    }
  }

  async function handleCadastro() {
    const doc = documento.replace(/\D/g, "");

    const isCPF = doc.length === 11;
    const isCNPJ = doc.length === 14;

    if (!isCPF && !isCNPJ) {
      Alert.alert(
        "Erro",
        "Informe um CPF ou CNPJ válido."
      );
      return;
    }

    if (!nome || !email || !telefone || !senha) {
      Alert.alert(
        "Erro",
        "Preencha todos os campos."
      );
      return;
    }

    try {
      setLoading(true);

      let endpoint = "";

      const body: any = {
        nome,
        email,
        telefone,
        senha,
      };

      if (localizacao) {
        body.geolocalizacao = {
          type: "Point",
          coordinates: [
            localizacao.longitude,
            localizacao.latitude,
          ],
        };
      }

      if (isCPF) {
        endpoint = "/usuario/registrar";
        body.cpf = doc;
        body.tipo = false;
      } else {
        endpoint = "/ongs/registrar";
        body.cnpj = doc;
        body.tipo = true;
      }

      console.log("BODY ENVIADO:", body);

      await api.post(endpoint, body);

      Alert.alert(
        "Sucesso",
        "Conta criada com sucesso!"
      );

      navigation.navigate("Login");
    } catch (error: any) {
      console.log("ERRO CADASTRO:", error.response?.data);

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível realizar o cadastro."
      );
    } finally {
      setLoading(false);
    }
  }

  const somenteNumeros = documento.replace(/\D/g, "");
  const isCNPJ = somenteNumeros.length === 14;

return (
  <SafeAreaView style={signUpStyles.container}>
    <View style={signUpStyles.card}>
      <Text style={signUpStyles.title}>Bem-vindo 👋</Text>

      <Text style={signUpStyles.subtitle}>
        Se registre para continuar doando
      </Text>

      <InputField
        icon="user"
        placeholder={
          isCNPJ ? "Nome da ONG" : "Seu nome"
        }
        value={nome}
        onChangeText={setNome}
      />

      <InputField
        icon="mail"
        placeholder="Seu e-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <InputField
        icon="credit-card"
        placeholder="CPF ou CNPJ"
        value={documento}
        onChangeText={setDocumento}
        keyboardType="numeric"
      />

      <InputField
        icon="phone"
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <InputField
        icon="lock"
        placeholder="Sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <PrimaryButton
        label={loading ? "Cadastrando..." : "Registrar"}
        onPress={handleCadastro}
      />

      <View style={signUpStyles.separator}>
        <View style={signUpStyles.line} />
        <Text style={signUpStyles.separatorText}>ou</Text>
        <View style={signUpStyles.line} />
      </View>

      <TouchableOpacity style={signUpStyles.googleButton}>
        <Text style={signUpStyles.googleText}>
          Continuar com Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={signUpStyles.footerText}>
          Já tem registro?{" "}
          <Text style={signUpStyles.loginText}>
            Faça Login
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);
}


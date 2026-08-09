import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import PrimaryButton from '../components/PrimaryButton';
import LocationPickerMap from '../components/LocationPickerMap';
import campanhaService from '../services/campanhaService';
import doacaoService, { Doacao } from '../services/doacaoService';
import { useAuth } from '../contexts/AuthContext';
import { doacoesStyles } from '../styles/doacoesStyles';
import { colors } from '../styles/loginStyles';

export default function CampanhaDetalhesScreen({ route, navigation }: any) {
  const { campanha: campanhaInicial } = route.params;
  const { conta, role } = useAuth();

  const [campanha, setCampanha] = useState(campanhaInicial);
  const [editando, setEditando] = useState(false);
  const [descricao, setDescricao] = useState(campanha.descricao);
  const [localizacao, setLocalizacao] = useState(
    campanha.latitude && campanha.longitude
      ? { latitude: campanha.latitude, longitude: campanha.longitude }
      : null
  );
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  // Doações
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [carregandoDoacoes, setCarregandoDoacoes] = useState(false);
  const [doacaoEditandoId, setDoacaoEditandoId] = useState<string | null>(null);
  const [quantidadeEdit, setQuantidadeEdit] = useState('');
  const [tipoEdit, setTipoEdit] = useState('');

  // Formulário de nova doação
  const [mostrarFormDoacao, setMostrarFormDoacao] = useState(false);
  const [novaQuantidade, setNovaQuantidade] = useState('');
  const [novoTipo, setNovoTipo] = useState('');
  const [enviandoDoacao, setEnviandoDoacao] = useState(false);

  const cnpjDaCampanha = campanha.cnpjOng ?? campanha.ong?.cnpj;
  const ehDonoDaCampanha = role === 'ong' && conta && 'cnpj' in conta && conta.cnpj === cnpjDaCampanha;
  const ehUsuario = role === 'usuario';

  useFocusEffect(
    useCallback(() => {
      if (ehUsuario) {
        carregarDoacoes();
      }
    }, [ehUsuario, campanha.id])
  );

  async function carregarDoacoes() {
    setCarregandoDoacoes(true);
    try {
      const todas = await doacaoService.listarDoacoes();
      const daCampanha = (todas || []).filter((d) => d.IDcampanha === campanha.id);
      setDoacoes(daCampanha);
    } catch (error: any) {
      console.log('ERRO LISTAR DOACOES:', error.response?.data);
    } finally {
      setCarregandoDoacoes(false);
    }
  }

  async function handleConfirmarDoacao() {
    const quantidadeNum = Number(novaQuantidade);
    if (!novoTipo || !quantidadeNum || quantidadeNum <= 0) {
      Alert.alert('Atenção', 'Preencha o tipo e uma quantidade válida.');
      return;
    }
    if (!conta || !('email' in conta)) {
      Alert.alert('Erro', 'Não foi possível identificar o usuário logado.');
      return;
    }

    setEnviandoDoacao(true);
    try {
      await doacaoService.criarDoacao({
        datadoacao: new Date().toISOString(),
        quantidade: quantidadeNum,
        tipo: novoTipo,
        email: conta.email,
        cnpj: cnpjDaCampanha ?? null,
        IDcampanha: campanha.id,
      });

      setNovaQuantidade('');
      setNovoTipo('');
      setMostrarFormDoacao(false);
      await carregarDoacoes();
      Alert.alert('Obrigado!', 'Sua doação foi registrada com sucesso.');
    } catch (error: any) {
      console.log('ERRO CRIAR DOACAO:', error.response?.data);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível registrar a doação.');
    } finally {
      setEnviandoDoacao(false);
    }
  }

  function iniciarEdicaoDoacao(doacao: Doacao) {
    setDoacaoEditandoId(doacao.id);
    setQuantidadeEdit(String(doacao.quantidade));
    setTipoEdit(doacao.tipo);
  }

  function cancelarEdicaoDoacao() {
    setDoacaoEditandoId(null);
    setQuantidadeEdit('');
    setTipoEdit('');
  }

  async function salvarEdicaoDoacao(doacao: Doacao) {
    const quantidadeNum = Number(quantidadeEdit);
    if (!tipoEdit || !quantidadeNum || quantidadeNum <= 0) {
      Alert.alert('Atenção', 'Preencha o tipo e uma quantidade válida.');
      return;
    }

    try {
      await doacaoService.atualizarDoacao(doacao.id, {
        datadoacao: doacao.datadoacao,
        quantidade: quantidadeNum,
        tipo: tipoEdit,
        cnpj: doacao.cnpj,
        IDcampanha: doacao.IDcampanha,
      });

      cancelarEdicaoDoacao();
      await carregarDoacoes();
    } catch (error: any) {
      console.log('ERRO ATUALIZAR DOACAO:', error.response?.data);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível atualizar a doação.');
    }
  }

  function handleExcluirDoacao(doacao: Doacao) {
    Alert.alert(
      'Excluir doação',
      'Tem certeza que deseja excluir esta doação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await doacaoService.deletarDoacao(doacao.id);
              await carregarDoacoes();
            } catch (error: any) {
              console.log('ERRO EXCLUIR DOACAO:', error.response?.data);
              Alert.alert('Erro', error.response?.data?.message || 'Não foi possível excluir a doação.');
            }
          },
        },
      ]
    );
  }

  async function handleSalvarEdicaoCampanha() {
    if (!descricao) {
      Alert.alert('Atenção', 'A descrição não pode ficar vazia.');
      return;
    }

    setSalvando(true);
    try {
      const atualizada = await campanhaService.atualizarCampanha(campanha.id, {
        descricao,
        latitude: localizacao?.latitude,
        longitude: localizacao?.longitude,
        cnpjOng: cnpjDaCampanha,
      });

      setCampanha({ ...campanha, ...atualizada });
      setEditando(false);
      Alert.alert('Sucesso', 'Campanha atualizada!');
    } catch (error: any) {
      console.log('ERRO ATUALIZAR CAMPANHA:', error.response?.data);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível atualizar a campanha.');
    } finally {
      setSalvando(false);
    }
  }

  function handleExcluirCampanha() {
    Alert.alert(
      'Excluir campanha',
      'Tem certeza que deseja excluir esta campanha? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setExcluindo(true);
            try {
              await campanhaService.deletarCampanha(campanha.id);
              navigation.goBack();
            } catch (error: any) {
              console.log('ERRO EXCLUIR CAMPANHA:', error.response?.data);
              Alert.alert('Erro', error.response?.data?.message || 'Não foi possível excluir a campanha.');
            } finally {
              setExcluindo(false);
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Image source={{ uri: campanha.foto }} style={styles.image} />

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>

        {ehDonoDaCampanha && !editando && (
          <View style={styles.ownerActions}>
            <TouchableOpacity style={styles.ownerButton} onPress={() => setEditando(true)}>
              <Icon name="edit-2" size={18} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ownerButton, { backgroundColor: 'rgba(220,38,38,0.85)' }]}
              onPress={handleExcluirCampanha}
              disabled={excluindo}
            >
              {excluindo ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Icon name="trash-2" size={18} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.ongName}>{campanha.ong?.nome || "ONG Parceira"}</Text>
          <Text style={styles.title}>{campanha.nome}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Sobre a campanha</Text>

          {editando ? (
            <>
              <TextInput
                style={styles.editInput}
                value={descricao}
                onChangeText={setDescricao}
                multiline
                editable={!salvando}
              />

              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Localização</Text>
              <LocationPickerMap value={localizacao} onChange={setLocalizacao} />

              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setDescricao(campanha.descricao);
                    setLocalizacao(
                      campanha.latitude && campanha.longitude
                        ? { latitude: campanha.latitude, longitude: campanha.longitude }
                        : null
                    );
                    setEditando(false);
                  }}
                  disabled={salvando}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                {salvando ? (
                  <ActivityIndicator size="small" color="#16A34A" style={{ flex: 1 }} />
                ) : (
                  <View style={{ flex: 1 }}>
                    <PrimaryButton label="Salvar alterações" onPress={handleSalvarEdicaoCampanha} />
                  </View>
                )}
              </View>
            </>
          ) : (
            <Text style={styles.description}>{campanha.descricao}</Text>
          )}

          {/* Seção de doações - só para usuários */}
          {ehUsuario && !editando && (
            <View style={{ marginTop: 28 }}>
              <View style={styles.donationsSectionHeader}>
                <Text style={styles.sectionTitle}>Minhas doações nesta campanha</Text>
                {carregandoDoacoes && <ActivityIndicator size="small" color={colors.greenDark} />}
              </View>

              {doacoes.length === 0 && !carregandoDoacoes && (
                <Text style={styles.emptyText}>Você ainda não doou para esta campanha.</Text>
              )}

              {doacoes.map((doacao) => (
                <View key={doacao.id} style={doacoesStyles.card}>
                  {doacaoEditandoId === doacao.id ? (
                    <View>
                      <TextInput
                        style={styles.smallInput}
                        placeholder="Tipo (ex: Cestas Básicas)"
                        value={tipoEdit}
                        onChangeText={setTipoEdit}
                      />
                      <TextInput
                        style={styles.smallInput}
                        placeholder="Quantidade"
                        value={quantidadeEdit}
                        onChangeText={setQuantidadeEdit}
                        keyboardType="numeric"
                      />
                      <View style={styles.editActions}>
                        <TouchableOpacity style={styles.cancelButton} onPress={cancelarEdicaoDoacao}>
                          <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.saveSmallButton}
                          onPress={() => salvarEdicaoDoacao(doacao)}
                        >
                          <Text style={styles.saveSmallButtonText}>Salvar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <>
                      <View style={doacoesStyles.cardHeader}>
                        <Text style={doacoesStyles.ongName}>{campanha.ong?.nome || 'ONG Parceira'}</Text>
                        <Text style={doacoesStyles.dateText}>
                          {new Date(doacao.datadoacao).toLocaleDateString('pt-BR')}
                        </Text>
                      </View>
                      <View style={doacoesStyles.cardBody}>
                        <View style={doacoesStyles.iconBox}>
                          <Icon name="package" size={20} color={colors.greenDark} />
                        </View>
                        <View style={doacoesStyles.donationDetails}>
                          <Text style={doacoesStyles.quantityText}>
                            {doacao.quantidade}x {doacao.tipo}
                          </Text>
                        </View>
                        <View style={styles.donationActions}>
                          <TouchableOpacity onPress={() => iniciarEdicaoDoacao(doacao)}>
                            <Icon name="edit-2" size={18} color={colors.textSecondary} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleExcluirDoacao(doacao)}>
                            <Icon name="trash-2" size={18} color="#DC2626" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              ))}

              {mostrarFormDoacao && (
                <View style={styles.novaDoacaoForm}>
                  <TextInput
                    style={styles.smallInput}
                    placeholder="Tipo (ex: Cestas Básicas)"
                    value={novoTipo}
                    onChangeText={setNovoTipo}
                  />
                  <TextInput
                    style={styles.smallInput}
                    placeholder="Quantidade"
                    value={novaQuantidade}
                    onChangeText={setNovaQuantidade}
                    keyboardType="numeric"
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setMostrarFormDoacao(false);
                        setNovoTipo('');
                        setNovaQuantidade('');
                      }}
                      disabled={enviandoDoacao}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    {enviandoDoacao ? (
                      <ActivityIndicator size="small" color={colors.greenDark} style={{ flex: 1 }} />
                    ) : (
                      <View style={{ flex: 1 }}>
                        <PrimaryButton label="Confirmar doação" onPress={handleConfirmarDoacao} />
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {ehUsuario && !editando && !mostrarFormDoacao && (
        <View style={styles.footer}>
          <PrimaryButton label="Fazer uma Doação" onPress={() => setMostrarFormDoacao(true)} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  image: { width: '100%', height: 280, resizeMode: 'cover' },
  backButton: {
    position: 'absolute', top: 20, left: 20,
    backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 20,
  },
  ownerActions: {
    position: 'absolute', top: 20, right: 20,
    flexDirection: 'row', gap: 10,
  },
  ownerButton: {
    backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 20,
  },
  content: { padding: 24, marginTop: -20, backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  ongName: { fontSize: 14, color: '#16A34A', fontWeight: 'bold', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: '#1F2937' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  description: { fontSize: 15, color: '#4B5563', lineHeight: 24 },
  editInput: {
    fontSize: 15, color: '#4B5563', lineHeight: 24,
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12,
    padding: 12, minHeight: 100, textAlignVertical: 'top',
  },
  editActions: { flexDirection: 'row', gap: 12, marginTop: 16, alignItems: 'center' },
  cancelButton: {
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
  },
  cancelButtonText: { color: '#4B5563', fontWeight: '600' },
  footer: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#F3F4F6' },
  donationsSectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  emptyText: { fontSize: 14, color: '#9CA3AF', marginBottom: 12 },
  donationActions: { flexDirection: 'row', gap: 14, marginLeft: 8 },
  smallInput: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10,
    padding: 10, marginBottom: 10, fontSize: 14,
  },
  saveSmallButton: {
    flex: 1, backgroundColor: '#16A34A', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  saveSmallButtonText: { color: '#FFF', fontWeight: '700' },
  novaDoacaoForm: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12,
    padding: 16, marginTop: 8,
  },
});
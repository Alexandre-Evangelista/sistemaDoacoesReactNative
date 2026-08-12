import React, { useCallback, useMemo, useState } from 'react';
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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import PrimaryButton from '../components/PrimaryButton';
import LocationPickerMap from '../components/LocationPickerMap';
import campanhaService from '../services/campanhaService';
import doacaoService, { Doacao } from '../services/doacaoService';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { ScreenProps } from '../routes/types';
import { createDoacoesStyles } from '../styles/doacoesStyles';
import type { ThemeColors } from '../styles/theme';
import { resolveMediaUrl } from '../utils/media';


export default function CampanhaDetalhesScreen({ route, navigation }: ScreenProps<'CampanhaDetalhes'>) {
  const { campanha: campanhaInicial } = route.params;
  const { conta, role } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const donationStyles = useMemo(() => createDoacoesStyles(colors), [colors]);

  const [campanha, setCampanha] = useState(campanhaInicial);
  const [editando, setEditando] = useState(false);
  const [descricao, setDescricao] = useState(campanha.descricao);
  const [localizacao, setLocalizacao] = useState(
    campanha.latitude != null && campanha.longitude != null
      ? { latitude: campanha.latitude, longitude: campanha.longitude }
      : null
  );
  const fotoUri = resolveMediaUrl(campanha.foto);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  // Doações
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [carregandoDoacoes, setCarregandoDoacoes] = useState(false);
  const [doacaoEditandoId, setDoacaoEditandoId] = useState<string | null>(null);
  const [quantidadeEdit, setQuantidadeEdit] = useState('');
  const [tipoEdit, setTipoEdit] = useState('');

  // Modal de nova doação
  const [modalVisivel, setModalVisivel] = useState(false);
  const [novaQuantidade, setNovaQuantidade] = useState('1');
  const [novoTipo, setNovoTipo] = useState('');
  const [enviandoDoacao, setEnviandoDoacao] = useState(false);
  const [erroDoacoes, setErroDoacoes] = useState<string | null>(null);

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
      setErroDoacoes(null);
      const todas = await doacaoService.listarDoacoes();
      const daCampanha = (todas || []).filter((d) => d.IDcampanha === campanha.id);
      setDoacoes(daCampanha);
    } catch {
      setErroDoacoes('Não foi possível carregar suas doações nesta campanha.');
    } finally {
      setCarregandoDoacoes(false);
    }
  }

  function abrirModalDoacao() {
    setNovoTipo('');
    setNovaQuantidade('1');
    setModalVisivel(true);
  }

  async function handleConfirmarDoacao() {
    const quantidadeNum = Number(novaQuantidade);
    if (!novoTipo.trim() || !Number.isFinite(quantidadeNum) || quantidadeNum <= 0) {
      Alert.alert('Atenção', 'Preencha o tipo e uma quantidade válida.');
      return;
    }
    if (!conta || role !== 'usuario' || !conta.email) {
      Alert.alert('Erro', 'Não foi possível identificar o usuário logado.');
      return;
    }

    setEnviandoDoacao(true);
    try {
      await doacaoService.criarDoacao({
        datadoacao: new Date().toISOString(),
        quantidade: quantidadeNum,
        tipo: novoTipo.trim(),
        email: conta.email,
        cnpj: cnpjDaCampanha ?? null,
        IDcampanha: campanha.id,
      });

      setModalVisivel(false);
      setNovaQuantidade('1');
      setNovoTipo('');
      await carregarDoacoes();
      Alert.alert('Obrigado!', `Sua doação para a ${campanha.ong?.nome || 'ONG'} foi registrada. Agradecemos o apoio!`);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      Alert.alert('Erro', message || 'Não foi possível registrar a doação.');
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
    if (!tipoEdit.trim() || !Number.isFinite(quantidadeNum) || quantidadeNum <= 0) {
      Alert.alert('Atenção', 'Preencha o tipo e uma quantidade válida.');
      return;
    }

    try {
      await doacaoService.atualizarDoacao(doacao.id, {
        datadoacao: doacao.datadoacao,
        quantidade: quantidadeNum,
        tipo: tipoEdit.trim(),
        cnpj: doacao.cnpj,
        IDcampanha: doacao.IDcampanha,
      });

      cancelarEdicaoDoacao();
      await carregarDoacoes();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      Alert.alert('Erro', message || 'Não foi possível atualizar a doação.');
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
            } catch (error: unknown) {
              const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
              Alert.alert('Erro', message || 'Não foi possível excluir a doação.');
            }
          },
        },
      ]
    );
  }

  async function handleSalvarEdicaoCampanha() {
    if (!descricao.trim()) {
      Alert.alert('Atenção', 'A descrição não pode ficar vazia.');
      return;
    }

    setSalvando(true);
    try {
      if (!cnpjDaCampanha) throw new Error('Não foi possível identificar a ONG responsável.');
      const atualizada = await campanhaService.atualizarCampanha(campanha.id, {
        descricao: descricao.trim(),
        latitude: localizacao?.latitude,
        longitude: localizacao?.longitude,
        cnpjOng: cnpjDaCampanha,
      });

      setCampanha({ ...campanha, ...atualizada });
      setEditando(false);
      Alert.alert('Sucesso', 'Campanha atualizada!');
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      Alert.alert('Erro', message || (error instanceof Error ? error.message : 'Não foi possível atualizar a campanha.'));
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
            } catch (error: unknown) {
              const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
              Alert.alert('Erro', message || 'Não foi possível excluir a campanha.');
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
        {fotoUri ? (
          <Image source={{ uri: fotoUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Icon name="image" size={44} color={colors.placeholder} />
          </View>
        )}

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
                      campanha.latitude != null && campanha.longitude != null
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
                  <ActivityIndicator size="small" color={colors.greenDark} style={{ flex: 1 }} />
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

              {erroDoacoes && !carregandoDoacoes && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{erroDoacoes}</Text>
                  <TouchableOpacity onPress={carregarDoacoes} accessibilityRole="button">
                    <Text style={styles.retryText}>Tentar novamente</Text>
                  </TouchableOpacity>
                </View>
              )}

              {doacoes.length === 0 && !carregandoDoacoes && !erroDoacoes && (
                <Text style={styles.emptyText}>Você ainda não doou para esta campanha.</Text>
              )}

              {doacoes.map((doacao) => (
                <View key={doacao.id} style={donationStyles.card}>
                  {doacaoEditandoId === doacao.id ? (
                    <View>
                      <TextInput
                        style={styles.smallInput}
                        placeholder="Tipo (ex: Cestas Básicas)"
                        placeholderTextColor={colors.placeholder}
                        value={tipoEdit}
                        onChangeText={setTipoEdit}
                      />
                      <TextInput
                        style={styles.smallInput}
                        placeholder="Quantidade"
                        placeholderTextColor={colors.placeholder}
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
                      <View style={donationStyles.cardHeader}>
                        <Text style={donationStyles.ongName}>{campanha.ong?.nome || 'ONG Parceira'}</Text>
                        <Text style={donationStyles.dateText}>
                          {new Date(doacao.datadoacao).toLocaleDateString('pt-BR')}
                        </Text>
                      </View>
                      <View style={donationStyles.cardBody}>
                        <View style={donationStyles.iconBox}>
                          <Icon name="package" size={20} color={colors.greenDark} />
                        </View>
                        <View style={donationStyles.donationDetails}>
                          <Text style={donationStyles.quantityText}>
                            {doacao.quantidade}x {doacao.tipo}
                          </Text>
                        </View>
                        <View style={styles.donationActions}>
                          <TouchableOpacity onPress={() => iniciarEdicaoDoacao(doacao)}>
                            <Icon name="edit-2" size={18} color={colors.textSecondary} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleExcluirDoacao(doacao)}>
                            <Icon name="trash-2" size={18} color={colors.danger} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {ehUsuario && !editando && (
        <View style={styles.footer}>
          <PrimaryButton label="Fazer uma Doação" onPress={abrirModalDoacao} />
        </View>
      )}

      {/* Modal de nova doação - estilo igual ao anterior */}
      <Modal
        visible={modalVisivel}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalhes da Doação</Text>

            <Text style={styles.label}>O que você vai doar?</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Cesta Básica, Agasalhos..."
              placeholderTextColor={colors.placeholder}
              value={novoTipo}
              onChangeText={setNovoTipo}
            />

            <Text style={styles.label}>Quantidade</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              value={novaQuantidade}
              onChangeText={setNovaQuantidade}
            />

            {enviandoDoacao ? (
              <ActivityIndicator size="large" color={colors.greenDark} style={{ marginTop: 24 }} />
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisivel(false)}>
                  <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirmButton} onPress={handleConfirmarDoacao}>
                  <Text style={styles.modalConfirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  image: { width: '100%', height: 280, resizeMode: 'cover' },
  imagePlaceholder: {
    backgroundColor: colors.imagePlaceholder, alignItems: 'center', justifyContent: 'center',
  },
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
  content: { padding: 24, marginTop: -20, backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  ongName: { fontSize: 14, color: colors.greenDark, fontWeight: 'bold', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  description: { fontSize: 15, color: colors.textSecondary, lineHeight: 24 },
  editInput: {
    fontSize: 15, color: colors.textPrimary, lineHeight: 24,
    backgroundColor: colors.inputBackground,
    borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 12,
    padding: 12, minHeight: 100, textAlignVertical: 'top',
  },
  editActions: { flexDirection: 'row', gap: 12, marginTop: 16, alignItems: 'center' },
  cancelButton: {
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: 12, borderWidth: 1, borderColor: colors.inputBorder,
  },
  cancelButtonText: { color: colors.textSecondary, fontWeight: '600' },
  footer: { padding: 20, backgroundColor: colors.surface, borderTopWidth: 1, borderColor: colors.divider },
  donationsSectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  emptyText: { fontSize: 14, color: colors.placeholder, marginBottom: 12 },
  errorBox: { backgroundColor: colors.dangerSurface, borderRadius: 12, padding: 12, marginBottom: 12 },
  errorText: { color: colors.danger, fontSize: 14, marginBottom: 8 },
  retryText: { color: colors.link, fontSize: 14, fontWeight: '700' },
  donationActions: { flexDirection: 'row', gap: 14, marginLeft: 8 },
  smallInput: {
    borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 10,
    padding: 10, marginBottom: 10, fontSize: 14, color: colors.textPrimary,
    backgroundColor: colors.inputBackground,
  },
  saveSmallButton: {
    flex: 1, backgroundColor: colors.greenDark, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  saveSmallButtonText: { color: '#FFF', fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: colors.inputBackground, borderRadius: 12, padding: 14, fontSize: 16, color: colors.textPrimary, borderWidth: 1, borderColor: colors.inputBorder },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  modalCancelButton: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: colors.inputBackground, borderRadius: 12, marginRight: 8 },
  modalCancelButtonText: { color: colors.textSecondary, fontWeight: 'bold', fontSize: 16 },
  modalConfirmButton: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: colors.greenDark, borderRadius: 12, marginLeft: 8 },
  modalConfirmButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

# Sistema de Doações — aplicativo

Aplicativo multiplataforma desenvolvido para organizar a experiência de doadores e organizações não governamentais. A mesma base React Native é executada em Android, iOS e web por meio do Expo.

Este repositório contém o componente **app** do Sistema de Doações: telas, navegação, estado global, modelos TypeScript, armazenamento local, tema, validações e integrações com recursos do dispositivo.

## Documentação técnica

| Documento | Conteúdo |
| --- | --- |
| [Visão geral e arquitetura](docs/arquitetura.md) | Papel do app, tecnologias, camadas, estrutura e decisões arquiteturais |
| [Armazenamento local](docs/armazenamento-local.md) | Chaves persistidas, ciclo de vida da sessão, segurança e preferências |
| [Navegação](docs/navegacao.md) | Rotas internas, parâmetros, controle de acesso e transições de tela |
| [Diagramas UML](docs/diagramas-uml.md) | Objetos, classes, componentes, casos de uso, estados e atividades |

Toda a documentação descreve exclusivamente os arquivos e comportamentos presentes neste repositório.

## Tecnologias

| Tecnologia | Versão | Finalidade | Documentação |
| --- | ---: | --- | --- |
| React | 19.1.0 | Componentes funcionais, hooks e contextos | [React](https://react.dev/) |
| React Native | 0.81.5 | Interface compartilhada entre Android e iOS | [React Native 0.81](https://reactnative.dev/docs/0.81/getting-started) |
| React Native Web | 0.21 | Execução dos componentes no navegador | [React Native Web](https://necolas.github.io/react-native-web/) |
| Expo SDK | 54 | Toolchain e acesso a funcionalidades nativas | [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/) |
| TypeScript | 5.9 | Tipagem estática do projeto | [TypeScript](https://www.typescriptlang.org/docs/) |
| React Navigation | 7 | Navegação em pilha e rotas tipadas | [React Navigation](https://reactnavigation.org/docs/getting-started/) |
| Axios | 1.x | Cliente de comunicação usado pelos serviços | [Axios](https://axios-http.com/docs/intro) |
| AsyncStorage | 2.2 | Persistência de preferências e dados da sessão | [AsyncStorage](https://react-native-async-storage.github.io/) |
| Expo SecureStore | 15 | Persistência protegida do token em Android/iOS | [SecureStore](https://docs.expo.dev/versions/v54.0.0/sdk/securestore/) |
| Expo Location | 19 | Permissão e leitura de geolocalização | [Location](https://docs.expo.dev/versions/v54.0.0/sdk/location/) |
| Expo ImagePicker | 17 | Seleção de imagens da galeria | [ImagePicker](https://docs.expo.dev/versions/v54.0.0/sdk/imagepicker/) |
| React Native Maps | 1.20 | Seleção visual de coordenadas no app nativo | [React Native Maps](https://github.com/react-native-maps/react-native-maps) |
| jwt-decode | 4 | Leitura local dos dados e expiração do token de sessão | [jwt-decode](https://github.com/auth0/jwt-decode) |

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20.19.x ou versão compatível com o Expo SDK 54;
- npm;
- [Expo Go](https://expo.dev/go) ou um development build;
- para Android local: [Android Studio](https://developer.android.com/studio);
- para iOS local: macOS com [Xcode](https://developer.apple.com/xcode/).

## Instalação

1. Clone o projeto e acesse sua pasta:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd sistemaDoacoesReactNative
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz e defina a variável exigida por `src/config/variaveis.ts`:

   ```env
   EXPO_PUBLIC_URL_API=https://endereco-do-ambiente
   ```

   Não adicione `/` ao final. Variáveis `EXPO_PUBLIC_*` são incorporadas ao bundle e não devem conter segredos.

4. Valide a instalação:

   ```bash
   npm run validate
   npx expo-doctor
   ```

## Execução

Inicie o ambiente Expo:

```bash
npm start
```

No terminal do Expo, pressione `a` para Android, `i` para iOS ou `w` para web. Também estão disponíveis os atalhos:

```bash
npm run android
npm run ios
npm run web
```

## Scripts

| Comando | Ação |
| --- | --- |
| `npm start` | Inicia o Metro e a interface do Expo |
| `npm run android` | Inicia e abre o destino Android |
| `npm run ios` | Inicia e abre o destino iOS |
| `npm run web` | Inicia a versão web |
| `npm run typecheck` | Verifica os tipos TypeScript sem gerar arquivos |
| `npm run expo:check` | Confere a compatibilidade das dependências com o SDK 54 |
| `npm run validate` | Executa `typecheck` e `expo:check` |

## Estrutura do projeto

```text
.
├── assets/                 # Logotipo, favicon, ícones e splash
├── docs/                   # Documentação técnica e diagramas
├── src/
│   ├── components/         # Componentes reutilizáveis
│   ├── config/             # Configuração do ambiente
│   ├── contexts/           # Estado global de autenticação e tema
│   ├── models/             # Tipos das entidades utilizadas pelo app
│   ├── routes/             # Navegação, proteção e tipos das rotas
│   ├── screens/            # Telas e fluxos de interação
│   ├── services/           # Operações de autenticação, campanhas e doações
│   ├── styles/             # Paleta e estilos por tema
│   └── utils/              # Validação e resolução de mídia
├── app.json                # Configuração do Expo e plugins
├── index.ts                # Entrada do aplicativo
├── package.json            # Dependências e scripts
└── tsconfig.json           # Configuração TypeScript
```

## Perfis e funcionalidades

### Usuário

- cadastro por CPF e autenticação por e-mail;
- consulta e pesquisa de campanhas;
- registro, edição e exclusão de doações;
- edição do nome e da foto;
- visualização de estatísticas no perfil.

### ONG

- cadastro e autenticação por CNPJ;
- consulta e pesquisa de campanhas;
- criação, edição e exclusão das próprias campanhas;
- seleção de foto e localização;
- visualização de estatísticas no perfil.

### Recursos comuns

- restauração e encerramento da sessão;
- navegação protegida por autenticação e tipo de conta;
- tema claro/escuro persistente;
- splash e barra de status adaptados ao tema;
- permissões de localização e galeria;
- estados visuais de carregamento, erro e conteúdo vazio;
- suporte a Android, iOS e web.

## Tema

O tema segue a preferência do sistema no primeiro uso. Depois de uma escolha manual em Configurações, o valor é salvo em `@app:theme`. A paleta central fica em `src/styles/theme.ts`, e todas as telas recebem tokens semânticos pelo `ThemeContext`.

## Armazenamento e segurança local

- O token da sessão usa SecureStore em Android/iOS.
- Na web, o token usa o fallback AsyncStorage.
- Conta, tipo de perfil e preferências ficam no AsyncStorage.
- Senhas não são persistidas pelo aplicativo.
- O app remove sessões expiradas ou inconsistentes durante a inicialização.

Detalhes e chaves utilizadas estão em [docs/armazenamento-local.md](docs/armazenamento-local.md).

## Validação do projeto

O projeto foi verificado com:

```bash
npm run validate
npx expo-doctor
npx expo export --platform web
```

Os documentos Markdown também seguem as regras definidas em `.markdownlint.json`.

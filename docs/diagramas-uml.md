# Diagramas UML

Os diagramas usam [Mermaid](https://mermaid.js.org/), formato textual renderizado pelo GitHub. Todos representam arquivos, estados e interações presentes no aplicativo.

## 1. Diagrama de objetos

O diagrama de objetos apresenta uma fotografia de instâncias manipuladas pela interface. Os valores abaixo são ilustrativos.

```mermaid
classDiagram
    class contaAtiva["contaAtiva : Usuario"] {
      email = maria@email.com
      nome = Maria Silva
      tipo = false
    }

    class campanhaSelecionada["campanhaSelecionada : Campanha"] {
      id = camp-001
      nome = Alimentos para famílias
      cnpjOng = 12345678000195
    }

    class ongDaCampanha["ongDaCampanha : ONG"] {
      cnpj = 12345678000195
      nome = ONG Esperança
    }

    class doacaoEmEdicao["doacaoEmEdicao : Doacao"] {
      id = doa-001
      quantidade = 2
      tipo = Cesta básica
      status = Registrada
    }

    contaAtiva --> doacaoEmEdicao : identifica autoria
    doacaoEmEdicao --> campanhaSelecionada : referencia
    campanhaSelecionada --> ongDaCampanha : contém
```

### Leitura do diagrama de objetos

- `contaAtiva` representa o valor mantido no `AuthContext`.
- `campanhaSelecionada` é recebido por `CampanhaDetalhes` em `route.params`.
- `doacaoEmEdicao` representa um item da lista no estado local da tela.
- `ongDaCampanha` corresponde à relação opcional `campanha.ong`.

## 2. Diagrama de classes

O diagrama reúne os modelos TypeScript, contextos e serviços presentes no código.

```mermaid
classDiagram
    direction LR

    class Usuario {
      +string id
      +string email
      +string nome
      +string cpf
      +string telefone
      +string foto
      +number latitude
      +number longitude
    }

    class ONG {
      +string cnpj
      +string nome
      +string email
      +string telefone
      +string descricao
      +string foto
      +number latitude
      +number longitude
    }

    class Campanha {
      +string id
      +string nome
      +string descricao
      +string foto
      +number latitude
      +number longitude
      +string datacriacao
      +string cnpjOng
    }

    class Doacao {
      +string id
      +string datadoacao
      +number quantidade
      +string tipo
      +string email
      +string cnpj
      +string IDcampanha
      +string status
    }

    class AuthContext {
      +Usuario|ONG conta
      +usuario|ong role
      +boolean loading
      +boolean isAuthenticated
      +login(identificador, senha)
      +logout()
      +excluirConta()
      +atualizarFoto(novaFoto)
      +atualizarConta(dados)
    }

    class ThemeContext {
      +boolean isDarkMode
      +ThemeColors colors
      +Theme navigationTheme
      +toggleTheme()
    }

    class AuthService {
      +loginAuto(identificador, senha)
      +salvarSessao(data)
      +getSessaoSalva()
      +logout()
      +atualizarUsuario(email, data)
    }

    class CampanhaService {
      +criarCampanha(data)
      +atualizarCampanha(id, data)
      +deletarCampanha(id)
    }

    class DoacaoService {
      +criarDoacao(data)
      +listarDoacoes()
      +atualizarDoacao(id, data)
      +deletarDoacao(id)
    }

    ONG "1" --> "0..*" Campanha : campanhas
    Usuario "1" --> "0..*" Doacao : doacoes
    Campanha "0..1" --> "0..*" Doacao : doacoes
    ONG "0..1" --> "0..*" Doacao : doacoes
    AuthContext ..> AuthService : utiliza
    AuthService ..> Usuario : manipula
    AuthService ..> ONG : manipula
    CampanhaService ..> Campanha : manipula
    DoacaoService ..> Doacao : manipula
```

### Leitura do diagrama de classes

- `Usuario`, `ONG`, `Campanha` e `Doacao` são interfaces TypeScript.
- Contextos mantêm estado compartilhado e oferecem ações às telas.
- Serviços encapsulam operações por área funcional.
- As associações entre modelos correspondem às propriedades opcionais definidas em `src/models`.

## 3. Diagrama de componentes

O diagrama mostra a decomposição interna do aplicativo e suas dependências.

```mermaid
flowchart TB
    ROOT[«component»<br/>App]

    subgraph Presentation[Apresentação]
      SCREENS[«component»<br/>Screens]
      COMPONENTS[«component»<br/>Components]
      STYLES[«component»<br/>Styles]
    end

    subgraph Application[Aplicação]
      ROUTES[«component»<br/>Routes]
      AUTH[«component»<br/>AuthContext]
      THEME[«component»<br/>ThemeContext]
    end

    subgraph Domain[Domínio local]
      MODELS[«component»<br/>Models]
      UTILS[«component»<br/>Utils]
    end

    subgraph Infrastructure[Infraestrutura]
      SERVICES[«component»<br/>Services]
      STORAGE[«component»<br/>TokenStorage e AsyncStorage]
      NATIVE[«component»<br/>Location, ImagePicker e Maps]
    end

    ROOT --> ROUTES
    ROOT --> AUTH
    ROOT --> THEME
    ROUTES --> SCREENS
    SCREENS --> COMPONENTS
    SCREENS --> SERVICES
    SCREENS --> MODELS
    SCREENS --> UTILS
    SCREENS --> NATIVE
    COMPONENTS --> STYLES
    COMPONENTS --> THEME
    AUTH --> SERVICES
    AUTH --> STORAGE
    THEME --> STORAGE
    SERVICES --> MODELS
```

### Leitura do diagrama de componentes

- `App` compõe providers e navegação.
- `Routes` decide quais telas pertencem à árvore atual.
- `Screens` coordenam os fluxos e reutilizam componentes.
- `Contexts` distribuem sessão e tema.
- `Services`, `Storage` e módulos nativos concentram detalhes de infraestrutura.
- `Models` e `Utils` mantêm contratos e regras locais reutilizáveis.

## 4. Diagrama de casos de uso

```mermaid
flowchart LR
    Visitante([Visitante])
    Usuario([Usuário])
    ONG([Representante de ONG])

    subgraph App[Sistema de Doações App]
      UC1([Cadastrar conta])
      UC2([Autenticar-se])
      UC3([Consultar campanhas])
      UC4([Pesquisar campanha])
      UC5([Visualizar campanha])
      UC6([Registrar doação])
      UC7([Editar doação])
      UC8([Excluir doação])
      UC9([Editar perfil])
      UC10([Alterar foto])
      UC11([Criar campanha])
      UC12([Editar campanha])
      UC13([Excluir campanha])
      UC14([Selecionar localização])
      UC15([Alterar tema])
      UC16([Configurar notificações])
      UC17([Encerrar sessão])
      UC18([Excluir conta])
    end

    Visitante --> UC1
    Visitante --> UC2
    Usuario --> UC3
    Usuario --> UC4
    Usuario --> UC5
    Usuario --> UC6
    Usuario --> UC7
    Usuario --> UC8
    Usuario --> UC9
    Usuario --> UC10
    Usuario --> UC15
    Usuario --> UC16
    Usuario --> UC17
    Usuario --> UC18
    ONG --> UC3
    ONG --> UC4
    ONG --> UC5
    ONG --> UC10
    ONG --> UC11
    ONG --> UC12
    ONG --> UC13
    ONG --> UC15
    ONG --> UC16
    ONG --> UC17
    ONG --> UC18
    UC1 -. inclui .-> UC14
    UC11 -. inclui .-> UC14
```

### Leitura do diagrama de casos de uso

- Visitantes acessam cadastro e autenticação.
- Usuários controlam perfil e doações.
- ONGs controlam perfil e campanhas.
- Tema, foto, configurações e sessão aparecem conforme o acesso da tela.
- A localização é opcional no cadastro e utilizada na criação/edição de campanha.

## 5. Diagrama de estados da sessão

```mermaid
stateDiagram-v2
    [*] --> Carregando

    Carregando --> Visitante: sessão ausente ou inválida
    Carregando --> UsuarioAutenticado: role usuario
    Carregando --> OngAutenticada: role ong

    Visitante --> Autenticando: enviar formulário
    Autenticando --> Visitante: falha
    Autenticando --> UsuarioAutenticado: conta de usuário
    Autenticando --> OngAutenticada: conta de ONG

    UsuarioAutenticado --> AtualizandoConta: editar perfil ou foto
    OngAutenticada --> AtualizandoConta: alterar foto
    AtualizandoConta --> UsuarioAutenticado: role usuario
    AtualizandoConta --> OngAutenticada: role ong

    UsuarioAutenticado --> Visitante: logout ou exclusão
    OngAutenticada --> Visitante: logout ou exclusão
```

### Leitura do diagrama de estados

- O estado `Carregando` evita exibir uma rota incorreta durante a restauração.
- `Visitante` possui somente as rotas públicas.
- O papel da conta define um dos dois estados autenticados.
- A atualização da conta preserva o papel e substitui os dados em memória.
- Logout ou exclusão limpam o contexto e retornam à árvore pública.

## 6. Diagrama de atividades — registrar uma doação

```mermaid
flowchart TD
    A([Início]) --> B[Abrir card de campanha]
    B --> C[Renderizar CampanhaDetalhes]
    C --> D{role é usuario?}
    D -- Não --> E[Ocultar ação de doação]
    E --> Z([Fim])
    D -- Sim --> F[Exibir doações da campanha]
    F --> G[Tocar em Fazer uma Doação]
    G --> H[Preencher tipo e quantidade]
    H --> I{Dados válidos?}
    I -- Não --> J[Exibir alerta]
    J --> H
    I -- Sim --> K[Ativar indicador de envio]
    K --> L[Executar criarDoacao]
    L --> M{Operação concluída?}
    M -- Não --> N[Exibir erro e manter formulário]
    N --> H
    M -- Sim --> O[Fechar modal]
    O --> P[Atualizar lista da tela]
    P --> Q[Exibir confirmação]
    Q --> Z
```

### Leitura do diagrama de atividades

- A ação existe somente para `role === usuario`.
- Tipo deve possuir texto e quantidade deve ser numérica e maior que zero.
- O indicador evita múltiplos envios durante a operação.
- Sucesso fecha o modal e atualiza a lista; falha preserva o contexto de edição.

## Diagrama complementar de navegação

```mermaid
flowchart LR
    Login --> SignUp
    SignUp --> Login
    Login --> Home
    Home --> CampanhaDetalhes
    Home --> CriarCampanha
    Home --> Perfil
    Home --> Doacoes
    Perfil --> EditarPerfil
    Perfil --> AlterarFoto
    Perfil --> Configuracoes
    Doacoes --> Home
    Doacoes --> Perfil
    Perfil --> Home
```

As arestas apresentam transições possíveis; `CriarCampanha` pertence à ONG e `Doacoes`/`EditarPerfil` pertencem ao usuário. O catálogo completo está em [navegacao.md](navegacao.md).

## Manutenção dos diagramas

Quando uma tela, modelo ou fluxo mudar:

1. atualize a implementação correspondente;
2. revise o catálogo em [navegacao.md](navegacao.md);
3. atualize os diagramas afetados;
4. renderize o Markdown em um ambiente compatível com Mermaid;
5. execute a validação Markdown antes de entregar a alteração.

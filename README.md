# SRM Credit Engine — Frontend

Interface do operador para simulação, liquidação e acompanhamento de recebíveis multimoedas. Construída com **React 19 + TypeScript + Vite**.

---

## Sumário

- [Stack](#stack)
- [Como rodar](#como-rodar)
  - [Com Docker](#com-docker)
  - [Sem Docker (Node local)](#sem-docker-node-local)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Funcionalidades](#funcionalidades)
- [Arquitetura e decisões de design](#arquitetura-e-decisões-de-design)
- [Git workflow](#git-workflow)

---

## Stack

| Responsabilidade | Tecnologia | Justificativa |
|---|---|---|
| Framework | React 19 + TypeScript | Tipagem no frontend; componentes funcionais com hooks |
| Bundler | Vite 8 | Dev server rápido, HMR, alias `@/` via `resolve.alias` |
| Estado servidor | TanStack Query v5 | Cache automático, invalidação cirúrgica, `staleTime` de 30s |
| Tabelas | TanStack Table v8 | Paginação server-side, colunas tipadas, sem opinião sobre UI |
| HTTP | Axios | Interceptors, baseURL via env, tipos de resposta inferidos |
| Qualidade | ESLint + Prettier + Husky + commitlint | Lint e formatação antes de cada commit |

---

## Como rodar

O backend precisa estar rodando antes de iniciar o frontend (veja [case-srm-back](https://github.com/lenigmacedo/case-srm-back)).

### Com Docker

Requer: **Docker** instalado.

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd case-srm-front

# 2. Build da imagem passando a URL da API
docker build \
  --build-arg VITE_API_URL=http://localhost:3000 \
  -t srm-frontend .

# 3. Suba o container
docker run -p 80:80 srm-frontend
```

A aplicação estará disponível em **http://localhost:80**.

> **Por que `--build-arg` e não variável de ambiente em runtime?**  
> O Vite injeta `VITE_API_URL` diretamente no bundle JS durante o `yarn build`. O container final é apenas nginx servindo arquivos estáticos — não há Node rodando, então variáveis de runtime não têm efeito. A URL precisa ser definida no momento do build.

---

### Sem Docker (Node local)

Requer: **Node.js 20+** e **Yarn**.

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd case-srm-front

# 2. Instale as dependências
yarn install

# 3. Configure o ambiente
# crie um arquivo .env na raiz com:
# VITE_API_URL=http://localhost:3000

# 4. Inicie o servidor de desenvolvimento
yarn dev
```

A aplicação estará disponível em **http://localhost:5173**.

---

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | URL base da API do backend |

---

## Estrutura de pastas

```
src/
├── components/
│   ├── layout/
│   │   └── AppLayout.tsx          # Shell da aplicação: sidebar + tabs
│   └── ui/                        # Átomos reutilizáveis (Button, Input, Select,
│       ├── Button.tsx              # Card, Modal, Pill, Spinner, Toast, Label)
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── ...
│
├── features/                      # Organização por domínio de negócio
│   ├── simulator/
│   │   ├── components/
│   │   │   ├── FormSimulacao.tsx  # Formulário dumb: recebe props, dispara callbacks
│   │   │   └── ResultadoSimulacao.tsx
│   │   ├── hooks/
│   │   │   └── useSimulator.ts    # Toda a lógica: queries, mutations, debounce
│   │   └── index.tsx              # Composição: conecta hook → componentes
│   │
│   ├── transactions/              # Grid com paginação server-side
│   ├── cedentes/                  # CRUD de cedentes
│   ├── currencies/                # Visualização e atualização de taxas
│   └── receivable-types/          # CRUD de tipos de recebível
│
├── services/
│   └── api/
│       ├── client.ts              # Instância axios com baseURL do env
│       ├── transactions.ts
│       ├── currencies.ts
│       ├── cedentes.ts
│       └── receivable-types.ts
│
├── hooks/
│   └── useToast.ts                # Toast global
│
├── types/
│   └── api.ts                     # Tipos compartilhados das respostas da API
│
└── lib/
    └── utils.ts                   # maskBRL, stripBRL e utilitários
```

---

## Funcionalidades

### Painel de Simulação

- Formulário com campos: valor de face, cedente (opcional), tipo de recebível, data de vencimento, moeda de origem e moeda de pagamento.
- Debounce de **800ms**: a simulação é disparada automaticamente após o usuário parar de digitar — sem botão de "calcular".
- Exibe em tempo real: valor presente, deságio (R$ e %), spread mensal, taxa base, prazo calculado e taxa de câmbio aplicada quando há conversão cross-currency.
- Botão "Registrar" executa a liquidação (persiste no banco via ACID).

### Grid de Transações

- Tabela server-side com paginação via TanStack Table.
- Filtros dinâmicos por cedente, moeda de pagamento e período (data inicial/final).
- Cache automático via TanStack Query, invalidado após cada liquidação bem-sucedida.

### Gestão de Câmbio

- Exibe todas as moedas cadastradas com taxa em relação ao BRL.
- Modal de edição para atualização manual da taxa de câmbio.

### Gestão de Cedentes

- Listagem, criação (nome + CNPJ + tier de risco) e remoção de cedentes.

### Tipos de Recebível

- Listagem, criação (código, nome e spread mensal) e remoção de tipos.

---

## Arquitetura e decisões de design

### Separação UI / lógica

Componentes dentro de `features/*/components/` são **dumb**: recebem props tipadas e disparam callbacks. Eles não conhecem a API, não fazem fetch e não mantêm estado derivado de servidor.

Toda a lógica vive nos custom hooks em `features/*/hooks/`: queries com TanStack Query, mutations, debounce e formatação.

A composição acontece no `index.tsx` de cada feature, que conecta o hook ao componente.

```
features/simulator/index.tsx
    ↓ usa
features/simulator/hooks/useSimulator.ts   (TanStack Query, mutations)
    ↓ passa props para
features/simulator/components/FormSimulacao.tsx  (dumb)
features/simulator/components/ResultadoSimulacao.tsx  (dumb)
```

### TanStack Query como camada de estado servidor

`staleTime: 30_000` no `QueryClient` global evita refetches desnecessários para dados como lista de cedentes e tipos de recebível, que mudam com baixa frequência.

A invalidação de `["transactions"]` após `liquidate` garante que o grid de transações reflita o novo registro sem reload manual.

### Debounce na simulação

O `FormSimulacao` usa `useEffect` com `setTimeout` de 800ms para disparar `onSimulate`. Um `useRef` guarda a referência estável ao callback, evitando que a função recriada a cada render resete o timer indevidamente.

### Sem fetch direto em componentes

Nenhum componente importa `axios` ou `fetch` diretamente. Todo acesso à API passa pelos services em `src/services/api/`, que são consumidos exclusivamente pelos hooks.

### Alias `@/`

O Vite está configurado com `resolve.alias: { '@': './src' }`, o que permite imports limpos como `@/components/ui` em vez de caminhos relativos longos.

### QueryClient global no entry point

O `QueryClientProvider` envolve toda a aplicação em `main.tsx`, tornando o cache disponível para qualquer hook sem prop-drilling do cliente.

---

## Git workflow

O projeto segue **GitHub Flow**: branches de feature mergeadas via Pull Request na `main`.

Hooks configurados com Husky:

| Hook | O que faz |
|---|---|
| `pre-commit` | ESLint + Prettier via `lint-staged` nos arquivos `src/**/*.{ts,tsx}` |
| `commit-msg` | `commitlint` exige Conventional Commits |
| `pre-push` | (configurado — adicionar suíte de testes quando implementados) |

Padrão de commits: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `chore:`

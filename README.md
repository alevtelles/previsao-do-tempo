# Weather Forecast App

Aplicacao de previsao do tempo desenvolvida com React e Node.js.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## Funcionalidades

- Busca de previsao do tempo por cidade
- Exibicao do clima atual com temperatura, umidade e velocidade do vento
- Previsao para os proximos 5 dias
- Interface moderna com animacoes e efeitos visuais
- Fundo dinamico que muda conforme a condicao climatica
- Design responsivo para mobile e desktop

## Screenshots

### Estado Inicial
Tela inicial com sugestoes de busca rapida.

### Resultado da Busca
Exibe clima atual e previsao com icones animados.

## Tecnologias

### Front-end (`vite-fe/`)
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipagem estatica
- **Vite** - Build tool
- **TailwindCSS** - Estilizacao
- **shadcn/ui** - Componentes de UI
- **React Hook Form** - Gerenciamento de formularios
- **Zod** - Validacao de dados
- **Axios** - Cliente HTTP
- **Lucide React** - Icones

### Back-end (`node.api/`)
- **Node.js** - Runtime
- **TypeScript** - Tipagem estatica
- **Fastify** - Framework web
- **TypeORM** - ORM para persistencia
- **SQLite** - Banco de dados
- **Axios** - Cliente HTTP
- **dotenv** - Variaveis de ambiente

## Pre-requisitos

- Node.js 18+
- npm ou yarn
- Chave da API OpenWeatherMap

## Instalacao

### 1. Clone o repositorio

```bash
git clone <url-do-repositorio>
cd prompt
```

### 2. Configure o Back-end

```bash
cd node.api
npm install
```

Crie um arquivo `.env` com sua chave da API:

```env
OPENWEATHER_API_KEY=sua_chave_aqui
PORT=3001
```

> Obtenha sua chave gratuita em: https://openweathermap.org/api

### 3. Configure o Front-end

```bash
cd ../vite-fe
npm install
```

## Executando a Aplicacao

### Terminal 1 - Back-end

```bash
cd node.api
npm run dev
```

O servidor estara disponivel em: http://localhost:3001

### Terminal 2 - Front-end

```bash
cd vite-fe
npm run dev
```

A aplicacao estara disponivel em: http://localhost:5173

## Estrutura do Projeto

```
prompt/
├── node.api/                    # Back-end
│   ├── src/
│   │   ├── clients/             # Clientes de APIs externas
│   │   ├── controllers/         # Controladores HTTP
│   │   ├── database/            # Configuracao do TypeORM
│   │   ├── entities/            # Entidades do banco
│   │   ├── routes/              # Rotas da API
│   │   ├── services/            # Logica de negocio
│   │   ├── types/               # Tipos TypeScript
│   │   └── server.ts            # Ponto de entrada
│   ├── .env                     # Variaveis de ambiente
│   └── package.json
│
├── vite-fe/                     # Front-end
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   │   ├── ui/              # Componentes shadcn
│   │   │   └── ...              # Componentes customizados
│   │   ├── services/            # Servicos de API
│   │   ├── types/               # Tipos TypeScript
│   │   └── App.tsx              # Componente principal
│   └── package.json
│
├── DOCUMENTACAO.md              # Documentacao tecnica detalhada
└── README.md                    # Este arquivo
```

## API Endpoints

### GET /api/weather

Retorna a previsao do tempo para uma cidade.

**Parametros:**
- `city` (query string, obrigatorio): Nome da cidade

**Exemplo:**
```bash
curl "http://localhost:3001/api/weather?city=Sao%20Paulo"
```

**Resposta:**
```json
{
  "city": "Sao Paulo",
  "country": "BR",
  "current": {
    "temp": 25,
    "tempMin": 22,
    "tempMax": 28,
    "humidity": 65,
    "windSpeed": 3.5,
    "condition": "cloud",
    "description": "nublado"
  },
  "forecast": [
    {
      "date": "2025-12-18",
      "tempMin": 20,
      "tempMax": 30,
      "humidity": 70,
      "windSpeed": 4.2,
      "condition": "sun",
      "description": "Clear"
    }
  ]
}
```

### GET /health

Verifica se o servidor esta funcionando.

```bash
curl "http://localhost:3001/health"
```

## Scripts Disponiveis

### Back-end (`node.api/`)

| Script | Descricao |
|--------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento |
| `npm run build` | Compila o TypeScript |
| `npm run start` | Inicia o servidor compilado |
| `npm run typecheck` | Verifica erros de TypeScript |

### Front-end (`vite-fe/`)

| Script | Descricao |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Compila para producao |
| `npm run preview` | Visualiza a build de producao |

## Validacoes Implementadas

### Front-end
- Minimo de 2 caracteres
- Maximo de 100 caracteres
- Remocao de caracteres especiais perigosos
- Validacao com Zod

### Back-end
- Mesmas validacoes do front-end
- Sanitizacao de entrada
- Tratamento de erros da API externa
- Log de todas as consultas

## Boas Praticas

- **Sem `any`**: Tipagem completa em TypeScript
- **Separacao de camadas**: Controller > Service > Client
- **Variaveis de ambiente**: Chaves sensiveis protegidas
- **Validacao dupla**: Front-end e back-end
- **Logs de auditoria**: Todas as buscas sao registradas

## Limitacoes

- A API gratuita do OpenWeatherMap fornece apenas 5 dias de previsao
- Para 7+ dias, seria necessario usar a "One Call API" (plano pago)

## Licenca

MIT

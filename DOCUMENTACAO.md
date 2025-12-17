# Aplicação de Previsão do Tempo

Esta documentação explica a implementação de uma aplicação web que exibe a previsão do tempo de uma cidade, incluindo informações do dia atual e dos próximos 7 dias.

## Arquitetura Geral

O projeto segue uma arquitetura cliente-servidor com separação clara de responsabilidades:

```
prompt/
├── node.api/                    # Back-end (API REST)
│   ├── src/
│   │   ├── clients/             # Clientes externos (OpenWeatherMap)
│   │   ├── controllers/         # Controladores HTTP
│   │   ├── database/            # Configuração do TypeORM
│   │   ├── entities/            # Entidades do banco de dados
│   │   ├── routes/              # Definição de rotas
│   │   ├── services/            # Lógica de negócio
│   │   ├── types/               # Tipos TypeScript
│   │   └── server.ts            # Ponto de entrada
│   ├── .env                     # Variáveis de ambiente (NÃO VERSIONAR)
│   └── package.json
│
├── vite-fe/                     # Front-end (React)
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   │   ├── ui/              # Componentes shadcn/ui
│   │   │   └── ...              # Componentes customizados
│   │   ├── services/            # Serviços de API
│   │   ├── types/               # Tipos TypeScript
│   │   ├── lib/                 # Utilitários
│   │   └── App.tsx              # Componente principal
│   └── package.json
│
└── DOCUMENTACAO.md
```

## Fluxo de Dados

```
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐    ┌──────────────────┐
│   Usuário   │───►│   Front-end  │───►│    Back-end     │───►│  OpenWeatherMap  │
│  (Browser)  │    │  (React)     │    │   (Fastify)     │    │      API         │
└─────────────┘    └──────────────┘    └─────────────────┘    └──────────────────┘
                          │                    │
                          ▼                    ▼
                   ┌──────────────┐    ┌─────────────────┐
                   │  Validação   │    │   Persistência  │
                   │    (Zod)     │    │   (TypeORM)     │
                   └──────────────┘    └─────────────────┘
```

1. **Usuário** digita o nome da cidade e clica em "Buscar"
2. **Front-end** valida a entrada com Zod e envia requisição ao back-end
3. **Back-end** valida novamente, consulta a API externa e registra o log
4. **Resposta** é processada e exibida ao usuário

## Back-end (node.api)

### Tecnologias Utilizadas

| Tecnologia | Propósito |
|------------|-----------|
| **Fastify** | Framework web rápido e eficiente |
| **TypeScript** | Tipagem estática |
| **TypeORM** | ORM para persistência de logs |
| **better-sqlite3** | Banco de dados SQLite |
| **Axios** | Cliente HTTP |
| **dotenv** | Variáveis de ambiente |

### Camadas da Aplicação

#### 1. Routes (`src/routes/weather.routes.ts`)

Define os endpoints da API. Responsabilidade única: mapear URLs para controllers.

```typescript
export async function weatherRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/weather', getWeather);
}
```

#### 2. Controllers (`src/controllers/weather.controller.ts`)

Recebe requisições HTTP, valida entrada e retorna respostas.

**Validações implementadas:**
- Mínimo de 2 caracteres
- Máximo de 100 caracteres
- Sanitização de caracteres perigosos (`<`, `>`, `"`, `'`, `&`, `;`)
- Regex para permitir apenas letras, espaços e acentos

```typescript
function sanitizeCity(city: string): string {
  return city
    .trim()
    .replace(/[<>\"'&;]/g, '')
    .substring(0, MAX_CITY_LENGTH);
}
```

#### 3. Services (`src/services/weather.service.ts`)

Contém a lógica de negócio:
- Busca dados da API externa
- Processa e agrupa previsões
- Registra logs de consulta

#### 4. Clients (`src/clients/openweather.client.ts`)

Encapsula a comunicação com APIs externas:
- Gerencia a chave de API
- Trata erros específicos da API
- Define timeout para requisições

```typescript
export async function fetchCurrentWeather(city: string): Promise<OpenWeatherCurrentResponse> {
  const apiKey = getApiKey(); // Lido de process.env
  const response = await axios.get(`${API_BASE_URL}/weather`, {
    params: { q: city, appid: apiKey, units: 'metric' },
    timeout: 10000,
  });
  return response.data;
}
```

#### 5. Entities (`src/entities/SearchLog.entity.ts`)

Modelo de dados para persistência de logs:

```typescript
@Entity('search_logs')
export class SearchLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;         // Cidade buscada

  @Column({ nullable: true })
  cityFound: string;    // Cidade encontrada (pode ser diferente)

  @Column()
  success: boolean;     // Se a busca foi bem-sucedida

  @Column({ nullable: true })
  errorMessage: string; // Mensagem de erro, se houver

  @Column()
  ipAddress: string;    // IP do cliente

  @CreateDateColumn()
  createdAt: Date;      // Data/hora da busca
}
```

### Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do `node.api`:

```env
OPENWEATHER_API_KEY=sua_chave_aqui
PORT=3001
```

**IMPORTANTE:** Nunca versione o arquivo `.env` no Git!

### Endpoint da API

**GET /api/weather?city={cidade}**

**Parâmetros:**
- `city` (obrigatório): Nome da cidade (2-100 caracteres)

**Resposta de Sucesso (200):**
```json
{
  "city": "São Paulo",
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

**Respostas de Erro:**
- `400 Bad Request`: Parâmetros inválidos
- `404 Not Found`: Cidade não encontrada
- `500 Internal Server Error`: Erro interno

## Front-end (vite-fe)

### Tecnologias Utilizadas

| Tecnologia | Propósito |
|------------|-----------|
| **React** | Biblioteca de UI |
| **TypeScript** | Tipagem estática |
| **Vite** | Build tool |
| **TailwindCSS** | Estilização |
| **shadcn/ui** | Componentes de UI |
| **React Hook Form** | Gerenciamento de formulários |
| **Zod** | Validação de dados |
| **Axios** | Cliente HTTP |

### Validações Implementadas

O formulário valida a entrada **antes** de enviar ao back-end:

```typescript
const searchSchema = z.object({
  city: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .transform((val) => val.trim().replace(/[<>"'&;]/g, ''))
    .refine(
      (val) => /^[\p{L}\p{M}\s\-'.]+$/u.test(val),
      'Caracteres inválidos'
    ),
});
```

### Componentes

| Componente | Responsabilidade |
|------------|------------------|
| `App.tsx` | Gerencia estado global e orquestra componentes |
| `SearchForm.tsx` | Formulário de busca com validação |
| `CurrentWeatherCard.tsx` | Exibe clima atual |
| `ForecastCard.tsx` | Exibe previsão de um dia |
| `WeatherIcon.tsx` | Ícones SVG de clima |

### Tratamento de Estados

```typescript
const [weather, setWeather] = useState<WeatherResponse | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

O front-end exibe:
- **Loading**: Enquanto aguarda resposta
- **Erro**: Se algo deu errado
- **Dados**: Quando a busca é bem-sucedida
- **Vazio**: Estado inicial

## Boas Práticas de Segurança

### 1. Proteção de Credenciais

❌ **ERRADO:**
```typescript
const API_KEY = "9b8953c2fa98575705dabd06e69e56d1"; // Exposta no código!
```

✅ **CORRETO:**
```typescript
const apiKey = process.env['OPENWEATHER_API_KEY']; // Lido do ambiente
```

### 2. Validação em Múltiplas Camadas

A validação é feita em **duas camadas**:
1. **Front-end**: Feedback rápido ao usuário
2. **Back-end**: Proteção real contra ataques

Nunca confie apenas na validação do front-end!

### 3. Sanitização de Entrada

Caracteres potencialmente perigosos são removidos:
- `<` e `>`: Prevenção de XSS
- `"` e `'`: Prevenção de injection
- `&` e `;`: Prevenção de entidades HTML

### 4. Limitação de Tamanho

- Input limitado a 100 caracteres
- Proteção contra ataques de buffer overflow
- Reduz carga no servidor

### 5. Separação de Responsabilidades

O front-end **nunca** acessa a API externa diretamente:
- A chave de API fica segura no servidor
- Possibilidade de rate limiting
- Auditoria centralizada de logs

### 6. Logs de Auditoria

Toda busca é registrada com:
- Cidade buscada
- IP do cliente
- Sucesso/falha
- Timestamp

## Como Executar

### 1. Back-end

```bash
cd node.api
npm install
# Configure o .env com sua chave OpenWeatherMap
npm run dev
```

Servidor disponível em: `http://localhost:3001`

### 2. Front-end

```bash
cd vite-fe
npm install
npm run dev
```

Aplicação disponível em: `http://localhost:5173`

## Verificação de Qualidade

### TypeScript

```bash
# Back-end
cd node.api && npm run typecheck

# Front-end
cd vite-fe && npx tsc -b
```

### Verificar uso de `any`

```bash
grep -r ": any" src/  # Não deve retornar resultados no código-fonte
```

## Resumo das Camadas

| Camada | Arquivo | Responsabilidade |
|--------|---------|------------------|
| **Route** | `weather.routes.ts` | Mapeia URL → Controller |
| **Controller** | `weather.controller.ts` | Valida entrada, retorna resposta |
| **Service** | `weather.service.ts` | Lógica de negócio |
| **Client** | `openweather.client.ts` | Comunicação com API externa |
| **Entity** | `SearchLog.entity.ts` | Modelo de dados |
| **Database** | `data-source.ts` | Configuração do banco |

Esta separação facilita:
- Testes unitários
- Manutenção
- Escalabilidade
- Substituição de componentes

Role

Você é um desenvolvedor de sistemas web sênior, especializado em React, Next.js, Node.js e TypeScript, com forte domínio de arquitetura segura, boas práticas de API, Clean Code e separação de responsabilidades.

Objetivo da Aplicação

Desenvolver uma aplicação web que permita ao usuário consultar a previsão do tempo de uma cidade, exibindo:

Previsão do dia atual

Previsão dos próximos 7 dias

Para cada dia, devem ser exibidos:

Temperatura mínima e máxima

Ícone representativo do clima (sol, nuvem ou chuva)

Velocidade média do vento

Umidade do ar

O usuário deve informar a cidade por meio de um input controlado e acionar a busca via um botão “Buscar”.

Requisitos Funcionais

O sistema deve validar corretamente o nome da cidade antes de processar a requisição.

Erros de cidade inválida, indisponibilidade da API externa ou falhas internas devem ser tratados e exibidos ao usuário de forma amigável.

O front-end NÃO deve acessar diretamente a API externa de clima.

Instruções de Front-end

Criar o front-end no projeto @vite-fe

Utilizar obrigatoriamente:

React + TypeScript

React Hook Form para gerenciamento de formulários

Zod para validações de entrada

Axios para requisições HTTP

TailwindCSS para estilização

shadcn/ui para componentização

Boas práticas obrigatórias:

Validação de entrada no formulário (mínimo de caracteres, remoção de caracteres inválidos).

Tratamento de loading e estados de erro.

Nenhuma chave de API ou URL sensível deve estar hardcoded no front-end.

Comunicação exclusiva com o back-end via API própria.

Instruções de Back-end

Criar o back-end no projeto @node.api

Utilizar obrigatoriamente:

Node.js + TypeScript

Fastify

dotenv para variáveis de ambiente

TypeORM para persistência (mesmo que apenas para logs ou histórico)

Consumir a API do OpenWeatherMap para obter as previsões.

Regras de segurança obrigatórias:

A chave da API do OpenWeatherMap NÃO deve estar hardcoded no código-fonte.

A chave deve ser lida exclusivamente a partir de variáveis de ambiente (process.env).

O back-end deve:

Validar os parâmetros de entrada

Proteger a API contra abuso (ex.: limitar tamanho do input)

Tratar corretamente erros da API externa

NUNCA utilizar o tipo any.

SEMPRE utilizar tipagem explícita e correta.

Regras de Qualidade

Se existir qualquer erro de TypeScript, a tarefa será rejeitada.

Se for utilizado o tipo any, a tarefa será rejeitada.

O código deve seguir princípios de:

Clean Code

Separação de responsabilidades

Camadas bem definidas (controller, service, client externo)

Output Esperado

Implementação completa do front-end e back-end.

Documento em Markdown, explicando:

Arquitetura geral

Fluxo de dados

Validações implementadas

Boas práticas de segurança aplicadas

O documento deve ser escrito como se fosse para um desenvolvedor júnior, com explicações passo a passo.

🔍 Falhas de Segurança no Prompt Original
1. Chave de API exposta

Problema grave:

Use a API OpenWeatherMap com a chave "9b8953c2fa98575705dabd06e69e56d1"


Isso incentiva:

Vazamento de credenciais

Uso indevido da chave

Violação de boas práticas básicas de segurança

Correção aplicada:
A chave deve estar exclusivamente em variáveis de ambiente, nunca no código ou prompt final.

2. Front-end acessando API externa

No prompt original não havia impedimento explícito.

Risco:

Exposição da chave no bundle

Dificuldade de controle, rate limit e auditoria

Correção aplicada:
O front-end só conversa com sua própria API.

3. Ausência de validação de entrada no back-end

Somente o front-end citava validações.

Risco:

Injection de parâmetros

Inputs malformados

Consumo excessivo da API externa

Correção aplicada:
Validação explícita também no back-end.

4. Banco de dados sem propósito definido

TypeORM era exigido, mas sem contexto.

Risco:

Uso artificial de banco

Código confuso

Correção sugerida:
Uso opcional para logs, auditoria ou histórico de consultas.

5. Prompt permitia má separação de responsabilidades

Sem orientação clara de camadas.

Correção aplicada:
Incentivo explícito a controller/service/client externo.
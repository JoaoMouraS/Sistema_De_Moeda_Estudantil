# Sistema de Moeda Estudantil

Sistema que estimula o reconhecimento do mérito estudantil através de uma moeda virtual. Professores distribuem moedas a alunos como reconhecimento; empresas parceiras oferecem vantagens em troca dessas moedas.

> Projeto da disciplina **Laboratório de Desenvolvimento de Software** — Engenharia de Software, PUC Minas. Prof. **João Paulo Carneiro Aramuni**. Lab03 — Release 1 (concluída) · Lab04 — Release 2 (em andamento).

---

## Sumário
- [Visão geral](#visão-geral)
- [Status atual](#status-atual)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Subindo o projeto](#subindo-o-projeto)
- [Credenciais e perfis de teste](#credenciais-e-perfis-de-teste)
- [Como testar](#como-testar)
- [Documentação adicional](#documentação-adicional)
- [Cronograma das sprints](#cronograma-das-sprints)
- [Integrantes](#integrantes)

---

## Visão geral

A plataforma centraliza a economia interna de mérito de uma instituição de ensino:

- **Alunos** cadastram-se com seus dados, recebem moedas dos professores e consultam saldo/extrato.
- **Professores** são pré-cadastrados pela instituição. Recebem **1.000 moedas por semestre** (acumulável) para distribuir como reconhecimento, com uma mensagem aberta e obrigatória.
- **Empresas parceiras** cadastram-se para oferecer vantagens — recebem o histórico de trocas dos alunos.
- **Administrador** gerencia todos os alunos e empresas cadastrados.
- Toda distribuição/resgate é registrada como **transação** consultável em extrato.

---

## Status atual

A Release 1 — **Lab03S03** — implementa o seguinte recorte:

| User Story | Status |
|---|---|
| US01 — Autenticação JWT por papel (Aluno, Professor, Empresa, Admin) | ✅ |
| US02 — Cadastro de Aluno (CRUD final) | ✅ |
| US03 — Aluno consulta extrato e saldo | ✅ |
| US05 — Professor distribui moedas (com mensagem obrigatória, transação atômica) | ✅ |
| US06 — Professor consulta extrato e saldo | ✅ |
| Cadastro/edição/listagem de Empresa Parceira (CRUD final) | ✅ |
| Painel Admin (listagem/edição/exclusão de alunos e empresas) | ✅ |
| US07 — CRUD de Vantagens pela empresa (backend) | ✅ Lab04 |
| Infra de mensageria (RabbitMQ + exchange/filas/DLQ) | ✅ Lab04 |
| US04 — Resgate de vantagens pelo aluno | 🛠 em andamento |
| US08 — Crédito automático de 1.000 moedas/semestre | 🛠 em andamento |
| US09/US10 — Notificações por e-mail + cupom de resgate + WhatsApp | 🛠 em andamento |

---

## Tecnologias

**Backend**
- Java 21
- Micronaut 4.10
- Hibernate / Micronaut Data JPA (ORM) + Flyway (migrations)
- Padrão DAO com `EntityManager`
- Micronaut Security JWT (Bearer, 4h) + BCrypt (custo 12)
- PostgreSQL 14+ (local via Docker ou Neon serverless)
- RabbitMQ 3 (mensageria de notificações) via `micronaut-rabbitmq`
- Jakarta Mail (SMTP) e Google ZXing (geração de QR Code)
- `dotenv-java` para carregar `.env` em desenvolvimento
- Maven 3.9+

**Frontend**
- Angular 17+ (standalone components, signals, lazy routes)
- Angular Material (snackbar, themes)
- TypeScript 5
- Design system próprio (tokens CSS, sem dependência de UI kit externo para os formulários)
- Node.js 20+ / npm

---

## Arquitetura

Arquitetura MVC com camadas bem separadas:

```
Controller (HTTP)  →  DTO  →  Service (regra)  →  DAO (persistência)  →  Entity (JPA)  →  PostgreSQL
                                ↑
                          JWT + RBAC
```

---

## Pré-requisitos

- **Java 21** (JDK)
- **Maven 3.9+** (o projeto já inclui `mvnw`)
- **Node.js 20+** e **npm**
- **Docker Desktop** (para subir PostgreSQL e RabbitMQ localmente)
- _Opcional:_ conta no **[Neon](https://neon.tech)** caso queira hospedar o Postgres na nuvem em vez de localmente.

---

## Subindo o projeto

O backend lê configuração de um arquivo **`.env`** localizado em `Aplicacao/Backend/.env`. O arquivo **não** é versionado; use `.env.example` como template.

### 1. Configurar variáveis de ambiente

```powershell
cd Aplicacao\Backend
Copy-Item .env.example .env
```

Edite o `.env` com seus valores. Os blocos principais:

| Bloco | Variáveis | Quando preencher |
|---|---|---|
| Banco de dados | `DB_URL`, `DB_USER`, `DB_PASSWORD`, `DB_SKIP_BOOTSTRAP` | Sempre |
| JWT | `JWT_SECRET` | Sempre (use um segredo aleatório ≥ 256 bits) |
| CORS | `CORS_ALLOWED_ORIGIN` | Sempre (default: `http://localhost:4200`) |
| RabbitMQ | `RABBITMQ_URI` | Sempre — usado para notificações assíncronas |
| E-mail (SMTP) | `MAIL_ENABLED`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM` | Quando ligar notificações por e-mail |
| WhatsApp | `WHATSAPP_ENABLED`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_TEMPLATE` | Quando ligar notificações no WhatsApp |

#### Opção A — Postgres local (via Docker)

```dotenv
DB_URL=jdbc:postgresql://localhost:5432/moedaestudantil
DB_USER=postgres
DB_PASSWORD=postgres
DB_SKIP_BOOTSTRAP=false
```

Com `DB_SKIP_BOOTSTRAP=false`, o backend tenta criar o database `moedaestudantil` automaticamente no primeiro startup.

#### Opção B — Postgres no Neon (gerenciado)

1. Crie um projeto em [neon.tech](https://neon.tech) e copie a connection string.
2. Converta de `postgresql://user:senha@host/db?sslmode=require` para o formato JDBC:

```dotenv
DB_URL="jdbc:postgresql://ep-xxxxx.sa-east-1.aws.neon.tech/neondb?sslmode=require"
DB_USER=neondb_owner
DB_PASSWORD=<senha-do-neon>
DB_SKIP_BOOTSTRAP=true
```

`DB_SKIP_BOOTSTRAP=true` é obrigatório no Neon — o banco já existe e a conta não tem permissão de `CREATE DATABASE`.

### 2. Subir a infraestrutura local (RabbitMQ + opcionalmente Postgres)

```powershell
cd Aplicacao\Backend
docker compose up -d              # sobe Postgres + RabbitMQ
# OU, se estiver usando Neon, apenas o RabbitMQ:
docker compose up -d rabbitmq
```

Painel do RabbitMQ: `http://localhost:15672` (login `guest` / `guest`).

### 3. Backend

```powershell
cd Aplicacao\Backend
.\mvnw mn:run
```

O backend sobe em `http://localhost:8080`. Endpoints REST sob `/api/*`. O Flyway roda as migrations automaticamente; o `DataSeeder` cria os perfis de teste no primeiro startup.

Swagger UI: `http://localhost:8080/swagger-ui` (clique em **Authorize** e cole o JWT obtido em `/api/auth/login`).

### 4. Frontend

```powershell
cd Aplicacao\Frontend
npm install
npm start
```

O frontend sobe em `http://localhost:4200`.

---

## Credenciais e perfis de teste

O `DataSeeder` cria automaticamente, no primeiro startup, os seguintes perfis para teste:

| Papel | E-mail | Senha | Observações |
|---|---|---|---|
| **Administrador** | `admin@studentcoins.com` | `admin123` | Acesso ao painel admin (listagem/edição/exclusão de alunos e empresas). |
| **Professor** | `joao.aramuni@puc.br` | `senha123` | CPF `11122233344`, vinculado à PUC Minas (Eng. de Software), saldo inicial **1.000 moedas**. |
| **Aluno** | _(criar via /alunos/novo)_ | _(definida no cadastro)_ | Saldo inicial **0** — receberá moedas quando o professor distribuir. |
| **Empresa Parceira** | _(criar via /empresas/novo)_ | _(definida no cadastro)_ | Cadastro aberto. |

**Instituições pré-cadastradas pelo seed:** PUC Minas, UFMG, CEFET-MG.

> Para alterar a senha do professor ou criar outros perfis pré-cadastrados, edite `Aplicacao/Backend/src/main/java/com/puc/moedaestudantil/config/DataSeeder.java`.

---

## Como testar

### Caminho rápido — pela interface web

1. Abra `http://localhost:4200` e clique em **Entrar**.
2. Use as credenciais acima conforme o papel que quer testar.
3. Cada papel é direcionado para seu painel automaticamente:
   - Aluno → `/alunos/painel`
   - Professor → `/professor/painel`
   - Empresa → `/empresas/vantagens`
   - Admin → `/alunos` (listagem)

### Caminho rápido — via API (`curl`)

```bash
# Login professor (retorna JWT)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao.aramuni@puc.br","senha":"senha123"}'

# Listar alunos (precisa de token)
curl -H "Authorization: Bearer <TOKEN>" http://localhost:8080/api/alunos

# Distribuir 100 moedas (regras: saldo suficiente + mensagem ≥10 chars)
curl -X POST http://localhost:8080/api/professores/1/distribuir \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"alunoId":<ID>,"quantidade":100,"mensagem":"Excelente participação em aula."}'
```

---

## Documentação adicional

- **[Descrição do problema (PDF)](Descrição%20Problema%20Lab%2003%20Release1.pdf)** — Especificação original da Release 1.
- **[Histórias de Usuário (PDF)](docs/Histórias-de-Usuário.pdf)** — US01 a US10.
- Diagramas UML em `docs/` (Caso de Uso, Classes, Componentes, ER).

---

## Cronograma das sprints

| Sprint | Entrega | Status |
|---|---|---|
| **Lab03S01** | Diagrama de Casos de Uso, Histórias de Usuário, Diagrama de Classes, Diagrama de Componentes | ✅ |
| **Lab03S02** | Modelo ER, estratégia ORM + DAO, CRUDs iniciais de Aluno e Empresa Parceira | ✅ |
| **Lab03S03** | CRUDs versão final + camada de persistência + arquitetura + feature de Professor | ✅ |
| **Lab04S01** | Infra base (RabbitMQ + Mail + ZXing), notificação de envio de moedas, job semestral | 🛠 em andamento |
| **Lab04S02** | CRUD de Vantagem (back ✅ / front 🛠) + listagem para aluno + diagramas de sequência | 🛠 em andamento |
| **Lab04S03** | Resgate + geração de QR Code + WhatsApp Cloud API + diagrama geral | ⏸ pendente |
| **Lab05S01** | Deploy cloud (Render + Vercel + Neon + CloudAMQP) + diagramas de Comunicação e Implantação | ⏸ pendente |
| **Lab05S02** | Análise crítica de outro grupo + 3 PRs de refatoração | ⏸ pendente |

---

## Integrantes

- [Henrique Carvalho](https://github.com/henriquegdc)
- [João Pedro Moura Santos](https://github.com/JoaoMouraS)
- [Miguel Gomes](https://github.com/Miguelgdn1)

## Professor

[João Paulo Aramuni](https://github.com/joaopauloaramuni)

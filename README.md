# Sistema de Moeda Estudantil

Sistema que estimula o reconhecimento do mérito estudantil através de uma moeda virtual. Professores distribuem moedas a alunos como reconhecimento; empresas parceiras oferecem vantagens em troca dessas moedas.

> Projeto da disciplina **Laboratório de Desenvolvimento de Software** — Engenharia de Software, PUC Minas. Prof. **João Paulo Carneiro Aramuni**. Avaliação Lab03 — Release 1.

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
| US04 — Resgate de vantagens pelo aluno | ⏸ fora de escopo |
| US07 — Cadastro de vantagens pela empresa | ⏸ fora de escopo |
| US08 — Crédito automático de 1.000 moedas/semestre | ⏸ fora de escopo |
| US09/US10 — Notificações por e-mail + cupom de resgate | ⏸ fora de escopo |

---

## Tecnologias

**Backend**
- Java 21
- Micronaut 4.10
- Hibernate / Micronaut Data JPA (ORM)
- Padrão DAO com `EntityManager`
- Micronaut Security JWT (Bearer, 4h) + BCrypt (custo 12)
- PostgreSQL 14+
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
- **Maven 3.9+** (o projeto inclui `mvnw`)
- **Node.js 20+** e **npm**
- **PostgreSQL 14+** rodando em `localhost:5432` com usuário `postgres` / senha `postgres`

> O backend cria automaticamente o database `moedaestudantil` no primeiro startup, se ele ainda não existir.

---

## Subindo o projeto

### 1. Backend

```powershell
cd Aplicacao\Backend
.\mvnw mn:run
```

O backend sobe em `http://localhost:8080`. Endpoints sob `/api/*`.

Variáveis de ambiente opcionais:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — sobrescrevem os defaults do PostgreSQL.
- `JWT_SECRET` — substitui o segredo de assinatura JWT (recomendado em produção; o default é seguro apenas para desenvolvimento).

### 2. Frontend

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

- **[docs/DESENVOLVIMENTO.md](docs/DESENVOLVIMENTO.md)** — Guia técnico para devs (estrutura, convenções, endpoints, regras de negócio, design system, troubleshooting, fluxos de teste).
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

---

## Integrantes

- [Henrique Carvalho](https://github.com/henriquegdc)
- [João Pedro Moura Santos](https://github.com/JoaoMouraS)
- [Miguel Gomes](https://github.com/Miguelgdn1)

## Professor

[João Paulo Aramuni](https://github.com/joaopauloaramuni)

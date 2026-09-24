<div align="center">


#  SOM DAS SEIS

### Ficha digital online para o sistema de RPG **Som das Seis**

*Sua personagem, seu cartaz de procurado, sua rolagem — direto no navegador.*

<br>

[![Acessar a ficha](https://img.shields.io/badge/▶_ACESSAR_A_FICHA-09111d?style=for-the-badge&labelColor=09111d&color=c9a24b)](https://ficha-som-das-seis.vercel.app)

![React](https://img.shields.io/badge/React-09111d?style=flat-square&logo=react&logoColor=c9a24b)
![TypeScript](https://img.shields.io/badge/TypeScript-09111d?style=flat-square&logo=typescript&logoColor=c9a24b)
![Vite](https://img.shields.io/badge/Vite-09111d?style=flat-square&logo=vite&logoColor=c9a24b)
![Supabase](https://img.shields.io/badge/Supabase-09111d?style=flat-square&logo=supabase&logoColor=c9a24b)
![Vercel](https://img.shields.io/badge/Vercel-09111d?style=flat-square&logo=vercel&logoColor=c9a24b)
![Foundry VTT](https://img.shields.io/badge/Foundry_VTT-09111d?style=flat-square&logoColor=c9a24b)

<!--
<img width="1919" height="914" alt="image" src="https://github.com/user-attachments/assets/1d91cf29-6c8c-4b18-9f6c-5188ed3e1bb0" />

-->

</div>

<br>

##  O Caso

> *Uma mesa de RPG. Uma jogadora sem ficha. Um aplicativo que não abria no computador dela.*

O aplicativo de mesa usado na campanha não funcionava corretamente no computador de uma das jogadoras. Para que ela continuasse na sessão, nasceu esta ficha digital: acessível pelo navegador, com **salvamento online** e **integração opcional com o Foundry VTT**.

Cada jogadora tem as próprias fichas, sem instalar nada.

<br>

##  Funcionalidades

| | Para as jogadoras |
|---|---|
| 🔐 | Cadastro e login com e-mail e senha |
| 🏜️ | Tela inicial de boas-vindas com estética de velho oeste |
| 🪪 | Até **cinco fichas** por jogadora, em cartões no estilo **cartaz de procurado** |
| 🖼️ | Upload de retrato da personagem |
| 📋 | Atributos, habilidades, inventário, montaria e notas |
| 🎲 | Rolagens de dados direto na ficha |
| 💾 | Salvamento online automático |
| 📤 | Exportação da ficha em JSON |
| 🔒 | Bloqueio da ficha contra alterações acidentais |

| | Para a administradora |
|---|---|
| 👁️ | Listar e visualizar as fichas das jogadoras |
| 🗑️ | Excluir fichas quando necessário |
| 📊 | Registro das rolagens no banco de dados |
| 🎭 | Módulo opcional que mostra as rolagens no chat do **Foundry VTT** |

<br>

##  Como funciona

<table>
<tr>
<td width="50%" valign="top">

###  Jogadoras

1. Acessam o site pelo navegador
2. Criam uma conta com e-mail e senha
3. Veem a tela inicial com suas fichas
4. Criam até cinco personagens
5. Escolhem uma ficha para usar na sessão
6. Tudo é salvo automaticamente online

</td>
<td width="50%" valign="top">

###  Administradora

A conta administrativa acessa um painel próprio para:

- Ver as fichas criadas pelas jogadoras
- Abrir os dados de uma ficha
- Excluir fichas
- Acompanhar as rolagens registradas

> A conta precisa ter `role = 'admin'` na tabela `profiles` do Supabase.

</td>
</tr>
</table>

<br>

##  Tecnologias

`React` · `TypeScript` · `Vite` · `CSS` · `Supabase Auth` · `Supabase PostgreSQL` · `Row Level Security (RLS)` · `Vercel` · `Foundry VTT`

<br>

## ⚙️ Instalação e configuração

<details>
<summary><b> 1. Configurar o Supabase</b></summary>

<br>

Execute `supabase/schema.sql` no **SQL Editor** do Supabase. Depois, rode as migrations na ordem:

```
supabase/migrations/002_roll_events.sql
supabase/migrations/003_multiple_sheets.sql
```

Para transformar a conta da administradora em admin:

```sql
update public.profiles
set role = 'admin'
where email = 'SEU_EMAIL_ADMIN';
```

</details>

<details>
<summary><b> 2. Variáveis de ambiente na Vercel</b></summary>

<br>

Em **Settings > Environment Variables**, adicione:

| Variável | Valor |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase, terminada em `.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave pública (Publishable ou anon public) |
| `VITE_ADMIN_EMAIL` | E-mail da conta administrativa |

As variáveis devem existir no ambiente **Production**, e um novo deploy deve ser feito depois de salvá-las.

> ⚠️ A chave `service_role` **nunca** deve ser usada no frontend nem em variáveis que começam com `VITE_`.

</details>

<details>
<summary><b> 3. Rodar localmente</b></summary>

<br>

```bash
pnpm install   # instala as dependências
pnpm dev       # inicia o servidor local
```

Para validar o projeto:

```bash
pnpm check
pnpm build
```

</details>

<details>
<summary><b> 4. Publicação</b></summary>

<br>

O projeto está preparado para a Vercel, conectado à branch `main` do GitHub. A cada alteração enviada para a `main`, a Vercel pode iniciar um novo deploy automaticamente.

</details>

<br>

##  Integração com o Foundry VTT

A pasta [`foundry-module`](./foundry-module) contém um módulo personalizado que consulta as rolagens salvas no Supabase e publica os resultados no chat do Foundry.

1. Execute as migrations do Supabase
2. Instale a pasta `foundry-module` em `Data/modules/som-das-seis-rolls` (ou compacte-a em ZIP)
3. Instale o módulo no Foundry
4. Ative o módulo no mundo
5. Configure a URL do Supabase, a chave pública e a conta administrativa nas configurações do módulo
6. Mantenha o mundo aberto como GM

O módulo consulta novas rolagens periodicamente e usa somente a chave pública e as políticas de segurança do Supabase.

<br>

##  Segurança

- Senhas gerenciadas pelo **Supabase Auth**
- Fichas protegidas por **Row Level Security**
- Cada jogadora acessa apenas as próprias fichas
- A administradora consulta as fichas conforme as políticas configuradas
- A chave `service_role` não deve ser compartilhada
- Senhas reais não devem ser salvas no código nem no repositório

<br>

##  Origem do projeto

Este projeto nasceu de uma necessidade real durante uma campanha de RPG: em vez de deixar uma jogadora sem acesso à ficha, foi criada uma alternativa própria, acessível pelo navegador e adaptada ao funcionamento da mesa.

O desenvolvimento contou com apoio de inteligência artificial como ferramenta de programação, organização, documentação e resolução de problemas técnicos. As decisões sobre a necessidade do sistema, o funcionamento da mesa e a solução final foram definidas para atender ao grupo.

<br>

<div align="center">



[**▶ Acessar a ficha**](https://ficha-som-das-seis.vercel.app)

</div>

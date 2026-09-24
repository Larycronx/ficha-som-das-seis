<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=229&color=timeGradient&section=header&reversal=true&text=SOM+DAS+SEIS&textBg=false&fontColor=F5DEB3&fontSize=65&fontAlign=50&fontAlignY=50&animation=twinkling&rotate=0&strokeWidth=0&descSize=20&descAlign=50&descAlignY=60" width="100%" alt="SOM DAS SEIS Banner">

<br>

### Ficha digital online para o sistema de RPG **Som das Seis**

*Sua personagem, seu cartaz de procurado, sua rolagem, direto no navegador.*

<br>

[![Entrar na mesa](https://img.shields.io/badge/ENTRAR_NA_MESA-161110?style=for-the-badge&labelColor=161110&color=161110)](https://ficha-som-das-seis.vercel.app)

![React](https://img.shields.io/badge/React-161110?style=flat-square&logo=react&logoColor=ede2d0)
![TypeScript](https://img.shields.io/badge/TypeScript-161110?style=flat-square&logo=typescript&logoColor=ede2d0)
![Vite](https://img.shields.io/badge/Vite-161110?style=flat-square&logo=vite&logoColor=ede2d0)
![Supabase](https://img.shields.io/badge/Supabase-161110?style=flat-square&logo=supabase&logoColor=ede2d0)
![Vercel](https://img.shields.io/badge/Vercel-161110?style=flat-square&logo=vercel&logoColor=ede2d0)
![Foundry VTT](https://img.shields.io/badge/Foundry_VTT-161110?style=flat-square&logoColor=ede2d0)

<br>

<img src="docs/assets/divisor-laranja.svg" width="100%" alt="">

<br>

## Capturas de tela

<table align="center">
<tr>
<td align="center" width="33%">
<img width="540" height="660" alt="image" src="https://github.com/user-attachments/assets/7037470d-c01a-4a5f-81a5-5f2560eb8cc7" />
<br><sub><b>Entrar na mesa</b><br>Login com e-mail e senha</sub>
</td>
<td align="center" width="33%">
<img width="540" height="660" alt="image" src="https://github.com/user-attachments/assets/0743a188-aa36-4fcf-9572-48d7f5070a66" />
<br><sub><b>Minhas fichas</b><br>Cartões de personagem</sub>
</td>
<td align="center" width="33%">
<img width="540" height="660" alt="image" src="https://github.com/user-attachments/assets/387bb7d6-0792-4a2c-89c8-fcc337bb844d" />
<br><sub><b>Ficha da personagem</b><br>Atributos, inventário e rolagens</sub>
</td>
</tr>
</table>

<sub>Para adicionar mais prints: salve a imagem em `docs/screenshots/` e descomente a linha `<img>` correspondente.</sub>

<br>

<img src="docs/assets/divisor-laranja.svg" width="100%" alt="">

<br>

## O Caso

> *Uma mesa de RPG. Uma jogadora sem ficha. Um aplicativo que não abria no computador dela.*

O aplicativo de mesa usado na campanha não funcionava corretamente no computador de uma das jogadoras.<br>
Para que ela continuasse na sessão, nasceu esta ficha digital: acessível pelo navegador,<br>
com **salvamento online** e **integração opcional com o Foundry VTT**.

Cada jogadora tem as próprias fichas, sem instalar nada.

<br>

<img src="docs/assets/divisor-laranja.svg" width="100%" alt="">

<br>

## Funcionalidades

### Para as jogadoras

| |
|:---:|
| Cadastro e login com e-mail e senha |
| Tela inicial de boas-vindas com estética de velho oeste |
| Até **cinco fichas** por jogadora, em cartões no estilo **cartaz de procurado** |
| Upload de retrato da personagem |
| Atributos, habilidades, inventário, montaria e notas |
| Rolagens de dados direto na ficha |
| Salvamento online automático |
| Exportação da ficha em JSON |
| Bloqueio da ficha contra alterações acidentais |

### Para a administradora

| |
|:---:|
| Listar e visualizar as fichas das jogadoras |
| Excluir fichas quando necessário |
| Registro das rolagens no banco de dados |
| Módulo opcional que mostra as rolagens no chat do **Foundry VTT** |

Depois de atualizar a aplicação, execute no SQL Editor do Supabase as migrations `004_read_own_roll_events.sql`, `005_remove_single_sheet_constraint.sql` e `006_remove_roll_outcome.sql`.

<br>

<img src="docs/assets/divisor-laranja.svg" width="100%" alt="">

<br>

## Como funciona

### Jogadoras

**1.** Acessam o site pelo navegador<br>
**2.** Criam uma conta com e-mail e senha<br>
**3.** Veem a tela inicial com suas fichas<br>
**4.** Criam até cinco personagens<br>
**5.** Escolhem uma ficha para usar na sessão<br>
**6.** Tudo é salvo automaticamente online

### Administradora

A conta administrativa acessa um painel próprio para ver as fichas criadas pelas jogadoras,<br>
abrir os dados de uma ficha, excluir fichas e acompanhar as rolagens registradas.

> A conta precisa ter `role = 'admin'` na tabela `profiles` do Supabase.

<br>

<img src="docs/assets/divisor-laranja.svg" width="100%" alt="">

<br>

## Tecnologias

`React` · `TypeScript` · `Vite` · `CSS`<br>
`Supabase Auth` · `Supabase PostgreSQL` · `Row Level Security (RLS)`<br>
`Vercel` · `Foundry VTT`

<br>

<img src="docs/assets/divisor-laranja.svg" width="100%" alt="">

<br>

## Instalação e configuração

<details>
<summary><b>1. Configurar o Supabase</b></summary>

<br>

Execute `supabase/schema.sql` no **SQL Editor** do Supabase.<br>
Depois, rode as migrations na ordem:

```
supabase/migrations/002_roll_events.sql
supabase/migrations/003_multiple_sheets.sql
supabase/migrations/004_read_own_roll_events.sql
supabase/migrations/005_remove_single_sheet_constraint.sql
supabase/migrations/006_remove_roll_outcome.sql
```

Para transformar a conta da administradora em admin:

```sql
update public.profiles
set role = 'admin'
where email = 'SEU_EMAIL_ADMIN';
```

</details>

<details>
<summary><b>2. Variáveis de ambiente na Vercel</b></summary>

<br>

Em **Settings > Environment Variables**, adicione:

| Variável | Valor |
|:---:|:---:|
| `VITE_SUPABASE_URL` | URL do projeto Supabase, terminada em `.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave pública (Publishable ou anon public) |
| `VITE_ADMIN_EMAIL` | E-mail da conta administrativa |

As variáveis devem existir no ambiente **Production**,<br>
e um novo deploy deve ser feito depois de salvá-las.

> **Atenção:** a chave `service_role` **nunca** deve ser usada no frontend<br>
> nem em variáveis que começam com `VITE_`.

</details>

<details>
<summary><b>3. Rodar localmente</b></summary>

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
<summary><b>4. Publicação</b></summary>

<br>

O projeto está preparado para a Vercel, conectado à branch `main` do GitHub.<br>
A cada alteração enviada para a `main`, a Vercel pode iniciar um novo deploy automaticamente.

</details>

<br>

<img src="docs/assets/divisor-laranja.svg" width="100%" alt="">

<br>

## Integração com o Foundry VTT

A pasta [`foundry-module`](./foundry-module) contém um módulo personalizado<br>
que consulta as rolagens salvas no Supabase e publica os resultados no chat do Foundry.

**1.** Execute as migrations do Supabase<br>
**2.** Instale a pasta `foundry-module` em `Data/modules/som-das-seis-rolls` (ou compacte-a em ZIP)<br>
**3.** Instale o módulo no Foundry<br>
**4.** Ative o módulo no mundo<br>
**5.** Configure a URL do Supabase, a chave pública e a conta administrativa nas configurações do módulo<br>
**6.** Mantenha o mundo aberto como GM

O módulo consulta novas rolagens periodicamente<br>
e usa somente a chave pública e as políticas de segurança do Supabase.

<br>

<img src="docs/assets/divisor-laranja.svg" width="100%" alt="">

<br>

## Segurança

Senhas gerenciadas pelo **Supabase Auth**<br>
Fichas protegidas por **Row Level Security**<br>
Cada jogadora acessa apenas as próprias fichas<br>
A administradora consulta as fichas conforme as políticas configuradas<br>
A chave `service_role` não deve ser compartilhada<br>
Senhas reais não devem ser salvas no código nem no repositório

<br>

<img src="docs/assets/divisor-laranja.svg" width="100%" alt="">

<br>

## Origem do projeto

Este projeto nasceu de uma necessidade real durante uma campanha de RPG:<br>
em vez de deixar uma jogadora sem acesso à ficha, foi criada uma alternativa própria,<br>
acessível pelo navegador e adaptada ao funcionamento da mesa.

O desenvolvimento contou com apoio de inteligência artificial como ferramenta de suporte para programação,<br>
organização, documentação e resolução de problemas técnicos.<br>
As decisões sobre a necessidade do sistema, o funcionamento da mesa e a solução final<br>
foram definidas para atender ao grupo.

<br>

<img src="docs/assets/divisor-laranja.svg" width="100%" alt="">

<br>

[**Entrar na mesa**](https://ficha-som-das-seis.vercel.app)

<br>

<img src="docs/assets/borda-laranja.svg" width="100%" alt="">

</div>

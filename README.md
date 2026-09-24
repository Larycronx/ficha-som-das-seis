# Som das Seis

Ficha digital online para personagens do sistema **Som das Seis**, com estética de velho oeste e suporte para uso durante sessões de RPG.

## Sobre o projeto

Este sistema foi criado como solução para um problema prático: o aplicativo de mesa utilizado na campanha não funcionava corretamente no computador de uma das jogadoras. Para que ela pudesse continuar participando da sessão, foi desenvolvida uma ficha digital acessível pelo navegador, com salvamento online e integração opcional com o Foundry VTT.

O site permite que cada jogadora tenha suas próprias fichas, sem depender de um aplicativo instalado no computador.

## Funcionalidades

- Cadastro e login com e-mail e senha.
- Tela inicial de boas-vindas com estética de velho oeste.
- Criação de até cinco fichas por jogadora.
- Cartões de personagem no estilo cartaz de procurado.
- Upload de retrato para a personagem.
- Ficha com atributos, habilidades, inventário, montaria e notas.
- Rolagens de dados diretamente na ficha.
- Salvamento online automático.
- Exportação da ficha em JSON.
- Bloqueio da ficha para evitar alterações acidentais.
- Área administrativa para listar e visualizar fichas.
- Exclusão de fichas pela administradora.
- Registro das rolagens no banco de dados.
- Módulo opcional para exibir as rolagens no chat do Foundry VTT.

## Como o sistema funciona

### Jogadoras

1. Acessam o site pelo navegador.
2. Criam uma conta com e-mail e senha.
3. Recebem uma tela inicial com suas fichas.
4. Podem criar até cinco personagens.
5. Escolhem uma ficha para editar e usar durante a sessão.
6. As alterações são salvas automaticamente online.

### Administradora

A conta administrativa acessa um painel próprio. Nele é possível:

- Ver as fichas criadas pelas jogadoras.
- Abrir os dados de uma ficha.
- Excluir fichas quando necessário.
- Acompanhar as rolagens registradas pelo sistema.

A conta precisa ter o campo `role` definido como `admin` na tabela `profiles` do Supabase.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- CSS
- Supabase Auth
- Supabase PostgreSQL
- Row Level Security (RLS)
- Vercel
- Foundry VTT

## Configuração do Supabase

Execute o arquivo `supabase/schema.sql` no **SQL Editor** do Supabase.

Depois execute as migrations na ordem:

```text
supabase/migrations/002_roll_events.sql
supabase/migrations/003_multiple_sheets.sql
```

Para transformar a conta da administradora em administradora:

```sql
update public.profiles
set role = 'admin'
where email = 'SEU_EMAIL_ADMIN';
```

## Variáveis da Vercel

Na Vercel, adicione estas variáveis em **Settings > Environment Variables**:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_ADMIN_EMAIL
```

Valores:

- `VITE_SUPABASE_URL`: URL do projeto Supabase, terminada em `.supabase.co`.
- `VITE_SUPABASE_ANON_KEY`: chave pública Publishable ou anon public.
- `VITE_ADMIN_EMAIL`: e-mail da conta administrativa.

As variáveis devem existir no ambiente **Production** e um novo deploy deve ser feito depois de salvá-las.

A chave `service_role` nunca deve ser usada no frontend ou em variáveis que começam com `VITE_`.

## Desenvolvimento local

Instale as dependências:

```bash
pnpm install
```

Inicie o servidor local:

```bash
pnpm dev
```

Valide o projeto:

```bash
pnpm check
pnpm build
```

## Publicação

O projeto está preparado para ser publicado pela Vercel conectado à branch `main` do GitHub.

Sempre que novas alterações forem enviadas para a branch `main`, a Vercel pode iniciar um novo deploy automaticamente.

## Integração com o Foundry VTT

A pasta `foundry-module` contém um módulo personalizado que consulta as rolagens salvas no Supabase e publica os resultados no chat do Foundry.

Para instalar:

1. Execute as migrations do Supabase.
2. Instale a pasta `foundry-module` em `Data/modules/som-das-seis-rolls` ou compacte-a em ZIP.
3. Instale o módulo no Foundry.
4. Ative o módulo no mundo.
5. Configure a URL do Supabase, a chave pública e a conta administrativa nas configurações do módulo.
6. Mantenha o mundo aberto como GM.

O módulo consulta novas rolagens periodicamente. Ele utiliza somente a chave pública e as políticas de segurança do Supabase.

## Segurança

- As senhas são gerenciadas pelo Supabase Auth.
- As fichas são protegidas por Row Level Security.
- Cada jogadora acessa apenas as próprias fichas.
- A administradora pode consultar as fichas conforme as políticas configuradas.
- A chave `service_role` não deve ser compartilhada.
- Senhas reais não devem ser salvas no código ou no repositório.

## Origem do projeto

Este projeto nasceu de uma necessidade real durante uma campanha de RPG: o aplicativo de mesa utilizado não funcionava no computador de uma das jogadoras. Em vez de deixar essa jogadora sem acesso à ficha, foi criada uma alternativa própria, acessível pelo navegador e adaptada ao funcionamento da mesa.

O desenvolvimento foi realizado com apoio de inteligência artificial, utilizada como ferramenta de programação, organização, documentação e resolução de problemas técnicos. As decisões sobre a necessidade do sistema, o funcionamento da mesa e a solução final foram definidas para atender ao grupo.

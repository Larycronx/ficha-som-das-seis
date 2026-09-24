# Modulo Som das Seis para Foundry

Este modulo consulta os eventos de rolagem salvos pelo site e publica cada nova rolagem no chat do Foundry.

## Instalar

1. Execute `supabase/migrations/002_roll_events.sql` no SQL Editor do Supabase.
2. Compacte a pasta `foundry-module` em um arquivo ZIP, ou copie-a para `Data/modules/som-das-seis-rolls`.
3. No Foundry, abra **Add-on Modules > Install Module** e instale o ZIP usando o manifesto `module.json`.
4. Ative o modulo no mundo.
5. Como GM, abra **Configure Settings > Module Settings**.
6. Preencha:
   - URL do Supabase: a URL terminada em `.supabase.co`
   - Chave publica: a Publishable key ou anon public key
   - E-mail administrativo: o e-mail da conta que tem `role = 'admin'`
   - Senha administrativa: a senha dessa conta
7. Salve e deixe o mundo aberto como GM.

O modulo consulta novas rolagens a cada 3 segundos e envia o resultado para o chat. Ele usa somente a chave publica e as politicas RLS; nunca use a chave `service_role`.

# 🚀 Configuração do Supabase

## ⚠️ Status Atual
O sistema está funcionando com **localStorage** como fallback. Para ativar o Supabase, siga os passos abaixo.

## 📋 Passos para Configurar o Supabase

### 1. Acesse o Supabase Dashboard
- Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Faça login na sua conta
- Acesse o projeto: `jptqxyfbvfrcmebmxmxl`

### 2. Execute o Schema SQL
1. No dashboard do Supabase, vá para **"SQL Editor"**
2. Clique em **"New query"**
3. Copie e cole todo o conteúdo do arquivo `supabase-schema.sql`
4. Clique em **"Run"** para executar o script

### 3. Verifique as Tabelas
1. Vá para **"Table Editor"**
2. Confirme que as tabelas foram criadas:
   - ✅ `clients` - Tabela de clientes
   - ✅ `sales` - Tabela de vendas

### 4. Configurar Políticas de Segurança (Opcional)
Se quiser restringir o acesso:
1. Vá para **"Authentication" > "Policies"**
2. Configure as políticas conforme necessário

## 🔧 Schema das Tabelas

### Tabela `clients`
```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- phone (VARCHAR)
- business_type (VARCHAR) - agropecuaria, petshop, mercado, fazenda
- city (VARCHAR)
- location (TEXT)
- importance_level (VARCHAR) - high, medium, low
- weekly_sales (JSONB) - Array de vendas semanais
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabela `sales`
```sql
- id (UUID, Primary Key)
- value (DECIMAL)
- client_name (VARCHAR)
- city (VARCHAR)
- date (DATE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## ✅ Verificação
Após executar o schema, o sistema automaticamente:
- ✅ Tentará conectar ao Supabase
- ✅ Se conectar com sucesso, usará o banco de dados
- ✅ Se falhar, continuará usando localStorage
- ✅ Mostrará logs no console do navegador

## 🐛 Troubleshooting

### Erro 404
- **Causa**: Tabelas não foram criadas
- **Solução**: Execute o schema SQL no Supabase

### Erro de Permissão
- **Causa**: Políticas de segurança muito restritivas
- **Solução**: Verifique as políticas RLS no dashboard

### Dados não aparecem
- **Causa**: Problema de conexão
- **Solução**: Verifique a URL e chave da API

## 📱 Status do Sistema
- 🟢 **Funcionando**: localStorage (fallback)
- 🟡 **Pendente**: Configuração do Supabase
- 🔴 **Erro**: Verificar configurações

## 🎯 Próximos Passos
1. Execute o schema SQL no Supabase
2. Recarregue a aplicação
3. Verifique os logs no console
4. Teste adicionando um cliente/venda

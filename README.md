# Dashboard de Vendas

Um dashboard moderno e funcional para gerenciar clientes e vendas de produtos agropecuários e pet shop.

## 🚀 Funcionalidades

### 📋 Gestão de Clientes
- **Cadastro completo**: Nome, telefone, ramo de trabalho, cidade e localização
- **Integração WhatsApp**: Clique no telefone para abrir conversa direta
- **Google Maps**: Acesso direto à localização do cliente
- **Categorização por importância**: Alta, Média e Baixa prioridade
- **Filtros avançados**: Por ramo, importância, nome e cidade
- **Ordenação**: Por nome, importância ou data de cadastro

### 💰 Gestão de Vendas
- **Cadastro simples**: Valor, cliente, cidade e data da venda
- **Filtros inteligentes**: Por cliente e data
- **Ordenação flexível**: Por valor ou data (crescente/decrescente)
- **Estatísticas**: Total de vendas, valor total e ticket médio
- **Formatação monetária**: Valores em Real brasileiro

### 🎨 Design
- **Interface moderna**: Design limpo e minimalista
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Navegação intuitiva**: Sistema de abas para alternar entre clientes e vendas
- **Cores temáticas**: Azul para clientes, verde para vendas
- **Animações suaves**: Transições e hover effects

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Lucide React** para ícones
- **date-fns** para manipulação de datas
- **CSS moderno** com gradientes e sombras
- **LocalStorage** para persistência de dados

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o projeto:
   ```bash
   npm start
   ```

4. Acesse `http://localhost:3000` no seu navegador

## 🎯 Como Usar

### Cadastrando Clientes
1. Clique em "Novo Cliente"
2. Preencha as informações obrigatórias (nome, telefone, cidade)
3. Selecione o ramo de trabalho e nível de importância
4. Adicione a localização para integração com Google Maps
5. Salve o cliente

### Registrando Vendas
1. Clique em "Nova Venda"
2. Informe o valor da venda
3. Selecione o cliente da lista
4. Digite a cidade onde foi feita a venda
5. Escolha a data da venda
6. Salve a venda

### Organizando Dados
- Use os filtros para encontrar clientes ou vendas específicas
- Ordene por diferentes critérios para melhor visualização
- Clique no telefone para abrir WhatsApp
- Clique em "Ver no Google Maps" para localizar o cliente

## 📱 Recursos Especiais

- **Integração WhatsApp**: Números de telefone são clicáveis e abrem conversa direta
- **Google Maps**: Localizações são acessíveis com um clique
- **Persistência**: Todos os dados são salvos localmente no navegador
- **Responsivo**: Interface adaptada para todos os dispositivos
- **Acessibilidade**: Cores contrastantes e navegação por teclado

## 🔧 Personalização

O dashboard é facilmente personalizável:
- Cores podem ser alteradas no CSS
- Novos campos podem ser adicionados aos formulários
- Filtros adicionais podem ser implementados
- Integrações com APIs externas podem ser adicionadas

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ClientForm.tsx   # Formulário de clientes
│   ├── ClientList.tsx   # Lista de clientes
│   ├── SaleForm.tsx     # Formulário de vendas
│   ├── SaleList.tsx     # Lista de vendas
│   └── TabNavigation.tsx # Navegação por abas
├── hooks/               # Hooks customizados
│   └── useLocalStorage.ts
├── types/               # Definições TypeScript
│   └── index.ts
├── App.tsx              # Componente principal
├── App.css              # Estilos do app
├── index.tsx            # Ponto de entrada
└── index.css            # Estilos globais
```

## 🎨 Paleta de Cores

- **Azul**: #3B82F6 (clientes)
- **Verde**: #10B981 (vendas)
- **Roxo**: #8B5CF6 (estatísticas)
- **Cinza**: #6B7280 (textos secundários)
- **Branco**: #FFFFFF (fundo dos cards)

## 📈 Próximas Funcionalidades

- [ ] Exportação de dados para Excel/PDF
- [ ] Gráficos e relatórios visuais
- [ ] Backup na nuvem
- [ ] Notificações de aniversários de clientes
- [ ] Histórico de vendas por cliente
- [ ] Metas de vendas mensais
- [ ] Integração com sistemas de pagamento

---

Desenvolvido com ❤️ para otimizar a gestão de vendas e relacionamento com clientes.

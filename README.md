# 📧 Classificador Inteligente de Emails

Uma aplicação web que utiliza inteligência artificial para classificar emails automaticamente e gerar sugestões de respostas personalizadas. Desenvolvida com Flask e OpenAI GPT-4.

## 🚀 Funcionalidades

- **Classificação Automática**: Analisa emails e os classifica como "Produtivo" ou "Improdutivo"
- **Sugestões de Resposta**: Gera respostas profissionais e contextualizadas automaticamente
- **Suporte a Múltiplos Formatos**: Aceita arquivos `.txt` e `.pdf`
- **Interface Intuitiva**: Design moderno e responsivo com drag-and-drop
- **Processamento Seguro**: Análise local dos arquivos antes do envio para a API

## 🛠️ Tecnologias Utilizadas

- **Backend**: Python 3.x, Flask
- **IA**: OpenAI GPT-4
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Processamento de PDF**: PyPDF2
- **Gerenciamento de Variáveis**: python-dotenv

## 📋 Pré-requisitos

- Python 3.7 ou superior
- Chave da API OpenAI
- pip (gerenciador de pacotes Python)

## 🔧 Instalação e Configuração Local

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd backend
```

### 2. Crie um ambiente virtual (recomendado)
```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Instale as dependências
```bash
pip install -r requirements.txt
```

### 4. Configure as variáveis de ambiente
1. Copie o arquivo `.env-example` para `.env`:
```bash
copy .env-example .env
```

2. Edite o arquivo `.env` e adicione sua chave da API OpenAI:
```
OPENAI_API_KEY=sua_chave_da_api_aqui
```

### 5. Execute a aplicação
```bash
python app.py
```

A aplicação estará disponível em: `http://localhost:5000`

## 🌐 Deploy Online

A aplicação também está disponível online para uso imediato:

🔗 **Link de Produção**: [desafio-autou.vercel.app](https://desafio-autou.vercel.app)

## 📖 Como Utilizar

### 1. Acesse a aplicação
- **Local**: Abra `http://localhost:5000` no seu navegador
- **Online**: Acesse o link de produção acima

### 2. Envie seu email para análise
Você pode enviar o conteúdo do email de duas formas:

#### Opção A: Upload de Arquivo
- Arraste e solte um arquivo `.txt` ou `.pdf` na área de upload
- Ou clique em "Selecionar Arquivo" para escolher um arquivo

#### Opção B: Digite o Conteúdo
- Cole o texto do email diretamente na caixa de texto

### 3. Analise o resultado
A IA irá:
- Classificar o email como "Produtivo" ou "Improdutivo"
- Gerar uma sugestão de resposta profissional
- Exibir o conteúdo analisado para referência

## 🎯 Categorias de Classificação

### ✅ Produtivo
Exemplos de emails que exigem ação, resposta ou contêm informações relevantes:
- Solicitações de suporte
- Pedidos de atualização de status
- Dúvidas sobre processos
- Envio de arquivos importantes

### ❌ Improdutivo
Exemplo de emails que não exigem ação imediata:
- Mensagens de agradecimento
- Felicitações
- Spam ou propagandas
- Newsletters pessoais

## 📁 Estrutura do Projeto

```
backend/
├── app.py                # Aplicação Flask principal
├── requirements.txt      # Dependências Python
├── .env-example          # Exemplo de variáveis de ambiente
├── templates/
│   └── index.html        # Interface principal
├── static/
│   ├── css/
│   │   └── style.css     # Estilos da aplicação
│   ├── js/
│   │   └── script.js     # Lógica JavaScript
│   └── img/
│       └── icon.png      # Ícone da aplicação
└── email-tests/          # Arquivos de teste
```
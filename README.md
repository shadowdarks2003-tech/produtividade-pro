# Produtividade Pro IA - Centro de Operações

Um sistema profissional de produtividade com IA integrada, agentes autônomos e análise multimodal de documentos.

## 🚀 Características

- **Matriz de Eisenhower**: Organize tarefas por prioridade
- **Timers Inteligentes**: Pomodoro e cronômetro integrados
- **IA Estratégica**: Geração automática de tarefas e planos
- **Agentes Autônomos**: 6 agentes especializados trabalhando para você
- **Chat Central**: Comunique-se com sua IA consciente
- **Análise Multimodal**: Processe textos, imagens, PDFs, áudio e vídeos do YouTube
- **Backend Serverless**: Funções do Netlify para processamento de IA

## 📁 Estrutura do Projeto

```
produtividade-pro/
├── index.html              # Página principal
├── style.css               # Estilos profissionais
├── script.js               # Lógica front-end
├── package.json            # Dependências
├── netlify.toml            # Configuração Netlify
├── assets/
│   ├── audio/              # Sons ambientais
│   └── icons/              # Ícones customizados
└── netlify/functions/      # Funções serverless
    ├── agent-matriz.js
    ├── agent-estrategista.js
    └── agente-contexto.js
```

## 🔧 Instalação Local

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/produtividade-pro.git
cd produtividade-pro
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a variável de ambiente:
```bash
export OPENAI_API_KEY="sua-chave-aqui"
```

4. Execute localmente com Netlify CLI:
```bash
npm install -g netlify-cli
netlify dev
```

## 🌐 Deploy no Netlify

1. Faça push do projeto para GitHub
2. Acesse [netlify.com](https://netlify.com)
3. Conecte seu repositório GitHub
4. Configure a variável de ambiente `OPENAI_API_KEY` nas configurações do Netlify
5. Deploy automático ao fazer push!

## 🤖 Agentes Disponíveis

- **Agente Matriz**: Organiza tarefas na Matriz de Eisenhower
- **Agente Estrategista**: Cria planos de ação a partir de documentos
- **Agente de Contexto**: IA central que monitora tudo
- **Agente Pomodoro**: Gerencia seu foco e pausas
- **Agente Conector**: Integra com calendários e apps externos
- **Agente Analista**: Gera relatórios e insights

## 📊 Como Usar

1. **Adicione Tarefas**: Clique nos quadrantes da Matriz de Eisenhower
2. **Use Timers**: Pomodoro (25 min) ou Cronômetro customizado
3. **Gere Tarefas com IA**: Descreva seu projeto e deixe a IA sugerir tarefas
4. **Chat com IA**: Comunique-se com a IA central em tempo real
5. **Processe Documentos**: Carregue textos, imagens, PDFs, áudio ou links do YouTube

## 🔐 Segurança

- Dados salvos localmente no navegador (localStorage)
- Chave da OpenAI protegida no backend (variável de ambiente)
- Sem armazenamento de dados pessoais em servidores

## 📝 Licença

MIT

## 🤝 Contribuições

Contribuições são bem-vindas! Abra uma issue ou pull request.

---

**Desenvolvido com ❤️ para maximizar sua produtividade**

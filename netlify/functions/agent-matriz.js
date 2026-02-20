const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  const { projectDesc, currentTasks } = JSON.parse(event.body);
  
  const prompt = `
    Você é um especialista em produtividade e Matriz de Eisenhower.
    O usuário descreveu o seguinte projeto: "${projectDesc}".
    As tarefas atuais na matriz são: ${JSON.stringify(currentTasks)}.
    
    Com base nisso, gere uma lista de NOVAS tarefas necessárias para executar o projeto.
    Para cada tarefa, classifique em um dos quadrantes:
    - "urgent-important"
    - "important-not-urgent"
    - "urgent-not-important"
    - "not-urgent-not-important"
    
    Retorne um JSON com o formato: { "tarefas": [ { "nome": "descrição", "quadrante": "categoria" } ] }
    Apenas o JSON, sem texto adicional.
  `;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });
    
    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed)
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro ao processar' }) };
  }
};

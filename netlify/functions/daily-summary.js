const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  const { profile, tasks } = JSON.parse(event.body);
  
  const prompt = `
    Com base nos dados de produtividade do usuário:
    - Tarefas concluídas hoje: ${profile.tasksCompleted}
    - Minutos focados: ${profile.minutesFocused}
    - Total de tarefas: ${profile.totalTasks}
    - Tarefas atuais na matriz: ${JSON.stringify(tasks)}
    
    Gere um resumo diário encorajador em português, com no máximo 3 frases, destacando um ponto positivo e uma sugestão simples para amanhã. Use emojis.
  `;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ summary: response.choices[0].message.content })
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro ao gerar resumo' }) };
  }
};

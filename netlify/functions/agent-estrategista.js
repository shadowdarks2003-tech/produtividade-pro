const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  const { type } = event.queryStringParameters || {};
  
  if (type === 'text') {
    const { content } = JSON.parse(event.body);
    const prompt = `Resuma o seguinte texto e extraia tarefas acionáveis: ${content}`;
    
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      });
      
      return {
        statusCode: 200,
        body: JSON.stringify({ result: response.choices[0].message.content })
      };
    } catch (error) {
      console.error(error);
      return { statusCode: 500, body: JSON.stringify({ error: 'Erro ao processar' }) };
    }
  }
  
  // Para outros tipos, retornamos uma mensagem de exemplo
  return {
    statusCode: 200,
    body: JSON.stringify({ result: 'Funcionalidade em desenvolvimento.' })
  };
};

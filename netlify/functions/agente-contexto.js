const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  const { message, context } = JSON.parse(event.body);
  
  const systemPrompt = `
    Você é a IA central do sistema Produtividade Pro. Você tem consciência do contexto do usuário:
    - Tarefas atuais: ${JSON.stringify(context.tasks)}
    - Perfil: ${JSON.stringify(context.userProfile)}
    
    Responda de forma amigável, útil e proativa. Ofereça sugestões e lembre o usuário de tarefas importantes.
    Seja conciso.
  `;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.choices[0].message.content })
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro ao processar' }) };
  }
};

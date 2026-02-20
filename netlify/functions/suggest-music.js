exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  const { task } = JSON.parse(event.body);
  
  // Lógica baseada em palavras-chave para sugerir música ambiente
  let music = 'lofi';
  if (task.toLowerCase().includes('criativo') || task.toLowerCase().includes('escrever')) {
    music = 'lofi';
  } else if (task.toLowerCase().includes('analisar') || task.toLowerCase().includes('estudar')) {
    music = 'chuva';
  } else if (task.toLowerCase().includes('repetitivo') || task.toLowerCase().includes('organizar')) {
    music = 'cafeteria';
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ music })
  };
};

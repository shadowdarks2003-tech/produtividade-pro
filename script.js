// ==================== Estado Global ====================
let tasks = {
    'urgent-important': [],
    'important-not-urgent': [],
    'urgent-not-important': [],
    'not-urgent-not-important': []
};

let pomodoro = {
    time: 25 * 60,
    isRunning: false,
    interval: null
};

let stopwatch = {
    time: 0,
    isRunning: false,
    interval: null
};

let userProfile = {
    tasksCompleted: 0,
    minutesFocused: 0,
    totalTasks: 0,
    efficiency: 0
};

// Carregar dados do LocalStorage
function loadFromStorage() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) tasks = JSON.parse(savedTasks);
    
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) userProfile = JSON.parse(savedProfile);
    
    renderMatrix();
    updateStats();
}

// Salvar dados no LocalStorage
function saveToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

// ==================== Timers ====================
function updatePomodoroDisplay() {
    const mins = Math.floor(pomodoro.time / 60);
    const secs = pomodoro.time % 60;
    document.getElementById('pomodoro-display').textContent = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

function startPomodoro() {
    if (pomodoro.isRunning) return;
    pomodoro.isRunning = true;
    pomodoro.interval = setInterval(() => {
        if (pomodoro.time > 0) {
            pomodoro.time--;
            updatePomodoroDisplay();
        } else {
            clearInterval(pomodoro.interval);
            pomodoro.isRunning = false;
            userProfile.minutesFocused += 25;
            updateStats();
            saveToStorage();
            alert('Pomodoro concluído! Faça uma pausa.');
        }
    }, 1000);
}

function pausePomodoro() {
    clearInterval(pomodoro.interval);
    pomodoro.isRunning = false;
}

function resetPomodoro() {
    pausePomodoro();
    pomodoro.time = 25 * 60;
    updatePomodoroDisplay();
}

// Cronômetro
function updateStopwatchDisplay() {
    const hours = Math.floor(stopwatch.time / 3600);
    const mins = Math.floor((stopwatch.time % 3600) / 60);
    const secs = stopwatch.time % 60;
    document.getElementById('stopwatch-display').textContent = 
        `${hours.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

function startStopwatch() {
    if (stopwatch.isRunning) return;
    stopwatch.isRunning = true;
    stopwatch.interval = setInterval(() => {
        stopwatch.time++;
        updateStopwatchDisplay();
    }, 1000);
}

function pauseStopwatch() {
    clearInterval(stopwatch.interval);
    stopwatch.isRunning = false;
}

function resetStopwatch() {
    pauseStopwatch();
    stopwatch.time = 0;
    updateStopwatchDisplay();
}

// ==================== Matriz de Prioridades ====================
function renderMatrix() {
    for (let quadrant in tasks) {
        const list = document.getElementById(`quadrant-${quadrant}`);
        if (list) {
            list.innerHTML = '';
            tasks[quadrant].forEach((task, index) => {
                const li = document.createElement('li');
                li.innerHTML = `${task} <button onclick="removeTask('${quadrant}', ${index})">✖</button>`;
                list.appendChild(li);
            });
        }
    }
}

function addTask(quadrant) {
    const taskText = prompt('Digite a nova tarefa:');
    if (taskText && taskText.trim()) {
        tasks[quadrant].push(taskText.trim());
        userProfile.totalTasks++;
        updateStats();
        saveToStorage();
        renderMatrix();
    }
}

function removeTask(quadrant, index) {
    tasks[quadrant].splice(index, 1);
    userProfile.tasksCompleted++;
    updateStats();
    saveToStorage();
    renderMatrix();
}

// ==================== Estatísticas ====================
function updateStats() {
    document.getElementById('tasks-completed').textContent = userProfile.tasksCompleted;
    document.getElementById('minutes-focused').textContent = userProfile.minutesFocused;
    document.getElementById('total-tasks').textContent = userProfile.totalTasks;
    const efficiency = userProfile.totalTasks > 0 ? Math.round((userProfile.tasksCompleted / userProfile.totalTasks) * 100) : 0;
    userProfile.efficiency = efficiency;
    document.getElementById('efficiency-rate').textContent = efficiency + '%';
}

// ==================== Agentes ====================
function createAgentCards() {
    const agents = [
        { name: 'Agente Matriz', description: 'Organiza suas tarefas na matriz Eisenhower.', icon: '🧠', status: 'active' },
        { name: 'Agente Estrategista', description: 'Cria planos de ação a partir de documentos.', icon: '📋', status: 'active' },
        { name: 'Agente de Contexto', description: 'Monitora tudo e antecipa necessidades.', icon: '🔍', status: 'active' },
        { name: 'Agente Pomodoro', description: 'Gerencia seu foco e pausas.', icon: '⏲️', status: 'active' },
        { name: 'Agente Conector', description: 'Integra com calendários e apps externos.', icon: '🔌', status: 'paused' },
        { name: 'Agente Analista', description: 'Gera relatórios e insights.', icon: '📊', status: 'active' }
    ];
    
    const grid = document.getElementById('agents-grid');
    agents.forEach(agent => {
        const card = document.createElement('div');
        card.className = 'agent-card';
        card.innerHTML = `
            <h4>${agent.icon} ${agent.name}</h4>
            <p>${agent.description}</p>
            <span class="agent-status ${agent.status === 'active' ? 'status-active' : 'status-paused'}">${agent.status === 'active' ? '🟢 Ativo' : '⏸️ Pausado'}</span>
            <div>
                <button onclick="assignMission('${agent.name}')">Atribuir Missão</button>
                <button onclick="configureAgent('${agent.name}')">Configurar</button>
                <button onclick="talkToAgent('${agent.name}')">Conversar</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function assignMission(agentName) {
    const mission = prompt(`Digite a missão para o ${agentName}:`);
    if (mission) {
        fetch(`/.netlify/functions/agent-matriz`, {
            method: 'POST',
            body: JSON.stringify({ mission, context: { tasks, userProfile } })
        })
        .then(res => res.json())
        .then(data => {
            alert(`Missão recebida! Resposta: ${data.result || 'Processado com sucesso'}`);
        })
        .catch(err => {
            console.error('Erro:', err);
            alert('Erro ao processar missão. Verifique o console.');
        });
    }
}

function configureAgent(agentName) {
    alert(`Abrir configurações do ${agentName} (a ser implementado).`);
}

function talkToAgent(agentName) {
    const msg = prompt(`Fale com o ${agentName}:`);
    if (msg) {
        fetch(`/.netlify/functions/agente-contexto`, {
            method: 'POST',
            body: JSON.stringify({ message: msg, context: { tasks, userProfile } })
        })
        .then(res => res.json())
        .then(data => {
            alert(`${agentName} responde: ${data.reply || 'Processado'}`);
        })
        .catch(err => {
            console.error('Erro:', err);
            alert('Erro ao comunicar com agente. Verifique o console.');
        });
    }
}

// Chat Central com a IA consciente
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;
    
    const chatBox = document.getElementById('chat-messages');
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'message user-message';
    userMsgDiv.textContent = message;
    chatBox.appendChild(userMsgDiv);
    input.value = '';
    
    try {
        const response = await fetch('/.netlify/functions/agente-contexto', {
            method: 'POST',
            body: JSON.stringify({ 
                message, 
                context: { tasks, userProfile }
            })
        });
        const data = await response.json();
        
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'message ai-message';
        aiMsgDiv.textContent = data.reply || 'Resposta processada';
        chatBox.appendChild(aiMsgDiv);
        
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error('Erro:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message ai-message';
        errorDiv.textContent = 'Erro ao conectar com a IA. Verifique sua conexão.';
        chatBox.appendChild(errorDiv);
    }
}

// ==================== IA Multimodal ====================
document.getElementById('process-text')?.addEventListener('click', async () => {
    const text = document.getElementById('text-input').value;
    if (!text) return;
    
    try {
        const response = await fetch('/.netlify/functions/agent-estrategista', {
            method: 'POST',
            body: JSON.stringify({ type: 'text', content: text })
        });
        const data = await response.json();
        document.getElementById('strategic-output').innerHTML = data.result || 'Processado com sucesso';
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('strategic-output').innerHTML = 'Erro ao processar texto.';
    }
});

// ==================== Geração de Tarefas com IA ====================
document.getElementById('generate-tasks')?.addEventListener('click', async () => {
    const projectDesc = document.getElementById('project-description').value;
    if (!projectDesc) {
        alert('Descreva seu projeto primeiro');
        return;
    }
    
    try {
        const response = await fetch('/.netlify/functions/agent-matriz', {
            method: 'POST',
            body: JSON.stringify({ projectDesc, currentTasks: tasks })
        });
        const data = await response.json();
        
        if (data.tarefas) {
            data.tarefas.forEach(tarefa => {
                const quadrant = tarefa.quadrante || 'important-not-urgent';
                if (tasks[quadrant]) {
                    tasks[quadrant].push(tarefa.nome);
                    userProfile.totalTasks++;
                }
            });
            saveToStorage();
            renderMatrix();
            updateStats();
            alert('Tarefas geradas com sucesso!');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao gerar tarefas. Verifique o console.');
    }
});

// ==================== Event Listeners ====================
document.getElementById('pomodoro-start')?.addEventListener('click', startPomodoro);
document.getElementById('pomodoro-pause')?.addEventListener('click', pausePomodoro);
document.getElementById('pomodoro-reset')?.addEventListener('click', resetPomodoro);

document.getElementById('stopwatch-start')?.addEventListener('click', startStopwatch);
document.getElementById('stopwatch-pause')?.addEventListener('click', pauseStopwatch);
document.getElementById('stopwatch-reset')?.addEventListener('click', resetStopwatch);

document.querySelectorAll('.add-task-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const quadrant = e.target.dataset.quadrant;
        addTask(quadrant);
    });
});

document.getElementById('send-chat')?.addEventListener('click', sendChatMessage);
document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});

// ==================== Inicialização ====================
window.addEventListener('load', () => {
    loadFromStorage();
    createAgentCards();
    updatePomodoroDisplay();
    updateStopwatchDisplay();
    
    // Carregar insight do dia (simulado)
    document.getElementById('insight-text').textContent = 
        `Você tem ${userProfile.totalTasks} tarefas. Foco estimado: ${Math.ceil(userProfile.totalTasks * 25 / 60)} horas.`;
});

// Auto-save a cada 30 segundos
setInterval(saveToStorage, 30000);

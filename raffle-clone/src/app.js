const defaultConfig = {
  title: "Annual Prize Draw",
  participants_label: "Participants",
  prizes_label: "Prizes",
  background_color: "#f3e8ff",
  surface_color: "#ffffff",
  text_color: "#581c87",
  primary_action_color: "#9333ea",
  secondary_action_color: "#3b82f6",
  font_family: "system-ui",
  font_size: 16
};

let participants = [];
let prizes = [];
let isDrawing = false;

const dataHandler = {
  onDataChanged(data) {
    participants = data.filter(item => item.type === 'participant');
    prizes = data.filter(item => item.type === 'prize');
    
    renderParticipants();
    renderPrizes();
    updateDrawButton();
  }
};

async function initializeApp() {
  const initResult = await window.dataSdk.init(dataHandler);
  if (!initResult.isOk) {
    console.error("Failed to initialize data SDK");
  }
  
  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange: async (config) => {
        const customFont = config.font_family || defaultConfig.font_family;
        const baseFontStack = 'system-ui, -apple-system, sans-serif';
        const baseSize = config.font_size || defaultConfig.font_size;
        
        document.body.style.background = `linear-gradient(to bottom right, ${config.background_color || defaultConfig.background_color}, ${config.secondary_action_color || defaultConfig.secondary_action_color}20)`;
        
        document.getElementById('main-title').textContent = config.title || defaultConfig.title;
        document.getElementById('main-title').style.fontFamily = `${customFont}, ${baseFontStack}`;
        document.getElementById('main-title').style.fontSize = `${baseSize * 2.5}px`;
        document.getElementById('main-title').style.color = config.text_color || defaultConfig.text_color;
        
        document.getElementById('participants-title').textContent = config.participants_label || defaultConfig.participants_label;
        document.getElementById('participants-title').style.fontFamily = `${customFont}, ${baseFontStack}`;
        document.getElementById('participants-title').style.fontSize = `${baseSize * 1.5}px`;
        document.getElementById('participants-title').style.color = config.text_color || defaultConfig.text_color;
        
        document.getElementById('prizes-title').textContent = config.prizes_label || defaultConfig.prizes_label;
        document.getElementById('prizes-title').style.fontFamily = `${customFont}, ${baseFontStack}`;
        document.getElementById('prizes-title').style.fontSize = `${baseSize * 1.5}px`;
        document.getElementById('prizes-title').style.color = config.secondary_action_color || defaultConfig.secondary_action_color;
        
        const allCards = document.querySelectorAll('.bg-white');
        allCards.forEach(card => {
          card.style.backgroundColor = config.surface_color || defaultConfig.surface_color;
        });
        
        document.getElementById('draw-btn').style.background = `linear-gradient(to right, ${config.primary_action_color || defaultConfig.primary_action_color}, ${config.secondary_action_color || defaultConfig.secondary_action_color})`;
        
        document.body.style.fontFamily = `${customFont}, ${baseFontStack}`;
        document.body.style.fontSize = `${baseSize}px`;
      },
      mapToCapabilities: (config) => ({
        recolorables: [
          {
            get: () => config.background_color || defaultConfig.background_color,
            set: (value) => {
              window.elementSdk.config.background_color = value;
              window.elementSdk.setConfig({ background_color: value });
            }
          },
          {
            get: () => config.surface_color || defaultConfig.surface_color,
            set: (value) => {
              window.elementSdk.config.surface_color = value;
              window.elementSdk.setConfig({ surface_color: value });
            }
          },
          {
            get: () => config.text_color || defaultConfig.text_color,
            set: (value) => {
              window.elementSdk.config.text_color = value;
              window.elementSdk.setConfig({ text_color: value });
            }
          },
          {
            get: () => config.primary_action_color || defaultConfig.primary_action_color,
            set: (value) => {
              window.elementSdk.config.primary_action_color = value;
              window.elementSdk.setConfig({ primary_action_color: value });
            }
          },
          {
            get: () => config.secondary_action_color || defaultConfig.secondary_action_color,
            set: (value) => {
              window.elementSdk.config.secondary_action_color = value;
              window.elementSdk.setConfig({ secondary_action_color: value });
            }
          }
        ],
        borderables: [],
        fontEditable: {
          get: () => config.font_family || defaultConfig.font_family,
          set: (value) => {
            window.elementSdk.config.font_family = value;
            window.elementSdk.setConfig({ font_family: value });
          }
        },
        fontSizeable: {
          get: () => config.font_size || defaultConfig.font_size,
          set: (value) => {
            window.elementSdk.config.font_size = value;
            window.elementSdk.setConfig({ font_size: value });
          }
        }
      }),
      mapToEditPanelValues: (config) => new Map([
        ["title", config.title || defaultConfig.title],
        ["participants_label", config.participants_label || defaultConfig.participants_label],
        ["prizes_label", config.prizes_label || defaultConfig.prizes_label]
      ])
    });
  }
}

function renderParticipants() {
  const container = document.getElementById('participants-list');
  const emptyState = document.getElementById('participants-empty');
  
  if (participants.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  
  const totalWeight = participants.reduce((sum, p) => sum + p.weight, 0);
  
  container.innerHTML = participants.map(participant => {
    const probability = ((participant.weight / totalWeight) * 100).toFixed(1);
    return `
      <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg fade-in">
        <div class="flex-1">
          <div class="font-semibold text-gray-800">${escapeHtml(participant.name)}</div>
          <div class="text-sm text-gray-600">Weight: ${participant.weight} (${probability}% chance)</div>
        </div>
        <button onclick="deleteParticipant('${participant.id}')" class="text-red-500 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors">
          🗑️
        </button>
      </div>
    `;
  }).join('');
}

function renderPrizes() {
  const container = document.getElementById('prizes-list');
  const emptyState = document.getElementById('prizes-empty');
  
  if (prizes.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  
  const sortedPrizes = [...prizes].sort((a, b) => b.weight - a.weight);
  const totalPrizeWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
  
  container.innerHTML = sortedPrizes.map((prize, index) => {
    const probability = ((prize.weight / totalPrizeWeight) * 100).toFixed(1);
    let tier = '';
    let emoji = '';
    
    if (index === 0) {
      tier = 'Grand Prize';
      emoji = '🏆';
    } else if (index === sortedPrizes.length - 1) {
      tier = 'Minor Prize';
      emoji = '🎁';
    } else {
      tier = `Prize ${index + 1}`;
      emoji = '🎖️';
    }
    
    return `
      <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg fade-in">
        <div class="flex-1">
          <div class="font-semibold text-gray-800">${emoji} ${escapeHtml(prize.name)}</div>
          <div class="text-sm text-gray-600">${tier} (${probability}% chance)</div>
        </div>
        <button onclick="deletePrize('${prize.id}')" class="text-red-500 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors">
          🗑️
        </button>
      </div>
    `;
  }).join('');
}

function updateDrawButton() {
  const drawBtn = document.getElementById('draw-btn');
  const canDraw = participants.length > 0 && prizes.length > 0;
  drawBtn.disabled = !canDraw || isDrawing;
}

document.getElementById('participant-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (participants.length >= 999) {
    showToast("Maximum limit of 999 participants reached. Please delete some first.");
    return;
  }
  
  const nameInput = document.getElementById('participant-name');
  const weightInput = document.getElementById('participant-weight');
  const addBtn = document.getElementById('add-participant-btn');
  
  addBtn.disabled = true;
  addBtn.textContent = 'Adding...';
  
  const result = await window.dataSdk.create({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: nameInput.value.trim(),
    weight: parseInt(weightInput.value),
    type: 'participant'
  });
  
  addBtn.disabled = false;
  addBtn.textContent = 'Add Participant';
  
  if (result.isOk) {
    nameInput.value = '';
    weightInput.value = '1';
  } else {
    showToast("Failed to add participant. Please try again.");
  }
});

document.getElementById('prize-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (prizes.length >= 999) {
    showToast("Maximum limit of 999 prizes reached. Please delete some first.");
    return;
  }
  
  const nameInput = document.getElementById('prize-name');
  const addBtn = document.getElementById('add-prize-btn');
  
  addBtn.disabled = true;
  addBtn.textContent = 'Adding...';
  
  const prizeWeight = 1000 - prizes.length;
  
  const result = await window.dataSdk.create({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: nameInput.value.trim(),
    weight: prizeWeight,
    type: 'prize'
  });
  
  addBtn.disabled = false;
  addBtn.textContent = 'Add Prize';
  
  if (result.isOk) {
    nameInput.value = '';
  } else {
    showToast("Failed to add prize. Please try again.");
  }
});

async function deleteParticipant(id) {
  const participant = participants.find(p => p.id === id);
  if (!participant) return;
  
  const result = await window.dataSdk.delete(participant);
  if (!result.isOk) {
    showToast("Failed to delete participant. Please try again.");
  }
}

async function deletePrize(id) {
  const prize = prizes.find(p => p.id === id);
  if (!prize) return;
  
  const result = await window.dataSdk.delete(prize);
  if (!result.isOk) {
    showToast("Failed to delete prize. Please try again.");
  }
}

document.getElementById('draw-btn').addEventListener('click', async () => {
  if (participants.length === 0 || prizes.length === 0 || isDrawing) return;
  
  isDrawing = true;
  const drawBtn = document.getElementById('draw-btn');
  const loadingIndicator = document.getElementById('loading-indicator');
  const winnerDisplay = document.getElementById('winner-display');
  
  drawBtn.disabled = true;
  loadingIndicator.classList.remove('hidden');
  winnerDisplay.classList.add('hidden');
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const winner = weightedRandomSelection(participants);
  const prize = weightedRandomSelection(prizes);
  
  document.getElementById('winner-name').textContent = winner.name;
  document.getElementById('winner-prize').textContent = prize.name;
  
  loadingIndicator.classList.add('hidden');
  winnerDisplay.classList.remove('hidden');
  
  createConfetti();
  
  isDrawing = false;
  drawBtn.disabled = false;
});

function weightedRandomSelection(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item;
    }
  }
  
  return items[items.length - 1];
}

function createConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.position = 'absolute';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    
    container.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 3000);
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg fade-in';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.deleteParticipant = deleteParticipant;
window.deletePrize = deletePrize;

initializeApp();
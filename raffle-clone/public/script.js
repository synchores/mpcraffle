const textarea = document.getElementById('name-input');
const namesBox = document.getElementById('names');
const resultEl = document.getElementById('result');
const countEl = document.getElementById('name-count');
const addBtn = document.getElementById('add-btn');
const sampleBtn = document.getElementById('sample-btn');
const clearBtn = document.getElementById('clear-btn');
const pickBtn = document.getElementById('pick-btn');
const confettiLayer = document.getElementById('confetti');

const names = [];
const sampleNames = [
  'Amelia', 'Ben', 'Charlotte', 'Daniel', 'Ethan', 'Fatima', 'Grace', 'Hannah', 'Isaac', 'Jayden',
  'Kai', 'Layla', 'Maya', 'Noah', 'Olivia', 'Parker', 'Quinn', 'Riley', 'Sofia', 'Theo'
];

const setNames = (list) => {
  names.length = 0;
  names.push(...list);
  renderNames();
};

const parseInput = () => {
  const raw = textarea.value;
  if (!raw.trim()) return [];

  return raw
    .split(/[\n,]/)
    .map((n) => n.trim())
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index);
};

const renderNames = () => {
  namesBox.innerHTML = '';

  if (names.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.className = 'tag empty';
    placeholder.textContent = 'No names yet – add a few to get started!';
    namesBox.appendChild(placeholder);
  } else {
    names.forEach((name) => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = name;
      namesBox.appendChild(tag);
    });
  }

  countEl.textContent = names.length;
};

const showToast = (message) => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2400);
};

const throwConfetti = () => {
  const colors = ['#8b5cf6', '#a855f7', '#22c55e', '#14b8a6', '#ec4899'];

  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    piece.style.transform = `rotate(${Math.random() * 60}deg)`;
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 2500);
  }
};

const addNames = () => {
  const incoming = parseInput();
  if (incoming.length === 0) {
    showToast('Please type at least one name before adding.');
    return;
  }

  const merged = [...names];
  incoming.forEach((name) => {
    if (!merged.includes(name)) merged.push(name);
  });

  setNames(merged);
  textarea.value = '';
};

const loadSamples = () => {
  setNames(sampleNames);
  textarea.value = sampleNames.join('\n');
};

const clearNames = () => {
  setNames([]);
  resultEl.textContent = '—';
  textarea.value = '';
};

const pickRandomName = () => {
  if (names.length === 0) {
    showToast('Add some names first.');
    return;
  }

  pickBtn.disabled = true;
  let highlightCount = 0;
  let activeTag;
  const tags = Array.from(document.querySelectorAll('.tag')); // includes empty state but replaced earlier

  const interval = setInterval(() => {
    if (activeTag) activeTag.classList.remove('highlight');
    const tag = tags[Math.floor(Math.random() * tags.length)];
    tag.classList.add('highlight');
    activeTag = tag;
    highlightCount += 1;

    if (highlightCount >= 16) {
      clearInterval(interval);
      const winner = tag.textContent;
      resultEl.textContent = winner;
      throwConfetti();
      pickBtn.disabled = false;
    }
  }, 120);
};

addBtn.addEventListener('click', addNames);
clearBtn.addEventListener('click', clearNames);
pickBtn.addEventListener('click', pickRandomName);
sampleBtn.addEventListener('click', loadSamples);

textarea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    addNames();
  }
});

renderNames();

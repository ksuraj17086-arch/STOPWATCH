const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsContainer = document.getElementById('lapsContainer');

let startTime = 0;
let elapsedBefore = 0;
let running = false;
let rafId = null;

function formatTime(ms) {
  const totalCentis = Math.floor(ms / 10);
  const centis = totalCentis % 100;
  const totalSeconds = Math.floor(totalCentis / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(centis).padStart(2,'0')}`;
}

function update() {
  const now = performance.now();
  const elapsed = elapsedBefore + (now - startTime);
  display.textContent = formatTime(elapsed);
  rafId = requestAnimationFrame(update);
}

startBtn.addEventListener('click', () => {
  if (!running) {
    startTime = performance.now();
    running = true;
    startBtn.textContent = 'Stop';
    startBtn.classList.remove('btn-start');
    startBtn.classList.add('btn-stop');
    rafId = requestAnimationFrame(update);
  } else {
    cancelAnimationFrame(rafId);
    elapsedBefore += performance.now() - startTime;
    running = false;
    startBtn.textContent = 'Start';
    startBtn.classList.remove('btn-stop');
    startBtn.classList.add('btn-start');
  }
});

resetBtn.addEventListener('click', () => {
  cancelAnimationFrame(rafId);
  running = false;
  startTime = 0;
  elapsedBefore = 0;
  display.textContent = '00:00.00';
  startBtn.textContent = 'Start';
  startBtn.classList.remove('btn-stop');
  startBtn.classList.add('btn-start');
  lapsContainer.innerHTML = '';
});

lapBtn.addEventListener('click', () => {
  const nowMs = running ? (elapsedBefore + (performance.now() - startTime)) : elapsedBefore;
  const lapTime = formatTime(nowMs);
  const count = lapsContainer.children.length + 1;
  const el = document.createElement('div');
  el.className = 'lap';
  el.innerHTML = `<span>Lap ${count}</span><span>${lapTime}</span>`;
  lapsContainer.prepend(el);
});

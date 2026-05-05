// ===== PRODUTOS AFILIADOS =====
const PRODUTOS = [
  {
    nome: 'Daily T-shirt Insider — Mais Vendida',
    preco: 'R$ 74,50',
    precoAntigo: 'R$ 149,00',
    desconto: '50% OFF',
    loja: 'ml',
    lojaLabel: 'Mercado Livre',
    link: 'https://meli.la/1AqU3iX',
    img: 'https://http2.mlstatic.com/D_NQ_NP_895901-MLB75343482478_032024-F.webp',
    emoji: '👕',
  },
  {
    nome: 'Samsung Galaxy A07 128GB — Violeta',
    preco: 'R$ 665,56',
    precoAntigo: 'R$ 799,00',
    desconto: '16% OFF',
    loja: 'amz',
    lojaLabel: 'Amazon',
    link: 'https://amzn.to/3ONfKZP',
    img: 'https://m.media-amazon.com/images/I/51Zt4BKQHSL._AC_SX679_.jpg',
    emoji: '📱',
  },
  {
    nome: 'Kit 2 Camisas Polo Piquet Premium',
    preco: 'R$ 59,90',
    precoAntigo: 'R$ 88,90',
    desconto: '32% OFF',
    loja: 'ml',
    lojaLabel: 'Mercado Livre',
    link: 'https://meli.la/11U872X',
    img: 'https://http2.mlstatic.com/D_NQ_NP_617251-MLB75343482478_032024-F.webp',
    emoji: '👔',
  },
  {
    nome: 'JBL Tune 520BT Bluetooth On-ear — Azul',
    preco: 'R$ 199,00',
    precoAntigo: 'R$ 299,00',
    desconto: '33% OFF',
    loja: 'amz',
    lojaLabel: 'Amazon',
    link: 'https://amzn.to/4tcKcux',
    img: 'https://m.media-amazon.com/images/I/61+oHoJGgLL._AC_SX679_.jpg',
    emoji: '🎧',
  },
];

// ===== CARROSSEL =====
const carousels = {}; // { id: { current, timer } }

function buildCarousel(containerId, startIndex) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Cria os cards
  PRODUTOS.forEach((p, i) => {
    const a = document.createElement('a');
    a.href = p.link;
    a.target = '_blank';
    a.rel = 'noopener sponsored';
    a.className = 'ad-product-card' + (i === startIndex ? ' visible' : '');
    a.dataset.index = i;
    a.innerHTML = `
      <img class="ad-product-img" src="${p.img}" alt="${p.nome}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'" />
      <div class="ad-product-img-fallback" style="display:none">${p.emoji}</div>
      <div class="ad-product-info">
        <div class="ad-product-store ${p.loja}">${p.lojaLabel}</div>
        <div class="ad-product-name">${p.nome}</div>
        <div class="ad-product-prices">
          <span class="ad-product-price">${p.preco}</span>
          <span class="ad-product-old">${p.precoAntigo}</span>
          <span class="ad-product-badge">${p.desconto}</span>
        </div>
      </div>
      <div class="ad-product-cta">Ver oferta →</div>
    `;
    container.appendChild(a);
  });

  // Dots
  const dots = document.createElement('div');
  dots.className = 'ad-dots';
  PRODUTOS.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'ad-dot' + (i === startIndex ? ' active' : '');
    dots.appendChild(d);
  });
  container.appendChild(dots);

  carousels[containerId] = { current: startIndex };
  startCarouselTimer(containerId);
}

function showSlide(containerId, index) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const cards = container.querySelectorAll('.ad-product-card');
  const dots  = container.querySelectorAll('.ad-dot');
  const total = cards.length;
  const next  = ((index % total) + total) % total;

  cards.forEach(c => c.classList.remove('visible'));
  dots.forEach(d => d.classList.remove('active'));
  cards[next].classList.add('visible');
  dots[next].classList.add('active');
  carousels[containerId].current = next;
}

function startCarouselTimer(containerId) {
  setInterval(() => {
    const c = carousels[containerId];
    showSlide(containerId, c.current + 1);
  }, 6000);
}

function initCarousels() {
  // Cada banner começa num produto diferente pra variar
  buildCarousel('carousel-top',    0);
  buildCarousel('carousel-middle', 2);
  buildCarousel('carousel-bottom', 1);
}

// ===== ESTADO DO USUÁRIO =====
// Para produção: verificar token JWT / cookie de sessão
// Por enquanto simula com localStorage
let isPro = localStorage.getItem('calc_pro') === 'true';

function initUserState() {
  if (isPro) {
    hideAds();
    document.getElementById('user-badge').textContent = '✅ Pro — Sem anúncios';
    document.getElementById('user-badge').classList.add('is-pro');
    document.getElementById('btn-subscribe').classList.add('hidden');
  }
}

function hideAds() {
  document.querySelectorAll('.ad-banner').forEach(el => el.classList.add('hidden'));
}

// ===== TABS =====
function switchTab(name, btn) {
  document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  btn.classList.add('active');
}

// ===== CALCULADORAS =====

// Ações
function calcAcoes() {
  const risco = parseFloat(document.getElementById('acoes-risco').value);
  const loss  = parseFloat(document.getElementById('acoes-loss').value);
  const el    = document.getElementById('acoes-qty');

  if (!risco || !loss || risco <= 0) { el.textContent = '—'; return; }

  const qty = Math.floor(loss / risco);
  el.textContent = qty > 0 ? qty.toLocaleString('pt-BR') : '—';
}

// WIN
function calcWin() {
  const risco  = parseFloat(document.getElementById('win-risco').value);
  const loss   = parseFloat(document.getElementById('win-loss').value);
  const loss1El = document.getElementById('win-loss1');
  const el     = document.getElementById('win-qty');

  if (!risco || risco <= 0) { loss1El.value = '—'; el.textContent = '—'; return; }

  const lossPorContrato = risco * 0.20;
  loss1El.value = 'R$ ' + lossPorContrato.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (!loss || loss <= 0) { el.textContent = '—'; return; }

  const qty = Math.floor(loss / lossPorContrato);
  el.textContent = qty > 0 ? qty.toLocaleString('pt-BR') : '—';
}

// WDO
function calcWdo() {
  const risco  = parseFloat(document.getElementById('wdo-risco').value);
  const loss   = parseFloat(document.getElementById('wdo-loss').value);
  const loss1El = document.getElementById('wdo-loss1');
  const el     = document.getElementById('wdo-qty');

  if (!risco || risco <= 0) { loss1El.value = '—'; el.textContent = '—'; return; }

  const lossPorContrato = risco * 10;
  loss1El.value = 'R$ ' + lossPorContrato.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (!loss || loss <= 0) { el.textContent = '—'; return; }

  const qty = Math.floor(loss / lossPorContrato);
  el.textContent = qty > 0 ? qty.toLocaleString('pt-BR') : '—';
}

// BIT
function calcBit() {
  const risco  = parseFloat(document.getElementById('bit-risco').value);
  const loss   = parseFloat(document.getElementById('bit-loss').value);
  const loss1El = document.getElementById('bit-loss1');
  const el     = document.getElementById('bit-qty');

  if (!risco || risco <= 0) { loss1El.value = '—'; el.textContent = '—'; return; }

  const lossPorContrato = risco * 0.01;
  loss1El.value = 'R$ ' + lossPorContrato.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (!loss || loss <= 0) { el.textContent = '—'; return; }

  const qty = Math.floor(loss / lossPorContrato);
  el.textContent = qty > 0 ? qty.toLocaleString('pt-BR') : '—';
}

// ===== MODAL =====
function openSubscribeModal() {
  document.getElementById('modal-overlay').classList.add('open');
  // Seleciona anual por padrão ao abrir
  selectPlan('anual');
}

function closeSubscribeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

// Fecha modal com ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSubscribeModal();
});

// ===== PLANOS =====
let planoSelecionado = 'anual'; // anual selecionado por padrão (melhor valor)

function selectPlan(plano) {
  planoSelecionado = plano;
  document.querySelectorAll('.plan').forEach(el => el.classList.remove('selected'));
  document.getElementById('plan-' + plano).classList.add('selected');
  const btn = document.getElementById('btn-checkout-final');
  if (plano === 'mensal') {
    btn.textContent = 'Assinar Mensal — R$ 9,90/mês →';
  } else {
    btn.textContent = 'Assinar Anual — R$ 79,00/ano →';
  }
}

function confirmCheckout() {
  goToCheckout(planoSelecionado);
}

// ===== CHECKOUT HOTMART =====
// Substitua pelas URLs reais após criar o produto na Hotmart
const CHECKOUT = {
  mensal: 'https://pay.hotmart.com/J61298585B?off=95lyeqyf',
  anual:  'https://pay.hotmart.com/J61298585B',
};

function goToCheckout(plano) {
  const url = CHECKOUT[plano];
  if (!url || url.includes('SEU_PRODUTO')) {
    alert('⚠️ Link de checkout ainda não configurado.\nCrie o produto na Hotmart e atualize a variável CHECKOUT no app.js.');
    return;
  }
  window.open(url, '_blank', 'noopener');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initUserState();
  initCarousels();
});

// Atalho de teste: abrir console e digitar setPro(true) para simular assinante
window.setPro = function(val) {
  localStorage.setItem('calc_pro', val ? 'true' : 'false');
  location.reload();
};

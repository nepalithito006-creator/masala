const NUMBER = '9779745347914';
const wa = (msg) => `https://wa.me/${NUMBER}?text=${encodeURIComponent(msg)}`;
document.querySelectorAll('.order').forEach(a => {
  a.href = wa(`Hi, I'd like to order ${a.dataset.p}.`);
  a.target = '_blank'; a.rel = 'noopener';
});
const main = document.getElementById('wa-main');
if (main) { main.href = wa("Hi, I'd like to place an order."); main.target = '_blank'; main.rel = 'noopener'; }
document.querySelectorAll('.cta').forEach(a => { a.href = wa("Hi, I'd like to place an order."); a.target = '_blank'; });
const float = document.createElement('a');
float.id = 'wa-float'; float.href = wa("Hi, I have a question about your spices."); float.target = '_blank'; float.textContent = '💬';
float.setAttribute('aria-label', 'Chat on WhatsApp'); document.body.appendChild(float);
const menu = document.getElementById('menu'), links = document.getElementById('links');
menu.addEventListener('click', () => links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* Spice particle atmosphere: drifting seeds + click sprinkle + hero parallax */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.getElementById('spice-fx'), ctx = cv.getContext('2d');
  const COLORS = ['#e8a317', '#b3261e', '#a8752f', '#6b3a1e', '#7a8a3a', '#c4531f'];
  let W, H, seeds = [], sprinkles = [];
  const rand = (a, b) => a + Math.random() * (b - a);
  const make = (y) => ({ x: rand(0, W), y: y ?? rand(0, H), r: rand(1.5, 4.5), vy: rand(-.5, -.15), sway: rand(0, 6.28), sp: rand(.005, .02),
    rot: rand(0, 6.28), vr: rand(-.02, .02), c: COLORS[(Math.random() * COLORS.length) | 0], a: rand(.25, .6), seed: Math.random() < .5 });
  const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; seeds = Array.from({ length: Math.min(70, W / 18 | 0) }, () => make()); };
  resize(); addEventListener('resize', resize);

  addEventListener('pointerdown', e => {
    for (let i = 0; i < 28; i++) {
      const ang = rand(0, 6.28), s = rand(2, 6);
      sprinkles.push({ x: e.clientX, y: e.clientY, vx: Math.cos(ang) * s, vy: Math.sin(ang) * s - 2, r: rand(1.5, 4), c: COLORS[(Math.random() * COLORS.length) | 0], life: 1, rot: rand(0, 6.28) });
    }
  });

  const art = document.querySelector('.hero-art');
  if (art) addEventListener('pointermove', e => {
    const x = (e.clientX / innerWidth - .5) * 24, y = (e.clientY / innerHeight - .5) * 16;
    art.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });

  const shape = (p) => {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
    ctx.beginPath();
    if (p.seed) ctx.ellipse(0, 0, p.r * 1.8, p.r, 0, 0, 6.28); else ctx.arc(0, 0, p.r, 0, 6.28);
    ctx.fill(); ctx.restore();
  };

  (function tick() {
    ctx.clearRect(0, 0, W, H);
    seeds.forEach(p => {
      p.y += p.vy; p.sway += p.sp; p.x += Math.sin(p.sway) * .5; p.rot += p.vr;
      if (p.y < -10) Object.assign(p, make(H + 10));
      ctx.globalAlpha = p.a; shape(p);
    });
    sprinkles.forEach(p => {
      p.vy += .18; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.rot += .1; p.life -= .014;
      ctx.globalAlpha = Math.max(p.life, 0); p.seed = true; shape(p);
    });
    sprinkles = sprinkles.filter(p => p.life > 0);
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  })();
})();

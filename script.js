const phrase =
  "Hoy celebramos a la mujer más valiente, dulce y fuerte de nuestra vida. Gracias por todo tu amor, mamá.";

const body = document.body;
const introScreen = document.getElementById("introScreen");
const startExperienceBtn = document.getElementById("startExperienceBtn");
const mainCard = document.getElementById("mainCard");
const typedText = document.getElementById("typedText");
const surpriseBtn = document.getElementById("surpriseBtn");
const bgMusic = document.getElementById("bgMusic");
const heartsWrap = document.getElementById("hearts");
const letterModal = document.getElementById("letterModal");
const closeLetterBtn = document.getElementById("closeLetterBtn");
const letterPhotoWrap = document.getElementById("letterPhotoWrap");
const sparkles = document.getElementById("sparkles");
const fireworks = document.getElementById("fireworks");
const sparkleCtx = sparkles.getContext("2d");
const fireworksCtx = fireworks.getContext("2d");

let charIndex = 0;
let particles = [];
let fireworksParticles = [];
let typingStarted = false;

function typeWriter() {
  if (charIndex <= phrase.length) {
    typedText.textContent = phrase.slice(0, charIndex);
    charIndex += 1;
    requestAnimationFrame(() => setTimeout(typeWriter, 30));
  }
}

function tryPlayMusic() {
  bgMusic.volume = 0.45;
  const playPromise = bgMusic.play();
  if (playPromise) {
    playPromise.catch(() => {});
  }
}

window.addEventListener("load", tryPlayMusic);
["pointerdown", "touchstart", "keydown"].forEach((eventName) => {
  window.addEventListener(eventName, tryPlayMusic, { once: true });
});

startExperienceBtn.addEventListener("click", () => {
  introScreen.classList.add("hide");
  body.classList.remove("intro-active");
  mainCard.classList.remove("is-hidden");
  mainCard.classList.add("is-visible");

  if (!typingStarted) {
    typingStarted = true;
    typeWriter();
  }
});

function spawnHeart(x = Math.random() * window.innerWidth, burst = false) {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.style.left = `${x}px`;
  heart.style.animationDuration = `${Math.random() * 3.5 + 5}s`;
  heart.style.opacity = (Math.random() * 0.5 + 0.4).toString();
  heart.style.transform = `rotate(45deg) scale(${Math.random() * 0.9 + 0.6})`;

  if (burst) {
    heart.style.bottom = `${Math.random() * 70 + 20}px`;
  }

  heartsWrap.appendChild(heart);
  setTimeout(() => heart.remove(), 7800);
}

setInterval(() => {
  if (Math.random() > 0.28) {
    spawnHeart();
  }
}, 700);

function launchFireworkBurst(x, y, amount = 40) {
  const palette = ["#ffd36b", "#ff6da8", "#9f8cff", "#fff1bc", "#7bf7ff"];
  for (let i = 0; i < amount; i += 1) {
    const angle = (Math.PI * 2 * i) / amount;
    const speed = Math.random() * 3.6 + 1.2;
    fireworksParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: Math.random() * 48 + 52,
      alpha: 1,
      radius: Math.random() * 2.2 + 1,
      color: palette[Math.floor(Math.random() * palette.length)],
    });
  }
}

function startFireworkShow() {
  let shots = 0;
  const timer = setInterval(() => {
    const x = Math.random() * (window.innerWidth * 0.8) + window.innerWidth * 0.1;
    const y = Math.random() * (window.innerHeight * 0.35) + window.innerHeight * 0.12;
    launchFireworkBurst(x, y, 42);
    shots += 1;
    if (shots >= 8) {
      clearInterval(timer);
    }
  }, 170);
}

function openLetter() {
  letterModal.classList.remove("open");
  requestAnimationFrame(() => {
    letterModal.classList.add("open");
    letterModal.setAttribute("aria-hidden", "false");
  });
}

surpriseBtn.addEventListener("click", () => {
  surpriseBtn.classList.add("launch");
  setTimeout(() => surpriseBtn.classList.remove("launch"), 680);

  for (let i = 0; i < 42; i += 1) {
    setTimeout(() => spawnHeart(Math.random() * window.innerWidth, true), i * 36);
  }

  startFireworkShow();
  setTimeout(openLetter, 340);
});

closeLetterBtn.addEventListener("click", () => {
  letterModal.classList.remove("open");
  letterModal.setAttribute("aria-hidden", "true");
});

letterModal.addEventListener("click", (event) => {
  if (event.target === letterModal) {
    letterModal.classList.remove("open");
    letterModal.setAttribute("aria-hidden", "true");
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && letterModal.classList.contains("open")) {
    letterModal.classList.remove("open");
    letterModal.setAttribute("aria-hidden", "true");
  }
});

function updatePhotoTilt(clientX, clientY) {
  const bounds = letterPhotoWrap.getBoundingClientRect();
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;
  const offsetX = (clientX - centerX) / bounds.width;
  const offsetY = (clientY - centerY) / bounds.height;

  letterPhotoWrap.style.setProperty("--tiltY", `${offsetX * 12}deg`);
  letterPhotoWrap.style.setProperty("--tiltX", `${-offsetY * 12}deg`);
}

letterPhotoWrap.addEventListener("mousemove", (event) => {
  updatePhotoTilt(event.clientX, event.clientY);
});

letterPhotoWrap.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  if (touch) {
    updatePhotoTilt(touch.clientX, touch.clientY);
  }
});

["mouseleave", "touchend", "touchcancel"].forEach((eventName) => {
  letterPhotoWrap.addEventListener(eventName, () => {
    letterPhotoWrap.style.setProperty("--tiltY", "0deg");
    letterPhotoWrap.style.setProperty("--tiltX", "0deg");
  });
});

function resizeCanvas() {
  sparkles.width = window.innerWidth;
  sparkles.height = window.innerHeight;
  fireworks.width = window.innerWidth;
  fireworks.height = window.innerHeight;
}

function createParticles() {
  const total = Math.max(36, Math.floor(window.innerWidth / 24));
  particles = Array.from({ length: total }, () => ({
    x: Math.random() * sparkles.width,
    y: Math.random() * sparkles.height,
    radius: Math.random() * 1.6 + 0.35,
    speedY: Math.random() * 0.35 + 0.06,
    drift: (Math.random() - 0.5) * 0.25,
    alpha: Math.random() * 0.5 + 0.22,
  }));
}

function drawSparkles() {
  sparkleCtx.clearRect(0, 0, sparkles.width, sparkles.height);
  for (const particle of particles) {
    particle.y -= particle.speedY;
    particle.x += particle.drift;

    if (particle.y < -10) {
      particle.y = sparkles.height + 10;
      particle.x = Math.random() * sparkles.width;
    }

    if (particle.x < -10) particle.x = sparkles.width + 10;
    if (particle.x > sparkles.width + 10) particle.x = -10;

    sparkleCtx.beginPath();
    sparkleCtx.fillStyle = `rgba(255, 235, 170, ${particle.alpha})`;
    sparkleCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    sparkleCtx.fill();
  }

  requestAnimationFrame(drawSparkles);
}

function drawFireworks() {
  fireworksCtx.clearRect(0, 0, fireworks.width, fireworks.height);
  fireworksParticles = fireworksParticles.filter((particle) => particle.life > 0 && particle.alpha > 0);

  for (const particle of fireworksParticles) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.028;
    particle.life -= 1;
    particle.alpha -= 0.014;

    fireworksCtx.beginPath();
    fireworksCtx.fillStyle = `${particle.color}${Math.max(0, Math.floor(particle.alpha * 255)).toString(16).padStart(2, "0")}`;
    fireworksCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    fireworksCtx.fill();
  }

  requestAnimationFrame(drawFireworks);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

resizeCanvas();
createParticles();
drawSparkles();
drawFireworks();

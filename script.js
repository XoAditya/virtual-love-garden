function plantFlower() {
  const message = document.getElementById('message').value.trim();
  if (!message) return;

  const garden = document.getElementById('garden');
  const flower = document.createElement('div');
  flower.className = 'flower';

  const row = Math.floor(Math.random() * 5);
  flower.dataset.row = row;
  flower.dataset.message = message;

  // Vertical offset: row × 41px
  const rowOffset = row * 41;
  flower.style.backgroundPositionY = `-${rowOffset}px`;

  // Start at phase 1 (frame 0), animate to phase 2 (frame 1)
  flower.style.backgroundPositionX = '0px';
  flower.style.animation = 'grow-to-2 0.4s steps(1) forwards';

  const leftPercent = Math.random() * 60 + 40;
  const topPercent = Math.random() * 60 + 40;
  flower.style.left = leftPercent + '%';
  flower.style.top = topPercent + '%';

  // On click → grow to phase 3–4, then show popup
  flower.onclick = () => {
    flower.style.animation = 'none'; // reset animation
    flower.offsetHeight; // trigger reflow
    flower.style.animation = 'grow-to-4 0.6s steps(1) forwards';

    setTimeout(() => {
      document.getElementById('popup-text').innerText = flower.dataset.message;
      document.getElementById('popup').classList.remove('hidden');
      document.currentFlower = flower;
    }, 600);
  };

  garden.appendChild(flower);
  document.getElementById('message').value = '';
}

function closePopup() {
  document.getElementById('popup').classList.add('hidden');
  const flower = document.currentFlower;
  if (flower) {
    flower.style.animation = 'none';
    flower.offsetHeight;
    flower.style.backgroundPositionX = '-41px'; // Reset to phase 2
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bg-music");
  const slider = document.getElementById("volume-slider");
  const icon = document.getElementById("speaker-icon");

  music.volume = 0.5;

  icon.addEventListener("click", () => {
    slider.classList.toggle("visible");
  });

  slider.addEventListener("input", () => {
    music.volume = parseFloat(slider.value);
  });
});
// Shovel Mode Logic
let shovelMode = false;

document.addEventListener("DOMContentLoaded", () => {
  const shovelIcon = document.getElementById("shovel-icon");
  const garden = document.getElementById("garden");
  const puff = document.getElementById("puff-sound");

  // Toggle shovel mode
  shovelIcon.addEventListener("click", () => {
    shovelMode = !shovelMode;
    shovelIcon.classList.toggle("active");
  });

  // Click on flower when shovel mode is active
  garden.addEventListener("click", (e) => {
    if (!shovelMode) return;

    const target = e.target;
    if (target.classList.contains("flower")) {
      target.remove(); // remove flower
      puff.currentTime = 0;
      puff.play();
    }
  });
});


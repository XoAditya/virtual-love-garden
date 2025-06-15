// === Firebase Setup ===
const firebaseConfig = {
  apiKey: "AIzaSyBgtQdwGMzD-8GK4EEnl4Cd_gGuKGWJ9G0",
  authDomain: "virtuallovegarden.firebaseapp.com",
  projectId: "virtuallovegarden",
  storageBucket: "virtuallovegarden.firebasestorage.app",
  messagingSenderId: "73424640990",
  appId: "1:73424640990:web:b65870e0892831f0bd1b4f",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// === Create and Display Flower ===
function createFlower({ message, row, x, y, id }) {
  const garden = document.getElementById('garden');
  const flower = document.createElement('div');
  flower.className = 'flower';
  flower.dataset.row = row;
  flower.dataset.message = message;
  flower.dataset.id = id || null;

  const rowOffset = row * 41;
  flower.style.backgroundPositionY = `-${rowOffset}px`;
  flower.style.backgroundPositionX = '0px';
  flower.style.animation = 'grow-to-2 0.4s steps(1) forwards';
  flower.style.left = x + '%';
  flower.style.top = y + '%';

  flower.onclick = () => {
    if (window.shovelMode) {
      // Delete from database if ID exists
      if (flower.dataset.id) {
        database.ref('flowers/' + flower.dataset.id).remove();
      }
      flower.remove();
      document.getElementById("puff-sound").play();
    } else {
      flower.style.animation = 'none';
      flower.offsetHeight;
      flower.style.animation = 'grow-to-4 0.6s steps(1) forwards';

      setTimeout(() => {
        document.getElementById('popup-text').innerText = message;
        document.getElementById('popup').classList.remove('hidden');
        document.currentFlower = flower;
      }, 600);
    }
  };

  garden.appendChild(flower);
}

// === Plant New Flower ===
function plantFlower() {
  const message = document.getElementById('message').value.trim();
  if (!message) return;

  const row = Math.floor(Math.random() * 5);
  const x = Math.random() * 60 + 40;
  const y = Math.random() * 60 + 40;

  // Push to Firebase
  const newFlowerRef = database.ref('flowers').push();
  newFlowerRef.set({
    message,
    row,
    x,
    y,
    timestamp: Date.now()
  });

  createFlower({ message, row, x, y, id: newFlowerRef.key });
  document.getElementById('message').value = '';
}

// === Close Popup ===
function closePopup() {
  document.getElementById('popup').classList.add('hidden');
  const flower = document.currentFlower;
  if (flower) {
    flower.style.animation = 'none';
    flower.offsetHeight;
    flower.style.backgroundPositionX = '-41px'; // Reset to phase 2
  }
}

// === DOM Ready ===
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

  // === Load Existing Flowers from Firebase ===
  database.ref('flowers').on('value', (snapshot) => {
    const garden = document.getElementById('garden');
    garden.innerHTML = ''; // Clear existing
    snapshot.forEach(child => {
      const data = child.val();
      createFlower({ ...data, id: child.key });
    });
  });

  // === Shovel Tool Logic ===
  const shovel = document.getElementById("shovel-icon");
  const tooltip = document.querySelector(".shovel-tooltip");

  window.shovelMode = false;

  shovel.addEventListener("mouseover", () => {
    tooltip.innerText = "Click to remove flowers";
    shovel.style.transform = "scale(1.2)";
  });

  shovel.addEventListener("mouseout", () => {
    tooltip.innerText = "";
    shovel.style.transform = "scale(1)";
  });

  shovel.addEventListener("click", () => {
    window.shovelMode = !window.shovelMode;
    shovel.classList.toggle("active");
  });
});

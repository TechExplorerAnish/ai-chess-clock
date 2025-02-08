/** @format */

let timeLimit = 300;
let warningThreshold = 30;
let player1Time = timeLimit;
let player2Time = timeLimit;
let currentPlayer = 1;
let startTime;
let isRunning = false;
let cooldownTime = 1000; // 1 second cooldown in milliseconds
let lastSwitchTime = 0;
let handPose;
let video;
let hands = [];
let isCameraVisible = true;

const loadingOverlay = document.getElementById("loading-overlay");
const buttons = document.querySelectorAll("button");
const editButtons = document.querySelectorAll(
  '[onclick="editPlayerName(1)"], [onclick="editPlayerName(2)"]'
);

const startBtn = document.querySelector("#start");
const resetBtn = document.querySelector("#reset");
const toggleCameraBtn = document.querySelector("#toggle-camera");
const sketchContainer = document.querySelector("#sketch-container");
disableButtons();
// Load saved player names on startup
loadPlayerNames();

// Load saved camera visibility preference
loadCameraPreference();

// Initialize warning threshold slider
document
  .getElementById("warning-slider")
  .addEventListener("input", function () {
    document.getElementById("warning-display").textContent = this.value;
    warningThreshold = parseInt(this.value);
  });

startBtn.addEventListener("click", () => {
  if (!isRunning) {
    startGame();
  }
});

resetBtn.addEventListener("click", () => {
  resetGame();
});

toggleCameraBtn.addEventListener("click", () => {
  toggleCamera();
});

async function preload() {
  try {
    handPose = await ml5.handPose();
    enableButtons();
  } catch (error) {
    console.error("Error loading handpose model:", error);
    alert("Error loading hand detection. Please refresh the page.");
  }
}

async function setup() {
  try {
    const canvas = createCanvas(320, 240);
    canvas.parent("sketch-container");
    video = createCapture(VIDEO);
    video.size(160, 120);
    video.hide();
    await handPose.detectStart(video, gotHands);
  } catch (error) {
    console.error("Error setting up video:", error);
    alert(
      "Error accessing camera. Please ensure camera permissions are granted."
    );
    enableButtons();
  }
}

function toggleCamera() {
  isCameraVisible = !isCameraVisible;
  localStorage.setItem("isCameraVisible", isCameraVisible);
  updateCameraVisibility();
}

function loadCameraPreference() {
  const savedPreference = localStorage.getItem("isCameraVisible");
  if (savedPreference !== null) {
    isCameraVisible = savedPreference === "true";
    updateCameraVisibility();
  }
}

function updateCameraVisibility() {
  if (isCameraVisible) {
    sketchContainer.style.height = "auto";
    sketchContainer.style.opacity = "1";
    toggleCameraBtn.textContent = "Hide Camera";
  } else {
    sketchContainer.style.height = "0";
    sketchContainer.style.opacity = "0";
    toggleCameraBtn.textContent = "Show Camera";
  }
}

function loadPlayerNames() {
  const player1Name = localStorage.getItem("player1Name") || "Player 1";
  const player2Name = localStorage.getItem("player2Name") || "Player 2";
  document.querySelector("#player1-name").textContent = player1Name;
  document.querySelector("#player2-name").textContent = player2Name;
}

function editPlayerName(playerNum) {
  if (isRunning) {
    alert("Please finish or reset the current game before changing names.");
    return;
  }

  const currentName =
    localStorage.getItem(`player${playerNum}Name`) || `Player ${playerNum}`;
  const newName = prompt(`Enter new name for ${currentName}:`, currentName);

  if (newName && newName.trim()) {
    localStorage.setItem(`player${playerNum}Name`, newName.trim());
    document.querySelector(`#player${playerNum}-name`).textContent =
      newName.trim();
  }
}

function clearPlayerNames() {
  if (isRunning) {
    alert("Please finish or reset the current game before clearing names.");
    return;
  }

  if (confirm("Are you sure you want to clear saved player names?")) {
    localStorage.removeItem("player1Name");
    localStorage.removeItem("player2Name");
    document.querySelector("#player1-name").textContent = "Player 1";
    document.querySelector("#player2-name").textContent = "Player 2";
  }
}

document.getElementById("time-slider").addEventListener("input", function () {
  document.getElementById("time-display").textContent = this.value;
  timeLimit = this.value * 60;
  resetGame();
});

function setup() {
  const canvas = createCanvas(320, 240);
  canvas.parent("sketch-container");
  video = createCapture(VIDEO);
  video.size(160, 120);
  video.hide();
  handPose.detectStart(video, gotHands);
}

function draw() {
  updateTimer();
  image(video, 0, 0, width, height);
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x * 2, keypoint.y * 2, 10);
    }
  }
}

function gotHands(results) {
  hands = results;

  if (hands.length > 0) {
    let isHandCentered = isHandCenteredOnScreen(hands[0]);
    if (isHandCentered) handleHandDetection(hands[0].handedness);
  }
}

function updateTimer() {
  if (!isRunning) return;
  let currentTime = millis() / 1000;
  let elapsed = currentTime - startTime;

  const updatePlayerWarning = (playerNum, timeLeft) => {
    const boxElement = document.getElementById(`player${playerNum}-box`);
    const timeElement = document.getElementById(`player${playerNum}-time`);
    const warningElement = document.getElementById(
      `player${playerNum}-warning`
    );

    if (timeLeft <= warningThreshold) {
      boxElement.classList.add("bg-red-100/10");
      boxElement.classList.add("animate-pulse");
      timeElement.classList.add("text-red-500");
      warningElement.classList.remove("hidden");
    } else {
      boxElement.classList.remove("bg-red-100/10");
      boxElement.classList.remove("animate-pulse");
      timeElement.classList.remove("text-red-500");
      warningElement.classList.add("hidden");
    }
  };

  if (currentPlayer === 1) {
    player1Time = max(0, player1Time - elapsed);
    document.getElementById("player1-time").textContent =
      formatTime(player1Time);
    updatePlayerWarning(1, player1Time);

    // Update indicators
    document
      .getElementById("player1-indicator")
      .classList.replace("bg-gray-500", "bg-green-500");
    document
      .getElementById("player2-indicator")
      .classList.replace("bg-green-500", "bg-gray-500");
    document
      .getElementById("player1-box")
      .classList.add("ring-2", "ring-blue-500");
    document
      .getElementById("player2-box")
      .classList.remove("ring-2", "ring-blue-500");
  } else {
    player2Time = max(0, player2Time - elapsed);
    document.getElementById("player2-time").textContent =
      formatTime(player2Time);
    updatePlayerWarning(2, player2Time);

    // Update indicators
    document
      .getElementById("player2-indicator")
      .classList.replace("bg-gray-500", "bg-green-500");
    document
      .getElementById("player1-indicator")
      .classList.replace("bg-green-500", "bg-gray-500");
    document
      .getElementById("player2-box")
      .classList.add("ring-2", "ring-blue-500");
    document
      .getElementById("player1-box")
      .classList.remove("ring-2", "ring-blue-500");
  }

  startTime = currentTime;

  if (player1Time <= 0 || player2Time <= 0) {
    gameOver();
  }
}

function resetGame() {
  isRunning = false;
  currentPlayer = 1;
  player1Time = timeLimit;
  player2Time = timeLimit;
  lastSwitchTime = 0;

  // Update time displays
  const timeDisplay1 = document.getElementById("player1-time");
  const timeDisplay2 = document.getElementById("player2-time");
  timeDisplay1.textContent = formatTime(player1Time);
  timeDisplay2.textContent = formatTime(player2Time);

  // Clear warnings
  const player1Warning = document.getElementById("player1-warning");
  const player2Warning = document.getElementById("player2-warning");
  player1Warning.classList.add("hidden");
  player2Warning.classList.add("hidden");

  // Clear all warning styles
  const elements = {
    boxes: [
      document.getElementById("player1-box"),
      document.getElementById("player2-box"),
    ],
    times: [timeDisplay1, timeDisplay2],
  };

  elements.boxes.forEach((box) => {
    box.classList.remove(
      "ring-2",
      "ring-blue-500",
      "bg-red-100/10",
      "animate-pulse"
    );
  });

  elements.times.forEach((time) => {
    time.classList.remove("text-red-500");
  });

  // Reset indicators
  document
    .getElementById("player1-indicator")
    .classList.replace("bg-green-500", "bg-gray-500");
  document
    .getElementById("player2-indicator")
    .classList.replace("bg-green-500", "bg-gray-500");
  document.getElementById("sliderContainer").classList.remove("hidden");
}

function gameOver() {
  isRunning = false;
  const winner =
    player1Time <= 0
      ? localStorage.getItem("player2Name") || "Player 2"
      : localStorage.getItem("player1Name") || "Player 1";
  alert(winner + " wins on time!");
  resetGame();
}

function formatTime(seconds) {
  let mins = floor(seconds / 60);
  let secs = floor(seconds % 60);
  return nf(mins, 2) + ":" + nf(secs, 2);
}

function switchPlayer() {
  if (!isRunning) return;
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  startTime = millis() / 1000;
}

function startGame() {
  isRunning = true;
  startTime = millis() / 1000;
  document
    .getElementById("player1-box")
    .classList.add("ring-2", "ring-blue-500");
  document.getElementById("sliderContainer").classList.add("hidden");
}

function disableButtons() {
  buttons.forEach((button) => (button.disabled = true));
  editButtons.forEach((button) => (button.style.pointerEvents = "none"));
}

// Enable all buttons
function enableButtons() {
  buttons.forEach((button) => (button.disabled = false));
  editButtons.forEach((button) => (button.style.pointerEvents = "auto"));
  loadingOverlay.classList.add("hidden");
}

function handleHandDetection(hand) {
  if (!isRunning) return;

  const currentTime = millis();
  // Check if enough time has passed since the last switch
  if (currentTime - lastSwitchTime < cooldownTime) {
    return; // Exit if we're still in cooldown period
  }

  if (hand === "Left" && currentPlayer === 1) {
    switchPlayer();
    lastSwitchTime = currentTime;
  }
  if (hand === "Right" && currentPlayer === 2) {
    switchPlayer();
    lastSwitchTime = currentTime;
  }
}

function isHandCenteredOnScreen(hand) {
  // Get the wrist position as reference point for hand center
  const wrist = hand.wrist;

  // Convert pixel coordinates to normalized coordinates (0-1 range)
  const VIDEO_WIDTH = video.width;
  const VIDEO_HEIGHT = video.height;

  const normalizedX = wrist.x / VIDEO_WIDTH;
  const normalizedY = wrist.y / VIDEO_HEIGHT;

  // Define the center region bounds (30% from center in each direction)
  const centerRegionSize = 0.3;

  // Calculate screen center regions
  const minX = 0.5 - centerRegionSize;
  const maxX = 0.5 + centerRegionSize;
  const minY = 0.5 - centerRegionSize;
  const maxY = 0.5 + centerRegionSize;

  // Check if hand is within the center region
  const isXCentered = normalizedX >= minX && normalizedX <= maxX;
  const isYCentered = normalizedY >= minY && normalizedY <= maxY;

  return isXCentered && isYCentered;
}

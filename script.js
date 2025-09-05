// ----------------------------
// TASKHERO SCRIPT (Phase 2 Ready)
// ----------------------------

// ----------------------------
// CONFIG
// ----------------------------
const parentPin = "1234"; // parent PIN
const xpPerTask = 10;

// ----------------------------
// MODE HANDLING
// ----------------------------
const mode = localStorage.getItem("taskhero_mode") || "kids"; 
// Default = kids if none chosen
document.title = `TaskHero - ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;

// ----------------------------
// ELEMENTS
// ----------------------------
const taskInput = document.querySelector("#taskInput");
const taskSection = document.querySelector(".tasks");
const addButton = document.querySelector("#push");
const progressBar = document.querySelector(".progress-bar");
const statsText = document.getElementById("stats");
const achievementList = document.getElementById("achievement-list");
const toastContainer = document.getElementById("toast-container");

// ----------------------------
// STATE
// ----------------------------
let tasks = [];
let xp = 0;
let level = 1;
let completedCount = 0;
const achievements = new Set();
const today = new Date().toISOString().slice(0, 10);

// ----------------------------
// LOCAL STORAGE
// ----------------------------
function loadTasks() {
  const saved = JSON.parse(localStorage.getItem(`tasks_${mode}`) || "[]");
  tasks = saved.map(t => {
    if (t.completed && t.lastCompleted !== today) t.completed = false;
    return t;
  });
  tasks.forEach(t => createTaskElement(t));
  updateProgress();
}

function saveTasks() {
  localStorage.setItem(`tasks_${mode}`, JSON.stringify(tasks));
}

// ----------------------------
// ADD TASK (Kids + Pro)
// ----------------------------
function addTask() {
  if (mode === "students") {
    showToast("📚 Students: Add tasks via opportunity search (coming soon).");
    return;
  }

  const text = taskInput.value.trim();
  if (!text) {
    showToast("⚠️ Please enter a task!");
    return;
  }

  const taskObj = {
    text,
    completed: false,
    streak: 0,
    lastCompleted: '',
    dateCreated: today
  };

  tasks.push(taskObj);
  createTaskElement(taskObj);
  saveTasks();
  taskInput.value = "";
  updateProgress();
}

if (addButton) {
  addButton.addEventListener("click", addTask);
  taskInput.addEventListener("keyup", e => { if (e.key === "Enter") addTask(); });
}

// ----------------------------
// CREATE TASK ELEMENT
// ----------------------------
function createTaskElement(taskObj) {
  const task = document.createElement("div");
  task.classList.add("task");

  task.innerHTML = `
    <label>
      <input type="checkbox" class="check-task" ${taskObj.completed ? "checked" : ""}>
      <p>${taskObj.text} <span class="streak">🔥 ${taskObj.streak}</span></p>
    </label>
    <div class="delete">
      <i class="uil uil-trash"></i>
    </div>
  `;

  const checkbox = task.querySelector(".check-task");
  const streakSpan = task.querySelector(".streak");

  checkbox.addEventListener("change", () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    taskObj.completed = checkbox.checked;

    if (checkbox.checked) {
      if (taskObj.lastCompleted === getYesterday()) {
        taskObj.streak += 1;
      } else if (taskObj.lastCompleted !== todayStr) {
        taskObj.streak = 1;
      }
      taskObj.lastCompleted = todayStr;
      addXP();
      completedCount++;
      checkAchievements();
      celebrate();
    }

    streakSpan.innerText = `🔥 ${taskObj.streak}`;
    saveTasks();
    updateProgress();
  });

  task.querySelector(".delete").addEventListener("click", () => {
    const enteredPin = prompt("Enter parent PIN to delete task:");
    if (enteredPin === parentPin) {
      task.remove();
      tasks = tasks.filter(t => t !== taskObj);
      saveTasks();
      updateProgress();
      showToast("Task deleted ✅");
    } else {
      showToast("❌ Incorrect PIN!");
    }
  });

  taskSection.appendChild(task);
}

// ----------------------------
// HELPER: Yesterday
// ----------------------------
function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// ----------------------------
// PROGRESS & LEVELING
// ----------------------------
function updateProgress() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const percent = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  progressBar.style.width = `${percent}%`;
  statsText.innerText = `Level ${level} | XP: ${xp}`;
}

function addXP() {
  xp += xpPerTask;
  if (xp >= level * 50) {
    level++;
    xp = 0;
    showToast(`🎉 Level Up! You reached Level ${level}`);
    celebrate();
  }
  updateProgress();
}

// ----------------------------
// ACHIEVEMENTS
// ----------------------------
function checkAchievements() {
  if (completedCount === 1) unlockAchievement("🥇 First Task Completed");
  if (completedCount === 10) unlockAchievement("🏆 10 Tasks Completed");
  if (completedCount === 25) unlockAchievement("👑 25 Tasks Completed");
}

function unlockAchievement(name) {
  if (achievements.has(name)) return;
  achievements.add(name);

  const li = document.createElement("li");
  li.textContent = name;
  li.classList.add("unlocked");
  achievementList.appendChild(li);

  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  showToast(`🏅 Achievement unlocked: ${name}!`);
}

// ----------------------------
// TOAST NOTIFICATIONS
// ----------------------------
function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ----------------------------
// CELEBRATION CONFETTI
// ----------------------------
function celebrate() {
  const duration = 1000;
  const end = Date.now() + duration;
  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// ----------------------------
// STUDENT & PRO PLACEHOLDERS
// ----------------------------
if (mode === "students") {
  showToast("📚 Student Mode: Scholarship & internship search coming soon.");
}

if (mode === "pro") {
  showToast("💼 Pro Mode: AI task capture (email, Slack, voice) coming soon.");
}

// ----------------------------
// INITIAL LOAD
// ----------------------------
loadTasks();
updateProgress();



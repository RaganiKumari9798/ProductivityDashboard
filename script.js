const API_KEY = "19d503c3e3a4d0c8397bd5f19b026d9b";

const weatherIcon = document.querySelector("#weatherIcon");
const condition = document.querySelector("#condition");
const city = document.querySelector("#city");
const temperature = document.querySelector("#temperature");
const feelsLike = document.querySelector("#feelsLike");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windSpeed");

const currentDate = document.querySelector("#currentDate");
const currentTime = document.querySelector("#currentTime");

// Date & Time

function updateTime() {
  const now = new Date();

  currentTime.textContent = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  currentDay.textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
  });

  currentDate.textContent = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

setInterval(updateTime, 1000);
updateTime();

// Weather

const body = document.body;

async function getWeather(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    );

    const data = await response.json();

    city.textContent = data.name;
    condition.textContent = data.weather[0].main;
    temperature.textContent = Math.round(data.main.temp);
    feelsLike.textContent = Math.round(data.main.feels_like);
    humidity.textContent = data.main.humidity + "%";
    windSpeed.textContent = data.wind.speed + " km/h";

    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // Change Background According to Weather

    const weather = data.weather[0].main.toLowerCase();

    if (weather === "clear") {
      body.style.backgroundImage = "url('images/sunny.png')";
    } else if (weather === "clouds") {
      body.style.backgroundImage = "url('images/cloudy.png')";
    } else if (weather === "rain" || weather === "drizzle") {
      body.style.backgroundImage = "url('images/rainy.png')";
    } else if (weather === "thunderstorm") {
      body.style.backgroundImage = "url('images/thunder.png')";
    } else if (
      weather === "mist" ||
      weather === "fog" ||
      weather === "haze" ||
      weather === "smoke"
    ) {
      body.style.backgroundImage = "url('images/mist.png')";
    } else {
      body.style.backgroundImage = "url('images/sunny.png')";
    }
  } catch (error) {
    console.log(error);
  }
}

// Location

navigator.geolocation.getCurrentPosition(

    (position) => {

        console.log(position.coords.latitude);
        console.log(position.coords.longitude);

        getWeather(
            position.coords.latitude,
            position.coords.longitude
        );

    },

    (error) => {

        console.error(error);

        alert("Unable to get your location.");

    },

    {

        enableHighAccuracy: true,

        timeout: 15000,

        maximumAge: 0

    }

);

const dashboard = document.querySelector("#dashboard");

const motivationPage = document.querySelector("#motivationPage");

const motivationCard = document.querySelector("#motivationCard");
const featurePages = document.querySelectorAll(".feature-page");
const backBtn = document.querySelectorAll(".backBtn");

motivationCard.addEventListener("click", () => {
  dashboard.style.display = "none";

  motivationPage.style.display = "block";
});

backBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    featurePages.forEach((page) => {
      page.style.display = "none";
    });

    dashboard.style.display = "block";
  });
});

const quoteText = document.querySelector("#quoteText");

const quoteAuthor = document.querySelector("#quoteAuthor");

const newQuoteBtn = document.querySelector("#newQuoteBtn");

async function getQuote() {
  quoteText.innerHTML = "Loading Quote...";

  quoteAuthor.innerHTML = "";

  try {
    const response = await fetch("https://dummyjson.com/quotes/random");

    const data = await response.json();

    quoteText.innerHTML = `"${data.quote}"`;

    quoteAuthor.innerHTML = `— ${data.author}`;
  } catch (error) {
    quoteText.innerHTML = "Unable to load quote. Please try again.";

    quoteAuthor.innerHTML = "";
  }
}

newQuoteBtn.addEventListener("click", getQuote);

getQuote();

const pomodoroCard = document.querySelector("#pomodoroCard");

const pomodoroPage = document.querySelector("#pomodoroPage");

pomodoroCard.addEventListener("click", () => {
  dashboard.style.display = "none";

  pomodoroPage.style.display = "block";
});

let time = 25 * 60;

let interval;

const timer = document.querySelector("#timer");

const status = document.querySelector("#status");

function updateTimer() {
  let minutes = Math.floor(time / 60);

  let seconds = time % 60;

  timer.innerHTML = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

updateTimer();

startBtn.addEventListener("click", () => {
  clearInterval(interval);

  status.innerHTML = "Focus Time 🍅";

  interval = setInterval(() => {
    if (time > 0) {
      time--;

      updateTimer();
    } else {
      clearInterval(interval);

      status.innerHTML = "Session Complete 🎉";
    }
  }, 1000);
});

pauseBtn.addEventListener("click", () => {
  clearInterval(interval);

  status.innerHTML = "Paused ⏸";
});

resetBtn.addEventListener("click", () => {
  clearInterval(interval);

  time = 25 * 60;

  updateTimer();

  status.innerHTML = "Ready to Focus 🚀";
});

const goalCard = document.querySelector("#goalCard");

const goalPage = document.querySelector("#goalPage");

goalCard.addEventListener("click", () => {
  dashboard.style.display = "none";

  goalPage.style.display = "block";
});

const goalInput = document.querySelector("#goalInput");

const addGoalBtn = document.querySelector("#addGoalBtn");

const goalList = document.querySelector("#goalList");

const goalCount = document.querySelector("#goalCount");

let goals = JSON.parse(localStorage.getItem("goals")) || [];

function saveGoals() {
  localStorage.setItem("goals", JSON.stringify(goals));
}

function updateProgress() {
  const completed = goals.filter((goal) => goal.done).length;

  goalCount.innerHTML = `${completed} / ${goals.length} Completed`;
}

function renderGoals() {
  goalList.innerHTML = "";

  goals.forEach((goal, index) => {
    goalList.innerHTML += `

        <div class="goal-card">

            <div class="goal-left">

                <input
                type="checkbox"
                ${goal.done ? "checked" : ""}
                onchange="toggleGoal(${index})">

                <h3>${goal.text}</h3>

            </div>

            <button onclick="deleteGoal(${index})">

                Delete

            </button>

        </div>

        `;
  });

  updateProgress();

  saveGoals();
}

addGoalBtn.addEventListener("click", () => {
  if (goalInput.value.trim() == "") return;

  goals.push({
    text: goalInput.value,

    done: false,
  });

  goalInput.value = "";

  renderGoals();
});

function toggleGoal(index) {
  goals[index].done = !goals[index].done;

  renderGoals();
}

function deleteGoal(index) {
  goals.splice(index, 1);

  renderGoals();
}

renderGoals();

const plannerCard = document.querySelector("#plannerCard");

const plannerPage = document.querySelector("#plannerPage");

plannerCard.addEventListener("click", () => {
  dashboard.style.display = "none";

  plannerPage.style.display = "block";
});

const plannerContainer = document.querySelector("#plannerContainer");

const plannerDate = document.querySelector("#plannerDate");

const plannerTime = document.querySelector("#plannerTime");

const plannerData = JSON.parse(localStorage.getItem("planner")) || {};

const hours = [
  "04:00 AM",
  "05:00 AM",
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
  "12:00 AM",
  "01:00 AM",
  "02:00 AM",
  "03:00 AM",
];

function renderPlanner() {
  plannerContainer.innerHTML = "";

  const currentHour = new Date().getHours();

  hours.forEach((hour, index) => {
    const row = document.createElement("div");

    row.className = "planner-row";

    if (index === currentHour) {
      row.classList.add("current-hour");
    }

    row.innerHTML = `

        <div class="time">${hour}</div>

        <input
        class="planInput"
        type="text"
        placeholder="Write your plan..."
        value="${plannerData[hour] || ""}"
        >

        <button class="deleteBtn">

            🗑

        </button>

        `;

    const input = row.querySelector(".planInput");

    input.addEventListener("input", () => {
      plannerData[hour] = input.value;

      localStorage.setItem("planner", JSON.stringify(plannerData));
    });

    const deleteBtn = row.querySelector(".deleteBtn");

    deleteBtn.addEventListener("click", () => {
      delete plannerData[hour];

      localStorage.setItem("planner", JSON.stringify(plannerData));

      renderPlanner();
    });

    plannerContainer.appendChild(row);
  });
}

renderPlanner();
function updatePlannerClock() {
  const now = new Date();

  plannerDate.innerHTML = now.toLocaleDateString("en-IN", {
    weekday: "long",

    day: "numeric",

    month: "long",

    year: "numeric",
  });

  plannerTime.innerHTML = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",
  });
}

updatePlannerClock();

setInterval(updatePlannerClock, 1000);

const todoCard = document.querySelector("#todoCard");

const todoPage = document.querySelector("#todoPage");

todoCard.addEventListener("click", () => {
  dashboard.style.display = "none";

  todoPage.style.display = "block";
});

const taskInput = document.querySelector("#taskInput");

const addTaskBtn = document.querySelector("#addTaskBtn");

const taskList = document.querySelector("#taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTask() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    taskList.innerHTML += `

        <div class="task ${task.completed ? "completed" : ""} ${task.important ? "important" : ""}" data-index="${index}">

            <div class="task-left">

                <h3>${task.text}</h3>

            </div>

            <div class="task-right">

                <button class="important">

                    ${task.important ? "⭐" : "☆"}

                </button>

                <button class="complete ${task.completed ? "active" : ""}">
    ✔
</button>

                <button class="delete">

                    🗑

                </button>

            </div>

        </div>

        `;
  });

  saveTask();
}
function addTask() {
  const value = taskInput.value.trim();

  if (value === "") {
    alert("Enter a Task");

    return;
  }

  tasks.push({
    text: value,

    completed: false,

    important: false,
  });

  taskInput.value = "";

  renderTask();
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});
taskList.addEventListener("click", (e) => {
  const task = e.target.closest(".task");

  if (!task) return;

  const index = task.dataset.index;

  if (e.target.classList.contains("important")) {
    tasks[index].important = !tasks[index].important;
  }

  if (e.target.classList.contains("complete")) {
    tasks[index].completed = !tasks[index].completed;
  }

  if (e.target.classList.contains("delete")) {
    tasks.splice(index, 1);
  }

  renderTask();
});

renderTask();

const themeBtn = document.querySelector("#themeBtn");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeBtn.innerHTML = "☀️";

    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.innerHTML = "🌙 ";

    localStorage.setItem("theme", "light");
  }
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");

  themeBtn.innerHTML = "☀️";
}

const inputs = document.querySelectorAll(".input2");
const inputs2 = document.querySelectorAll(".input1");
const nightInputIndex = document.querySelector(".night");
const spanInputIndex = nightInputIndex.querySelector("span").value;
// Полный сброс игры (очистка полей, ролей и show-lines)
function fullReset() {
  // Сбрасываем все поля ввода
  document.querySelectorAll("input").forEach((input) => {
    input.value = "";
    input.readOnly = false;
  });
  // Сбрасываем все кнопки ролей
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.textContent = "";
    btn.style.color = "";
    btn.style.fontSize = "";
  });

  // Убираем все отметки о смерти (show-lines)
  document.querySelectorAll(".player").forEach((player) => {
    player.classList.remove("show-lines");
  });

  // Очищаем localStorage (если не нужно сохранять данные между сессиями)
  localStorage.removeItem("mafiaGameState");
}
function Mafia() {
  const sigma = event.target.closest(".player");
  const btn = sigma.querySelector(".btn");
  btn.textContent = "Маф";
  btn.style.color = "red";
}
function Don() {
  const sigma = event.target.closest(".player");
  const btn = sigma.querySelector(".btn");
  btn.textContent = "Дон";
  btn.style.color = "var(--text-color)";
}
function Sherif() {
  const sigma = event.target.closest(".player");
  const btn = sigma.querySelector(".btn");
  btn.textContent = "Шериф";
  btn.style.color = "blue";
  btn.style.fontSize = "10px";
}
function Mirni() {
  const sigma = event.target.closest(".player");
  const btn = sigma.querySelector(".btn");
  btn.textContent = "Мир";
  btn.style.color = "rgb(16, 150, 16)";
}
// Основные настройки игры
const GAME_SETTINGS = {
  roles: {
    mafia: { count: 2, text: "Маф.", color: "red" },
    don: { count: 1, text: "Дон", color: "var(--text-color)" },
    sheriff: { count: 1, text: "Шериф", color: "blue", fontSize: "10px" },
    civilian: { count: 6, text: "Мир.", color: "rgb(19, 204, 19)" },
  },
  maxPlayers: 10,
};

// Инициализация игры при загрузке

// Настройка всех обработчиков событий
function saveNightsInput() {
  document.querySelectorAll(".night input").forEach((input) => {
    input.addEventListener("input", (event) => {
      const nightElement = event.target.closest(".night");
      const nightNumber = nightElement.querySelector("span").textContent;
      const nightInput = nightElement.querySelector("input");
      const playerNumbers = nightInput.value
        .trim()
        .split(/\s+/)
        .filter((num) => num);

      // Сохраняем данные для суда
      localStorage.setItem(
        "courtData",
        JSON.stringify({
          nightNumber: nightNumber,
          players: playerNumbers,
        })
      );
    });
  });
}
// Функция распределения ролей
function assignRandomRoles(e) {
  if (e) e.preventDefault(); // Если событие передано, отменяем действие по умолчанию

  let rolesPool = [];
  for (const [role, settings] of Object.entries(GAME_SETTINGS.roles)) {
    rolesPool.push(...Array(settings.count).fill(role));
  }

  shuffleArray(rolesPool);

  document.querySelectorAll(".player .btn").forEach((btn, index) => {
    if (index < rolesPool.length) {
      const role = rolesPool[index];
      applyRoleToButton(btn, role);
    }
  });

  saveGameState();
}
function setupEventListeners() {
  // Обработчики для кнопок ролей
  document
    .querySelector('a[onclick="role()"]')
    .addEventListener("click", assignRandomRoles);

  // Обработчики для выстрелов
  document.querySelectorAll(".fa-gun").forEach((gun) => {
    gun.addEventListener("click", Shoot);
  });

  // Обработчики для перехода на страницу суда
  document.querySelectorAll(".fa-scale-balanced").forEach((icon) => {
    icon.addEventListener("click", goToCourtPage);
  });
}

// Применяем роль к кнопке
function applyRoleToButton(btn, role) {
  const roleSettings =
    GAME_SETTINGS.roles[role === "civilian" ? "civilian" : role];

  btn.textContent = roleSettings.text;
  btn.style.color = roleSettings.color;
  btn.style.fontSize = roleSettings.fontSize || "";
}

// Перемешивание массива (алгоритм Фишера-Йетса)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Сохранение состояния игры
function saveGameState() {
  const gameState = {
    players: [],
    nights: [],
    version: "1.2",
  };

  // Сохраняем игроков
  document.querySelectorAll(".player").forEach((player, index) => {
    const input1 = player.querySelector(".input1");
    const input2 = player.querySelector(".input2");
    const btn = player.querySelector(".btn");

    gameState.players.push({
      id: index + 1,
      name: input1.value,
      votes: input2.value,
      role: btn.textContent,
      roleColor: btn.style.color,
      roleFontSize: btn.style.fontSize,
      isDead: player.classList.contains("show-lines"),
    });
  });

  // Сохраняем ночи
  // document.querySelectorAll(".night").forEach((night, index) => {
  //   const input = night.querySelector("input");
  //   gameState.nights.push({
  //     nightNumber: index + 1,
  //     numbers: input.value.trim(),
  //   });
  // });

  localStorage.setItem("mafiaGameState", JSON.stringify(gameState));
}

// Восстановление состояния
function Reset() {
  const colorSigma = JSON.parse(localStorage.getItem("courtColorIndex"));
  document.documentElement.style.setProperty("--bg-col", colorSigma);

  const color = colorSigma;
  document.getElementById("color").value = color;
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Смена текста в зависимости от яркости
  if (brightness > 150) {
    // Светлый фон — делаем тёмный текст
    document.documentElement.style.setProperty(
      "--text-color",
      "rgb(13, 13, 13)"
    );
  } else {
    // Тёмный фон — делаем светлый текст
    document.documentElement.style.setProperty(
      "--text-color",
      "rgb(246, 246, 246)"
    );
  }
  const savedState = localStorage.getItem("mafiaGameState");
  if (!savedState) return;

  try {
    const gameState = JSON.parse(savedState);

    // Проверка версии
    if (gameState.version !== "1.2") {
      console.warn("Версия сохранения не поддерживается");
      return;
    }

    // Восстановление игроков
    gameState.players.forEach((playerData) => {
      const player = document.querySelector(
        `.player:nth-child(${playerData.id})`
      );
      if (!player) return;

      const input1 = player.querySelector(".input1");
      const input2 = player.querySelector(".input2");
      const btn = player.querySelector(".btn");

      input1.value = playerData.name || "";
      input2.value = playerData.votes || "";
      btn.textContent = playerData.role;
      btn.style.color = playerData.roleColor || "";
      btn.style.fontSize = playerData.roleFontSize || "";

      if (playerData.isDead) {
        player.classList.add("show-lines");
        input1.readOnly = true;
        input2.readOnly = true;
      }
    });

    // Восстановление ночей
    const nightsData = JSON.parse(localStorage.getItem("nightsData"));
    if (nightsData) {
      const nightInputs = document.querySelectorAll(".night input");
      nightsData.forEach((night, index) => {
        if (nightInputs[index]) {
          nightInputs[index].value = night.numbers.join(" ");
        }
      });
    }
  } catch {
    console.log("error");
  }
}
// function saveNightInputs() {
//   const nights = document.querySelectorAll(".night input");
//   const allPlayers = []; // Будет хранить номера игроков как массив строк (не объектов!)

//   nights.forEach((input) => {
//     const numbers = input.value
//       .trim()
//       .split(/\s+/)
//       .filter((num) => num);
//     allPlayers.push(...numbers); // Добавляем числа в общий массив
//   });

//   localStorage.setItem("nominatedPlayers", JSON.stringify(allPlayers));
// }
// Восстановление состояния из сохранения
function saveNightInputs() {
  const nightsData = [];
  document.querySelectorAll(".night").forEach((night, index) => {
    const input = night.querySelector("input");
    const numbers = input.value
      .trim()
      .split(/\s+/)
      .filter((num) => num);
    nightsData.push({
      nightNumber: index + 1,
      numbers: numbers,
    });
  });
  localStorage.setItem("nightsData", JSON.stringify(nightsData));
}
function restoreGameState(gameState) {
  gameState.players.forEach((playerData) => {
    const playerElement = document.querySelector(
      `.player:nth-child(${playerData.id})`
    );
    if (!playerElement) return;

    const input1 = playerElement.querySelector(".input1");
    const input2 = playerElement.querySelector(".input2");
    const btn = playerElement.querySelector(".btn");

    // Восстанавливаем данные игрока
    input1.value = playerData.name || "";
    input2.value = playerData.votes || "";

    // Восстанавливаем роль
    if (playerData.role) {
      btn.textContent = playerData.role;
      btn.style.color = playerData.roleColor || "";
      btn.style.fontSize = playerData.roleFontSize || "";
    }

    // Восстанавливаем статус жизни
    if (playerData.isDead) {
      playerElement.classList.add("show-lines");
      input2.readOnly = true;
      input1.readOnly = true;
    } else {
      playerElement.classList.remove("show-lines");
      input2.readOnly = false;
      input1.readOnly = false;
    }
  });
}

// Полный сброс игры
function fullResetFoto() {
  const text =
    "Вы точно хотите сбросить всю информацию \n(ночи, роли, ники, фолы)?";
  if (confirm(text) == true) {
    fullReset();
  } else {
    return;
  }
}
function assignRandomRolesA() {
  const text = "Вы точно изменить все роли?";
  if (confirm(text) == true) {
    assignRandomRoles();
  } else {
    return;
  }
}
// Обработка выстрела
function Shoot() {
  const text = "Вы точно хотите убить этого игрока?";

  const playerElement = event.target.closest(".player");
  const input2 = playerElement.querySelector(".input2");
  const input1 = playerElement.querySelector(".input1");

  if (!input1.value.trim() || playerElement.classList.contains("show-lines")) {
    return;
  }
  if (confirm(text) === true) {
    playerElement.classList.add("show-lines");
    input2.value = "X";
    input2.readOnly = true;
    input1.readOnly = true;
  } else {
    return;
  }

  saveGameState();
}

function goToCourtPage(event) {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue("--bg-col")
    .trim();
  localStorage.setItem("courtColorIndex2", JSON.stringify(color));
  // Переходим на страницу суда
  window.location.href = "index2.html";
  // Сохраняем все данные игры
  saveGameState();
  const nightElement = event.target.closest(".night");
  const nightNumber = nightElement.querySelector("span").textContent;
  const nightInput = nightElement.querySelector("input");

  // Получаем номера игроков из input
  const playerNumbers = nightInput.value
    .trim()
    .split(/\s+/)
    .filter((num) => num);

  // Сохраняем данные для суда
  localStorage.setItem(
    "courtData",
    JSON.stringify({
      nightNumber: nightNumber,
      players: playerNumbers,
    })
  );
  // Переходим на страницу суда
  window.location.href = "index2.html";
  saveGameState();
}
// Показ уведомлений

// Функции для ручного назначения роле
function Delete() {
  const btn = event.target.closest(".player").querySelector(".btn");
  btn.textContent = "";
  btn.style.color = "";
  btn.style.fontSize = "";
  saveGameState();
}

// Установка роли вручную
function setRole(context, roleType) {
  const btn = context.closest(".player").querySelector(".btn");
  const role = GAME_SETTINGS.roles[roleType];

  btn.textContent = role.text;
  btn.style.color = role.color;
  btn.style.fontSize = role.fontSize || "";

  saveGameState();
}
document.querySelectorAll(".input2").forEach((input) => {
  input.addEventListener("input", (event) => {
    // Заменяем любые буквы на "V"
    const original = event.target.value;
    const replaced = original.replace(/[a-zA-Zа-яА-Я]/g, "V");
    if (replaced !== original) event.target.value = replaced;

    const playerElement = event.target.closest(".player");
    const newValue = event.target.value;

    // Если введено 4 "V" и игрок еще не убит
    if (
      newValue.length >= 4 &&
      !playerElement.classList.contains("show-lines")
    ) {
      // Оставляем только первые 4 символа
      event.target.value = "VVVV";

      // Помечаем как убитого
      playerElement.classList.add("show-lines");
      event.target.value = "X";
      event.target.readOnly = true;

      // Также блокируем input1
      const input1 = playerElement.querySelector(".input1");
      if (input1) input1.readOnly = true;

      // Сохраняем состояние
      saveGameState();
    }
    saveGameState();
  });
});

// Назначить функцию на все иконки суда
document.querySelectorAll(".night a").forEach((link) => {
  link.addEventListener("click", saveNightInputs);
});
window.onload = function () {
  Reset();
  setupEventListeners();
};

// function saveNightNumbers() {
//   const nightInputs = document.querySelectorAll(".night input");
//   const nightNumbers = Array.from(nightInputs).map((input) =>
//     input.value.trim()
//   );
//   localStorage.setItem("nightNumbers", JSON.stringify(nightNumbers));
// }
const input = document.getElementById("color");
document.getElementById("icon").addEventListener("click", () => {
  document.getElementById("sigma").classList.toggle("opacity");
});
input.addEventListener("input", () => {
  document.documentElement.style.setProperty("--bg-col", input.value);
  const color = input.value;
  // Получение RGB из HEX
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Смена текста в зависимости от яркости
  if (brightness > 200) {
    // Светлый фон — делаем тёмный текст
    document.documentElement.style.setProperty(
      "--text-color",
      "rgb(13, 13, 13)"
    );
  } else {
    // Тёмный фон — делаем светлый текст
    document.documentElement.style.setProperty(
      "--text-color",
      "rgb(246, 246, 246)"
    );
  }
});
document.getElementById("bigSigma").addEventListener("click", () => {
  saveGameState();
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue("--bg-col")
    .trim();
  localStorage.setItem("courtColor", JSON.stringify(color));
  // Переходим на страницу суда
  window.location.href = "index3.html";
});
document.getElementById("bigSigma").addEventListener("click", () => {
  saveGameState();
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue("--bg-col")
    .trim();
  localStorage.setItem("courtColorIndex", JSON.stringify(color));
  // Переходим на страницу суда
});

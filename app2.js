// document.addEventListener("DOMContentLoaded", () => {
//   const container = document.getElementById("nights-container");
//   container.innerHTML = ""; // Очищаем контейнер

//   // Получаем номера игроков из localStorage
//   const nominatedPlayers =
//     JSON.parse(localStorage.getItem("nominatedPlayers")) || [];

//   // Создаем блок для каждого номера
//   nominatedPlayers.forEach((playerNum) => {
//     const playerVote = document.createElement("div");
//     playerVote.className = "player-vote";

//     playerVote.innerHTML = `
//       <div class="player-number"><p>${playerNum}</p></div>
//       <input type="text" placeholder="голоса" />
//     `;

//     container.appendChild(playerVote);
//   });
// });
// document.addEventListener("DOMContentLoaded", () => {
//   const container = document.getElementById("nights-container");
//   container.innerHTML = ""; // Очищаем контейнер

//   // Получаем номер текущей ночи
//   const currentNight = localStorage.getItem("currentNight");

//   // Получаем все данные по ночам
//   const nightsData = JSON.parse(localStorage.getItem("nightsData")) || [];

//   // Находим данные для текущей ночи
//   const currentNightData = nightsData.find(
//     (night) => night.nightNumber.toString() === currentNight
//   );

//   // Если есть данные для этой ночи, создаем элементы
//   if (currentNightData) {
//     currentNightData.numbers.forEach((playerNum) => {
//       const playerVote = document.createElement("div");
//       playerVote.className = "player-vote";

//       playerVote.innerHTML = `
//         <div class="player-number"><p>${playerNum}</p></div>
//         <input type="text" placeholder="голоса" />
//       `;

//       container.appendChild(playerVote);
//     });
//   }
// });
document.addEventListener("DOMContentLoaded", () => {
  const courtColor = JSON.parse(localStorage.getItem("courtColorIndex2"));
  document.documentElement.style.setProperty("--bg-col", courtColor);
  const r = parseInt(courtColor.substr(1, 2), 16);
  const g = parseInt(courtColor.substr(3, 2), 16);
  const b = parseInt(courtColor.substr(5, 2), 16);
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
  const container = document.getElementById("nights-container");
  container.innerHTML = ""; // Очищаем контейнер

  // Получаем сохраненные данные для суда
  const courtData = JSON.parse(localStorage.getItem("courtData"));

  if (!courtData || !courtData.players) {
    container.innerHTML = "<p>Нет данных для отображения</p>";
    return;
  }

  // Создаем блок для каждого игрока
  courtData.players.forEach((playerNum) => {
    const playerVote = document.createElement("div");
    playerVote.className = "player-vote";

    playerVote.innerHTML = `
      <div class="player-number"><p>${playerNum}</p></div>
      <input type="text" placeholder="голоса" class="vote-input" />
    `;

    container.appendChild(playerVote);
  });
});

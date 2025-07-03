document.addEventListener("DOMContentLoaded", () => {
  const courtColor = JSON.parse(localStorage.getItem("courtColor"));
  document.documentElement.style.setProperty("--bg-col", courtColor);
  const r = parseInt(courtColor.substr(1, 2), 16);
  const g = parseInt(courtColor.substr(3, 2), 16);
  const b = parseInt(courtColor.substr(5, 2), 16);
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

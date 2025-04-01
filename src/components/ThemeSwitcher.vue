<script setup>
  import { onMounted } from "vue";

  const themes = {
    blue: {
      name: "Azul (Default)",
      colors: {
        50: "#f0f9ff",
        100: "#e0f2fe",
        200: "#bae6fd",
        300: "#7dd3fc",
        400: "#38bdf8",
        500: "#0ea5e9",
        600: "#0284c7",
        700: "#0369a1",
        800: "#075985",
        900: "#0c4a6e",
      },
    },
    green: {
      name: "Verde",
      colors: {
        50: "#f0fdf4",
        100: "#dcfce7",
        200: "#bbf7d0",
        300: "#86efac",
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d",
      },
    },
    emerald: {
      name: "Esmeralda",
      colors: {
        50: "#ecfdf5",
        100: "#d1fae5",
        200: "#a7f3d0",
        300: "#6ee7b7",
        400: "#34d399",
        500: "#10b981",
        600: "#059669",
        700: "#047857",
        800: "#065f46",
        900: "#064e3b",
      },
    },
  };

  function changeTheme(themeName) {
    if (!themes[themeName]) return;

    const theme = themes[themeName];
    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([shade, color]) => {
      root.style.setProperty(`--primary-${shade}`, color);
    });

    localStorage.setItem("selectedTheme", themeName);
  }

  function showThemeSelector() {
    const selectedTheme = prompt(
      `Selecciona un tema de color:
    1. ${themes.blue.name}
    2. ${themes.green.name}
    3. ${themes.emerald.name}

    (Escribe 1, 2 o 3)`
    );

    switch (selectedTheme) {
      case "1":
        changeTheme("blue");
        break;
      case "2":
        changeTheme("green");
        break;
      case "3":
        changeTheme("emerald");
        break;
      default:
        break;
    }
  }

  onMounted(() => {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "H") {
        e.preventDefault();
        showThemeSelector();
      }
    });

    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme && themes[savedTheme]) {
      changeTheme(savedTheme);
    }
  });
</script>

<template></template>

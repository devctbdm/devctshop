(function () {
  var stored = window.localStorage.getItem("devct-theme")
  var isDark =
    stored === "dark" ||
    (stored !== "light" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", isDark)
})()

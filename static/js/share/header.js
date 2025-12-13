document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("app-header");
  if (!headerContainer) return;

  fetch("../templates/share/header.html")
    .then(res => res.text())
    .then(html => {
      headerContainer.innerHTML = html;
    })
    .catch(err => {
      console.error("Failed to load header:", err);
    });
});

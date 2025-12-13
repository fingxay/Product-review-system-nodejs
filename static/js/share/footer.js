fetch("../templates/share/footer.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("app-footer").innerHTML = html;
  });

const login = (user, pass) => { //richiamo del servizio per l'accesso
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      username: user,
      password: pass,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.result == "prof") { //restituzione riconoscimento dell'utente prof
        sessionStorage.setItem("username", user);
        sessionStorage.setItem("password", pass);
        window.location.href = "../prof/home.html";
      } else if (data.result == "admin") { //restituzione riconoscimento dell'utente admin
        sessionStorage.setItem("username", user);
        sessionStorage.setItem("password", pass);
        window.location.href = "../admin/admin.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

document.getElementById("invio").onclick = () => {
  login(
    document.getElementById("email").value,
    document.getElementById("password").value
  );
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
};

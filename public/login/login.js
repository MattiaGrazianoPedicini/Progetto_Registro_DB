const login = (user, pass) => {
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
      console.log(data);
      if (data.result !== "Unauthorized") {
        sessionStorage.setItem("username", user);
        sessionStorage.setItem("password", pass);
        window.location.href = "../prof/home.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

document.getElementById("invio").onclick = () => {
  login(
    "ciao",
    document.getElementById("email").value,
    document.getElementById("password").value
  );
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
};

const login = (t, user, pass) => {
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      username: user,
      password: pass,
    },
    body: JSON.stringify({ cose: t }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
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

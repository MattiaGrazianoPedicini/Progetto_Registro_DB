import { load } from "../comune.js"; //importazione

load("/classi").then((data) => {
  renderClassi(data, document.getElementById("listaClassi")); //caricamento delle classi presenti dal db
});

const renderClassi = (lista, div) => { //stampa in finestre delle card con le classi
  let output = "";
  lista.forEach((classe) => {
    let templateCard = `
    <div class="card mt-4" id="%ID">
      <div class="card-body">
        <div class="row justify-content-start fs-3">
          <div class="col-auto">
            <h1 class="h1 dolore">%CLASSE</h1>
          </div>
        </div>
      </div>
    </div>
  `;
    output += templateCard
      .replace("%ID", classe.Id)
      .replace("%CLASSE", classe.Nome);
  });
  div.innerHTML = output;
  // Aggiungi gestore di eventi clic
  div.querySelectorAll(".card").forEach((card) => { //controllo per prelevare la classe premuta e inserimento nell'url
    card.addEventListener("click", () => {
      const nome = card.querySelector("h1").textContent;
      window.location.href = "./prof.html?nomeClasse=" + nome;
    });
  });
};

const loginControllo = (user, pass) => { //metodo per controllo dell'accesso
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
      if (data.result == "Unauthorized") { //se non ha effettuato l'accesso, la pagina non viene visualizzata e reindirizza al login
        window.location.href = "../login/login.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

loginControllo( //richiamo funzione nel momento in cui si va in home.html
  sessionStorage.getItem("username"),
  sessionStorage.getItem("password")
);

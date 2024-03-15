import { load } from "../comune.js";

load("/classi").then((data) => {
  renderClassi(data, document.getElementById("listaClassi"));
});

const renderClassi = (lista, div) => {
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
  div.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const nome = card.querySelector("h1").textContent;
      window.location.href = "./prof.html?nomeClasse=" + nome;
    });
  });
};

import { load } from "../comune.js";

const body = document.getElementById("tab_voti");

const tableHeader = `
  <tr class="table-primary">
    <th class="text-center">STUDENTE</th> 
    <th class="text-center">Italiano</th> 
    <th class="text-center">TPS</th>
    <th class="text-center">Matematica</th>
    <th class="text-center">Informatica</th>
    <th class="text-center">GPOI</th>
  </tr> 
`;

const template = `
  <tr>
    <td class="text-center">%STUDENTE</td> 
    <td class="text-center">%VOTO1</td> 
    <td class="text-center">%VOTO2</td>
    <td class="text-center">%VOTO3</td>
    <td class="text-center">%VOTO4</td>
    <td class="text-center">%VOTO5</td>
  </tr>
`;

const renderTab = () => {
    let html = tableHeader;
    //for (let i = 0; i < json.length; i++) {
      let rowHtml = template.replace("%STUDENTE", "mirko");
      rowHtml = rowHtml.replace("%VOTO1", "8");
      rowHtml = rowHtml.replace("%VOTO2", "10");
      rowHtml = rowHtml.replace("%VOTO3", "7");
      rowHtml = rowHtml.replace("%VOTO4", "6");
      rowHtml = rowHtml.replace("%VOTO5", "8");
  
      html += rowHtml;
    //}
    body.innerHTML = html;
};

renderTab();

document.getElementById("accediButton").addEventListener("click", function() {
    window.location.href = "/login/login.html";
  });


// Dichiara oggetti JSON vuoti per studenti, materie e valutazioni
let studentiData = {};
let materieData = {};
let valutazioniData = {};

// Carica i dati degli studenti
load("/studentiXclassi", function(studenti) {
  studenti.forEach(function(studente) {
    studentiData[studente.id] = {
      nome: studente.nome,
      cognome: studente.cognome
    };
  });

  // Carica i dati delle materie
  load("/materieXclassi", function(materie) {
    materie.forEach(function(materia) {
      materieData[materia.id] = materia.materia;
    });

    // Carica i dati delle valutazioni
    load("/valutazioniXmaterie", function(valutazioni) {
      valutazioni.forEach(function(valutazione) {
        if (!valutazioniData[valutazione.Studente_Id]) {
          valutazioniData[valutazione.Studente_Id] = {};
        }
        if (!valutazioniData[valutazione.Studente_Id][valutazione.NomeMateria]) {
          valutazioniData[valutazione.Studente_Id][valutazione.NomeMateria] = [];
        }
        valutazioniData[valutazione.Studente_Id][valutazione.NomeMateria].push(valutazione.Voto);
      });

      // Ora puoi utilizzare gli oggetti JSON studentiData, materieData e valutazioniData come necessario
      console.log("Dati degli studenti:", studentiData);
      console.log("Dati delle materie:", materieData);
      console.log("Dati delle valutazioni:", valutazioniData);
    });
  });
});

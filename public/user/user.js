//gestione pagina user

import { load } from "../comune.js";

const url = new URL(window.location.href);
const body = document.getElementById("tab_voti");
const classeDaProiettare = url.searchParams.get("nomeClasse");

//passaggio alla pagina login Augello
document.getElementById("accediButton").addEventListener("click", function () {
    window.location.href = "/login/login.html";
});

let studentiData = {};
let materieData = {};
let valutazioniData = {};

//recupero di dati da db Augello
load("/studentiXclassi").then((studenti) => {
    studenti.forEach((studente) => {
        studentiData[studente.Id] = {
            nome: studente.Nome,
            cognome: studente.Cognome,
            classe: studente.NomeClasse
        };
    });

    load("/materieXclassi").then((materie) => {
        materie.forEach((materia) => {
            materieData[materia.Id] = materia.Materia;
        });

        load("/valutazioniXmaterie").then((valutazioni) => {
            valutazioni.forEach((valutazione) => {
                if (!valutazioniData[valutazione.Studente_Id]) {
                    valutazioniData[valutazione.Studente_Id] = {};
                }
                if (!valutazioniData[valutazione.Studente_Id][valutazione.NomeMateria]) {
                    valutazioniData[valutazione.Studente_Id][valutazione.NomeMateria] = [];
                }
                valutazioniData[valutazione.Studente_Id][valutazione.NomeMateria].push(valutazione.Voto);

            });


            console.log("Dati degli studenti:", studentiData);
            console.log("Dati delle materie:", materieData);
            console.log("Dati delle valutazioni:", valutazioniData);
            renderTab();

        });
    });
});

//impostazione tabella Augello
const tableHeader = `
  <tr class="table-primary">
    <th class="text-center">STUDENTE</th> 
    <th class="text-center">Matematica</th> 
    <th class="text-center">Italiano</th>
    <th class="text-center">Storia</th>
    <th class="text-center">Scienze</th>
    <th class="text-center">Inglese</th>
    <th class="text-center">Arte</th>
    <th class="text-center">Musica</th>
    <th class="text-center">Geografia</th>
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
    <td class="text-center">%VOTO6</td>
    <td class="text-center">%VOTO7</td>
    <td class="text-center">%VOTO8</td>
  </tr>
`;

//creazione tabella Augello
const renderTab = () => {

    let chiavi = Object.keys(valutazioniData);
    let valori = Object.values(valutazioniData);

    let html = tableHeader;

    for (let i = 0; i < Object.keys(studentiData).length; i++) {
        if (Object.values(studentiData)[i].classe == classeDaProiettare) {
            console.log("entrato");
            let rowHtml = template.replace("%STUDENTE", Object.values(studentiData)[i].nome + " " + Object.values(studentiData)[i].cognome);
            for (let j = 0; j < chiavi.length; j++) {
                if (Object.keys(studentiData)[i] === chiavi[j]) {
                    if (valori[j].Matematica !== undefined) {
                        rowHtml = rowHtml.replace("%VOTO1", valori[j].Matematica);
                    } else {
                        rowHtml = rowHtml.replace("%VOTO1", "");
                    }
                    if (valori[j].Italiano !== undefined) {
                        rowHtml = rowHtml.replace("%VOTO2", valori[j].Italiano);
                    } else {
                        rowHtml = rowHtml.replace("%VOTO2", "");
                    }
                    if (valori[j].Storia !== undefined) {
                        rowHtml = rowHtml.replace("%VOTO3", valori[j].Storia);
                    } else {
                        rowHtml = rowHtml.replace("%VOTO3", "");
                    }
                    if (valori[j].Scienze !== undefined) {
                        rowHtml = rowHtml.replace("%VOTO4", valori[j].Scienze);
                    } else {
                        rowHtml = rowHtml.replace("%VOTO4", "");
                    }
                    if (valori[j].Inglese !== undefined) {
                        rowHtml = rowHtml.replace("%VOTO5", valori[j].Inglese);
                    } else {
                        rowHtml = rowHtml.replace("%VOTO5", "");
                    }
                    if (valori[j].Arte !== undefined) {
                        rowHtml = rowHtml.replace("%VOTO6", valori[j].Arte);
                    } else {
                        rowHtml = rowHtml.replace("%VOTO6", "");
                    }
                    if (valori[j].Musica !== undefined) {
                        rowHtml = rowHtml.replace("%VOTO7", valori[j].Musica);
                    } else {
                        rowHtml = rowHtml.replace("%VOTO7", "");
                    }
                    if (valori[j].Geografia !== undefined) {
                        rowHtml = rowHtml.replace("%VOTO8", valori[j].Geografia);
                    } else {
                        rowHtml = rowHtml.replace("%VOTO8", "");
                    }
                }

            }
       
        html += rowHtml;
        }
    }
    body.innerHTML = body.innerHTML = html.replaceAll('%VOTO1', '').replaceAll('%VOTO2', '').replaceAll('%VOTO3', '').replaceAll('%VOTO4', '').replaceAll('%VOTO5', '').replaceAll('%VOTO6', '').replaceAll('%VOTO7', '').replaceAll('%VOTO8', '');;
};
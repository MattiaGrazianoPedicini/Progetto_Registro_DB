import { load } from "../comune.js";

const body = document.getElementById("tab_voti");

document.getElementById("accediButton").addEventListener("click", function () {
    window.location.href = "/login/login.html";
});

let studentiData = {};
let materieData = {};
let valutazioniData = {};

load("/studentiXclassi").then((studenti) => {
    studenti.forEach((studente) => {
        studentiData[studente.Id] = {
            nome: studente.Nome,
            cognome: studente.Cognome
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


const renderTab = () => {

    let chiavi = Object.keys(valutazioniData);
    let valori = Object.values(valutazioniData);

    let html = tableHeader;

    for (let i = 0; i < Object.keys(studentiData).length; i++) {
        let rowHtml = template.replace("%STUDENTE", Object.values(studentiData)[i].nome + " " + Object.values(studentiData)[i].cognome);
        const check = [false, false, false, false, false, false, false, false];
        for (let j = 0; j < chiavi.length; j++) {
            if (Object.keys(studentiData)[i] === chiavi[j]) {
                if (valori[j].Matematica) {
                    rowHtml = rowHtml.replace("%VOTO1", valori[j].Matematica);
                    check[0] = true;
                }
                if (valori[j].Italiano) {
                    rowHtml = rowHtml.replace("%VOTO2", valori[j].Italiano);
                    check[1] = true;
                }
                if (valori[j].Storia) {
                    rowHtml = rowHtml.replace("%VOTO3", valori[j].Storia);
                    check[2] = true;
                }
                if (valori[j].Scienze) {
                    rowHtml = rowHtml.replace("%VOTO4", valori[j].Scienze);
                    check[3] = true;
                }
                if (valori[j].Inglese) {
                    rowHtml = rowHtml.replace("%VOTO5", valori[j].Inglese);
                    check[4] = true;
                }
                if (valori[j].Arte) {
                    rowHtml = rowHtml.replace("%VOTO6", valori[j].Arte);
                    check[5] = true;
                }
                if (valori[j].Musica) {
                    rowHtml = rowHtml.replace("%VOTO7", valori[j].Musica);
                    check[6] = true;
                }
                if (valori[j].Geografia) {
                    rowHtml = rowHtml.replace("%VOTO8", valori[j].Geografia);
                    check[7] = true;
                }

            }
            /*
            if (check[0] === false) {
                rowHtml = rowHtml.replace("%VOTO1", " ");
            }
            if (check[1] === false) {
                rowHtml = rowHtml.replace("%VOTO2", " ");
            }
            if (check[2] === false) {
                rowHtml = rowHtml.replace("%VOTO3", " ");
            }
            if (check[3] === false) {
                rowHtml = rowHtml.replace("%VOTO4", " ");
            }
            if (check[4] === false) {
                rowHtml = rowHtml.replace("%VOTO5", " ");
            }
            if (check[5] === false) {
                rowHtml = rowHtml.replace("%VOTO6", " ");
            }
            if (check[6] === false) {
                rowHtml = rowHtml.replace("%VOTO7", " ");
            }
            if (check[7] === false) {
                rowHtml = rowHtml.replace("%VOTO8", " ");
            }*/
        }
        html += rowHtml;
    }
    body.innerHTML = html;
};
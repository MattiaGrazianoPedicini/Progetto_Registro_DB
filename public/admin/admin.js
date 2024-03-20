import { send, load } from "./gestionedb.js";

// aggiunta studente a classe scelta
let nStud = document.getElementById("nStud");
let aggStud = document.getElementById("confermaNomiStud");
const nomeClasseInput = document.getElementById("nomeClasse");

// nome nuova materia
const nomeNuovaMateriaInput = document.getElementById("nomeNuovaMateria");
const aggMat = document.getElementById("aggMat");

// nome nuova classe
const nomeNuovaClasseInput = document.getElementById("nomeNuovaClasse");
const aggClass = document.getElementById("aggClass"); // button aggiunta classe a db

let formStud = document.getElementById("formStud"); // div
const nome = document.getElementById("nomeStud").value;
const cognome = document.getElementById("cognomeStud").value;

// materie univoche per tutte le classi
const elencoMaterie = ["Matematica", "Italiano", "Storia", "Scienze", "Inglese", "Arte", "Musica", "Geografia"];

let elencoClassi = [];
load("/getClassi").then((response )=> {
    console.log(response);
}).catch((error) => {
    console.log(error);
});

let classeTrovata;
// premuta button scelta aggiunta studenti
aggStud.onclick = () => {
    let nominativo = [];
    console.log(elencoClassi);
    // controlli nomi
    if (nome !== null && cognome !== null) {
        classeTrovata = false;
        // controlli classe
        for (let k = 0; k < elencoClassi.length; k++) {
            console.log("array ", elencoClassi[k].nomeClasse);
            console.log("input ", nomeClasseInput.value);
            console.log("Inidce " + k);
            if (elencoClassi[k].nomeClasse == nomeClasseInput.value) {
                classeTrovata = true;
                console.log("Inidce " + k);
                console.log("classe esistente nell'array");

                // premuta button conferma aggiunta
                let buttonConf = document.getElementById("confermaNomiStud");
                buttonConf.onclick = () => {
                    console.log("onclick");
                    //   const anagraficanome = document.querySelectorAll(".anagraficanome");
                    //   const anagraficacognome = document.querySelectorAll(".anagraficacognome");

                    /* aggiunta all'array
                    for (let j = 0; j < anagraficanome.length; j++) {
                        elencoClassi[k].elencoStudenti.push({
                            id: elencoStudenti.length + j,
                            nome: anagraficanome[j].value,
                            cognome: anagraficacognome[j].value,
                        })
                    }*/

                    // aggiunta all'array
                    nominativo.push({
                        nome: nome,
                        cognome: cognome,
                    })
                    
                    send({ studenti: nominativo }, '/studentiXclassi')
                }

                console.log(nome, cognome);
                formStud.innerHTML = "studente " + nome + " " + cognome + " aggiunto correttamente alla classe " + elencoClassi[k].nomeClasse;
                formStud.innerHTML += JSON.stringify(elencoClassi);
            };
           // break;
        }
    } else {
        console.log("error: nome studente non valido");
        formStud.innerHTML = "numero studenti non valido";
    } // else nome cognome

    if (!classeTrovata) {
        console.log("error: classe non valida");
        formStud.innerHTML = "classe non valida";
    }
} // button



aggClass.onclick = () => {
    let trovata = false;
    for (let i = 0; i < elencoClassi.length; i++) {
        if (elencoClassi[i].nomeClasse == nomeClasseInput.value) {
            trovata = true;
        }
    }
    if (!trovata) {
        const nuovaClasse = {
            nomeClasse: nomeNuovaClasseInput.value,
            elencoStudenti: [],
            numeroStudenti: elencoStudenti.length
        };
        elencoClassi.push(nuovaClasse);

        send(nuovaClasse, '/insertClasse')

        console.log("classe inserita ", elencoClassi);
    }
}

aggMat.onclick = () => {
    elencoMaterie.push(nomeNuovaMateriaInput.value);
    send({ materia: nomeNuovaMateriaInput.value, }, '/materieXclassi')
}
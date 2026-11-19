# AM4 Configuratore Tratte

Calcolatore non ufficiale per Airline Manager 4: scegli l'aereo, l'hub e la destinazione (domanda e distanza si compilano da sole) e vedi quanti aerei mettere, come configurarli (tutte le classi nel rapporto della domanda) e quanto rendono.

- **Tratte migliori dall'hub**: classifica le destinazioni dirette per profitto, con carburante, CO₂ e A-check.
- **Aerei**: i miei preferiti (A380-800, A330-900neo, A330-800neo, 737 MAX 10, 737-800) più tutti gli aerei passeggeri del gioco.

Si apre dal browser e si può installare sul telefono ("Aggiungi a schermata Home").

Dati (aeroporti, domanda di tutte le tratte, aerei) e formule dal progetto open-source [abc8747/am4](https://github.com/abc8747/am4), licenza MIT. I risultati sono indicativi.

## Tratte usate (privato)

Con un Google Sheet personale puoi segnare le tratte già usate: la loro domanda viene scalata e la tratta ricompare solo se ne resta abbastanza per un altro aereo. Lo script da incollare nel foglio è in [`apps-script/Code.gs`](apps-script/Code.gs) (istruzioni in testa al file). Il token non è nel repository: senza token il menu non compare e lo script non risponde.

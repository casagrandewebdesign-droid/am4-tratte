/**
 * AM4 Tratte – salvataggio privato delle tratte usate su Google Sheet.
 *
 * Installazione (una volta sola):
 * 1. Crea un nuovo Google Sheet (es. "AM4 Tratte") → Estensioni → Apps Script.
 * 2. Incolla tutto questo file al posto del codice presente e salva.
 * 3. Esegui la funzione "setup" (autorizza quando richiesto).
 *    Nel registro di esecuzione compare il TOKEN: copialo.
 * 4. Esegui il deployment → Nuovo deployment → tipo "App web"
 *    - Esegui come: Me
 *    - Chi ha accesso: Chiunque
 *    Copia l'URL che finisce con /exec.
 * 5. Nell'app: ⚙️ → "Le mie tratte" → incolla URL e token → Collega.
 *
 * Il token NON è scritto qui: sta nelle proprietà dello script.
 * Senza token valido lo script non legge e non scrive niente.
 * Per cambiarlo, riesegui "setup" (il vecchio token smette di funzionare).
 */

const SHEET = 'Tratte';
const COLS = ['id', 'hub', 'dest', 'aereo', 'aerei', 'y', 'j', 'f', 'voli', 'data', 'note'];

function setup() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  sh.getRange(1, 1, 1, COLS.length).setValues([COLS]).setFontWeight('bold');
  sh.setFrozenRows(1);
  const token = Utilities.getUuid().replace(/-/g, '');
  PropertiesService.getScriptProperties().setProperty('TOKEN', token);
  Logger.log('TOKEN: ' + token);
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out({ ok: false, err: 'richiesta non valida' }); }

  const token = PropertiesService.getScriptProperties().getProperty('TOKEN');
  if (!token || body.token !== token) return out({ ok: false, err: 'token' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
    if (!sh) return out({ ok: false, err: 'foglio "' + SHEET + '" mancante: esegui setup' });

    if (body.action === 'add') {
      const r = body.row;
      sh.appendRow([Utilities.getUuid().slice(0, 8), r.hub, r.dest, r.aereo, +r.aerei, +r.y, +r.j, +r.f, +r.voli, new Date(), r.note || '']);
    } else if (body.action === 'update' || body.action === 'remove') {
      const n = sh.getLastRow() - 1;
      const ids = n > 0 ? sh.getRange(2, 1, n, 1).getValues().map(v => String(v[0])) : [];
      const i = ids.indexOf(String(body.id));
      if (i < 0) return out({ ok: false, err: 'tratta non trovata' });
      if (body.action === 'remove') {
        sh.deleteRow(i + 2);
      } else {
        const r = body.row;
        sh.getRange(i + 2, 2, 1, 8).setValues([[r.hub, r.dest, r.aereo, +r.aerei, +r.y, +r.j, +r.f, +r.voli]]);
      }
    }
    return out({ ok: true, rows: list(sh) });
  } finally {
    lock.releaseLock();
  }
}

function list(sh) {
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, COLS.length).getValues()
    .filter(v => v[0] !== '')
    .map(v => {
      const o = {};
      COLS.forEach((c, i) => { o[c] = v[i]; });
      return o;
    });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

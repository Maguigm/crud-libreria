const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const PATRON_ID = /^[A-Z][0-9]{2}$/; // forma del id

//para generar el id
function generarId() {
  const letra = LETRAS[Math.floor(Math.random() * LETRAS.length)];
  const numero = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  return letra + numero;
}

//verifica el formato
function esIdValido(id) {
  return PATRON_ID.test(id);
}

module.exports = { generarId, esIdValido };
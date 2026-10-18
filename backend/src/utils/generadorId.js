const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const PATRON_ID = /^[A-Z][0-9]{2}$/; // letra A-Z + 2 dígitos

// Genera un ID aleatorio: letra A-Z + número 00-99 (ej. "B07")
function generarId() {
  const letra = LETRAS[Math.floor(Math.random() * LETRAS.length)];
  const numero = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  return letra + numero;
}

// Verifica que un ID tenga el formato correcto
function esIdValido(id) {
  return PATRON_ID.test(id);
}

module.exports = { generarId, esIdValido };
// Pruebas unitarias del generador de id
const { generarId, esIdValido } = require('../src/utils/generadorId');

describe('generarId', () => {
  afterEach(() => {
    jest.restoreAllMocks(); 
  });

  test('genera un ID con formato letra + 2 dígitos', () => {
    // Se prueba 100 veces porque el resultado es aleatorio
    for (let i = 0; i < 100; i++) {
      expect(generarId()).toMatch(/^[A-Z][0-9]{2}$/);
    }
  });

  test('conserva el cero inicial (ej. A05 y no A5)', () => {
    // Se "fija" Math.random para controlar el resultado
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0)     // letra: posición 0 → "A"
      .mockReturnValueOnce(0.05); // número: 0.05 × 100 = 5 → "05"
    expect(generarId()).toBe('A05');
  });

  test('puede generar los valores extremos Z99', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.999)  // última letra → "Z"
      .mockReturnValueOnce(0.999); // 99
    expect(generarId()).toBe('Z99');
  });
});

describe('esIdValido', () => {
  test.each(['A12', 'B07', 'Z99', 'M00'])('acepta %s', (id) => {
    expect(esIdValido(id)).toBe(true);
  });

  test.each(['abc', 'a12', 'A1', 'A123', '12A', ''])('rechaza "%s"', (id) => {
    expect(esIdValido(id)).toBe(false);
  });
});
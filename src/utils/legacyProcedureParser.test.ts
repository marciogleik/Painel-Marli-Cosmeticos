import { describe, it, expect } from 'vitest';
import { parseLegacyTechnicalObservation, LASER_COLUMNS } from './legacyProcedureParser';

describe('legacyProcedureParser', () => {
  it('should parse Laser ficha with multiple sessions and granular columns', () => {
    const text = "Laser: Área do Corpo: sobrancelha Tamanho: Tempo: 4 aons Motivo da Remoção: não gosta da cor Cores: Houve Retoque: ( )sim ( x) não Sessão Data Parâmetros Disparos Observação Valor 1º 06/01/21 220 3hz 160 34/1064 200,00 2º 22/12/21 300 3hz 219 1064 200,00 3º 05/06/23 500 3 / lábios 313 1064/532 200,00 4° 07/06/23 860 2hz 193 1064 200,00";
    const result = parseLegacyTechnicalObservation(text, "Laser");

    expect(result.isTable).toBe(true);
    expect(result.columns).toContain("Parâmetros");
    expect(result.rows).toHaveLength(4);
    
    // Check first session
    expect(result.rows[0][0]).toBe("1º");
    expect(result.rows[0][1]).toBe("06/01/21");
    expect(result.rows[0][5]).toBe("200,00");
    
    // Check fourth session
    expect(result.rows[3][0]).toBe("4°");
    expect(result.rows[3][1]).toBe("07/06/23");
  });

  it('should parse PMU ficha correctly', () => {
    const text = "Sessão Data Técnica Aplicada Cor Aplicada Agulha Sensibilidade Observação Técnicas sobre o procedimento 1º 10/05/22 Shadow Line castanho medio 1 rl baixa cicatrização ok";
    const result = parseLegacyTechnicalObservation(text, "Anamnese Micropigmentação");

    expect(result.isTable).toBe(true);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0][0]).toBe("1º");
    expect(result.rows[0][1]).toBe("10/05/22");
    expect(result.rows[0][2]).toBe("Shadow Line castanho medio 1 rl baixa cicatrização ok");
  });

  it('should detect Laser from content even if label is generic', () => {
    const text = "Laser: Área do Corpo:  Tamanho: Tempo:  Motivo da Remoção: Cores: Houve Retoque: Sessão Data Parâmetros Disparos Observação Valor 1 10/04/2021 100mj 2hz 121";
    const result = parseLegacyTechnicalObservation(text, "Observação");

    expect(result.isTable).toBe(true);
    expect(result.columns).toEqual(LASER_COLUMNS);
    expect(result.rows[0][1]).toBe("10/04/2021");
  });

  it('should parse date without leading session number (user example)', () => {
    const text = "Laser: Área do Corpo: Tamanho: Tempo: Motivo da Remoção: Cores: Houve Retoque: Sessão Data Parâmetros Disparos Observação Valor 21/05 Perna 50 virilha 37 axila";
    const result = parseLegacyTechnicalObservation(text, "Laser");

    expect(result.isTable).toBe(true);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0][0]).toBe("-"); // No session
    expect(result.rows[0][1]).toBe("21/05");
    expect(result.rows[0][4]).toContain("Perna 50");
  });

  it('should parse Larissa Ferrari complex line correctly', () => {
    const text = "Sessão Data Parâmetros Disparos Observação Valor 03 08/01/26 500 pg 280,00";
    const result = parseLegacyTechnicalObservation(text, "Laser");

    expect(result.isTable).toBe(true);
    expect(result.rows[0][0]).toBe("03");
    expect(result.rows[0][1]).toBe("08/01/26");
    expect(result.rows[0][2]).toBe("500");
    expect(result.rows[0][4]).toBe("pg");
    expect(result.rows[0][5]).toBe("280,00");
  });
});

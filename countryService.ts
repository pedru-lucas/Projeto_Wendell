import { Country } from '../types';

const BASE_URL = 'https://restcountries.com/v3.1';

// Define campos específicos para otimizar a requisição e evitar erros 400 na API
const FIELDS = 'name,cca3,capital,region,subregion,population,area,flags,currencies,languages,borders';

export const getAllCountries = async (): Promise<Country[]> => {
  try {
    // Requisitar campos explicitamente é mais robusto contra timeouts e erros 400 devido ao tamanho da carga
    // Alterado para usar o endpoint de países independentes
    const response = await fetch(`${BASE_URL}/independent?status=true&fields=${FIELDS}`);
    
    if (!response.ok) {
      throw new Error(`Falha ao buscar países: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
};

export const getCountriesByCodes = async (codes: string[]): Promise<Country[]> => {
  if (codes.length === 0) return [];
  try {
    const codesString = codes.join(',');
    const response = await fetch(`${BASE_URL}/alpha?codes=${codesString}&fields=${FIELDS}`);
    
    if (!response.ok) {
      throw new Error('Falha ao buscar detalhes dos países');
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na API (codes):", error);
    throw error;
  }
};
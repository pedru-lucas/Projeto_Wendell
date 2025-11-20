export interface CountryName {
  common: string;
  official: string;
}

export interface CountryFlags {
  png: string;
  svg: string;
  alt?: string;
}

export interface Currencies {
  [key: string]: {
    name: string;
    symbol: string;
  };
}

export interface Languages {
  [key: string]: string;
}

export interface Country {
  name: CountryName;
  cca3: string; // Código único de 3 letras
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area: number;
  flags: CountryFlags;
  currencies?: Currencies;
  languages?: Languages;
  borders?: string[];
}

export type Region = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania' | 'Antarctic' | '';

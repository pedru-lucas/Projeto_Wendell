import React from 'react';
import { Country } from '../tipos';
import { Heart, BarChart2 } from 'lucide-react';

interface CountryCardProps {
  country: Country;
  isFavorite: boolean;
  isInCompare: boolean;
  onToggleFavorite: (code: string) => void;
  onToggleCompare: (code: string) => void;
}

export const CountryCard: React.FC<CountryCardProps> = ({
  country,
  isFavorite,
  isInCompare,
  onToggleFavorite,
  onToggleCompare,
}) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full">
      {/* Imagem da Bandeira */}
      <div className="relative h-40 overflow-hidden bg-slate-100 group">
        <img
          src={country.flags.svg}
          alt={country.flags.alt || `Bandeira de ${country.name.common}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 flex gap-2">
           <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(country.cca3);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isFavorite 
                ? 'bg-red-500/90 text-white' 
                : 'bg-black/20 text-white hover:bg-black/40'
            }`}
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
      
      {/* Informações do País */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-3 truncate" title={country.name.common}>
          {country.name.common}
        </h3>
        
        <div className="space-y-2 text-sm text-slate-600 mb-4 flex-1">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-slate-900 min-w-[70px]">População:</span>
            <span>{formatNumber(country.population)}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-slate-900 min-w-[70px]">Região:</span>
            <span>{country.region}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-slate-900 min-w-[70px]">Capital:</span>
            <span className="truncate">{country.capital?.join(', ') || 'N/A'}</span>
          </div>
        </div>

        {/* Botão de Comparação */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(country.cca3);
          }}
          className={`w-full py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            isInCompare
              ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BarChart2 size={16} />
          {isInCompare ? 'Comparando' : 'Comparar'}
        </button>
      </div>
    </div>
  );
};

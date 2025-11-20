import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Region } from '../tipos';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedRegion,
  onRegionChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center sticky top-[72px] z-20 py-2 bg-slate-50/90 backdrop-blur-sm lg:static lg:bg-transparent lg:py-0">
      {/* Campo de Busca */}
      <div className="relative w-full md:w-1/3 shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Pesquisar país..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Filtro de Região */}
      <div className="relative w-full md:w-48 shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Filter size={20} />
        </div>
        <select
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value as Region)}
          className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg leading-5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer transition-all"
        >
          <option value="">Todas Regiões</option>
          <option value="Africa">África</option>
          <option value="Americas">Américas</option>
          <option value="Asia">Ásia</option>
          <option value="Europe">Europa</option>
          <option value="Oceania">Oceania</option>
          <option value="Antarctic">Antártida</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

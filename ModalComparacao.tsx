import React from 'react';
import { Country } from '../tipos';
import { X, Users, Map, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ComparisonModalProps {
  countries: Country[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (cca3: string) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  countries,
  isOpen,
  onClose,
  onRemove,
}) => {
  if (!isOpen) return null;

  // Preparar dados para os gráficos
  const populationData = countries.map(c => ({
    name: c.cca3, // Usar código para rótulos de eixo mais curtos
    full: c.name.common,
    value: c.population,
  }));

  const areaData = countries.map(c => ({
    name: c.cca3,
    full: c.name.common,
    value: c.area,
  }));

  const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

  const formatNumber = (num: number) => new Intl.NumberFormat('pt-BR').format(num);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Sobreposição de fundo */}
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
          
          {/* Cabeçalho do Modal */}
          <div className="bg-slate-50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-slate-200">
            <h3 className="text-lg leading-6 font-bold text-slate-900" id="modal-title">
              Comparação de Países
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto max-h-[70vh]">
            
            {/* Cartões Resumo no topo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {countries.map((country, index) => (
                <div key={country.cca3} className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative group">
                  <button 
                    onClick={() => onRemove(country.cca3)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remover da comparação"
                  >
                    <X size={16} />
                  </button>
                  <div className="flex items-center gap-3 mb-3">
                    <img src={country.flags.svg} alt={country.name.common} className="w-8 h-6 object-cover rounded shadow-sm" />
                    <h4 className="font-bold text-sm truncate" style={{ color: colors[index % colors.length] }}>{country.name.common}</h4>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1"><Building2 size={12} /> {country.capital?.[0] || 'N/A'}</p>
                    <p className="flex items-center gap-1"><Users size={12} /> {formatNumber(country.population)}</p>
                    <p className="flex items-center gap-1"><Map size={12} /> {formatNumber(country.area)} km²</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparação Visual */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Gráfico de População */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Users size={16} className="text-indigo-500" /> População Total
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={populationData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={40} tick={{fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        formatter={(value: number) => [formatNumber(value), 'População']}
                        labelFormatter={(label) => {
                          const country = countries.find(c => c.cca3 === label);
                          return country ? country.name.common : label;
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {populationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico de Área */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Map size={16} className="text-indigo-500" /> Área (km²)
                </h4>
                 <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={areaData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={40} tick={{fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        formatter={(value: number) => [formatNumber(value), 'km²']}
                        labelFormatter={(label) => {
                          const country = countries.find(c => c.cca3 === label);
                          return country ? country.name.common : label;
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {areaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-200">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

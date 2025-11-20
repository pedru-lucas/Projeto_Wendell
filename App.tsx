import React, { useEffect, useState, useMemo } from 'react';
import { Country, Region } from './tipos';
import { getAllCountries } from './servicos/paisServico';
import { CountryCard } from './componentes/CartaoPais';
import { FilterBar } from './componentes/BarraFiltro';
import { ComparisonModal } from './componentes/ModalComparacao';
import { Globe2, Heart, AlertCircle, BarChart2, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState<Region>('');
  
  // User Preferences
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('infomundo_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await getAllCountries();
        // Sort alphabetically by default
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(data);
      } catch (err: any) {
        // Simplify the error message for the user while keeping technical details for debugging
        let msg = err.message || 'Falha ao carregar dados.';
        if (msg.includes('400')) {
          msg = 'Erro de comunicação com o servidor (400). Tentando recuperar...';
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [retryKey]);

  // Persist Favorites
  useEffect(() => {
    localStorage.setItem('infomundo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filter Logic
  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const matchesSearch = country.name.common.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = region === '' || country.region === region;
      const matchesFavorites = showFavoritesOnly ? favorites.includes(country.cca3) : true;
      return matchesSearch && matchesRegion && matchesFavorites;
    });
  }, [countries, searchTerm, region, favorites, showFavoritesOnly]);

  // Handlers
  const toggleFavorite = (cca3: string) => {
    setFavorites(prev => 
      prev.includes(cca3) ? prev.filter(id => id !== cca3) : [...prev, cca3]
    );
  };

  const toggleCompare = (cca3: string) => {
    setCompareList(prev => {
      if (prev.includes(cca3)) {
        return prev.filter(id => id !== cca3);
      }
      if (prev.length >= 4) {
        alert("Você pode comparar no máximo 4 países por vez.");
        return prev;
      }
      return [...prev, cca3];
    });
  };

  const removeFromCompare = (cca3: string) => {
    setCompareList(prev => prev.filter(id => id !== cca3));
  };

  const countriesInCompare = useMemo(() => {
    return countries.filter(c => compareList.includes(c.cca3));
  }, [countries, compareList]);

  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Globe2 size={28} />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">InfoMundo</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`relative p-2 rounded-full transition-colors ${showFavoritesOnly ? 'bg-red-50 text-red-500' : 'hover:bg-slate-100 text-slate-600'}`}
              title="Filtrar Favoritos"
            >
              <Heart size={22} fill={showFavoritesOnly ? "currentColor" : "none"}/>
              {favorites.length > 0 && !showFavoritesOnly && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Controls */}
        <FilterBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRegion={region}
          onRegionChange={setRegion}
        />

        {/* Content State Handling */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-32 text-indigo-500 animate-in fade-in duration-500">
             <Loader2 size={48} className="animate-spin mb-4" />
             <p className="text-slate-500 font-medium">Carregando mapa do mundo...</p>
           </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500 bg-red-50 rounded-xl border border-red-100">
            <AlertCircle size={48} className="mb-4" />
            <p className="font-medium text-center max-w-md">{error}</p>
            <button 
              onClick={handleRetry} 
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <>
            {/* Stats / Info Bar if showing specific filtered set */}
            <div className="mb-6 text-sm text-slate-500 flex justify-between items-center">
              <p>Exibindo {filteredCountries.length} {filteredCountries.length === 1 ? 'país' : 'países'}</p>
              {showFavoritesOnly && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Filtro: Favoritos</span>
              )}
            </div>

            {/* Grid */}
            {filteredCountries.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredCountries.map((country) => (
                  <CountryCard
                    key={country.cca3}
                    country={country}
                    isFavorite={favorites.includes(country.cca3)}
                    isInCompare={compareList.includes(country.cca3)}
                    onToggleFavorite={toggleFavorite}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 text-lg">Nenhum país encontrado com os critérios atuais.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setRegion(''); setShowFavoritesOnly(false);}}
                  className="mt-4 text-indigo-600 font-medium hover:underline"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Comparison Floating Action Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-slate-900 text-white rounded-full px-6 py-3 shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 duration-300">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {compareList.length}
            </span>
            <span className="text-sm font-medium hidden sm:inline">Países para comparar</span>
          </div>
          <div className="h-4 w-px bg-slate-700"></div>
          <button 
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-2 text-sm font-bold text-indigo-300 hover:text-white transition-colors"
          >
            Comparar Agora <BarChart2 size={16} />
          </button>
           <button 
            onClick={() => setCompareList([])}
            className="ml-2 text-xs text-slate-500 hover:text-slate-300"
          >
            Limpar
          </button>
        </div>
      )}

      {/* Modals */}
      <ComparisonModal 
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        countries={countriesInCompare}
        onRemove={removeFromCompare}
      />
    </div>
  );
};

export default App;

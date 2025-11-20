import React from 'react';
import { Country } from '../types';
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

        <span className="hidden sm:inline-block
// src/components/Torneos/TournamentTable.jsx
import React from 'react';
import { FilePenLine, Eye, Trash2 } from 'lucide-react';

const TournamentTable = ({ torneos, onDeleteClick, onEditClick, onViewClick, tournamentPendingDeletion, expandedRowId }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Actividad</th>
            <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Deporte</th>
            <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Fechas</th>
            <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Equipos</th>
            <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Fase</th>
            <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Acciones</th>
          </tr>
        </thead>
        {torneos.map(torneo => {
          const isExpanded = torneo.id === expandedRowId;
          return (
            <tbody key={torneo.id} className="border-b border-gray-200">
              <tr className={`hover:bg-gray-50 transition-opacity duration-300 ${torneo.id === tournamentPendingDeletion ? 'opacity-40' : 'opacity-100'}`}>
                <td className="p-4"><div className="font-medium text-gray-800">{torneo.name}</div><div className="text-sm text-gray-500">{torneo.format}</div></td>
                <td className="p-4 text-gray-600">{torneo.sport}</td>
                <td className="p-4 text-gray-600">{`${torneo.startDate} a ${torneo.endDate}`}</td>
                <td className="p-4 text-gray-600">{`${torneo.currentTeams}/${torneo.maxTeams}`}</td>
                <td className="p-4 text-gray-600">{torneo.phase}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onEditClick(torneo)} className="p-2 text-gray-500 rounded-full bg-gray-100 hover:bg-gray-200 hover:text-blue-600 transition-colors"><FilePenLine size={18} /></button>
                    <button onClick={() => onViewClick(torneo.id)} className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ${isExpanded ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                      <Eye size={18} />
                    </button>
                    <button onClick={() => onDeleteClick(torneo)} className="p-2 text-gray-500 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
              {isExpanded && (
                <tr>
                  <td colSpan="6" className="p-0">
                    <div className="p-4 bg-gray-50">
                      <h4 className="font-semibold text-gray-800 mb-2">Descripción del Torneo:</h4>
                      {torneo.description && torneo.description.trim() !== '' ? (
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{torneo.description}</p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No hay descripción para este torneo.</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          )
        })}
      </table>
    </div>
  );
};

export default TournamentTable;
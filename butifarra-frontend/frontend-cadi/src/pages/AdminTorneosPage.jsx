// src/pages/AdminTorneosPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useTorneos } from '../hooks/useTorneos';
import TournamentTable from '../components/Torneos/TournamentTable';
import TournamentForm from '../components/Torneos/TournamentForm';
import { Trophy, X } from 'lucide-react';

const AdminTorneosPage = () => {
  const { torneos, loading, error, createTorneo, deleteTorneo, updateTorneo } = useTorneos();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); 
  const [editingTournament, setEditingTournament] = useState(null);
  
  const [formKey, setFormKey] = useState(Date.now());

  const [expandedRowId, setExpandedRowId] = useState(null);
  const [tournamentPendingDeletion, setTournamentPendingDeletion] = useState(null);
  const deleteTimerRef = useRef(null); 

  useEffect(() => { return () => clearTimeout(deleteTimerRef.current); }, []);
  
  const handleSaveTorneo = (torneoData) => { if (editingTournament) { updateTorneo(torneoData); } else { createTorneo(torneoData); } setIsDrawerOpen(false); setEditingTournament(null); };
  
  const handleEditClick = (torneo) => {
    setFormKey(torneo.id); 
    setEditingTournament(torneo);
    setIsDrawerOpen(true);
  };

  const handleCreateClick = () => {
    setFormKey(Date.now()); 
    setEditingTournament(null);
    setIsDrawerOpen(true);
  };
  
  const handleCloseDrawer = () => { setIsDrawerOpen(false); setEditingTournament(null); };
  const handleViewClick = (torneoId) => { setExpandedRowId(prevId => (prevId === torneoId ? null : torneoId)); };
  const handleDeleteClick = (torneo) => { if (deleteTimerRef.current) { clearTimeout(deleteTimerRef.current); deleteTorneo(tournamentPendingDeletion.id); } setTournamentPendingDeletion(torneo); deleteTimerRef.current = setTimeout(() => { deleteTorneo(torneo.id); setTournamentPendingDeletion(null); deleteTimerRef.current = null; }, 5000); };
  const handleUndoDelete = () => { clearTimeout(deleteTimerRef.current); setTournamentPendingDeletion(null); deleteTimerRef.current = null; };
  
  const [activeTab, setActiveTab] = useState('Torneos');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 justify-between md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Trophy className="text-blue-600" size={40} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de torneos</h1>
            <p className="mt-1 text-gray-500">Administra torneos deportivos, equipos y resultados</p>
          </div>
        </div>
        <button onClick={handleCreateClick} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"><span className="text-xl">+</span> Crear Torneo</button>
      </div>
      <div className="mb-6"><div className="border-b border-gray-200"><nav className="-mb-px flex space-x-6"><button onClick={() => setActiveTab('Torneos')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'Torneos' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Torneos</button><button onClick={() => setActiveTab('Fixture')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'Fixture' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Fixture</button><button onClick={() => setActiveTab('Resultados')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'Resultados' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Resultados</button><button onClick={() => setActiveTab('Estadisticas')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'Estadisticas' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Estadísticas</button></nav></div></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-800">Torneos activos</h3><p className="text-sm text-gray-500">{torneos.length} torneos registrados</p></div>
          {loading && <p className="p-4 text-center">Cargando torneos...</p>}
          {error && <p className="p-4 text-center text-red-500">Error: {error}</p>}
          {!loading && !error && <TournamentTable torneos={torneos} onDeleteClick={handleDeleteClick} onEditClick={handleEditClick} onViewClick={handleViewClick} tournamentPendingDeletion={tournamentPendingDeletion?.id} expandedRowId={expandedRowId} />}
      </div>
      
      {isDrawerOpen && <div onClick={handleCloseDrawer} className="fixed inset-0 z-40 bg-transparent"></div>}
      <div className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center border-b pb-4 mb-4"><h2 className="text-2xl font-bold">{editingTournament ? 'Editar Torneo' : 'Asistente para Crear Torneo'}</h2><button onClick={handleCloseDrawer} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"><X size={24} /></button></div>
          <div className="overflow-y-auto flex-1 pr-2">
            {/* --- CORRECCIÓN CLAVE: Usamos `key` para forzar el reinicio --- */}
            <TournamentForm 
              key={formKey}
              onSave={handleSaveTorneo} 
              onCancel={handleCloseDrawer} 
              isEditing={!!editingTournament} 
              initialData={editingTournament} 
            />
          </div>
        </div>
      </div>
      
      {tournamentPendingDeletion && (
        <div
          key={tournamentPendingDeletion.id}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white rounded-lg shadow-lg flex flex-col overflow-hidden animate-fadeIn pointer-events-auto"
        >
          <div className="py-3 px-5 flex items-center gap-4"><p>Torneo "{tournamentPendingDeletion.name}" eliminado.</p><button onClick={handleUndoDelete} className="font-bold text-blue-400 hover:text-blue-300 whitespace-nowrap">Deshacer</button></div>
          <div className="h-1 bg-blue-500 animate-shrink"></div>
        </div>
      )}
    </div>
  );
};

export default AdminTorneosPage;
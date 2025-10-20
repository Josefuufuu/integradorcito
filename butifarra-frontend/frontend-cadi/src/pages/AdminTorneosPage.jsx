import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Trophy, X } from 'lucide-react';

import AppLayout from '../components/layout/AppLayout.jsx';
import FixtureView from '../components/Torneos/FixtureView.jsx';
import TournamentForm from '../components/Torneos/TournamentForm.jsx';
import TournamentTable from '../components/Torneos/TournamentTable.jsx';
import { useTorneos } from '../hooks/useTorneos.js';

const TAB_KEYS = {
  TOURNAMENTS: 'Torneos',
  FIXTURE: 'Fixture',
  RESULTS: 'Resultados',
  STATS: 'Estadisticas',
};

const AdminTorneosPage = () => {
  const { torneos, loading, error, createTorneo, deleteTorneo, updateTorneo, registerResult } = useTorneos();

  const [activeTab, setActiveTab] = useState(TAB_KEYS.TOURNAMENTS);
  const [editingTournament, setEditingTournament] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [formKey, setFormKey] = useState(Date.now());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [tournamentPendingDeletion, setTournamentPendingDeletion] = useState(null);

  const deleteTimerRef = useRef(null);

  const selectedTournament = useMemo(
    () => torneos.find((torneo) => torneo.id === selectedTournamentId),
    [torneos, selectedTournamentId],
  );

  useEffect(() => () => clearTimeout(deleteTimerRef.current), []);

  useEffect(() => {
    if (!loading && torneos.length > 0 && !selectedTournamentId) {
      setSelectedTournamentId(torneos[0].id);
    }
  }, [loading, torneos, selectedTournamentId]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingTournament(null);
  };

  const handleCreateClick = () => {
    setFormKey(Date.now());
    setEditingTournament(null);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (torneo) => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTorneo(tournamentPendingDeletion.id);
    }

    setTournamentPendingDeletion(torneo);
    deleteTimerRef.current = setTimeout(() => {
      deleteTorneo(torneo.id);
      setTournamentPendingDeletion(null);
      deleteTimerRef.current = null;
    }, 5000);
  };

  const handleEditClick = (torneo) => {
    setFormKey(torneo.id);
    setEditingTournament(torneo);
    setIsDrawerOpen(true);
  };

  const handleSaveTorneo = (torneoData) => {
    if (editingTournament) {
      updateTorneo(torneoData);
    } else {
      createTorneo(torneoData);
    }

    closeDrawer();
  };

  const handleSaveResult = (matchId, scores) => {
    if (selectedTournamentId) {
      registerResult(selectedTournamentId, matchId, scores);
    }
  };

  const handleUndoDelete = () => {
    clearTimeout(deleteTimerRef.current);
    setTournamentPendingDeletion(null);
    deleteTimerRef.current = null;
  };

  const handleViewClick = (torneoId) => {
    setExpandedRowId((prevId) => (prevId === torneoId ? null : torneoId));
  };

  const renderTabs = () => (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          {Object.values(TAB_KEYS).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === tabKey
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tabKey}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  const renderTournamentsTab = () => (
    <>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Torneos activos</h3>
        <p className="text-sm text-gray-500">{torneos.length} torneos registrados</p>
      </div>

      {loading && <p className="p-4 text-center">Cargando torneos...</p>}
      {!loading && error && (
        <p className="p-4 text-center text-red-600">
          No pudimos cargar los torneos desde la API. Mostramos datos de ejemplo para que puedas continuar.
        </p>
      )}
      {!loading && (
        <TournamentTable
          torneos={torneos}
          onDeleteClick={handleDeleteClick}
          onEditClick={handleEditClick}
          onViewClick={handleViewClick}
          tournamentPendingDeletion={tournamentPendingDeletion?.id}
          expandedRowId={expandedRowId}
        />
      )}
    </>
  );

  const renderFixtureTab = () => (
    <div className="p-4">
      <label htmlFor="tournament-select" className="block text-sm font-medium text-gray-700 mb-2">
        Selecciona un torneo para gestionar:
      </label>
      <select
        id="tournament-select"
        value={selectedTournamentId ?? ''}
        onChange={(event) => setSelectedTournamentId(Number(event.target.value))}
        className="mb-6 w-full max-w-xs p-2 border border-gray-300 rounded-md"
      >
        {loading ? <option>Cargando...</option> : torneos.map((torneo) => <option key={torneo.id} value={torneo.id}>{torneo.name}</option>)}
      </select>

      {loading ? (
        <p className="text-center p-8">Cargando fixture...</p>
      ) : (
        <FixtureView tournament={selectedTournament} onSaveResult={handleSaveResult} />
      )}
    </div>
  );

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Trophy className="text-blue-600" size={40} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de torneos</h1>
            <p className="mt-1 text-gray-500">Administra torneos deportivos, equipos y resultados</p>
          </div>
        </div>

        <button
          onClick={handleCreateClick}
          className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Crear Torneo
        </button>
      </div>

      {renderTabs()}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {activeTab === TAB_KEYS.TOURNAMENTS && renderTournamentsTab()}
        {activeTab === TAB_KEYS.FIXTURE && renderFixtureTab()}
        {activeTab !== TAB_KEYS.TOURNAMENTS && activeTab !== TAB_KEYS.FIXTURE && (
          <div className="p-6 text-center text-gray-500">Próximamente disponible.</div>
        )}
      </div>

      {isDrawerOpen && <div onClick={closeDrawer} className="fixed inset-0 z-40 bg-transparent" />}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold">{editingTournament ? 'Editar Torneo' : 'Asistente para Crear Torneo'}</h2>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
              aria-label="Cerrar panel de creación o edición"
            >
              <X size={24} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 pr-2">
            <TournamentForm
              key={formKey}
              onSave={handleSaveTorneo}
              onCancel={closeDrawer}
              isEditing={Boolean(editingTournament)}
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
          <div className="py-3 px-5 flex items-center gap-4">
            <p>
              Torneo "{tournamentPendingDeletion.name}" eliminado.
            </p>
            <button onClick={handleUndoDelete} className="font-bold text-blue-400 hover:text-blue-300 whitespace-nowrap">
              Deshacer
            </button>
          </div>
          <div className="h-1 bg-blue-500 animate-shrink" />
        </div>
      )}
    </AppLayout>
  );
};

export default AdminTorneosPage;

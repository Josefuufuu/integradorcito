import React, { useEffect, useMemo, useRef, useState } from 'react';
import CampaignsView from './CampaignsView';
import CreateNotificationView from './CreateNotificationView';
import Toast from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import { createCampaign, deleteCampaign, listCampaigns, updateCampaign } from '../services/campaigns.js';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('Campañas');
  const [campaigns, setCampaigns] = useState([]);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '' });
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const deleteTimeoutRef = useRef(null);

  useEffect(() => {
    listCampaigns()
      .then((data) => setCampaigns(data ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formattedCampaigns = useMemo(() => campaigns.map((campaign) => {
    let schedule = '';
    if (campaign.scheduledAt) {
      const date = new Date(campaign.scheduledAt);
      schedule = Number.isNaN(date.getTime())
        ? campaign.scheduledAt
        : date.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
    }

    return {
      ...campaign,
      schedule,
      metrics: `${campaign.metricsSent ?? 0} enviados`,
      metricsSubtitle: `${campaign.metricsOpened ?? 0} aperturas`,
    };
  }), [campaigns]);

  const handleDelete = async (campaignId) => {
    try {
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
      const campaignToDelete = campaigns.find((c) => c.id === campaignId);
      await deleteCampaign(campaignId);
      setRecentlyDeleted(campaignToDelete);
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setShowToast(true);
      deleteTimeoutRef.current = setTimeout(() => {
        setRecentlyDeleted(null);
        setShowToast(false);
      }, 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUndoDelete = async () => {
    if (!recentlyDeleted) return;

    try {
      const [datePart, timePart = '09:00'] = (recentlyDeleted.scheduledAt || '').split('T');
      const recreated = await createCampaign({
        name: recentlyDeleted.name,
        message: recentlyDeleted.message,
        channel: recentlyDeleted.channel,
        segment: recentlyDeleted.segment,
        scheduleDate: datePart ?? '',
        scheduleTime: timePart.slice(0, 5),
      });
      setCampaigns((prev) => [recreated, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setRecentlyDeleted(null);
      setShowToast(false);
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    }
  };

  const handleSaveCampaign = async (formData) => {
    const payload = {
      name: formData.name,
      message: formData.message,
      channel: formData.channel,
      segment: formData.segment,
      scheduleDate: formData.scheduleDate,
      scheduleTime: formData.scheduleTime,
    };

    try {
      if (editingCampaign) {
        const updated = await updateCampaign(editingCampaign.id, payload);
        setCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setEditingCampaign(null);
      } else {
        const created = await createCampaign(payload);
        setCampaigns((prev) => [created, ...prev]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (campaignId) => {
    const campaignToEdit = campaigns.find((c) => c.id === campaignId);
    if (!campaignToEdit) return;

    setEditingCampaign({
      ...campaignToEdit,
      schedule: campaignToEdit.scheduledAt,
    });
    setActiveTab('Crear notificación');
  };

  const handleViewDetails = (campaign) => {
    setModalContent({
      title: `Detalles de: ${campaign.name}`,
      body: campaign.message || 'Esta campaña no tiene un mensaje detallado.',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="notifications-page">
      <header className="page-header-notifications">
        <div>
          <h1 className="title">Gestión de notificaciones</h1>
          <p className="subtitle">Crea y gestiona campañas de comunicación para estudiantes y personal</p>
        </div>
        {activeTab === 'Campañas' && (
          <button className="btn btn-primary" onClick={() => {
            setEditingCampaign(null);
            setActiveTab('Crear notificación');
          }}>
            + Nueva campaña
          </button>
        )}
      </header>

      <nav className="tabs-nav">
        <button className={`tab ${activeTab === 'Campañas' ? 'active' : ''}`} onClick={() => setActiveTab('Campañas')}>Campañas</button>
        <button className={`tab ${activeTab === 'Crear notificación' ? 'active' : ''}`} onClick={() => setActiveTab('Crear notificación')}>Crear notificación</button>
        <button className={`tab ${activeTab === 'Plantillas' ? 'active' : ''}`} onClick={() => setActiveTab('Plantillas')}>Plantillas</button>
        <button className={`tab ${activeTab === 'Logs de envío' ? 'active' : ''}`} onClick={() => setActiveTab('Logs de envío')}>Logs de envío</button>
      </nav>

      {error && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {activeTab === 'Campañas' && (
        <CampaignsView
          campaigns={formattedCampaigns}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
        />
      )}
      {activeTab === 'Crear notificación' && (
        <CreateNotificationView
          onSave={handleSaveCampaign}
          onSwitchTab={setActiveTab}
          editingCampaign={editingCampaign}
        />
      )}

      {showToast && <Toast message="Campaña eliminada." onUndo={handleUndoDelete} onDismiss={() => setShowToast(false)} />}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
      >
        <p>{modalContent.body}</p>
      </Modal>
    </div>
  );
}
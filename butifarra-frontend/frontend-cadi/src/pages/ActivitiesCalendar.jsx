import React, { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { TopBar } from "../components/Dashboard/TopBar";
import { Search, Filter, Star, MapPin, Clock, Users, Tag, X } from "lucide-react";

// Configuración del localizador para fechas en español
const locales = { 'es': es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Datos de muestra para actividades
const sampleActivities = [
  {
    id: 1,
    title: "Clase de yoga al aire libre",
    start: new Date(2025, 9, 20, 10, 0), // 2025-10-20 10:00
    end: new Date(2025, 9, 20, 12, 0),   // 2025-10-20 12:00
    location: "Cancha Múltiple A",
    description: "Actividad guiada por el área de salud mental. Cupos limitados.",
    category: "Bienestar físico",
    registerUrl: "/registro/yoga",
    availableSpots: 15,
    instructor: "Carla Mendoza",
    isFavorite: false,
  },
  {
    id: 2,
    title: "Torneo de ajedrez",
    start: new Date(2025, 9, 18, 14, 0), // 2025-10-18 14:00
    end: new Date(2025, 9, 18, 18, 0),   // 2025-10-18 18:00
    location: "Salón Múltiple B",
    description: "Competencia de ajedrez abierta para toda la comunidad universitaria.",
    category: "Deporte mental",
    registerUrl: "/registro/ajedrez",
    availableSpots: 32,
    instructor: "Manuel Suárez",
    isFavorite: false,
  },
  {
    id: 3,
    title: "Taller de mindfulness",
    start: new Date(2025, 9, 22, 15, 30), // 2025-10-22 15:30
    end: new Date(2025, 9, 22, 17, 0),    // 2025-10-22 17:00
    location: "Salón Bienestar",
    description: "Aprende técnicas de relajación y atención plena para combatir el estrés académico.",
    category: "Bienestar mental",
    registerUrl: "/registro/mindfulness",
    availableSpots: 20,
    instructor: "Laura Pérez",
    isFavorite: false,
  },
  {
    id: 4,
    title: "Fútbol 5 - Liga interna",
    start: new Date(2025, 9, 21, 16, 0), // 2025-10-21 16:00
    end: new Date(2025, 9, 21, 18, 0),   // 2025-10-21 18:00
    location: "Cancha de fútbol 5",
    description: "Jornada de la liga interna de fútbol. Enfrentamiento entre facultades.",
    category: "Deporte colectivo",
    registerUrl: "/registro/futbol",
    availableSpots: 0, // Lleno
    instructor: "Carlos Ramírez",
    isFavorite: false,
  },
  {
    id: 5,
    title: "Sesión de cine foro",
    start: new Date(2025, 9, 25, 18, 0), // 2025-10-25 18:00
    end: new Date(2025, 9, 25, 21, 0),   // 2025-10-25 21:00
    location: "Auditorio Principal",
    description: "Proyección de película y discusión guiada por expertos en estudios cinematográficos.",
    category: "Cultura",
    registerUrl: "/registro/cineforo",
    availableSpots: 45,
    instructor: "Diana Torres",
    isFavorite: false,
  }
];

// Categorías disponibles para filtros
const categories = [
  "Bienestar físico",
  "Bienestar mental",
  "Deporte colectivo",
  "Deporte mental",
  "Cultura"
];

export default function ActivitiesCalendar() {
  // Estados
  const [view, setView] = useState("month");
  const [activities, setActivities] = useState(sampleActivities);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filtrar eventos
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "" || activity.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activities, searchTerm, selectedCategory]);

  // Manejadores de eventos
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const toggleFavorite = (id) => {
    setActivities(activities.map(activity =>
      activity.id === id ? {...activity, isFavorite: !activity.isFavorite} : activity
    ));
  };

  const handleRegister = (registerUrl) => {
    // Aquí iría la lógica de registro o redirección
    console.log(`Registering to: ${registerUrl}`);
    // Para implementación futura: history.push(registerUrl);
  };

  // Estilización de eventos en el calendario
  const eventStyleGetter = (event) => {
    const isPast = new Date(event.end) < new Date();
    const style = {
      backgroundColor: isPast ? '#CBD5E0' : '#3182CE',
      opacity: isPast ? 0.7 : 1,
      color: '#FFF',
      border: '0',
      borderRadius: '4px',
      padding: '2px 5px',
      fontSize: '90%',
      cursor: isPast ? 'default' : 'pointer',
    };
    return {
      style,
      className: isPast ? 'past-event' : ''
    };
  };

  return (
    <main
      style={{ display: "grid", gridTemplateColumns: "230px 1fr" }}
      className="h-screen w-screen overflow-x-hidden"
    >
      <Sidebar />
      <div className="h-full overflow-y-auto bg-stone-50">
        <TopBar />
        <section role="main" className="p-6 md:p-8 space-y-8">
          {/* Encabezado */}
          <header className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Calendario de Actividades</h1>
            <p className="text-sm text-gray-500">
              Visualiza y regístrate en las actividades programadas por Bienestar Universitario
            </p>
          </header>

          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar actividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none w-full"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={view}
                  onChange={(e) => setView(e.target.value)}
                  className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="month">Vista Mensual</option>
                  <option value="week">Vista Semanal</option>
                  <option value="day">Vista Diaria</option>
                </select>
              </div>
            </div>
          </div>

          {/* Calendario */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-300px)]">
            <Calendar
              localizer={localizer}
              events={filteredActivities}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              views={['month', 'week', 'day']}
              view={view}
              onView={(newView) => setView(newView)}
              eventPropGetter={eventStyleGetter}
              messages={{
                previous: 'Anterior',
                next: 'Siguiente',
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                noEventsInRange: 'No hay actividades en este período',
              }}
              className="h-full"
            />
          </div>
        </section>

        {/* Modal de detalles */}
        {showModal && selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(selectedEvent.id)}
                      className="text-gray-500 hover:text-yellow-500 focus:outline-none"
                      title={selectedEvent.isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                      <Star className={selectedEvent.isFavorite ? "fill-yellow-500 text-yellow-500" : ""} size={20} />
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="text-gray-500 hover:text-red-500 focus:outline-none"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">{selectedEvent.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2" />
                      <span>
                        {format(new Date(selectedEvent.start), 'EEEE d MMMM, HH:mm', {locale: es})} -
                        {format(new Date(selectedEvent.end), ' HH:mm', {locale: es})}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users size={16} className="mr-2" />
                      <span>Instructor: {selectedEvent.instructor}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Tag size={16} className="mr-2" />
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {selectedEvent.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
                    <span className={`text-sm font-medium ${selectedEvent.availableSpots > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedEvent.availableSpots > 0
                        ? `${selectedEvent.availableSpots} cupos disponibles`
                        : 'No hay cupos disponibles'}
                    </span>
                    <button
                      onClick={() => handleRegister(selectedEvent.registerUrl)}
                      disabled={selectedEvent.availableSpots <= 0 || new Date(selectedEvent.end) < new Date()}
                      className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none 
                        ${selectedEvent.availableSpots > 0 && new Date(selectedEvent.end) >= new Date()
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      {new Date(selectedEvent.end) < new Date()
                        ? 'Actividad finalizada'
                        : selectedEvent.availableSpots <= 0
                          ? 'Sin cupos'
                          : 'Inscribirme'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

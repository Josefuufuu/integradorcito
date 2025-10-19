// src/mocks/userActivities.js
const userActivitiesMock = [
  {
    id: 1,
    title: "Entrenamiento de baloncesto",
    start: new Date(2025, 9, 21, 14, 0), // 21 de octubre de 2025, 14:00
    end: new Date(2025, 9, 21, 16, 0),   // 21 de octubre de 2025, 16:00
    location: "Cancha A",
    description: "Sesión de entrenamiento regular.",
    category: "Deporte",
    instructor: "Juan Pérez",
    availableSpots: 20,
    registerUrl: "/registro/baloncesto",
    isFavorite: false,
  },
  {
    id: 2,
    title: "Clase de pintura",
    start: new Date(2025, 9, 22, 10, 0), // 22 de octubre de 2025, 10:00
    end: new Date(2025, 9, 22, 12, 0),   // 22 de octubre de 2025, 12:00
    location: "Sala de arte",
    description: "Aprende técnicas básicas de pintura.",
    category: "Arte",
    instructor: "María Gómez",
    availableSpots: 10,
    registerUrl: "/registro/pintura",
    isFavorite: false,
  },
  {
    id: 3,
    title: "Sesión de mindfulness",
    start: new Date(2025, 9, 23, 9, 0), // 23 de octubre de 2025, 09:00
    end: new Date(2025, 9, 23, 10, 30), // 23 de octubre de 2025, 10:30
    location: "Sala Bienestar",
    description: "Ejercicios de respiración y relajación.",
    category: "Bienestar",
    instructor: "Carlos Rodríguez",
    availableSpots: 15,
    registerUrl: "/registro/mindfulness",
    isFavorite: false,
  },
];

export default userActivitiesMock;

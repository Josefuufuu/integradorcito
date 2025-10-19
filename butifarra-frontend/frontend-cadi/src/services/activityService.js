// src/services/activityService.js
import axios from "axios";
import userActivitiesMock from "../mocks/userActivitiesMock";

// Obtiene las actividades del usuario autenticado. Si falla, devuelve datos mock.
export async function getUserActivities() {
  try {
    const response = await axios.get("/api/user/activities");
    return response.data;
  } catch (error) {
    console.error("No se pudieron obtener las actividades del usuario:", error);
    return userActivitiesMock;
  }
}

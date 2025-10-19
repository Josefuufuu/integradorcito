import React from "react";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Dashboard } from "../components/Dashboard/AdminDashboard";

export default function AdminReport() {
  return (
    
   <main style={{ display: 'grid', gridTemplateColumns: '230px 1fr'}} className="h-screen w-full">
      <Sidebar />
      <Dashboard />
    </main>
  );
  

}
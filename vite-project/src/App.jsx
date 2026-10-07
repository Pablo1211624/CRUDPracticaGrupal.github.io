import { Navigate, Route, Routes } from "react-router-dom";
import GestionAlumnos from "./Paginas/GestionAlumnos";
import ListaAlumnos from "./Paginas/ListaAlumnos";
import Menu from "./Paginas/Menu";
import NuevoAlumno from "./Paginas/NuevoAlumno";

function App() {
  return (
    <>
      <Menu />

      <Routes>
        <Route path="/" element={<Navigate to="/alumnos" replace />} />
        <Route path="/alumnos" element={<ListaAlumnos />} />
        <Route path="/nuevo" element={<NuevoAlumno />} />
        <Route path="/gestionar" element={<GestionAlumnos />} />
        <Route path="*" element={<Navigate to="/alumnos" replace />} />
      </Routes>
    </>
  );
}

export default App;

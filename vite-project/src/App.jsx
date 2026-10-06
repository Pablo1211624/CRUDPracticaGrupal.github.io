import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import GestionAlumnos from "./Paginas/GestionAlumnos";
import ListaAlumnos from "./Paginas/ListaAlumnos";
import NuevoAlumno from "./Paginas/NuevoAlumno";

function App() {
  const claseEnlace = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand">Gestión de alumnos</span>
          <div className="navbar-nav">
            <NavLink to="/alumnos" className={claseEnlace}>
              Ver alumnos
            </NavLink>
            <NavLink to="/nuevo" className={claseEnlace}>
              Nuevo alumno
            </NavLink>
            <NavLink to="/gestionar" className={claseEnlace}>
              Actualizar / eliminar
            </NavLink>
          </div>
        </div>
      </nav>

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

import { NavLink } from "react-router-dom";

const opcionesMenu = [
  { ruta: "/alumnos", texto: "Ver alumnos" },
  { ruta: "/nuevo", texto: "Nuevo alumno" },
  { ruta: "/gestionar", texto: "Actualizar / eliminar" },
];

function Menu() {
  const claseEnlace = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-primary" aria-label="Navegación principal">
      <div className="container flex-column flex-md-row align-items-start align-items-md-center">
        <NavLink to="/alumnos" className="navbar-brand">
          Gestión de alumnos
        </NavLink>

        <div className="navbar-nav flex-row flex-wrap gap-2 gap-md-0">
          {opcionesMenu.map((opcion) => (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              className={claseEnlace}
            >
              {opcion.texto}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Menu;

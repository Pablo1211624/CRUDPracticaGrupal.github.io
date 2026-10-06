import { useCallback, useEffect, useState } from "react";

const obtenerAlumnos = async () => {
  const respuesta = await fetch("/api/alumnos");
  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || "No se pudieron obtener los alumnos");
  }

  return resultado;
};

function ListaAlumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarAlumnos = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      setAlumnos(await obtenerAlumnos());
    } catch (errorPeticion) {
      setError(errorPeticion.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let paginaActiva = true;

    obtenerAlumnos()
      .then((resultado) => {
        if (paginaActiva) setAlumnos(resultado);
      })
      .catch((errorPeticion) => {
        if (paginaActiva) setError(errorPeticion.message);
      })
      .finally(() => {
        if (paginaActiva) setCargando(false);
      });

    return () => {
      paginaActiva = false;
    };
  }, []);

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Alumnos registrados</h1>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={cargarAlumnos}
          disabled={cargando}
        >
          Actualizar
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {cargando ? (
        <p>Cargando alumnos...</p>
      ) : alumnos.length === 0 ? (
        <p>No hay alumnos registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Carnet</th>
                <th>Carrera</th>
                <th>Edad</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((alumno) => (
                <tr key={alumno.IdAlumno}>
                  <td>{alumno.IdAlumno}</td>
                  <td>{alumno.Nombre}</td>
                  <td>{alumno.Apellido}</td>
                  <td>{alumno.Carnet}</td>
                  <td>{alumno.Carrera}</td>
                  <td>{alumno.Edad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default ListaAlumnos;

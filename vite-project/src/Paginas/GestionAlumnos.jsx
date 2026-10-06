import { useCallback, useEffect, useState } from "react";

const formularioVacio = {
  IdAlumno: null,
  Nombre: "",
  Apellido: "",
  Carnet: "",
  Carrera: "",
  Edad: "",
};

const solicitarAlumnos = async () => {
  const respuesta = await fetch("/api/alumnos");
  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || "No se pudieron obtener los alumnos");
  }

  return resultado;
};

function GestionAlumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const cargarAlumnos = useCallback(async () => {
    setCargando(true);

    try {
      setAlumnos(await solicitarAlumnos());
    } catch (error) {
      setMensaje({ tipo: "danger", texto: error.message });
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let paginaActiva = true;

    solicitarAlumnos()
      .then((resultado) => {
        if (paginaActiva) setAlumnos(resultado);
      })
      .catch((error) => {
        if (paginaActiva) {
          setMensaje({ tipo: "danger", texto: error.message });
        }
      })
      .finally(() => {
        if (paginaActiva) setCargando(false);
      });

    return () => {
      paginaActiva = false;
    };
  }, []);

  const seleccionarAlumno = (alumno) => {
    setFormulario({
      ...alumno,
      Edad: String(alumno.Edad),
    });
    setMensaje(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const actualizarCampo = (event) => {
    const { name, value } = event.target;
    const nuevoValor = name === "Edad" ? value.replace(/\D/g, "").slice(0, 3) : value;

    setFormulario((actual) => ({
      ...actual,
      [name]: nuevoValor,
    }));
  };

  const actualizarAlumno = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setMensaje(null);

    try {
      const respuesta = await fetch(`/api/alumnos/${formulario.IdAlumno}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre: formulario.Nombre,
          Apellido: formulario.Apellido,
          Carnet: formulario.Carnet,
          Carrera: formulario.Carrera,
          Edad: Number(formulario.Edad),
        }),
      });
      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.mensaje || "No se pudo actualizar el alumno");
      }

      setMensaje({ tipo: "success", texto: resultado.mensaje });
      setFormulario(formularioVacio);
      await cargarAlumnos();
    } catch (error) {
      setMensaje({ tipo: "danger", texto: error.message });
    } finally {
      setGuardando(false);
    }
  };

  const eliminarAlumno = async (alumno) => {
    const confirmado = window.confirm(
      `¿Deseas eliminar a ${alumno.Nombre} ${alumno.Apellido}?`,
    );

    if (!confirmado) return;

    setMensaje(null);

    try {
      const respuesta = await fetch(`/api/alumnos/${alumno.IdAlumno}`, {
        method: "DELETE",
      });
      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.mensaje || "No se pudo eliminar el alumno");
      }

      if (formulario.IdAlumno === alumno.IdAlumno) {
        setFormulario(formularioVacio);
      }

      setMensaje({ tipo: "success", texto: resultado.mensaje });
      await cargarAlumnos();
    } catch (error) {
      setMensaje({ tipo: "danger", texto: error.message });
    }
  };

  return (
    <main className="container py-4">
      <h1 className="mb-4">Actualizar o eliminar alumnos</h1>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo}`} role="alert">
          {mensaje.texto}
        </div>
      )}

      {formulario.IdAlumno && (
        <section className="card mb-4">
          <div className="card-body">
            <h2 className="h4">Editar alumno #{formulario.IdAlumno}</h2>
            <form onSubmit={actualizarAlumno}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="editarNombre" className="form-label">Nombre</label>
                  <input id="editarNombre" name="Nombre" className="form-control" value={formulario.Nombre} onChange={actualizarCampo} maxLength={50} required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="editarApellido" className="form-label">Apellido</label>
                  <input id="editarApellido" name="Apellido" className="form-control" value={formulario.Apellido} onChange={actualizarCampo} maxLength={50} required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="editarCarnet" className="form-label">Carnet</label>
                  <input id="editarCarnet" name="Carnet" className="form-control" value={formulario.Carnet} onChange={actualizarCampo} maxLength={20} required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="editarCarrera" className="form-label">Carrera</label>
                  <input id="editarCarrera" name="Carrera" className="form-control" value={formulario.Carrera} onChange={actualizarCampo} maxLength={100} required />
                </div>
                <div className="col-md-3">
                  <label htmlFor="editarEdad" className="form-label">Edad</label>
                  <input id="editarEdad" name="Edad" type="text" inputMode="numeric" pattern="[0-9]{1,3}" maxLength={3} className="form-control" value={formulario.Edad} onChange={actualizarCampo} required />
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary" disabled={guardando}>
                  {guardando ? "Actualizando..." : "Actualizar"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setFormulario(formularioVacio)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

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
                <th>Acciones</th>
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
                  <td>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-warning btn-sm" onClick={() => seleccionarAlumno(alumno)}>
                        Editar
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => eliminarAlumno(alumno)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default GestionAlumnos;

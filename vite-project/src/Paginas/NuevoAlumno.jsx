import { useState } from "react";

const datosIniciales = {
  Nombre: "",
  Apellido: "",
  Carnet: "",
  Carrera: "",
  Edad: "",
};

function NuevoAlumno() {
  const [datos, setDatos] = useState(datosIniciales);
  const [confirmado, setConfirmado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const actualizarCampo = (event) => {
    const { name, value } = event.target;
    const nuevoValor = name === "Edad" ? value.replace(/\D/g, "").slice(0, 3) : value;

    setDatos((datosActuales) => ({
      ...datosActuales,
      [name]: nuevoValor,
    }));
  };

  const enviarFormulario = async (event) => {
    event.preventDefault();
    setEnviando(true);
    setMensaje(null);

    try {
      const respuesta = await fetch("/api/alumnos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...datos,
          Edad: Number(datos.Edad),
        }),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.mensaje || "No se pudo guardar el alumno");
      }

      setDatos(datosIniciales);
      setConfirmado(false);
      setMensaje({ tipo: "success", texto: resultado.mensaje });
    } catch (error) {
      setMensaje({ tipo: "danger", texto: error.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="container py-4">
      <h1 className="mb-4">Nuevo alumno</h1>
      <form onSubmit={enviarFormulario} className="col-lg-6">
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">
          Nombre
        </label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          name="Nombre"
          value={datos.Nombre}
          onChange={actualizarCampo}
          maxLength={50}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="apellido" className="form-label">
          Apellido
        </label>
        <input
          type="text"
          className="form-control"
          id="apellido"
          name="Apellido"
          value={datos.Apellido}
          onChange={actualizarCampo}
          maxLength={50}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="carnet" className="form-label">
          Carnet
        </label>
        <input
          type="text"
          className="form-control"
          id="carnet"
          name="Carnet"
          value={datos.Carnet}
          onChange={actualizarCampo}
          maxLength={20}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="carrera" className="form-label">
          Carrera
        </label>
        <input
          type="text"
          className="form-control"
          id="carrera"
          name="Carrera"
          value={datos.Carrera}
          onChange={actualizarCampo}
          maxLength={100}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="edad" className="form-label">
          Edad
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={3}
          pattern="[0-9]{1,3}"
          className="form-control"
          id="edad"
          name="Edad"
          value={datos.Edad}
          onChange={actualizarCampo}
          style={{ width: "6rem" }}
          title="Ingresa una edad de máximo 3 dígitos"
          required
        />
      </div>
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="confirmacion"
          checked={confirmado}
          onChange={(event) => setConfirmado(event.target.checked)}
          required
        />
        <label className="form-check-label" htmlFor="confirmacion">
          Confirmo que estos datos son correctos
        </label>
      </div>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo}`} role="alert">
          {mensaje.texto}
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={enviando}>
        {enviando ? "Guardando..." : "Guardar alumno"}
      </button>
      </form>
    </main>
  );
}

export default NuevoAlumno;

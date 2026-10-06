const express = require("express");
const { sql, poolPromise } = require("./db");

const app = express();

// Permite recibir información en formato JSON
app.use(express.json());

// =====================================================
// MÉTODO GET
// Consultar todos los alumnos
// =====================================================

app.get("/api/alumnos", async (req, res) => {
  try {
    // Obtener conexión a SQL Server
    const pool = await poolPromise;

    // Ejecutar SELECT
    const result = await pool.request().query(`
                SELECT
                    IdAlumno,
                    Nombre,
                    Apellido,
                    Carnet,
                    Carrera,
                    Edad
                FROM Alumnos
            `);

    // Devolver resultado en formato JSON
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al consultar:", error);

    res.status(500).json({
      mensaje: "Error al consultar los alumnos",
      error: error.message,
    });
  }
});

// =====================================================
// MÉTODO POST
// Insertar un nuevo alumno
// =====================================================

app.post("/api/alumnos", async (req, res) => {
  try {
    // Recibir datos enviados desde Postman
    const { Nombre, Apellido, Carnet, Carrera, Edad } = req.body;

    // Obtener conexión a SQL Server
    const pool = await poolPromise;

    // Ejecutar INSERT
    await pool
      .request()

      .input("Nombre", sql.VarChar(50), Nombre)
      .input("Apellido", sql.VarChar(50), Apellido)
      .input("Carnet", sql.VarChar(20), Carnet)
      .input("Carrera", sql.VarChar(100), Carrera)
      .input("Edad", sql.Int, Edad).query(`
                INSERT INTO Alumnos
                (
                    Nombre,
                    Apellido,
                    Carnet,
                    Carrera,
                    Edad
                )
                VALUES
                (
                    @Nombre,
                    @Apellido,
                    @Carnet,
                    @Carrera,
                    @Edad
                )
            `);

    // Respuesta al cliente
    res.status(201).json({
      mensaje: "Alumno insertado correctamente",
    });
  } catch (error) {
    console.error("Error al insertar:", error);

    res.status(500).json({
      mensaje: "Error al insertar el alumno",
      error: error.message,
    });
  }
});

// =====================================================
// MÉTODO PUT
// Actualizar un alumno por su ID
// =====================================================

app.put("/api/alumnos/:id", async (req, res) => {
  try {
    const IdAlumno = Number(req.params.id);
    const { Nombre, Apellido, Carnet, Carrera, Edad } = req.body;

    if (!Number.isInteger(IdAlumno) || IdAlumno <= 0) {
      return res.status(400).json({ mensaje: "El ID del alumno no es válido" });
    }

    if (!Nombre || !Apellido || !Carnet || !Carrera || Edad === undefined) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("IdAlumno", sql.Int, IdAlumno)
      .input("Nombre", sql.VarChar(50), Nombre)
      .input("Apellido", sql.VarChar(50), Apellido)
      .input("Carnet", sql.VarChar(20), Carnet)
      .input("Carrera", sql.VarChar(100), Carrera)
      .input("Edad", sql.Int, Edad)
      .query(`
        UPDATE Alumnos
        SET
          Nombre = @Nombre,
          Apellido = @Apellido,
          Carnet = @Carnet,
          Carrera = @Carrera,
          Edad = @Edad
        WHERE IdAlumno = @IdAlumno
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ mensaje: "Alumno no encontrado" });
    }

    res.json({ mensaje: "Alumno actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({
      mensaje: "Error al actualizar el alumno",
      error: error.message,
    });
  }
});

// =====================================================
// MÉTODO DELETE
// Eliminar un alumno por su ID
// =====================================================

app.delete("/api/alumnos/:id", async (req, res) => {
  try {
    const IdAlumno = Number(req.params.id);

    if (!Number.isInteger(IdAlumno) || IdAlumno <= 0) {
      return res.status(400).json({ mensaje: "El ID del alumno no es válido" });
    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("IdAlumno", sql.Int, IdAlumno)
      .query("DELETE FROM Alumnos WHERE IdAlumno = @IdAlumno");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ mensaje: "Alumno no encontrado" });
    }

    res.json({ mensaje: "Alumno eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({
      mensaje: "Error al eliminar el alumno",
      error: error.message,
    });
  }
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

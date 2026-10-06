const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate:
      process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log(" Conectado correctamente a SQL Server");
    return pool;
  })
  .catch((error) => {
    console.error(" Error conectando a SQL Server:");
    console.error(error);
    throw error;
  });

module.exports = {
  sql,
  poolPromise,
};

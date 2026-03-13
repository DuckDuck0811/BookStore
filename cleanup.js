import sql from "mssql";

const dbConfig = {
  user: "sa",
  password: "123",
  server: "localhost",
  database: "test",
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function cleanup() {
  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      DELETE FROM Events
      WHERE BatchId LIKE 'k6_%'
    `;
    console.log("Deleted rows:", result.rowsAffected[0]);
  } catch (err) {
    console.error("CLEANUP ERROR:", err);
  } finally {
    await sql.close();
  }
}

cleanup();

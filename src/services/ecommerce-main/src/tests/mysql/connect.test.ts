import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "duckhai80",
  password: "starter80",
  database: "ecommerce_dev",
});

// pool.query("SELECT 1 + 1 AS solution", (error, result) => {
pool.query("SELECT * FROM users", (error, result) => {
  if (error) throw error;

  console.log("Query results:", result);

  pool.end((error) => {
    if (error) throw error;

    console.log(`Connection closed`);
  });
});

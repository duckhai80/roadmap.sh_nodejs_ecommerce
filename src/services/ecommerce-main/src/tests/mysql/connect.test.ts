import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "duckhai80",
  password: "starter80",
  database: "ecommerce_dev",
});

// pool.query("SELECT 1 + 1 AS solution", (error, result) => {
//   if (error) throw error;

//   console.log("Query results:", result);

//   pool.end((error) => {
//     if (error) throw error;

//     console.log(`Connection closed`);
//   });
// });

const batchSize = 100_000;
const totalSize = 10_000_000;
let currentId = 1;

// 1M records per batch - Insert lost about 6s
// 10M records per batch - Insert lost about 1m:01s
console.time("::::::Timer::::::");

const insertBatch = async () => {
  const values = [];

  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;

    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd("::::::Timer::::::");
    pool.end((error) => {
      if (error) {
        console.error("Error when running batch insert", error);
      }
    });

    return;
  }

  const sql = "INSERT INTO test_table (id, name, age, address) VALUES ?";

  pool.query(sql, [values], async (error, result) => {
    if (error) throw error;

    console.log(`Inserted ${(result as any).affectedRows} records`);

    await insertBatch();
  });
};

insertBatch().catch(console.error);

/**
 * Fake Database Connection Module
 * Simulates a connection pool, queries, and latency.
 * Used for CheckPoint 2 (Database Connection feature branch).
 */

// -------------------- CONFIG --------------------
const CONFIG = {
  host: "localhost",
  port: 5432,
  user: "student",
  password: "password123",
  database: "csp451"
};

// -------------------- STATE --------------------
let connected = false;
let pool = [];

// -------------------- API --------------------
/**
 * Connect to the database.
 * Returns a promise that resolves to true after simulated delay.
 */
function connect() {
  return new Promise((resolve) => {
    console.log("Connecting to database...");
    setTimeout(() => {
      connected = true;
      console.log(`Connected to ${CONFIG.database} at ${CONFIG.host}:${CONFIG.port}`);
      resolve(true);
    }, 500);
  });
}

/**
 * Disconnect from the database.
 */
function disconnect() {
  if (connected) {
    connected = false;
    console.log("Disconnected from database.");
  } else {
    console.warn("Cannot disconnect: not connected.");
  }
}

/**
 * Add a fake record to the pool.
 */
function insert(record) {
  if (!connected) throw new Error("Not connected to database!");
  pool.push(record);
  console.log("Inserted record:", record);
}

/**
 * Query fake data from the pool.
 * Supports filtering by key/value.
 */
function query(key, value) {
  if (!connected) throw new Error("Not connected to database!");
  if (!key) return pool;
  return pool.filter(r => r[key] === value);
}

/**
 * Show connection status.
 */
function status() {
  return {
    connected,
    totalRecords: pool.length,
    config: { host: CONFIG.host, database: CONFIG.database }
  };
}

// -------------------- DEMO --------------------
async function demo() {
  await connect();
  insert({ id: 1, name: "Alice", role: "admin" });
  insert({ id: 2, name: "Bob", role: "user" });
  console.log("All users:", query());
  console.log("Only admins:", query("role", "admin"));
  console.log("Status:", status());
  disconnect();
}

// Run demo if called directly
if (require.main === module) {
  demo();
}

// Export functions for use by other modules
module.exports = { connect, disconnect, insert, query, status };

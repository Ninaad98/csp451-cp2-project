/**
 * API Routes Module
 * Simulates REST API endpoints for health, users, and login.
 * Depends on auth (fakeSignIn) and db modules.
 */

const { fakeSignIn } = require("../auth/auth.js");
const db = require("../db/db.js");

// -------------------- MOCK EXPRESS-LIKE ROUTER --------------------
class Router {
  constructor() {
    this.routes = {};
  }

  get(path, handler) {
    this.routes[`GET ${path}`] = handler;
  }

  post(path, handler) {
    this.routes[`POST ${path}`] = handler;
  }

  async handle(method, path, body = {}) {
    const key = `${method.toUpperCase()} ${path}`;
    const handler = this.routes[key];
    if (!handler) {
      return { status: 404, data: { error: "Not Found" } };
    }
    try {
      const result = await handler({ body });
      return { status: 200, data: result };
    } catch (err) {
      return { status: 500, data: { error: err.message } };
    }
  }
}

const router = new Router();

// -------------------- ROUTE DEFINITIONS --------------------

// Health check endpoint
router.get("/health", async () => {
  return { status: "ok", uptime: process.uptime() };
});

// Users endpoint (reads from db)
router.get("/users", async () => {
  const users = db.query(); // returns all records
  return { users };
});

// Login endpoint (calls fakeSignIn from auth)
router.post("/login", async ({ body }) => {
  const { username, password } = body;
  const result = fakeSignIn({ username, password });
  if (result.ok) {
    // Optionally add user to db if not already there
    const existing = db.query("name", username);
    if (existing.length === 0) {
      db.insert({ id: Date.now(), name: username, role: "user" });
    }
    return { token: result.token, user: result.user };
  } else {
    return { error: result.message };
  }
});

// -------------------- DEMO --------------------
async function demo() {
  await db.connect();

  console.log("GET /health ->", await router.handle("GET", "/health"));
  console.log("GET /users (empty) ->", await router.handle("GET", "/users"));

  console.log("POST /login (valid) ->",
    await router.handle("POST", "/login", { username: "alice", password: "secret123" })
  );

  console.log("POST /login (invalid) ->",
    await router.handle("POST", "/login", { username: "bad!", password: "123" })
  );

  console.log("GET /users (after login) ->", await router.handle("GET", "/users"));

  db.disconnect();
}

// Run demo if called directly
if (require.main === module) {
  demo();
}

// Export router for use by app.js or other modules
module.exports = router;

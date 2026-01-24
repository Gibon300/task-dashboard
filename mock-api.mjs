import http from "http";
import fs from "fs";
import { URL } from "url";

const PORT = 3001;
const DB_PATH = "./db.json";

/* =======================
   Utils
======================= */

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function makeId(prefix = "id") {
  // простой уникальный id для учебного проекта
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/* =======================
   Server
======================= */

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    /* =======================
       PROJECTS
    ======================= */

    // GET /projects
    if (req.method === "GET" && url.pathname === "/projects") {
      const db = readDb();
      sendJson(res, 200, db.projects ?? []);
      return;
    }

    // GET /projects/:id   (id = string, например "p1")
    if (req.method === "GET" && url.pathname.startsWith("/projects/")) {
      const id = url.pathname.split("/")[2];
      const db = readDb();

      const project = (db.projects ?? []).find((p) => String(p.id) === id);

      if (!project) {
        sendJson(res, 404, { message: "Project not found" });
        return;
      }

      sendJson(res, 200, project);
      return;
    }

    // POST /projects
    // body: { name: string, id?: string, createdAt?: string }
    if (req.method === "POST" && url.pathname === "/projects") {
      const body = await readBody(req);
      const db = readDb();

      const name = String(body?.name ?? "").trim();
      if (!name) {
        sendJson(res, 400, { message: "Project name is required" });
        return;
      }

      const newProject = {
        id: body?.id ? String(body.id) : makeId("p"),
        name,
        createdAt: body?.createdAt ? String(body.createdAt) : new Date().toISOString(),
      };

      db.projects = db.projects ?? [];
      db.projects.push(newProject);
      writeDb(db);

      sendJson(res, 201, newProject);
      return;
    }

    /* =======================
       TASKS
    ======================= */

    // GET /tasks?projectId=...
    if (req.method === "GET" && url.pathname === "/tasks") {
      const projectId = url.searchParams.get("projectId");
      const db = readDb();

      const all = db.tasks ?? [];
      const tasks = projectId ? all.filter((t) => String(t.projectId) === projectId) : all;

      sendJson(res, 200, tasks);
      return;
    }

    // POST /tasks
    // body: { projectId: string, title: string, status?: "todo"|"in_progress"|"done", id?: string }
    if (req.method === "POST" && url.pathname === "/tasks") {
      const body = await readBody(req);
      const db = readDb();

      const projectId = String(body?.projectId ?? "").trim();
      const title = String(body?.title ?? "").trim();
      const status = body?.status ?? "todo";

      if (!projectId) {
        sendJson(res, 400, { message: "projectId is required" });
        return;
      }
      if (!title) {
        sendJson(res, 400, { message: "title is required" });
        return;
      }
      if (!["todo", "in_progress", "done"].includes(status)) {
        sendJson(res, 400, { message: "Invalid status" });
        return;
      }

      const newTask = {
        id: body?.id ? String(body.id) : makeId("t"),
        projectId,
        title,
        status,
      };

      db.tasks = db.tasks ?? [];
      db.tasks.push(newTask);
      writeDb(db);

      sendJson(res, 201, newTask);
      return;
    }

    // DELETE /tasks/:id  (id = string, uuid тоже ок)
    if (req.method === "DELETE" && url.pathname.startsWith("/tasks/")) {
      const id = url.pathname.split("/")[2];
      const db = readDb();

      const tasks = db.tasks ?? [];
      const index = tasks.findIndex((t) => String(t.id) === id);

      if (index === -1) {
        sendJson(res, 404, { message: "Task not found" });
        return;
      }

      tasks.splice(index, 1);
      db.tasks = tasks;
      writeDb(db);

      res.writeHead(204);
      res.end();
      return;
    }

    // DELETE /projects/:id  (id = string)
if (req.method === "DELETE" && url.pathname.startsWith("/projects/")) {
  const id = url.pathname.split("/")[2];
  const db = readDb();

  const beforeProjects = (db.projects ?? []).length;
  db.projects = (db.projects ?? []).filter((p) => String(p.id) !== id);

  if (db.projects.length === beforeProjects) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Project not found" }));
    return;
  }

  // каскад: удаляем задачи проекта
  db.tasks = (db.tasks ?? []).filter((t) => String(t.projectId) !== id);

  writeDb(db);

  res.writeHead(204);
  res.end();
  return;
}


    // PATCH /tasks/:id  (частичное обновление, обычно status/title)
    if (req.method === "PATCH" && url.pathname.startsWith("/tasks/")) {
      const id = url.pathname.split("/")[2];
      const body = await readBody(req);
      const db = readDb();

      const tasks = db.tasks ?? [];
      const task = tasks.find((t) => String(t.id) === id);

      if (!task) {
        sendJson(res, 404, { message: "Task not found" });
        return;
      }

      // разрешаем менять только известные поля
      if (typeof body.title === "string") task.title = body.title.trim();
      if (typeof body.status === "string") {
        if (!["todo", "in_progress", "done"].includes(body.status)) {
          sendJson(res, 400, { message: "Invalid status" });
          return;
        }
        task.status = body.status;
      }

      writeDb(db);
      sendJson(res, 200, task);
      return;
    }

    /* =======================
       Fallback
    ======================= */

    sendJson(res, 404, { message: "Not found" });
  } catch (e) {
    // JSON parse error / unexpected error
    sendJson(res, 500, { message: "Server error" });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Mock API running on http://localhost:${PORT}`);
});

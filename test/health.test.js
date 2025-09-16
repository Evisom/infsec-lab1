import { createApp } from "../src/app.js";
import assert from "node:assert";
import test from "node:test";
import http from "http";

function request(server, options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request({ ...options, port: server.address().port }, (res) => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

test("GET /health returns ok", async () => {
  const app = createApp();
  const server = app.listen(0);
  const res = await request(server, { method: "GET", path: "/health" });
  server.close();
  assert.equal(res.status, 200);
  const json = JSON.parse(res.body);
  assert.equal(json.status, "ok");
});

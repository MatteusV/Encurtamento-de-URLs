"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/routes.ts
var routes_exports = {};
__export(routes_exports, {
  router: () => router
});
module.exports = __toCommonJS(routes_exports);

// src/lib/postgres.ts
var import_postgres = __toESM(require("postgres"));
var sql = (0, import_postgres.default)("postgresql://docker:docker@localhost:5432/short-links");

// src/routes/redirect-url.ts
var import_zod = __toESM(require("zod"));

// src/lib/redis.ts
var import_redis = require("redis");
var redis = (0, import_redis.createClient)({
  url: "redis://:docker@localhost:6379",
  database: 0
});
redis.connect();

// src/routes/redirect-url.ts
async function redirectUrl(request, reply) {
  const getLinkSchema = import_zod.default.object({
    code: import_zod.default.string().min(3)
  });
  const { code } = getLinkSchema.parse(request.params);
  const result = await sql`
    SELECT id, original_url FROM short_links WHERE code = ${code}
  `;
  if (result.length === 0) {
    return reply.status(400).send({ message: "Link not found" });
  }
  const link = result[0];
  await redis.zIncrBy("metrics", 1, String(link.id));
  return reply.redirect(301, link.original_url);
}

// src/routes/fetch-links.ts
async function fetchLinks(_, reply) {
  const links = await sql`
  SELECT * FROM short_links ORDER BY created_at DESC
`;
  return reply.status(200).send({ links });
}

// src/routes/create-link-short.ts
var import_postgres4 = require("postgres");
var import_zod2 = __toESM(require("zod"));
async function createLinkShort(request, reply) {
  const createLinkSchema = import_zod2.default.object({
    code: import_zod2.default.string().min(3),
    url: import_zod2.default.string().url()
  });
  const { code, url } = createLinkSchema.parse(request.body);
  try {
    const result = await sql`
    INSERT INTO short_links (code, original_url) VALUES (${code}, ${url}) RETURNING id
  `;
    const link = result[0];
    return reply.status(201).send({ shortLinkId: link.id });
  } catch (error) {
    if (error instanceof import_postgres4.PostgresError) {
      if (error.code === "23505") {
        return reply.status(400).send({ message: "Duplicate code" });
      }
    }
  }
}

// src/routes/get-metrics.ts
async function getMetrics() {
  const result = await redis.zRangeByScoreWithScores("metrics", 0, 50);
  const metrics = result.sort((a, b) => b.score - a.score).map((item) => {
    return {
      shortLinkId: Number(item.value),
      clicks: item.score
    };
  });
  return metrics;
}

// src/routes/routes.ts
async function router(app) {
  app.get("/:code", redirectUrl);
  app.get("/api/links", fetchLinks);
  app.get("/api/metrics", getMetrics);
  app.post("/api/links", createLinkShort);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  router
});

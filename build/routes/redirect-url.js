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

// src/routes/redirect-url.ts
var redirect_url_exports = {};
__export(redirect_url_exports, {
  redirectUrl: () => redirectUrl
});
module.exports = __toCommonJS(redirect_url_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  redirectUrl
});

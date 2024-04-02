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

// src/routes/create-link-short.ts
var create_link_short_exports = {};
__export(create_link_short_exports, {
  createLinkShort: () => createLinkShort
});
module.exports = __toCommonJS(create_link_short_exports);
var import_postgres2 = require("postgres");
var import_zod = __toESM(require("zod"));

// src/lib/postgres.ts
var import_postgres = __toESM(require("postgres"));
var sql = (0, import_postgres.default)("postgresql://docker:docker@localhost:5432/short-links");

// src/routes/create-link-short.ts
async function createLinkShort(request, reply) {
  const createLinkSchema = import_zod.default.object({
    code: import_zod.default.string().min(3),
    url: import_zod.default.string().url()
  });
  const { code, url } = createLinkSchema.parse(request.body);
  try {
    const result = await sql`
    INSERT INTO short_links (code, original_url) VALUES (${code}, ${url}) RETURNING id
  `;
    const link = result[0];
    return reply.status(201).send({ shortLinkId: link.id });
  } catch (error) {
    if (error instanceof import_postgres2.PostgresError) {
      if (error.code === "23505") {
        return reply.status(400).send({ message: "Duplicate code" });
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createLinkShort
});

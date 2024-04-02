"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/get-metrics.ts
var get_metrics_exports = {};
__export(get_metrics_exports, {
  getMetrics: () => getMetrics
});
module.exports = __toCommonJS(get_metrics_exports);

// src/lib/redis.ts
var import_redis = require("redis");
var redis = (0, import_redis.createClient)({
  url: "redis://:docker@localhost:6379",
  database: 0
});
redis.connect();

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getMetrics
});

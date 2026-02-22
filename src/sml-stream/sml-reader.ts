import { createBirpc } from "birpc";
import type { ParentFunctions } from "./sml-stream.service";

const rpc = createBirpc<ParentFunctions>(
  {},
  {
    post: (data) => process.send?.(data),
    on: (fn) => process.on("message", fn),
    serialize: (v) => JSON.stringify(v),
    deserialize: (v) => JSON.parse(v),
  },
);

setInterval(() => {
  const value = Math.round(Math.random() * 4000);
  rpc.send({ ts: Date.now(), value, source: "random" });
}, 1000);

import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { createBirpc } from "birpc";
import { fork, ChildProcess } from "child_process";
import { join } from "path";
import { ReplaySubject } from "rxjs";
import { ObisEntry } from "./lib/ObisEntry";

export type ParentFunctions = {
  send: (msg: { ts: number; obisEntries: ObisEntry[] }) => void;
};

@Injectable()
export class SmlStreamService implements OnModuleInit, OnModuleDestroy {
  private child?: ChildProcess;
  private stream = new ReplaySubject<ObisEntry[]>(1);
  private lastValue?: ObisEntry[];
  stream$ = this.stream.asObservable();

  onModuleInit() {
    const child = fork(join(__dirname, "sml-reader.js"));
    this.child = child;
    const parentFunctions: ParentFunctions = {
      send: (msg) => {
        const { obisEntries } = msg;
        this.stream.next(obisEntries);
        this.lastValue = obisEntries;
      },
    };
    createBirpc(parentFunctions, {
      post: (data) => child.send?.(data),
      on: (fn) => child.on("message", fn),
      serialize: (v) => JSON.stringify(v),
      deserialize: (v) => JSON.parse(v),
    });
    this.child.on("exit", (code) => {
      console.error("Worker exited", code);
    });
  }

  onModuleDestroy() {
    this.child?.kill();
  }

  getSample() {
    return this.lastValue;
  }
}

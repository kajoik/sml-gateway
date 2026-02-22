import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { createBirpc } from "birpc";
import { fork, ChildProcess } from "child_process";
import { join } from "path";
import { Subject } from "rxjs";

export type ParentFunctions = {
  send: (msg: { ts: number; value: number; source: "random" }) => void;
};

@Injectable()
export class SmlStreamService implements OnModuleInit, OnModuleDestroy {
  private child?: ChildProcess;
  private stream = new Subject<number>();
  private lastValue?: number;
  stream$ = this.stream.asObservable();

  onModuleInit() {
    const child = fork(join(__dirname, "sml-reader.js"));
    this.child = child;
    const parentFunctions: ParentFunctions = {
      send: (msg) => {
        const { value } = msg;
        this.stream.next(value);
        this.lastValue = value;
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

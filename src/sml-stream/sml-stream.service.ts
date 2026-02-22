import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { fork, ChildProcess } from "child_process";
import { join } from "path";
import { Subject } from "rxjs";

@Injectable()
export class SmlStreamService implements OnModuleInit, OnModuleDestroy {
  private child?: ChildProcess;
  private stream = new Subject<number>();
  private lastValue?: number;
  stream$ = this.stream.asObservable();

  onModuleInit() {
    // TODO: Use something like comlink for typesafe communication
    this.child = fork(join(__dirname, "sml-reader.js"));
    this.child.on("message", (msg: unknown) => {
      if (
        typeof msg === "object" &&
        msg !== null &&
        msg.hasOwnProperty("value") &&
        typeof (msg as any).value === "number"
      ) {
        this.stream.next((msg as any).value);
        this.lastValue = (msg as any).value;
      }
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

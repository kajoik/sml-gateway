import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { Subscription } from "rxjs";
import { SmlStreamService } from "./sml-stream.service";

@Injectable()
@WebSocketGateway()
export class SmlStreamGateway implements OnGatewayDisconnect, OnModuleDestroy {
  @WebSocketServer()
  server!: Server;

  // fixed room name (clients can join this room to receive live updates)
  private readonly room = "sml-room";

  // track which sockets have subscribed so we can keep a subscriber count
  private subscribers = new Map<string, boolean>();
  private subscribedCount = 0;

  private streamSub?: Subscription;

  constructor(private readonly smlStreamService: SmlStreamService) {}

  private ensureStreamSubscription() {
    if (!this.streamSub) {
      this.streamSub = this.smlStreamService.stream$.subscribe((value) => {
        this.server.to(this.room).emit("sample", { type: "sample", value });
      });
    }
  }

  private cleanupStreamSubscriptionIfNeeded() {
    if (this.subscribedCount === 0) {
      this.streamSub?.unsubscribe();
      this.streamSub = undefined;
    }
  }

  @SubscribeMessage("subscribeSamples")
  handleSubscribe(@ConnectedSocket() client: Socket): { ok: true } {
    if (!this.subscribers.get(client.id)) {
      client.join(this.room);
      this.subscribers.set(client.id, true);
      this.subscribedCount++;
      this.ensureStreamSubscription();
    }
    return { ok: true };
  }

  @SubscribeMessage("unsubscribeSamples")
  handleUnsubscribe(@ConnectedSocket() client: Socket): { ok: true } {
    if (this.subscribers.get(client.id)) {
      client.leave(this.room);
      this.subscribers.set(client.id, false);
      this.subscribedCount = Math.max(0, this.subscribedCount - 1);
      this.cleanupStreamSubscriptionIfNeeded();
    }
    return { ok: true };
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const wasSubscribed = this.subscribers.get(client.id);
    if (wasSubscribed) {
      this.subscribedCount = Math.max(0, this.subscribedCount - 1);
    }
    this.subscribers.delete(client.id);
    this.cleanupStreamSubscriptionIfNeeded();
  }

  onModuleDestroy() {
    this.streamSub?.unsubscribe();
    this.subscribers.clear();
    this.subscribedCount = 0;
  }
}

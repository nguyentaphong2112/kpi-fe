import {Injectable, OnDestroy} from "@angular/core";
import {CompatClient, Stomp, StompSubscription} from "@stomp/stompjs";
import {Task} from "@angular/compiler-cli/ngcc/src/execution/tasks/api";
import {STORAGE_NAME} from "@core/constant/system.constants";
import {environment} from "@env/environment";
import {StorageService} from "@core/services/storage.service";



export type ListenerCallBack = (message: any) => void;

@Injectable({
  providedIn: 'root'
})
export class WsService implements OnDestroy {

  static connection: CompatClient | undefined = undefined;

  private subscription: StompSubscription | undefined;

  constructor() {
    WsService.connection = Stomp.client(environment.backend.websocket);
  }

  static onConnect(token: string) {
    WsService.connection.connect({Authorization: token}, () => {});
  }

  public send(task: Task): void {
    if (WsService.connection && WsService.connection.connected) {
      WsService.connection.send('/dashboard/add_new_task', {}, JSON.stringify(task));
    }
  }

  public listen(fun: ListenerCallBack): void {
    if (WsService.connection) {
      WsService.connection.connect({Authorization: StorageService.get(STORAGE_NAME.ACCESS_TOKEN)}, () => {
        this.subscription = WsService.connection?.subscribe('/tasks/added_task', message => fun(JSON.parse(message.body)));
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
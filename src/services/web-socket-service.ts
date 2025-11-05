import { WebSocketService } from "typescript-toolkit"

export class GameoutWebSocket extends WebSocketService {
    protected getConnectionUrl(): string {
        return "http://localhost:8081/ws/"
    }
}

export const webSocketService = new WebSocketService()

webSocketService.connect()

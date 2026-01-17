import { WebSocketService } from "typescript-toolkit"
import Cookies from 'js-cookie';
import { env, envWs } from "../environment"

export class GameoutWebSocket extends WebSocketService {

    protected getConnectionUrl(): string {
        document.cookie = `type=web; path=/; SameSite=None; Secure`
        document.cookie = `token=${Cookies.get('token')}; path=/; SameSite=None; Secure`

        return envWs
    }

    protected webSocketErrorCallback(error: any): void {
        console.log('Connection lost, resetting URL for reconnection...')
        console.error(error)

        super.webSocketErrorCallback(error)
    }
}

export const webSocketService = new GameoutWebSocket()

window.onload = async () => {
    webSocketService.connect()
}



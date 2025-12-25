import { WebSocketService } from "typescript-toolkit"
import Cookies from 'js-cookie';
import { env } from "../environment"

export class GameoutWebSocket extends WebSocketService {
    private connectionUrl: string = ""
    private isRequestingUrl: boolean = false

    protected async requestUrl(): Promise<void> {
        if (this.isRequestingUrl) {
            return
        }

        this.isRequestingUrl = true

        try {
            const token = Cookies.get('token');

            const response = await fetch(`${env}/api/websocket/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            console.log('WebSocket URL response:', data)

            if (data.success && data.data?.url) {
                const backendUrl = new URL(env)
                const protocol = backendUrl.protocol === 'https:' ? 'wss:' : 'ws:'
                const host = backendUrl.host
                const path = data.data.url

                console.log('Constructed WebSocket URL:', `${protocol}//${host}${path}`)

                this.connectionUrl = `${protocol}//${host}${path}`

                document.cookie = `x-token-invite=${data.data.token}; path=/; SameSite=None; Secure`
                document.cookie = `type=web; path=/; SameSite=None; Secure`
                document.cookie = `id=${Cookies.get('id')}; path=/; SameSite=None; Secure`
            }
            else {
                console.error('Failed to get WebSocket URL from backend')
            }
        }
        catch (error) {
            console.error('Error requesting WebSocket URL:', error)
        }
        finally {
            this.isRequestingUrl = false
        }
    }

    protected getConnectionUrl(): string {
        if (!this.connectionUrl || this.connectionUrl.trim() === "") {
            this.requestUrl()
        }

        return this.connectionUrl
    }

    protected webSocketErrorCallback(error: any): void {
        if (error.code === 1002 || error.code === 1003) {
            console.log('Connection lost, resetting URL for reconnection...')

            this.connectionUrl = ""
        }

        super.webSocketErrorCallback(error)
    }
}

export const webSocketService = new GameoutWebSocket()

window.onload = async () => {
    webSocketService.connect()
}



import { cookiesService } from './cookies-service'

export type WebSocketEventHandler<T> = (data: WebSocketRequest<T>) => boolean | void

export interface WebSocketRequest<T = any> {
    Event: string
    Body?: T
}

export interface WebSocketError {
    code: number
    message: string
    details?: any
}

export enum WebSocketErrorCode {
    INVALID_MESSAGE = 1001,
    CONNECTION_FAILED = 1002,
    UNEXPECTED_CLOSE = 1003,
    UNKNOWN = 1999
}

export class WebSocketService {
    private static instance: WebSocketService
    private socket: WebSocket | null = null
    private reconnectTimeout: any
    private readonly url: string
    private listeners: Map<string, WebSocketEventHandler<any>[]> = new Map()

    public constructor() {
        this.url = this.getConnectionUrl()
    }

    public static getInstance(): WebSocketService {
        if (!this.instance) this.instance = new WebSocketService()
        return this.instance
    }

    public connect(): void {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) return

        try {
            this.socket = new WebSocket(this.url)

            this.socket.onopen = () => {
                console.log('WebSocket connected at ' + this.url)
            }

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    const handlers = this.listeners.get(data.Event)

                    if(handlers === undefined) {
                        return ;
                    }

                    for (let index = 0; index < handlers.length; index++) {
                        console.log('WebSocket event received: ' + data.Event);
                        const element = handlers[index];
                        const result = element(data);

                        if(result === false) {
                            break;
                        }
                    }

                } catch (err) {
                    this.handleError({
                        code: WebSocketErrorCode.INVALID_MESSAGE,
                        message: 'Failed to parse incoming WebSocket message.',
                        details: err
                    })
                }
            }

            this.socket.onerror = (err) => {
                this.handleError({
                    code: WebSocketErrorCode.CONNECTION_FAILED,
                    message: 'WebSocket connection error.',
                    details: err
                })
            }

            this.socket.onclose = () => {
                this.handleError({
                    code: WebSocketErrorCode.UNEXPECTED_CLOSE,
                    message: 'WebSocket connection closed unexpectedly. Retrying in 5 seconds...'
                })

                this.reconnectTimeout = setTimeout(() => this.connect(), this.getReconnectionDelay())
            }
        } catch (err) {
            this.handleError({
                code: WebSocketErrorCode.CONNECTION_FAILED,
                message: 'Failed to establish WebSocket connection.',
                details: err
            })
        }
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.onclose = null
            this.socket.close()
            clearTimeout(this.reconnectTimeout)
            this.socket = null
            console.log('WebSocket disconnected.')
        }
    }

    public send<T = any>(event: string, body?: T): void {
        const message = JSON.stringify({ Event: event, Body: body })
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message)
        } else {
            this.handleError({
                code: WebSocketErrorCode.CONNECTION_FAILED,
                message: 'WebSocket is not connected. Unable to send message.'
            })
        }
    }

    public on<T = any>(event: string, handler: WebSocketEventHandler<T>): void {
        const existing = this.listeners.get(event) || []
        existing.push(handler as WebSocketEventHandler<any>)
        this.listeners.set(event, existing)
    }

    public off<T = any>(event: string, handler: WebSocketEventHandler<T>): void {
        const existing = this.listeners.get(event)
        if (existing) this.listeners.set(event, existing.filter(h => h !== handler))
    }

    protected handleError(error: WebSocketError): void {
        console.error(`[WebSocketError ${error.code}]: ${error.message}`, error.details ?? '')
        this.webSocketErrorCallback(error)
    }

    private getConnectionUrl(): string {
        return "http://localhost:8081/ws/"
    }

    protected getReconnectionDelay(): number {
        return 5000
    }

    protected webSocketErrorCallback(error: WebSocketError): void { }
}

export const webSocketService = new WebSocketService()
webSocketService.connect()

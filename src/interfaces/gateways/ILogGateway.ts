export interface ILogGateway {
    log(logmessage: Record<string, unknown>): Promise<void>
}

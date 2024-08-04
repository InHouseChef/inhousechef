export {}
declare global {
    interface ExceptionDetail {
        type: string
        message: string
        raw: string
        stackFrames: any[]
    }

    interface Exception {
        status: number
        type: string
        title: string
        detail: string
        exceptionDetails: ExceptionDetail[]
        traceId: string
    }

    export interface Jwt {
        aud: string
        iss: string
        type: string
        sub: string
        iat: number
        exp: number
    }
}

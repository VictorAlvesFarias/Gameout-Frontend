export interface IAppFileResponse {
    name: string;
    path: string;
    versionControl: boolean;
    observer: boolean;
    id: number;
    createDate: string;
    updateDate: string;
    autoValidateSync: boolean;
    userId: string;
    status: number;
    statusDetails?: string;
    statusMessage?: string;
}

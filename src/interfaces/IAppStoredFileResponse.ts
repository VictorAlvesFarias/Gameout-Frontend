export interface IAppStoredFileResponse {
    id: number;
    name: string;
    path: string;
    appFileId: number;
    storedFileId?: number;
    createDate: string;
    updateDate: string;
    userId: string;
    versioned: boolean;
    sizeInBytes?: number;
    status: number;
    statusDetails?: string;
    statusMessage?: string;
}

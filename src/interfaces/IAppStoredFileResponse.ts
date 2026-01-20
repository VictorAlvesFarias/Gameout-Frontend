export interface IAppStoredFileResponse {
    id: number;
    appFileId: number;
    storedFileId?: number;
    createDate: string;
    updateDate: string;
    userId: string;
    sizeInBytes?: number;
}

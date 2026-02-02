export interface IAppStoredFileResponse {
    id: number;
    appFileId: number;
    storedFileId?: number;
    status: number; // Error=1, Uploading=2, Complete=3
    createDate: string;
    updateDate: string;
    userId: string;
    sizeInBytes?: number;
}

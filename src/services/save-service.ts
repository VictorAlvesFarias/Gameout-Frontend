import axios from "axios";
import { env } from "../environment";
import { BaseHttpService, catchErrors, IBaseHttpResponseApi } from "typescript-toolkit";
import { toast } from "react-toastify";
import { AUTH } from "../config/auth-config";

interface IAppFileRequest {
    name: string;
    path: string;
    versionControl: boolean;
    observer: boolean;
    autoValidateSync: boolean;
}

interface IAppFile {
    name: string;
    path: string;
    versionControl: boolean;
    observer: boolean;
    id: number;
    createDate: string;
    updateDate: string;
    synced: boolean;
    autoValidateSync: boolean;
    userId: string;
    status: number;
    statusDetails?: string;
    statusMessage?: string;
}

interface IStoredFile {
    mimeType: string
    base64: string
    name: string
    id: number
    sizeInBytes: number
    createDate: string
    updateDate: string
    userId: string
}

interface IAppStoredFile {
    id: number
    name: string
    path: string
    appFileId: number
    storedFileId: number
    createDate: string
    updateDate: string
    userId: string
    versioned: boolean
    message?: string
    sizeInBytes: number
    status: number
    statusDetails?: string
    statusMessage?: string
}

class SaveService extends BaseHttpService {
    constructor() {
        super(() => ({
            config: () => ({
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH.DEFAULT_AUTHORIZATION_TOKEN()
                },
            }),
            catch: (error) => {
                catchErrors(error, (e, m) => {
                    toast.error(m)
                })

                return error
            }
        }))
    }

    public async add(data: IAppFileRequest) {
        const result = this.post<IBaseHttpResponseApi<IAppFile>>({ api: env, href: "/upload-file" }, data)
        result.then(() => {
            toast.success("File added successfully")
        })
        return result;
    }

    public async update(data: IAppFileRequest, id: number) {
        const result = this.put<IBaseHttpResponseApi<IAppFile>>({ api: env, href: "/update-file", params: { id: id } }, data)
        return result;
    }

    public async syncSave(id: any) {
        const result = this.delete({ api: env, href: "/delete-email-address", params: { id: id } })

        return result;
    }

    public async remove(params: any) {
        const result = this.delete({ api: env, href: "/delete-file", params: params })
        result.then(() => {
            toast.success("File deleted successfully")
        })
        return result;
    }

    public async removeStoredFile(params: any) {
        const result = this.delete({ api: env, href: "/delete-stored-file", params: params })
        result.then(() => {
            toast.success("Stored file deleted successfully")
        })
        return result;
    }

    public async getAll() {
        const response = await this.get<IBaseHttpResponseApi<IAppFile[]>>({ api: env, href: "/get-files" })
        return response
    }

    public async getStoredFiles(params: any) {
        const response = await this.get<IBaseHttpResponseApi<IAppStoredFile[]>>({ api: env, href: "/get-stored-files", params: params })
        return response
    }

    public async singleSync(idAppFile: number) {
        const response = this.post<IBaseHttpResponseApi<any>>({ api: env, href: "/single-sync", params: { idAppFile } }, {})
        response.then(() => {
            toast.success("Sync request sent successfully")
        })
        return response
    }

    public async getById(params: any) {
        const response = await this.get<IBaseHttpResponseApi<IAppFile>>({ api: env, href: "/get-email-address-by-id", params: params })
        return response
    }

    public async download(params: any, name: string) {
        const response = await this.get<Blob>({ api: env, href: "/download-file", params: params }, { responseType: 'blob' })

        const blob = new Blob([response])
        const url = URL.createObjectURL(blob)

        const fileName = `${name}.zip`
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()

        URL.revokeObjectURL(url)
        
        toast.success("File downloaded successfully")
    }

    public async reprocessFile(appStoredFileId: number) {
        const response = this.post<IBaseHttpResponseApi<any>>({ api: env, href: "/reprocess-file", params: { appStoredFileId } }, {})
        response.then(() => {
            toast.success("File marked for reprocessing successfully")
        })
        return response
    }

    public async deleteFileWithError(appStoredFileId: number) {
        const response = this.delete<IBaseHttpResponseApi<any>>({ api: env, href: "/delete-file-with-error", params: { appStoredFileId } })
        response.then(() => {
            toast.success("File with error deleted successfully")
        })
        return response
    }

    public async checkProcessingStatus(appStoredFileId: number) {
        const response = this.post<IBaseHttpResponseApi<any>>({ api: env, href: "/check-stored-file-status" }, { appStoredFileId })
        response.then(() => {
            toast.success("Status check initiated successfully")
        })
        return response
    }

    public async validateStatus(appFileId: number) {
        const response = this.get<IBaseHttpResponseApi<any>>({ api: env, href: "/validate-status", params: { appFileId } })
        response.then(() => {
            toast.success("Status validation requested successfully")
        })
        return response
    }
}

const saveService = new SaveService()

export {
    SaveService,
    saveService,
    IAppFileRequest,
    IAppFile,
    IStoredFile,
    IAppStoredFile
}

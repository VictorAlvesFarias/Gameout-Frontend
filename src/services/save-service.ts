import axios from "axios";
import { env } from "../environment";
import { BaseService } from "./base-service";
import { IBaseResponseApi } from "../interfaces/shared/base-response-api";

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
    processing: boolean
    versioned: boolean
    message?: string
    error: boolean
    sizeInBytes: number
}

class SaveService extends BaseService {
    public async add(data: IAppFile) {
        const result = this.post<IBaseResponseApi<IAppFile>>({ api: env, href: "/upload-file" }, data)

        return result;
    }

    public async update(data: IAppFile, id: number) {
        const result = this.put<IBaseResponseApi<IAppFile>>({ api: env, href: "/update-file", params: { id: id } }, data)

        return result;
    }

    public async syncSave(id: any) {
        const result = this.delete({ api: env, href: "/delete-email-address", params: { id: id } })

        return result;
    }

    public async remove(params: any) {
        const result = this.delete({ api: env, href: "/delete-file", params: params })

        return result;
    }

    public async removeStoredFile(params: any) {
        const result = this.delete({ api: env, href: "/delete-stored-file", params: params })

        return result;
    }

    public async getAll() {
        const response = await this.get<IBaseResponseApi<IAppFile[]>>({ api: env, href: "/get-files" })
        return response
    }

    public async getStoredFiles(params: any) {
        const response = await this.get<IBaseResponseApi<IAppStoredFile[]>>({ api: env, href: "/get-stored-files", params: params })
        return response
    }

    public async singleSync(idAppFile: number) {
        const response = await this.post<IBaseResponseApi<any>>({ api: env, href: "/single-sync", params: { idAppFile } }, {})
        return response
    }

    public async getById(params: any) {
        const response = await this.get<IBaseResponseApi<IAppFile>>({ api: env, href: "/get-email-address-by-id", params: params })
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
    }

    public async reprocessFile(appStoredFileId: number) {
        const response = await this.post<IBaseResponseApi<any>>({ api: env, href: "/reprocess-file", params: { appStoredFileId } }, {})
        return response
    }

    public async deleteFileWithError(appStoredFileId: number) {
        const response = await this.delete<IBaseResponseApi<any>>({ api: env, href: "/delete-file-with-error", params: { appStoredFileId } })
        return response
    }

    public async checkProcessingStatus(appStoredFileId: number) {
        const response = await this.get<IBaseResponseApi<any>>({ api: env, href: "/check-processing-status", params: { appStoredFileId } })
        return response
    }

    public async validateStatus(appFileId: number) {
        const response = await this.get<IBaseResponseApi<any>>({ api: env, href: "/validate-status", params: { appFileId } })
        return response
    }
}

const saveService = new SaveService()

export {
    SaveService,
    saveService,
    IAppFile,
    IStoredFile,
    IAppStoredFile
}

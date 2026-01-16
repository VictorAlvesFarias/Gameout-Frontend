import { env } from "../environment";
import { BaseHttpService, catchErrors, IBaseHttpResponseApi } from "typescript-toolkit";
import { toast } from "react-toastify";
import { AUTH } from "../config/auth-config";
import { IAppFileRequest } from "../interfaces/IAppFileRequest";
import { IAppFileResponse } from "../interfaces/IAppFileResponse";
import { IAppStoredFileResponse } from "../interfaces/IAppStoredFileResponse";
import { ICheckAppFileStatusRequest } from "../interfaces/ICheckAppFileStatusRequest";
import { ICheckAppStoredFileStatusRequest } from "../interfaces/ICheckAppStoredFileStatusRequest";
import { IAppFileSyncRequest } from "../interfaces/IAppFileSyncRequest";

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
                try {
                    let errors = error.response.data.errors

                    if (Array.isArray(errors)) {
                        errors.forEach(e =>
                            toast.error(e.message)
                        );
                    }
                    else {
                        const keys = Object.keys(errors);
                        const values = keys.map((key) => errors[key]);

                        values.flatMap((item) => {
                            return item.map((error: any) => toast.error(error.message));
                        });
                    }
                }
                catch {
                    toast.error("An unexpected error occurred")
                }

                return error
            }
        }))
    }

    public async add(data: IAppFileRequest) {
        const result = this.post<IBaseHttpResponseApi<IAppFileResponse>>({ api: env, href: "/upload-file" }, data)

        result.then(() => {
            toast.success("File added successfully")
        })

        return result;
    }

    public async update(data: IAppFileRequest, id: number) {
        const result = this.put<IBaseHttpResponseApi<IAppFileResponse>>({ api: env, href: "/update-file", params: { id: id } }, data)

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
        const response = await this.get<IBaseHttpResponseApi<IAppFileResponse[]>>({ api: env, href: "/get-files" })

        return response
    }

    public async getStoredFiles(params: any) {
        const response = await this.get<IBaseHttpResponseApi<IAppStoredFileResponse[]>>({ api: env, href: "/get-stored-files", params: params })

        return response
    }

    public async singleSync(request: IAppFileSyncRequest) {
        const response = this.post<IBaseHttpResponseApi<any>>({ api: env, href: "/single-sync" }, request)

        response.then(() => {
            toast.success("Sync request sent successfully")
        })

        return response
    }

    public async getById(params: any) {
        const response = await this.get<IBaseHttpResponseApi<IAppFileResponse>>({ api: env, href: "/get-email-address-by-id", params: params })

        return response
    }

    public async download(params: any, name: string) {
        console.log("Downloading file with params:", params);

        try {
            // Generate signed URL through authenticated endpoint
            const response = await this.get<IBaseHttpResponseApi<string>>({
                api: env,
                href: "/generate-download-url",
                params: params
            })

            if (!response || !response.data) {
                toast.error("Failed to generate download URL")
                return
            }

            // Trigger browser native download using signed URL (no auth headers needed)
            window.location.href = response.data

            toast.success("Download started")
        } catch (error) {
            console.error("Download error:", error)
            toast.error("Failed to download file")
        }
    }

    public async reprocessFile(appStoredFileId: number) {
        const response = this.post<IBaseHttpResponseApi<any>>({ api: env, href: "/reprocess-file", params: { appStoredFileId } }, {})

        response.then(() => {
            toast.success("File marked for reprocessing successfully")
        })

        return response
    }

    public async deleteFileWithError(appStoredFileId: number) {
        const response = this.delete<IBaseHttpResponseApi<any>>({ api: env, href: "/delete-stored-file", params: { id: appStoredFileId } })

        response.then(() => {
            toast.success("File with error deleted successfully")
        })

        return response
    }

    public async checkProcessingStatus(request: ICheckAppStoredFileStatusRequest) {
        const response = this.post<IBaseHttpResponseApi<any>>({ api: env, href: "/check-stored-file-status" }, request)

        response.then(() => {
            toast.success("Status check initiated successfully")
        })

        return response
    }

    public async checkAppFileStatus(request: ICheckAppFileStatusRequest) {
        const response = this.post<IBaseHttpResponseApi<any>>({ api: env, href: "/check-app-file-status" }, request)

        response.then(() => {
            toast.success("Status check initiated for file")
        })

        return response
    }

    public async deleteSoftDeletedItems() {
        const response = this.delete<IBaseHttpResponseApi<any>>({ api: env, href: "/delete-soft-deleted-items" })

        response.then(() => {
            toast.success("🗑️ All items from trash have been permanently removed")
        })

        return response
    }
}

export const saveService = new SaveService();


import { BaseHttpService, catchErrors, IBaseHttpResponseApi } from "typescript-toolkit";
import { env } from "../environment";
import { AUTH } from "../config/auth-config";
import { toast } from "react-toastify";

enum AppFileActionType {
    InsertFile = 0,
    UpdateFile = 1,
    DeleteFile = 2,
    DeleteStoredFile = 3,
    DownloadFile = 4,
    RequestSync = 5,
    SingleSync = 6,
    StreamAssigned = 7,
    ProcessingCompleted = 8,
    ProcessingFailed = 9
}

interface IAppFileLog {
    id: number;
    appFileId?: number;
    appStoredFileId?: number;
    storedFileId?: number;
    path: string;
    recordName: string;
    actionMessage: string;
    actionType: AppFileActionType;
    createDate: string;
    updateDate: string;
    userId: string;
}

interface IAppFileLogFilter {
    appFileId?: number;
    appStoredFileId?: number;
    storedFileId?: number;
    actionType?: AppFileActionType;
    startDate?: string;
    endDate?: string;
    userId?: string;
    page?: number;
    pageSize?: number;
}

class LogService extends BaseHttpService {
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

    public async getAll(filters?: IAppFileLogFilter) {
        const response = await this.get<IBaseHttpResponseApi<IAppFileLog[]>>({
            api: env,
            href: "/api/AppFileLog",
            params: filters
        });
        return response;
    }

    public async getByFile(appFileId: number, page: number = 1, pageSize: number = 50) {
        const response = await this.get<IBaseHttpResponseApi<IAppFileLog[]>>({
            api: env,
            href: `/api/AppFileLog/by-file/${appFileId}`,
            params: { page, pageSize }
        });
        return response;
    }

    public async getByAction(actionType: AppFileActionType, page: number = 1, pageSize: number = 50) {
        const response = await this.get<IBaseHttpResponseApi<IAppFileLog[]>>({
            api: env,
            href: `/api/AppFileLog/by-action/${actionType}`,
            params: { page, pageSize }
        });
        return response;
    }
}

const logService = new LogService();

export {
    LogService,
    logService,
    IAppFileLog,
    IAppFileLogFilter,
    AppFileActionType
};

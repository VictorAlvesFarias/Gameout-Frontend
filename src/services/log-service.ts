import { env } from "../environment";
import { BaseService } from "./base-service";
import { IBaseResponseApi } from "../interfaces/shared/base-response-api";

export enum AppFileActionType {
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

export interface IAppFileLog {
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

export interface IAppFileLogFilter {
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

class LogService extends BaseService {
    public async getAll(filters?: IAppFileLogFilter) {
        const response = await this.get<IBaseResponseApi<IAppFileLog[]>>({ 
            api: env, 
            href: "/api/AppFileLog", 
            params: filters 
        });
        return response;
    }

    public async getByFile(appFileId: number, page: number = 1, pageSize: number = 50) {
        const response = await this.get<IBaseResponseApi<IAppFileLog[]>>({ 
            api: env, 
            href: `/api/AppFileLog/by-file/${appFileId}`, 
            params: { page, pageSize } 
        });
        return response;
    }

    public async getByAction(actionType: AppFileActionType, page: number = 1, pageSize: number = 50) {
        const response = await this.get<IBaseResponseApi<IAppFileLog[]>>({ 
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
    IAppFileLogFilter
};

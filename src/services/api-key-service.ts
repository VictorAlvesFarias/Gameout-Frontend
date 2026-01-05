import { env } from "../environment";
import { BaseHttpService, catchErrors, IBaseHttpResponseApi } from "typescript-toolkit";
import { toast } from "react-toastify";
import { AUTH } from "../config/auth-config";

class ApiKeyService extends BaseHttpService {
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

    public async generateApiKey() {
        const response = this.post<IBaseHttpResponseApi<string>>({ api: env, href: "/api/apikey/generate" }, {})
        return await response
    }

    public async getCurrentApiKey() {
        const response = await this.get<IBaseHttpResponseApi<string>>({ api: env, href: "/api/apikey/current" })
        return response
    }
}

const apiKeyService = new ApiKeyService()

export {
    ApiKeyService,
    apiKeyService
}


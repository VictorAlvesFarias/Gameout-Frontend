import { env } from "../environment";
import { BaseHttpService, catchErrors, IBaseHttpResponseApi } from "typescript-toolkit";
import Cookies from "js-cookie";

class DriverService extends BaseHttpService {
  constructor() {
    super(() => ({
      config: () => ({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token') ?? ''}`
        },
      }),
      catch: (error) => {
        return error
      }
    }))
  }

  public async checkDriverStatus() {
    const result = this.post<IBaseHttpResponseApi<boolean>>({ api: env, href: "/driver-is-connected", params: {} }, {})

    return result;
  }
}

const driverService = new DriverService()

export {
  DriverService,
  driverService
}

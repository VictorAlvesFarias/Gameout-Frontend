import { env } from "../environment";
import { BaseHttpService, catchErrors, IBaseHttpResponseApi } from "typescript-toolkit";
import { toast } from "react-toastify";
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

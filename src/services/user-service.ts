import { env } from "../environment";
import { BaseHttpService, catchErrors } from "typescript-toolkit";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export interface IUser {
  id: string;
  name: string;
  email: string;
  username: string;
  createDate: string;
}

export interface IUpdateUserRequest {
  name?: string;
  email?: string;
  username?: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class UserService extends BaseHttpService {
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

  public async getCurrentUser() {
    const result = this.get<{ data: IUser }>({ api: env, href: "/get-current-user", params: {} })

    return result;
  }

  public async updateUser(data: IUpdateUserRequest) {
    const result = this.put<{ success: boolean }>({ api: env, href: "/update-account", params: {} }, data)

    return result;
  }

  public async changePassword(data: IChangePasswordRequest) {
    const result = this.post<{ success: boolean }>({ api: env, href: "/change-password", params: {} }, {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword
    })

    return result;
  }
}

const userService = new UserService()

export {
  UserService,
  userService
}


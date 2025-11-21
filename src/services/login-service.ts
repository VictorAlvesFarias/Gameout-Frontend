import axios from "axios";
import { env } from "../environment";
import { BaseHttpService, catchErrors } from "typescript-toolkit";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

class LoginService extends BaseHttpService {
  constructor() {
    super(() => ({
      config: () => ({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token') ?? ''}`
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

  public async loginPost(data: { accessKey: string; password: string; }) {
    const result = this.post<any>({ api: env, href: "/sign-in", params: {} }, {
      accessKey: data.accessKey,
      password: data.password
    }).then(({ data }) => {

      const keys = Object.keys(data)

      keys.forEach(e => {
        if (typeof data[e] == "object") {
          Cookies.set(e, JSON.stringify(data[e]), { expires: Number(data.expirationTimetoken) })
        }
        else {
          Cookies.set(e, data[e], { expires: Number(data.expirationTimetoken) })
        }
      })

      return data
    })

    return result;
  }
  public logout() {
    const keys = Object.keys(Cookies.get())

    keys.forEach(e => {
      Cookies.remove(e)
    })

    window.location.href = '/login'
  }
}

const loginService = new LoginService()

export {
  LoginService,
  loginService
}

import axios from "axios";
import { env } from "../environment";
import { BaseService } from "./base-service";
import Cookies from "js-cookie";

class LoginService extends BaseService {
  public async loginPost(req: any) {
    const result = this.post<any>({ api: env, href: "/sign-in", params: {} }, req).then(({ data }) => {
      const keys = Object.keys(data)

      console.log(data)

      keys.forEach(e => {
        if (typeof data[e] == "object") {
          Cookies.set(e, JSON.stringify(data[e]), { expires: Number(data.expirationTimeAccessToken) })
        }
        else {
          Cookies.set(e, data[e], { expires: Number(data.expirationTimeAccessToken) })
        }
      })

      Cookies.set("type", "web", { expires: Number(data.expirationTimeAccessToken) })

      return data
    })

    return result;
  }
  public logout() {
    const keys = Object.keys(Cookies.get())
    keys.forEach(e => {
      Cookies.remove(e)
    })
  }
}

const loginService = new LoginService()

export {
  LoginService,
  loginService
}
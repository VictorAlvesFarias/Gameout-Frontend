
import axios from 'axios';
import { env } from '../environment';
import Cookies from 'js-cookie';
import { BaseHttpService, catchErrors } from 'typescript-toolkit';
import { toast } from 'react-toastify';
import { AUTH } from '../config/auth-config';

class SignupService extends BaseHttpService {
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

  async signupPost(data: { email: string; password: string; passwordConfirm: string; }): Promise<any> {
    const result = this.post({ api: env, href: "", params: "" },
      {
        username: data.email,
        password: data.password,
        confirmPassword: data.passwordConfirm
      }
    )
      .then(response => {
        return response
      })
      .catch((error) => {
        throw error
      })

    return await result
  }
}

const signupService = new SignupService()

export {
  SignupService,
  signupService
}
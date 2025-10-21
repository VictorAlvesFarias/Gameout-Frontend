import IClaimsKeys from "./claims";

export interface AuthContextType {
    isAuthenticated?: boolean;
    signIn: (data: any) => Promise<any>;
    logout: () => void;
    permissions?: IClaimsKeys | null
}

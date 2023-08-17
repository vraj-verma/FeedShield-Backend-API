import { Status } from "./account.model";
import { Role } from "./signup.model";

export class AuthUser {
     user_id?: number;
     account_id?: number;
     name?: string;
     user_limit?: number;
     email?: string;
     status?: Status;
     role?: Role;
     created_at?: Date | string;
     password?: string;
     token?: string;
     access?: boolean;
}
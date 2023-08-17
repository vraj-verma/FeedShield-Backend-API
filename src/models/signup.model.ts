import { Status } from "./account.model";

export class Signup {
     user_id?: number;
     account_id?: number;
     name?: string;
     role?: Role;
     email: string;
     password?: string;
     status?: Status;
     created_at?: Date | string;
     joined?: boolean;
}

export enum Role {
     Admin = "Admin",
     Super_Admin = "Super Admin",
     Basic = "Basic"
}
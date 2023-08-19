import { Status } from "./account.model";
import { Role } from "./signup.model";

export class CreateUser {
     account_id?: number;
     name?: string;
     email: string;
     role: Role;
     access?: boolean;
     created_at?: Date | string;
}

export class UpdateUser {
     account_id?: number;
     name?: string;
     role?: Role;
     status?: Status;
     access?: boolean;
     updated_at?: Date | string;
}
import { Status } from "./account.model";
import { Role } from "./signup.model";

export class CreateUser {
     account_id?: number;
     name?: string;
     email: string;
     role: Role;
     access?: boolean;
}

export class UpdateUser {
     account_id?: number;
     name?: string;
     role?: Role;
     status?: Status;
     access?: boolean;
}
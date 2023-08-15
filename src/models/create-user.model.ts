import { Role } from "./signup.model";

export class CreateUser {
     account_id?: number;
     name?: string;
     email: string;
     role: Role;
}
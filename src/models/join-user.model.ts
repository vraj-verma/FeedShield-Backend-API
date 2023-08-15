import { Status } from "./account.model";

export class JoinUser {
     user_id?: number;
     joined?: boolean;
     password?: string;
     confirm_password?: string;
     status: Status;
     created_at: Date;
}
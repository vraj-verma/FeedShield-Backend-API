export class Account {
     account_id?: number;
     user_limit?: number;
     user_used?: number;
     created_at?: Date;
}

export enum Status {
     Active = 'Active',
     Inactive = 'Inactive'
}
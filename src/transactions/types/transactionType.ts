export interface SanitizedUser {
    id: number;
    name: string;
    email: string;
    balance: number;
}

export interface SanitizedTransaction {
    id: number;
    transactionId: string;
    type: string;
    amount: number;
    status: string;
    createdAt: Date;
    sender?: SanitizedUser;
    receiver?: SanitizedUser;
}
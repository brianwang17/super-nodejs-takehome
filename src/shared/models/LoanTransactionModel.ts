import { LoanTransactionTypeEnum } from "../enums";

export interface LoanTransactionModel {
    _id: string,
    disclaimerId: string,
    transactionType: typeof LoanTransactionTypeEnum
    lenders: Array<string>
}
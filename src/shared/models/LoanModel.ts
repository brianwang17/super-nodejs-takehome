import { LoanStatusEnum } from "../enums";

export interface LoanModel {
    _id: string,
    loanAmount: number,
    interestRate: number,
    hasSignedAllDocuments: boolean,
    loanStatus: typeof LoanStatusEnum,
    loanTransactions: Array<string>
}
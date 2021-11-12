// const mongoose = require("mongoose");
import * as mongoose from 'mongoose';
import { 
    LoanStatusEnum,
    LoanTransactionTypeEnum,
    EntityTypeEnum
} from './shared/enums/index'

const Schema = mongoose.Schema;
const Model = mongoose.model;

const LoanSchema: mongoose.Schema = new Schema({
    _id: String,
    loanAmount: Number,
    interestRate: Number,
    hasSignedAllDocuments: Boolean,
    loanStatus: {
        type: String,
        enum: LoanStatusEnum
    },
    loanTransactions: Array // [{one: 1}, {two: 2}]
});

const LoanTransactionSchema: mongoose.Schema = new Schema({
    _id: String,
    disclaimerId: String,
    transactionType: {
        type: String,
        enum: LoanTransactionTypeEnum
    },
    lenders: Array
});

const LenderSchema: mongoose.Schema = new Schema({
    _id: String,
    name: String,
    age: Number,
    gender: String,
    address: String,
    entities: Array
})

const LenderDisclaimerSchema: mongoose.Schema = new Schema({
    _id: String,
    disclaimerSigned: Boolean,
    disclaimerFileLocation: Object
});

const LenderEntitySchema: mongoose.Schema = new Schema({
    _id: String,
    entityType: {
        type: String,
        enum: EntityTypeEnum
    },
    w9Signed: Boolean,
    w9FileLocation: Object
})

// export const loanModel = Model('LoanModel', LoanSchema);
// export const loanTransactionModel = Model('LoanTransactionModel', LoanTransactionSchema);
// export const lenderModel = Model('LenderModel', LenderSchema);
// export const lenderDisclaimerModel = Model('LenderDisclaimerModel', LenderDisclaimerSchema);
// export const lenderEntityModel = Model('LenderEntityModel', LenderEntitySchema);

export const loanModel: mongoose.Model<mongoose.Document<any, any, any>, any, any> = Model('loans', LoanSchema);
export const loanTransactionModel: mongoose.Model<mongoose.Document<any, any, any>, any, any> = Model('loan_transactions', LoanTransactionSchema);
export const lenderModel: mongoose.Model<mongoose.Document<any, any, any>, any, any> = Model('lenders', LenderSchema);
export const lenderDisclaimerModel: mongoose.Model<mongoose.Document<any, any, any>, any, any> = Model('lender_disclaimers', LenderDisclaimerSchema);
export const lenderEntityModel: mongoose.Model<mongoose.Document<any, any, any>, any, any> = Model('lender_entities', LenderEntitySchema);

/*
Model Design
    Loan: {
        id: string,
        Loan Amount: number,
        Interest Rate: number,
        Loan Status: string Enum {
            Draft, Available, Funded, Complete
        },
        Loan Transactions: [
            string, ... (loan_transaction1_id, loan_transaction2_id, ...)
        ]
    }

    Loan Transactions: {
        id: string,
        disclaimerId: string,
        type: string Enum {
            Origination, Sales
        }
        Lenders: [
            string, ... (lender1_id, lender2_id, ...)
        ]
    }

    Lenders: {
        id: string
        name: string
        address: string
        age: number
        Entities: [
            string, ... (entity1_id, entity2_id, ...)
        ]
    }

    Disclaimer: {
        id: string,
        disclaimerFileLocation: string
        ...
    }

    Entities: {
        id: string,
        entityType: string Enum {
            Individual, LLC, Corporation, Retirement Account
        }
        w9FileLocation: string
    }
*/
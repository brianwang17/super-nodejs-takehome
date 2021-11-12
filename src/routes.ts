import * as express from 'express';
import {
    loanModel,
    loanTransactionModel,
    lenderModel,
    lenderDisclaimerModel,
    lenderEntityModel
} from './modelSchemas';
import {
    LoanModel,
    LoanTransactionModel,
    LenderModel,
    LenderDisclaimerModel,
    LenderEntityModel
} from './shared/models'

const appRouter: express.Express = express();
const loanResource = 'loans';
const loanTransactionsResource = 'loantransactions';
const lenderResource = 'lenders';
const lenderDisclaimerResource = 'disclaimers';
const lenderEntityResource = 'entities'


// ##################################################

/**
 * Get All Loans Method
 */
// appRouter.get(`/${loanResource}`, async (request: any, response: any) => {
//     const loans = await loanModel.find({});

//     try {
//         response.send(loans);
//     } catch (err) {
//         response.status(500).send(err);
//     }
// })

/**
 * Get All Loans Method
 */
appRouter.get(`/${loanResource}`, async (request: express.Request, response: express.Response) => {
    let maxLoans: number;
    let sortOrder: number;
    
    // Set defaults
    if (request.query.maxLoans) {
        maxLoans = parseInt(request.query.maxLoans as string, 10);
    } else {
        maxLoans = 5; // default
    }
    
    if (request.query.sortOrder) {
        sortOrder = parseInt(request.query.sortOrder as string, 10);
    } else {
        sortOrder = -1;
    }

    // Fetch MongoDB for all loans with attached filters
    const loans: Array<LoanModel> = await loanModel.find({}).sort({loanAmount: sortOrder}).limit(maxLoans).exec();

    console.log('loans: ', loans);

    for (const loan of loans) {
        const {
            _id: loanId,
            loanTransactions
        } = loan;
        console.log('loan id: ', loanId);
        let hasSignedAllDocuments: boolean = false;

        for (const loanTransactionId of loanTransactions) {
            // I have the loan transaction id for each loan... need to know if disclaimer and w9 are signed..
            // soo.. to get to disclaimer, i need to...
                // query for an existing disclaimer id in LOAN_TRANSACTIONS table
                    // query LENDERS_DISCLAIMERS table by disclaimerId for disclaimerSigned=true/false
            // to get to get to w9, i need to...
                // query LENDERS TABLE for an existing array of entities...
                    // query LENDERS_ENTITIES table by entity_id for w9Signed=true/false

            const { 
                disclaimerId,
                lenders
            }: LoanTransactionModel = await loanTransactionModel.findById(loanTransactionId).exec();
            // FUTURE CAPABILITY -- ROLLBACK on query failure...

            // --- disclaimer check
            const { disclaimerSigned }: LenderDisclaimerModel = await lenderDisclaimerModel.findById(disclaimerId).exec();
            console.log(`disclaimer id: ${disclaimerId}, disclaimer signed: ${disclaimerSigned}`);
            // --- w9 check
            let allW9Signed: boolean = false;
            let previousW9SignedState: boolean = false;
            for (const lender of lenders) {

                const { entities }: LenderModel = await lenderModel.findById(lender);
                for (let entity = 0; entity < entities.length; entity++) {

                    const { w9Signed }: LenderEntityModel = await lenderEntityModel.findById(entities[entity]).exec();
                    console.log(`entity id: ${entities[entity]}, w9 signed: ${w9Signed}`);
                    if (!w9Signed) {
                        console.log(`w9 automatic false, entity id: ${entities[entity]}`);
                        allW9Signed = false;
                        break;
                    } // current returned w9 not signed, assign false and break loop
    
                    if (entity === 0) {
                        previousW9SignedState = w9Signed // initialize currentW9SignedState with first w9Signed result
                    } else if (entity > 0) {
                        allW9Signed = previousW9SignedState && w9Signed; // assign boolean result to allW9Signed
                        previousW9SignedState = w9Signed;
                        console.log(`all w9 signed inside else: ${allW9Signed}`);
                    }
                };
            };

            console.log(`disclaimer signed: ${disclaimerSigned}, all w9 signed: ${allW9Signed}`);
            hasSignedAllDocuments = disclaimerSigned && allW9Signed;
            console.log('has signed all documents: ', hasSignedAllDocuments);
            if (hasSignedAllDocuments) break;
        };

        loan.hasSignedAllDocuments = hasSignedAllDocuments;
    }

    try {
        response.send({loans});
    } catch (err) {
        response.status(500).send(err);
    }
});

export default appRouter;
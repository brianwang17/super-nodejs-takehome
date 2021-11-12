export interface LenderDisclaimerModel {
    _id: string,
    disclaimerSigned: boolean,
    disclaimerFileLocation: {
        filePath: string,
        disclaimerId: string
    }
}
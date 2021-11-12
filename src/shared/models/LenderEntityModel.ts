import { EntityTypeEnum } from "../enums";

export interface LenderEntityModel {
    _id: string,
    entityType: typeof EntityTypeEnum
    w9Signed: boolean,
    w9FileLocation: {
        filePath: string,
        w9Id: string
    }
}
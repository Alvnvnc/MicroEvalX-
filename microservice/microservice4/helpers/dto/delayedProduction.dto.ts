import { BasicItemAttributes } from "../../infrastructure/models/items/basic-item.model"

export type DelayedProductionDTO = {
    pkid: number,
    pdr_id: string,
    item_id: string,
    quantity: number,
    status: string,
    raw_mat_status: boolean,
    Item: BasicItemAttributes,
    createdAt: string,
}

export type NewDelayedProductionDTO = {
    status: string
    item_id: number,
    pdr_id: string,
    quantity: number,
}

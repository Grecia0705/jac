import { Decimal } from "@prisma/client/runtime/library";
import { MachineCompleted } from "./machine.d";
import { ProductsCompleted } from "./product.d";
import { RawMatterCompleted } from "./rawmatter";
import { UserCompleted } from "./user";

export interface ControlCreate {
    date: string,
    productId: string,
    machineId: string,
    rawmatterId: string,
    createId:  string,

    kg: number,
    gr: number,
}

export interface ControlDb extends ControlCreate {
    controlId: string
    create_at: string,
    update_at: string,
    delete_at: string,
}

export interface CompletedControl extends ControlDb {
    machineReference: any | null,
    productReference: any | null,
    rawmatterReference: any | null,
    createReference: any
}

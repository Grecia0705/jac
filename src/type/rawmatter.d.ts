import { UserCompleted } from "./user.d"

export interface RawMatterCreate {
    name: string,
    description: string,
    code: string,
    createId: string,
    kg: number,
    gr: number,
}


export interface RawMatterCompleted extends RawMatterCreate {
    rawmatterId: string,
    createReference: UserCompleted,
    updateAt: string,
    creteAt: string,
    deleteAt: string | null
}

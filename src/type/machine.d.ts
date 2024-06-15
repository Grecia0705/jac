import { UserCompleted } from "./user.d"

export interface MachineCreate {
    name: string,
    description: string,
    createId: string
}

export interface MachineCompleted extends MachineCreate {
    machineId: string,
    createReference: UserCompleted,
    update_at: string,
    crete_at: string,
    delete_at: string | null
}

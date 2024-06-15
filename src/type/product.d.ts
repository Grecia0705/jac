import { UserCompleted } from "./user.d"

export interface ProductCreate {
    name: string,
    description: string,
    createId: string
}

export interface ProductsCompleted extends ProductCreate {
    produtcId: string,
    update_at: string,
    crete_at: string,
    createReference: UserCompleted
    delete_at: string | null
}

import { UserCompleted } from "./user.d"

export interface TypeCreate {
    name: string,
    description: string,
    createId: string
} 

export interface TypeCompleted extends TypeCreate {
    transactionTypeId: string,
    createReference: UserCompleted,

    create_at: string,
    update_at: string,
    delete_at: string
}

export interface CategoryCreate {
    name: string,
    description: string,
    createId: string
} 

export interface CategoryCompleted extends CategoryCreate {
    transactionCategoryId: string,
    createReference: UserCompleted,

    create_at: string,
    update_at: string,
    delete_at: string
}

export interface TransactionCreate {
    categoryId: string,
    typeId: string,
    mount: number,
    description: string,
    date: string,
    createId: string
}

export interface TransactionCompleted extends TransactionCreate {
    transactionId: string,

    categoryReference: UserCompleted,
    typeReference: CategoryCreate,
    createReference: CategoryCompleted,

    create_at: string,
    update_at: string,
    delete_at: string
}



export interface CreateStock {
    description: string,
    quantity: number,
    price: any,
    createId: string,
}

export interface ObjectComplete extends CreateStock {
    create_at: string,
    update_at: string,
    delete_at: string | undefined,
}

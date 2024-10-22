import { CategoryCreate } from "../../type/transaction";
import TrasactionModel from "./TransactionModel";

class CategoryModel extends TrasactionModel {

    constructor () {
        super();
    }

    public async CreateCategory({ data,description,userId }: { data: CategoryCreate,description:string,userId: string }) {
        this.StartPrisma();
        const result = this.prisma.transactionCategory.create({ data });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `transaction.model`,
            objectReference: true,
        });
        this.DistroyPrisma();
        return result;
    }

    public async UpdateCategory({ data, id,description,userId }: {data: CategoryCreate, id: string,description:string,userId: string}) {
        this.StartPrisma();
        const result = this.prisma.transactionCategory.update({ data, where:{transactionCategoryId:id} });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `transaction.model`,
            objectReference: true,
        });
        this.DistroyPrisma();
        return result;
    }

    public async GetCategoryById({ id }: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.transactionCategory.findFirst({ 
            where:{
                transactionCategoryId:id,
                delete_at: false,
            }, 
            include:{
                createReference:true
            }
         });
        this.DistroyPrisma();
        return result;
    }

    public async GetPaginationCategory({ pag, limit }: {pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.transactionCategory.findMany({
            include: {
                createReference: true,
            },
            where: {
                delete_at: false,
            },
            skip: pag*limit,
            take: limit,
        });
        this.DistroyPrisma();
        return result;
    }

    public async CountAllCategory() {
        this.StartPrisma();
        const result = await this.prisma.transactionCategory.count();
        this.DistroyPrisma();
        return result;
    } 

    public async AtDeleteCategory({id,description,userId}:{id:string,description:string,userId: string}) {
        this.StartPrisma();
        await this.prisma.transactionCategory.update({ data:{delete_at:true}, where:{transactionCategoryId:id} });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `transaction.model`,
            objectReference: true,
        });
        this.DistroyPrisma();
        return null
    }
}

export default new CategoryModel;

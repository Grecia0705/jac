import { CategoryCreate } from "../../type/transaction";
import TrasactionModel from "./TransactionModel";

class CategoryModel extends TrasactionModel {

    constructor () {
        super();
    }

    public async CreateCategory({ data }: { data: CategoryCreate }) {
        this.StartPrisma();
        const result = this.prisma.transactionCategory.create({ data });
        this.DistroyPrisma();
        return result;
    }

    public async UpdateCategory({ data, id }: {data: CategoryCreate, id: string}) {
        this.StartPrisma();
        const result = this.prisma.transactionCategory.update({ data, where:{transactionCategoryId:id} });
        this.DistroyPrisma();
        return result;
    }

    public async GetCategoryById({ id }: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.transactionCategory.findFirst({ where:{transactionCategoryId:id}, 
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
}

export default new CategoryModel;

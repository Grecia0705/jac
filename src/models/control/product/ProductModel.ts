import { ProductCreate } from "../../../type/product";
import AbstractModel from "../../BaseModel";

class ProductModel extends AbstractModel {

    constructor () {
        super();
    }

    public async Create({ data }: {data:ProductCreate}) {
        this.StartPrisma();
        const result = await this.prisma.product.create({ data });
        this.DistroyPrisma();
        return result;
    }

    public async Update({ id, data }: {id:string, data:ProductCreate}) {
        this.StartPrisma();
        const result = await this.prisma.product.update({ data, where:{productId:id} });
        this.DistroyPrisma();
        return result;
    }
    
    public async AtDelete({id}:{id:string}) {
        this.StartPrisma();
        await this.prisma.product.update({ data:{delete_at:true}, where:{productId:id} })
        this.DistroyPrisma();
        return null
    }
    
    public async GetPagination({ pag, limit }: {pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.product.findMany({
            where: {
                delete_at: false,
            },
            include: {
                createReference: true
            },
            skip: pag*limit,
            take: limit,
        });
        this.DistroyPrisma();
        return result;
    }

    public async CountAll() {
        this.StartPrisma();
        const result = await this.prisma.product.count();
        this.DistroyPrisma();
        return result;
    } 

    public async GetById({ id }: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.product.findFirst({
            where: {
                productId: id,
                delete_at: false,
            },
            include: {
                createReference: true
            }
        });
        this.DistroyPrisma();
        return result;
    }
}

export default new ProductModel();

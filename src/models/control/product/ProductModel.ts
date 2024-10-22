import { ProductCreate } from "../../../type/product";
import AbstractModel from "../../BaseModel";

class ProductModel extends AbstractModel {

    constructor () {
        super();
    }

    public async Create({ data,description,userId }: {data:ProductCreate,description:string,userId: string}) {
        this.StartPrisma();
        const result = await this.prisma.product.create({ data });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `product`,
            objectReference: true,
        });
        this.DistroyPrisma();
        return result;
    }

    public async Update({ id, data,description,userId }: {id:string, data:ProductCreate,description:string,userId: string}) {
        this.StartPrisma();
        const result = await this.prisma.product.update({ data, where:{productId:id} });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `product`,
            objectReference: true,
        });
        this.DistroyPrisma();
        return result;
    }
    
    public async AtDelete({id,description,userId}:{id:string,description:string,userId: string}) {
        this.StartPrisma();
        await this.prisma.product.update({ data:{delete_at:true}, where:{productId:id} });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `product`,
            objectReference: true,
        });
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

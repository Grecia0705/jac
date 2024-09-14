import { Request, Response } from "express";
import BaseController from "../BaseController";
import ControlModel from "../../models/control/ControlModel";
import TypeModel from "../../models/transacction/TypeModel";
import CategoryModel from "../../models/transacction/CategoryModel";
import TransactionInstance from "../../models/transacction/TransactionModel";
import { OnSession } from "../../middleware/auth";
import { Prisma } from "@prisma/client";
import MachineModel from "../../models/control/machine/MachineModel";
import ProductModel from "../../models/control/product/ProductModel";
import RawmatterModel from "../../models/control/rawmatter/RawmatterModel";

const TransactionModel = new TransactionInstance();

class ReportController extends BaseController {
    public async HandleControlReport(req: Request, res: Response) {
        const skip = req.query.skip ? Number(req.query.skip) : 0; 
        const take = req.query.take ? Number(req.query.take) : 50; 

        const machinePromise = MachineModel.GetPagination({ limit:100,pag:0 });
        const productPromise = ProductModel.GetPagination({ limit:100,pag:0 });
        const rawmatterPromise = RawmatterModel.GetPagination({ limit:100,pag:0 });

        const date = req.query.date ? `${req.query.date}` : ``;
        const machine = req.query.machine ? `${req.query.machine}` : ``;
        const product = req.query.product ? `${req.query.product}` : ``;
        const rawmatter = req.query.rawmatter ? `${req.query.rawmatter}` : ``;

        const renderFilter: {key:string,value:string}[] = [];
        const filter: Prisma.ControlWhereInput[] = [];

        if(machine !== ``) {
            const MachineResult = await MachineModel.GetById({ id:machine });
            if (MachineResult) {
                renderFilter.push({ key:`Maquina`, value:`${MachineResult.name}` });
                filter.push({ machineId:MachineResult.machineId });
            }
        }

        if(product !== ``) {
            const ProductResult = await ProductModel.GetById({ id:product });
            if (ProductResult) {
                renderFilter.push({ key:`Producto`, value:`${ProductResult.name}` });
                filter.push({ productId:ProductResult.productId });
            }
        }

        if(rawmatter !== ``) {
            const RawmatterResult = await RawmatterModel.GetById({ id:rawmatter });
            if (RawmatterResult) {
                renderFilter.push({ key:`Materia Prima`, value:`${RawmatterResult.name}` });
                filter.push({ rawmatterId:RawmatterResult.rawmatterId });
            }
        }
        
        if (date !== ``) {
            renderFilter.push({ key:`Fecha`, value:`${date}` });
            filter.push({ date: { equals:`${date}` } }); 
        }
        
        const machineList = await machinePromise;
        const productList = await productPromise;
        const rawmatterList = await rawmatterPromise;

        const result = await ControlModel.ReportEvent({
            filter: {
                AND: filter
            },
            skip,
            take
        });

        console.log(result.result);

        return res.render(`s/report/control.hbs`, {
            result:result.result,
            count:result.count,
            filter:renderFilter,
            machineList,
            productList,
            rawmatterList
        });
    }

    public async HandleTransactionReport(req: Request, res: Response) {

        const TypePromise = TypeModel.GetPaginationType({ pag:0,limit:50 });
        const CategoryPromise = CategoryModel.GetPaginationCategory({ pag:0,limit:50 });

        const skip = req.query.skip ? Number(req.query.skip) : 0; 
        const take = req.query.take ? Number(req.query.take) : 50; 

        const date = req.query.date ? `${req.query.date}` : ``;
        const month = req.query.month ? `${req.query.month}` : ``;
        const type = req.query.type ? `${req.query.type}` : ``;
        const category = req.query.category ? `${req.query.category}` : ``;

        const renderFilter: {key:string,value:string}[] = [];
        const filter: Prisma.TransactionWhereInput[] = [];
        
        if(type !== ``) {
            const typePromise = await TypeModel.GetTypeById({ id:type });
            if (typePromise) {
                renderFilter.push({ key:`Tipo`, value:`${typePromise.name}` });
                filter.push({ typeId:typePromise.transactionTypeId });
            }
        }

        if(category !== ``) {
            const categoryPromise = await CategoryModel.GetCategoryById({ id:category });
            console.log(categoryPromise);
            if (categoryPromise) {
                renderFilter.push({ key:`Categoria`, value:`${categoryPromise.name}` });
                filter.push({ categoryId:categoryPromise.transactionCategoryId });
            }
        }

        if (month !== ``) {
            renderFilter.push({ key:`Mes`, value:`${month}` });
            filter.push({ date: { contains:`-${month}-` } });
        }

        if (date !== ``) {
            renderFilter.push({ key:`Fecha`, value:`${date}` });
            filter.push({ date: { equals:date } });
        }

        const result = await TransactionModel.ReportTransaction({
            filter: {
                AND: filter
            },
            skip,
            take,
        });

        console.log(result.result);

        return res.render(`s/report/transaction.hbs`, {
            result:result.result,
            count:result.count,
            filter:renderFilter,
            type: await TypePromise,
            category: await CategoryPromise,
        });
    }

    public LoadRouters() {        
        this.router.get(`/report/transaction`, OnSession, this.HandleTransactionReport);
        this.router.get(`/report/control`, OnSession, this.HandleControlReport);

        return this.router;
    }
}

export default new ReportController();

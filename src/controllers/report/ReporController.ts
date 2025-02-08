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
import { pushPdf } from "../../models/pdf/GeneratePDFkit";

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

        const fitlerRender: string[] = [];
        const count = await ControlModel.CountAllBy({ filter:{AND:filter} });
        let pagTake = 20;
        const headers = [``,`Maquina`, `Materia`, `Producto`,`Peso`];
        const rows: string[][] = [];
        
        const machineList = await machinePromise;
        const productList = await productPromise;
        const rawmatterList = await rawmatterPromise;

        do {
            const result = await ControlModel.ReportEvent({
                filter: {
                    AND: filter
                },
                skip:pagTake-20,
                take:pagTake
            });

            result.result.forEach((item,i) => {
                rows.push([
                    `${i+1}`,
                    `${item.machineReference.name}`,
                    `${item.rawmatterReference.name}`,
                    `${item.productReference.name}`,
                    `${item.kg}.${item.gr}`
                ]);
            });

        } while (count>pagTake);


        const pdf = await pushPdf({
            headers,
            rows,
            title:`Reporte`,
            filter: fitlerRender,
            count
        });

        return res.render(`s/report/control.hbs`, {
            file: pdf,
            filter: fitlerRender,
            count,
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

        // const status = req.query.status;
        const date = req.query.date;
        const type = req.query.type;
        const category = req.query.category;

        const fitlerRender: string[] = [];
        const filter: Prisma.TransactionWhereInput[] = [];

        if(category && type) {
            const typeResult = await TypeModel.GetTypeById({ id:type })
            const categoryResult = await CategoryModel.GetCategoryById({ id:category });

            filter.push({ AND:[{categoryId:category},{typeId:type}] });
            fitlerRender.push(`Tipo: ${typeResult?.name}`);
            fitlerRender.push(`Categoria: ${categoryResult?.name}`);


        }
        else {
            if(type) { 
                const result = await TypeModel.GetTypeById({ id:type })
                filter.push({ typeId:type });
                fitlerRender.push(`Tipo: ${result?.name}`);
            } else {
                fitlerRender.push(`Tipo: TODOS`);
            }

            if(category) { 
                const result = await CategoryModel.GetCategoryById({ id:category });
                filter.push({ categoryId:category });
                fitlerRender.push(`Categoria: ${result?.name}`);
            } else {
                fitlerRender.push(`Categoria: TODOS`);
            }
        }
        
        const count = await TransactionModel.CountAllBy({ filter:{AND:filter} });
        let pagTake = 20;
        const headers = [``,`Descripción`, `Monto`, `Fecha`];
        const rows: string[][] = [];

        let i = 0;
        do {
            const result = await TransactionModel.ReportTransaction({
                filter: filter.length > 1 ? { AND:filter } : filter[0],
                skip:pagTake-20,
                take:pagTake
            });

            result.result.forEach((item,i)=>{
                rows.push([i.toString(),`${item.description}`,`${item.mount}`,`${item.date}`]);
            });            

            i++;
        } while (count>pagTake);    

        const pdf = await pushPdf({
            headers,
            rows,
            title:`Reporte`,
            filter: fitlerRender,
            count
        });

        return res.render(`s/report/transaction.hbs`, {
            file: pdf,
            filter: fitlerRender,
            count,
            type: await TypePromise,
            category: await CategoryPromise,
        });
    }

    public async HandleTransactionReportFile(req: Request, res: Response) {

        const TypePromise = TypeModel.GetPaginationType({ pag:0,limit:50 });
        const CategoryPromise = CategoryModel.GetPaginationCategory({ pag:0,limit:50 });

        const skip = req.query.skip ? Number(req.query.skip) : 0; 
        const take = req.query.take ? Number(req.query.take) : 50; 

        // const status = req.query.status;
        const date = req.query.date;
        const type = req.query.type;
        const category = req.query.category;

        const fitlerRender: string[] = [];
        const filter: Prisma.TransactionWhereInput[] = [];

        if(category && type) {
            const typeResult = await TypeModel.GetTypeById({ id:type })
            const categoryResult = await CategoryModel.GetCategoryById({ id:category });

            filter.push({ AND:[{categoryId:category},{typeId:type}] });
            fitlerRender.push(`Tipo: ${typeResult?.name}`);
            fitlerRender.push(`Categoria: ${categoryResult?.name}`);


        }
        else {
            if(type) { 
                const result = await TypeModel.GetTypeById({ id:type })
                filter.push({ typeId:type });
                fitlerRender.push(`Tipo: ${result?.name}`);
            } else {
                fitlerRender.push(`Tipo: TODOS`);
            }

            if(category) { 
                const result = await CategoryModel.GetCategoryById({ id:category });
                filter.push({ categoryId:category });
                fitlerRender.push(`Categoria: ${result?.name}`);
            } else {
                fitlerRender.push(`Categoria: TODOS`);
            }
        }
        
        const count = await TransactionModel.CountAllBy({ filter:{AND:filter} });
        let pagTake = 20;
        const headers = [``,`Descripción`, `Monto`, `Fecha`];
        const rows: string[][] = [];

        let i = 0;
        do {
            const result = await TransactionModel.ReportTransaction({
                filter: filter.length > 1 ? { AND:filter } : filter[0],
                skip:pagTake-20,
                take:pagTake
            });

            result.result.forEach((item,i)=>{
                rows.push([i.toString(),`${item.description}`,`${item.mount}`,`${item.date}`]);
            });            

            i++;
        } while (count>pagTake);    

        const pdf = await pushPdf({
            headers,
            rows,
            title:`Reporte`,
            filter: fitlerRender,
            count
        });

        return res.redirect(`${pdf.download}`);
        return res.render(`s/report/transaction.hbs`, {
            file: pdf,
            filter: fitlerRender,
            count,
            type: await TypePromise,
            category: await CategoryPromise,
        });
    }

    public async HandleControlReportFile(req: Request, res: Response) {
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

        const fitlerRender: string[] = [];
        const count = await ControlModel.CountAllBy({ filter:{AND:filter} });
        let pagTake = 20;
        const headers = [``,`Maquina`, `Materia`, `Producto`,`Peso`];
        const rows: string[][] = [];
        
        const machineList = await machinePromise;
        const productList = await productPromise;
        const rawmatterList = await rawmatterPromise;

        do {
            const result = await ControlModel.ReportEvent({
                filter: {
                    AND: filter
                },
                skip:pagTake-20,
                take:pagTake
            });

            result.result.forEach((item,i) => {
                rows.push([
                    `${i+1}`,
                    `${item.machineReference.name}`,
                    `${item.rawmatterReference.name}`,
                    `${item.productReference.name}`,
                    `${item.kg}.${item.gr}`
                ]);
            });

        } while (count>pagTake);


        const pdf = await pushPdf({
            headers,
            rows,
            title:`Reporte`,
            filter: fitlerRender,
            count
        });

        return res.redirect(`${pdf.download}`);
        return res.render(`s/report/control.hbs`, {
            file: pdf,
            filter: fitlerRender,
            count,
            machineList,
            productList,
            rawmatterList
        });
    }

    public LoadRouters() {        
        this.router.get(`/report/transaction`, OnSession, this.HandleTransactionReport);
        this.router.get(`/report/control`, OnSession, this.HandleControlReport);
        this.router.get(`/report/transaction/file`, OnSession, this.HandleTransactionReportFile);
        this.router.get(`/report/control/file`, OnSession, this.HandleControlReportFile);

        return this.router;
    }
}

export default new ReportController();

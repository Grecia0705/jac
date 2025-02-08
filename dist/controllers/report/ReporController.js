"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("../BaseController"));
const ControlModel_1 = __importDefault(require("../../models/control/ControlModel"));
const TypeModel_1 = __importDefault(require("../../models/transacction/TypeModel"));
const CategoryModel_1 = __importDefault(require("../../models/transacction/CategoryModel"));
const TransactionModel_1 = __importDefault(require("../../models/transacction/TransactionModel"));
const auth_1 = require("../../middleware/auth");
const MachineModel_1 = __importDefault(require("../../models/control/machine/MachineModel"));
const ProductModel_1 = __importDefault(require("../../models/control/product/ProductModel"));
const RawmatterModel_1 = __importDefault(require("../../models/control/rawmatter/RawmatterModel"));
const GeneratePDFkit_1 = require("../../models/pdf/GeneratePDFkit");
const TransactionModel = new TransactionModel_1.default();
class ReportController extends BaseController_1.default {
    HandleControlReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const take = req.query.take ? Number(req.query.take) : 50;
            const machinePromise = MachineModel_1.default.GetPagination({ limit: 100, pag: 0 });
            const productPromise = ProductModel_1.default.GetPagination({ limit: 100, pag: 0 });
            const rawmatterPromise = RawmatterModel_1.default.GetPagination({ limit: 100, pag: 0 });
            const date = req.query.date ? `${req.query.date}` : ``;
            const machine = req.query.machine ? `${req.query.machine}` : ``;
            const product = req.query.product ? `${req.query.product}` : ``;
            const rawmatter = req.query.rawmatter ? `${req.query.rawmatter}` : ``;
            const renderFilter = [];
            const filter = [];
            if (machine !== ``) {
                const MachineResult = yield MachineModel_1.default.GetById({ id: machine });
                if (MachineResult) {
                    renderFilter.push({ key: `Maquina`, value: `${MachineResult.name}` });
                    filter.push({ machineId: MachineResult.machineId });
                }
            }
            if (product !== ``) {
                const ProductResult = yield ProductModel_1.default.GetById({ id: product });
                if (ProductResult) {
                    renderFilter.push({ key: `Producto`, value: `${ProductResult.name}` });
                    filter.push({ productId: ProductResult.productId });
                }
            }
            if (rawmatter !== ``) {
                const RawmatterResult = yield RawmatterModel_1.default.GetById({ id: rawmatter });
                if (RawmatterResult) {
                    renderFilter.push({ key: `Materia Prima`, value: `${RawmatterResult.name}` });
                    filter.push({ rawmatterId: RawmatterResult.rawmatterId });
                }
            }
            if (date !== ``) {
                renderFilter.push({ key: `Fecha`, value: `${date}` });
                filter.push({ date: { equals: `${date}` } });
            }
            const fitlerRender = [];
            const count = yield ControlModel_1.default.CountAllBy({ filter: { AND: filter } });
            let pagTake = 20;
            const headers = [``, `Maquina`, `Materia`, `Producto`, `Peso`];
            const rows = [];
            const machineList = yield machinePromise;
            const productList = yield productPromise;
            const rawmatterList = yield rawmatterPromise;
            do {
                const result = yield ControlModel_1.default.ReportEvent({
                    filter: {
                        AND: filter
                    },
                    skip: pagTake - 20,
                    take: pagTake
                });
                result.result.forEach((item, i) => {
                    rows.push([
                        `${i + 1}`,
                        `${item.machineReference.name}`,
                        `${item.rawmatterReference.name}`,
                        `${item.productReference.name}`,
                        `${item.kg}.${item.gr}`
                    ]);
                });
            } while (count > pagTake);
            const pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                headers,
                rows,
                title: `Reporte`,
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
        });
    }
    HandleTransactionReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const TypePromise = TypeModel_1.default.GetPaginationType({ pag: 0, limit: 50 });
            const CategoryPromise = CategoryModel_1.default.GetPaginationCategory({ pag: 0, limit: 50 });
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const take = req.query.take ? Number(req.query.take) : 50;
            // const status = req.query.status;
            const date = req.query.date;
            const type = req.query.type;
            const category = req.query.category;
            const fitlerRender = [];
            const filter = [];
            if (category && type) {
                const typeResult = yield TypeModel_1.default.GetTypeById({ id: type });
                const categoryResult = yield CategoryModel_1.default.GetCategoryById({ id: category });
                filter.push({ AND: [{ categoryId: category }, { typeId: type }] });
                fitlerRender.push(`Tipo: ${typeResult === null || typeResult === void 0 ? void 0 : typeResult.name}`);
                fitlerRender.push(`Categoria: ${categoryResult === null || categoryResult === void 0 ? void 0 : categoryResult.name}`);
            }
            else {
                if (type) {
                    const result = yield TypeModel_1.default.GetTypeById({ id: type });
                    filter.push({ typeId: type });
                    fitlerRender.push(`Tipo: ${result === null || result === void 0 ? void 0 : result.name}`);
                }
                else {
                    fitlerRender.push(`Tipo: TODOS`);
                }
                if (category) {
                    const result = yield CategoryModel_1.default.GetCategoryById({ id: category });
                    filter.push({ categoryId: category });
                    fitlerRender.push(`Categoria: ${result === null || result === void 0 ? void 0 : result.name}`);
                }
                else {
                    fitlerRender.push(`Categoria: TODOS`);
                }
            }
            const count = yield TransactionModel.CountAllBy({ filter: { AND: filter } });
            let pagTake = 20;
            const headers = [``, `Descripción`, `Monto`, `Fecha`];
            const rows = [];
            let i = 0;
            do {
                const result = yield TransactionModel.ReportTransaction({
                    filter: filter.length > 1 ? { AND: filter } : filter[0],
                    skip: pagTake - 20,
                    take: pagTake
                });
                result.result.forEach((item, i) => {
                    rows.push([i.toString(), `${item.description}`, `${item.mount}`, `${item.date}`]);
                });
                i++;
            } while (count > pagTake);
            const pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                headers,
                rows,
                title: `Reporte`,
                filter: fitlerRender,
                count
            });
            return res.render(`s/report/transaction.hbs`, {
                file: pdf,
                filter: fitlerRender,
                count,
                type: yield TypePromise,
                category: yield CategoryPromise,
            });
        });
    }
    HandleTransactionReportFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const TypePromise = TypeModel_1.default.GetPaginationType({ pag: 0, limit: 50 });
            const CategoryPromise = CategoryModel_1.default.GetPaginationCategory({ pag: 0, limit: 50 });
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const take = req.query.take ? Number(req.query.take) : 50;
            // const status = req.query.status;
            const date = req.query.date;
            const type = req.query.type;
            const category = req.query.category;
            const fitlerRender = [];
            const filter = [];
            if (category && type) {
                const typeResult = yield TypeModel_1.default.GetTypeById({ id: type });
                const categoryResult = yield CategoryModel_1.default.GetCategoryById({ id: category });
                filter.push({ AND: [{ categoryId: category }, { typeId: type }] });
                fitlerRender.push(`Tipo: ${typeResult === null || typeResult === void 0 ? void 0 : typeResult.name}`);
                fitlerRender.push(`Categoria: ${categoryResult === null || categoryResult === void 0 ? void 0 : categoryResult.name}`);
            }
            else {
                if (type) {
                    const result = yield TypeModel_1.default.GetTypeById({ id: type });
                    filter.push({ typeId: type });
                    fitlerRender.push(`Tipo: ${result === null || result === void 0 ? void 0 : result.name}`);
                }
                else {
                    fitlerRender.push(`Tipo: TODOS`);
                }
                if (category) {
                    const result = yield CategoryModel_1.default.GetCategoryById({ id: category });
                    filter.push({ categoryId: category });
                    fitlerRender.push(`Categoria: ${result === null || result === void 0 ? void 0 : result.name}`);
                }
                else {
                    fitlerRender.push(`Categoria: TODOS`);
                }
            }
            const count = yield TransactionModel.CountAllBy({ filter: { AND: filter } });
            let pagTake = 20;
            const headers = [``, `Descripción`, `Monto`, `Fecha`];
            const rows = [];
            let i = 0;
            do {
                const result = yield TransactionModel.ReportTransaction({
                    filter: filter.length > 1 ? { AND: filter } : filter[0],
                    skip: pagTake - 20,
                    take: pagTake
                });
                result.result.forEach((item, i) => {
                    rows.push([i.toString(), `${item.description}`, `${item.mount}`, `${item.date}`]);
                });
                i++;
            } while (count > pagTake);
            const pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                headers,
                rows,
                title: `Reporte`,
                filter: fitlerRender,
                count
            });
            return res.redirect(`${pdf.download}`);
            return res.render(`s/report/transaction.hbs`, {
                file: pdf,
                filter: fitlerRender,
                count,
                type: yield TypePromise,
                category: yield CategoryPromise,
            });
        });
    }
    HandleControlReportFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const take = req.query.take ? Number(req.query.take) : 50;
            const machinePromise = MachineModel_1.default.GetPagination({ limit: 100, pag: 0 });
            const productPromise = ProductModel_1.default.GetPagination({ limit: 100, pag: 0 });
            const rawmatterPromise = RawmatterModel_1.default.GetPagination({ limit: 100, pag: 0 });
            const date = req.query.date ? `${req.query.date}` : ``;
            const machine = req.query.machine ? `${req.query.machine}` : ``;
            const product = req.query.product ? `${req.query.product}` : ``;
            const rawmatter = req.query.rawmatter ? `${req.query.rawmatter}` : ``;
            const renderFilter = [];
            const filter = [];
            if (machine !== ``) {
                const MachineResult = yield MachineModel_1.default.GetById({ id: machine });
                if (MachineResult) {
                    renderFilter.push({ key: `Maquina`, value: `${MachineResult.name}` });
                    filter.push({ machineId: MachineResult.machineId });
                }
            }
            if (product !== ``) {
                const ProductResult = yield ProductModel_1.default.GetById({ id: product });
                if (ProductResult) {
                    renderFilter.push({ key: `Producto`, value: `${ProductResult.name}` });
                    filter.push({ productId: ProductResult.productId });
                }
            }
            if (rawmatter !== ``) {
                const RawmatterResult = yield RawmatterModel_1.default.GetById({ id: rawmatter });
                if (RawmatterResult) {
                    renderFilter.push({ key: `Materia Prima`, value: `${RawmatterResult.name}` });
                    filter.push({ rawmatterId: RawmatterResult.rawmatterId });
                }
            }
            if (date !== ``) {
                renderFilter.push({ key: `Fecha`, value: `${date}` });
                filter.push({ date: { equals: `${date}` } });
            }
            const fitlerRender = [];
            const count = yield ControlModel_1.default.CountAllBy({ filter: { AND: filter } });
            let pagTake = 20;
            const headers = [``, `Maquina`, `Materia`, `Producto`, `Peso`];
            const rows = [];
            const machineList = yield machinePromise;
            const productList = yield productPromise;
            const rawmatterList = yield rawmatterPromise;
            do {
                const result = yield ControlModel_1.default.ReportEvent({
                    filter: {
                        AND: filter
                    },
                    skip: pagTake - 20,
                    take: pagTake
                });
                result.result.forEach((item, i) => {
                    rows.push([
                        `${i + 1}`,
                        `${item.machineReference.name}`,
                        `${item.rawmatterReference.name}`,
                        `${item.productReference.name}`,
                        `${item.kg}.${item.gr}`
                    ]);
                });
            } while (count > pagTake);
            const pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                headers,
                rows,
                title: `Reporte`,
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
        });
    }
    LoadRouters() {
        this.router.get(`/report/transaction`, auth_1.OnSession, this.HandleTransactionReport);
        this.router.get(`/report/control`, auth_1.OnSession, this.HandleControlReport);
        this.router.get(`/report/transaction/file`, auth_1.OnSession, this.HandleTransactionReportFile);
        this.router.get(`/report/control/file`, auth_1.OnSession, this.HandleControlReportFile);
        return this.router;
    }
}
exports.default = new ReportController();

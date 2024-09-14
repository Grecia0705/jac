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
            const machineList = yield machinePromise;
            const productList = yield productPromise;
            const rawmatterList = yield rawmatterPromise;
            const result = yield ControlModel_1.default.ReportEvent({
                filter: {
                    AND: filter
                },
                skip,
                take
            });
            console.log(result.result);
            return res.render(`s/report/control.hbs`, {
                result: result.result,
                count: result.count,
                filter: renderFilter,
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
            const date = req.query.date ? `${req.query.date}` : ``;
            const month = req.query.month ? `${req.query.month}` : ``;
            const type = req.query.type ? `${req.query.type}` : ``;
            const category = req.query.category ? `${req.query.category}` : ``;
            const renderFilter = [];
            const filter = [];
            if (type !== ``) {
                const typePromise = yield TypeModel_1.default.GetTypeById({ id: type });
                if (typePromise) {
                    renderFilter.push({ key: `Tipo`, value: `${typePromise.name}` });
                    filter.push({ typeId: typePromise.transactionTypeId });
                }
            }
            if (category !== ``) {
                const categoryPromise = yield CategoryModel_1.default.GetCategoryById({ id: category });
                console.log(categoryPromise);
                if (categoryPromise) {
                    renderFilter.push({ key: `Categoria`, value: `${categoryPromise.name}` });
                    filter.push({ categoryId: categoryPromise.transactionCategoryId });
                }
            }
            if (month !== ``) {
                renderFilter.push({ key: `Mes`, value: `${month}` });
                filter.push({ date: { contains: `-${month}-` } });
            }
            if (date !== ``) {
                renderFilter.push({ key: `Fecha`, value: `${date}` });
                filter.push({ date: { equals: date } });
            }
            const result = yield TransactionModel.ReportTransaction({
                filter: {
                    AND: filter
                },
                skip,
                take,
            });
            console.log(result.result);
            return res.render(`s/report/transaction.hbs`, {
                result: result.result,
                count: result.count,
                filter: renderFilter,
                type: yield TypePromise,
                category: yield CategoryPromise,
            });
        });
    }
    LoadRouters() {
        this.router.get(`/report/transaction`, auth_1.OnSession, this.HandleTransactionReport);
        this.router.get(`/report/control`, auth_1.OnSession, this.HandleControlReport);
        return this.router;
    }
}
exports.default = new ReportController();

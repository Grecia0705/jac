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
const auth_1 = require("../../middleware/auth");
const ControlModel_1 = __importDefault(require("../../models/control/ControlModel"));
const RawmatterModel_1 = __importDefault(require("../../models/control/rawmatter/RawmatterModel"));
const MachineModel_1 = __importDefault(require("../../models/control/machine/MachineModel"));
const ProductModel_1 = __importDefault(require("../../models/control/product/ProductModel"));
const var_1 = require("../../var");
const StaticticsTransaction_1 = __importDefault(require("../../models/statictics/StaticticsTransaction"));
class ControlController extends BaseController_1.default {
    constructor() {
        super();
        this.view = `s/control`;
        this.url = `/control`;
        this.model = ControlModel_1.default;
    }
    RenderDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const 
            const Params = {};
            return res.render(`s/control/dashboard.hbs`, Params);
        });
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.query.pag | 0;
            const limit = req.query.limit | 10;
            const list = ControlModel_1.default.GetPagination({ pag, limit });
            const countPromise = ControlModel_1.default.CountAll();
            const Params = {
                list: yield list,
                next: `/control/list/?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/control/list/?pag=${pag - 1}`,
                count: yield countPromise,
                nowTotal: ``,
                requirePagination: false,
                nowPath: pag,
                nowPathOne: pag != 0 ? true : false,
                nowPathEnd: false,
            };
            Params.nowTotal = `${Params.list.length + (pag * 10)} / ${Params.count}`;
            Params.nowPathEnd = (Params.list.length - 9) > 0 ? true : false;
            Params.requirePagination = Params.count > 10 ? true : false;
            return res.render(`s/control/list.hbs`, Params);
        });
    }
    RenderCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const machine = MachineModel_1.default.GetPagination({ pag: 0, limit: 30 });
            const product = ProductModel_1.default.GetPagination({ pag: 0, limit: 30 });
            const rawmatter = RawmatterModel_1.default.GetPagination({ pag: 0, limit: 30 });
            const Params = {
                machineList: yield machine,
                productList: yield product,
                rawmatterList: yield rawmatter,
            };
            return res.render(`s/control/create.hbs`, Params);
        });
    }
    RenderUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = ControlModel_1.default.GetById({ id });
            const Params = {
                data: yield data
            };
            return res.render(`s/control/update.hbs`, Params);
        });
    }
    CreatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { machineId, productId, rawmatterId, date, kg, gr, } = req.body;
                const data = {
                    date,
                    gr: Number(gr),
                    kg: Number(kg),
                    machineId,
                    productId,
                    rawmatterId,
                    createId: user.userId,
                };
                const machinePromise = MachineModel_1.default.GetById({ id: data.machineId });
                const producPromise = ProductModel_1.default.GetById({ id: data.productId });
                const machine = yield machinePromise;
                const product = yield producPromise;
                const raw = yield RawmatterModel_1.default.GetById({ id: data.rawmatterId });
                // const rawmatterPromise = RawmatterModel.GetById({ id:data.rawmatterId });
                const descriptionHts = `Creación de Control: Fecha:${data} PESO:${kg}.${gr} Máquina:${machine === null || machine === void 0 ? void 0 : machine.name} Producto: ${product === null || product === void 0 ? void 0 : product.name} Materia Prima: ${raw === null || raw === void 0 ? void 0 : raw.code} ${raw === null || raw === void 0 ? void 0 : raw.name}`;
                const createPromise = ControlModel_1.default.Create({ data, userId: user.userId, description: descriptionHts });
                if (raw != null) {
                    console.log(`prev`, raw.kg, raw.gr);
                    console.log(`control`, data.kg, data.gr);
                    console.log(`now`, raw.kg - data.kg, raw.gr - data.gr);
                    const UpdateRaw = {
                        code: raw.code,
                        createId: raw.createId,
                        description: raw.description ? raw.description : ``,
                        gr: Number(raw.gr) - Number(data.gr),
                        kg: Number(raw.gr) - Number(data.kg),
                        name: raw.name
                    };
                    const descriptionRaw = `Actualización de peso de materia prima. Código:${raw.code} Nombre:${raw.name} Antiguo Peso:${kg}.${gr} Nuevo Peso:${raw.kg}.${raw.gr}`;
                    yield StaticticsTransaction_1.default.conectOrCreate({ name: `${raw.name}`, num: 1, type: `Rawmatter` });
                    yield RawmatterModel_1.default.Update({ id: raw.rawmatterId, data: UpdateRaw, userId: user.userId, description: descriptionRaw });
                }
                yield StaticticsTransaction_1.default.conectOrCreate({ name: `Control`, num: 1, type: `Control` });
                yield StaticticsTransaction_1.default.conectOrCreate({ name: `${machine === null || machine === void 0 ? void 0 : machine.name}`, num: 1, type: `Machine` });
                yield StaticticsTransaction_1.default.conectOrCreate({ name: `${product === null || product === void 0 ? void 0 : product.name}`, num: 1, type: `Product` });
                yield createPromise;
                req.flash(var_1.TypesFlash.success, var_1.Languaje.messages.success.create);
                return res.redirect(`/control`);
            }
            catch (error) {
                console.log(error);
                req.flash(var_1.TypesFlash.error, var_1.Languaje.messages.danger.create);
                return res.redirect(`/control`);
            }
        });
    }
    UpdatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = req.params.id;
                const { machineId, productId, rawmatterId, date, kg, gr } = req.body;
                const data = {
                    date,
                    gr: parseInt(gr),
                    kg: parseInt(kg),
                    machineId,
                    productId,
                    rawmatterId,
                    createId: user.userId,
                };
                const machinePromise = MachineModel_1.default.GetById({ id: data.machineId });
                const producPromise = ProductModel_1.default.GetById({ id: data.productId });
                const rawmatterPromise = RawmatterModel_1.default.GetById({ id: data.rawmatterId });
                const machine = yield machinePromise;
                const product = yield producPromise;
                const raw = yield rawmatterPromise;
                const descriptionHst = `Actualización de control: Fecha:${date} Peso: ${kg}.${gr} Máquina:${machine === null || machine === void 0 ? void 0 : machine.name} Producto: ${product === null || product === void 0 ? void 0 : product.name} Materia Prima: ${raw === null || raw === void 0 ? void 0 : raw.code} ${raw === null || raw === void 0 ? void 0 : raw.name}`;
                yield ControlModel_1.default.Update({ id, data, description: descriptionHst, userId: user.id });
                req.flash(var_1.TypesFlash.success, var_1.Languaje.messages.success.create);
                return res.redirect(`/control/list`);
            }
            catch (error) {
                console.log(error);
                req.flash(var_1.TypesFlash.error, var_1.Languaje.messages.danger.create);
                return res.redirect(`/control/list`);
            }
        });
    }
    LoadRoutes() {
        this.router.get(`/control`, auth_1.OnSession, this.RenderList);
        this.router.get(`/control/list`, auth_1.OnSession, this.RenderList);
        this.router.get(`/control/create`, auth_1.OnSession, this.RenderCreate);
        this.router.get(`/control/update/:id`, auth_1.OnSession, this.RenderUpdate);
        this.router.post(`/control/create`, auth_1.OnSession, this.CreatePost);
        this.router.post(`/control/update/:id`, auth_1.OnSession, this.UpdatePost);
        return this.router;
    }
}
exports.default = new ControlController();

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
const TransactionModel_1 = __importDefault(require("../../models/transacction/TransactionModel"));
const CategoryModel_1 = __importDefault(require("../../models/transacction/CategoryModel"));
const TypeModel_1 = __importDefault(require("../../models/transacction/TypeModel"));
const var_1 = require("../../var");
const TransactionModel = new TransactionModel_1.default;
class TransactionController extends BaseController_1.default {
    constructor() {
        super();
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.query.pag | 0;
            const limit = req.query.limit | 10;
            const machine = TransactionModel.GetPagination({ pag, limit });
            const countPromise = TransactionModel.CountAll();
            const Params = {
                list: yield machine,
                next: `/machine/?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/machine/?pag=${pag - 1}`,
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
            return res.render(`s/transaction/list.hbs`, Params);
        });
    }
    RenderCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const types = TypeModel_1.default.GetPaginationType({ pag: 0, limit: 100 });
            const category = CategoryModel_1.default.GetPaginationCategory({ pag: 0, limit: 100 });
            const Params = {
                types: yield types,
                category: yield category
            };
            return res.render(`s/transaction/create.hbs`, Params);
        });
    }
    RenderUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = TransactionModel.GetById({ id });
            const Params = {
                data: yield data
            };
            return res.render(`s/transaction/update.hbs`, Params);
        });
    }
    CreatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { categoryId, date, mount, typeId, description } = req.body;
                const data = {
                    description,
                    categoryId,
                    date,
                    mount: parseFloat(mount),
                    typeId,
                    createId: user.userId,
                };
                console.log(data);
                yield TransactionModel.Create({ data });
                req.flash(var_1.TypesFlash.success, var_1.Languaje.messages.success.create);
                return res.redirect(`/transaction`);
            }
            catch (error) {
                console.log(error);
                req.flash(var_1.TypesFlash.error, var_1.Languaje.messages.danger.create);
                return res.redirect(`/transaction`);
            }
        });
    }
    UpdatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = req.params.id;
                const { categoryId, date, mount, typeId, description } = req.body;
                const data = {
                    description,
                    categoryId,
                    date,
                    mount: parseInt(mount),
                    typeId,
                    createId: user.userId,
                };
                yield TransactionModel.Update({ id, data });
                req.flash(var_1.TypesFlash.success, var_1.Languaje.messages.success.create);
                return res.redirect(`/transaction`);
            }
            catch (error) {
                console.log(error);
                req.flash(var_1.TypesFlash.error, var_1.Languaje.messages.danger.create);
                return res.redirect(`/transaction`);
            }
        });
    }
    AddDeleteAt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const result = TransactionModel.AtDeleteTransaction({ id });
            req.flash(`succ`, `Transacción eliminada`);
            return res.redirect(`/transaction`);
        });
    }
    LoadRoutes() {
        this.router.get(`/transaction/`, auth_1.OnSession, this.RenderList);
        this.router.get(`/transaction/create`, auth_1.OnSession, this.RenderCreate);
        this.router.get(`/transaction/update/:id`, auth_1.OnSession, this.RenderUpdate);
        this.router.post(`/transaction/create`, auth_1.OnSession, this.CreatePost);
        this.router.get(`/transaction/delete/:id`, auth_1.OnSession, this.AddDeleteAt);
        this.router.post(`/transaction/update/:id`, auth_1.OnSession, this.UpdatePost);
        return this.router;
    }
}
exports.default = new TransactionController();

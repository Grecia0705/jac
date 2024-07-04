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
const BaseController_1 = __importDefault(require("../../BaseController"));
const auth_1 = require("../../../middleware/auth");
const CategoryModel_1 = __importDefault(require("../../../models/transacction/CategoryModel"));
const var_1 = require("../../../var");
class CategoryController extends BaseController_1.default {
    constructor() {
        super();
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.query.pag | 0;
            const limit = req.query.limit | 10;
            const machine = CategoryModel_1.default.GetPaginationCategory({ pag, limit });
            const countPromise = CategoryModel_1.default.CountAllCategory();
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
            return res.render(`s/transaction/category/list.hbs`, Params);
        });
    }
    RenderCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const Params = {};
            return res.render(`s/transaction/category/create.hbs`, Params);
        });
    }
    RenderUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = CategoryModel_1.default.GetCategoryById({ id });
            const Params = {
                data: yield data
            };
            return res.render(`s/transaction/category/update.hbs`, Params);
        });
    }
    CreatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { name, description } = req.body;
                const data = {
                    name, description,
                    createId: user.userId,
                };
                yield CategoryModel_1.default.CreateCategory({ data });
                req.flash(var_1.TypesFlash.success, var_1.Languaje.messages.success.create);
                return res.redirect(`/transaction/category`);
            }
            catch (error) {
                console.log(error);
                req.flash(var_1.TypesFlash.error, var_1.Languaje.messages.danger.create);
                return res.redirect(`/transaction/category`);
            }
        });
    }
    UpdatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = req.params.id;
                const { name, description, code, kg, gr } = req.body;
                const data = { name, description,
                    createId: user.userId,
                };
                yield CategoryModel_1.default.UpdateCategory({ id, data });
                req.flash(var_1.TypesFlash.success, var_1.Languaje.messages.success.create);
                return res.redirect(`/transaction/category`);
            }
            catch (error) {
                console.log(error);
                req.flash(var_1.TypesFlash.error, var_1.Languaje.messages.danger.create);
                return res.redirect(`/transaction/category`);
            }
        });
    }
    AddDeleteAt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            console.log(req.params);
            const result = CategoryModel_1.default.AtDeleteCategory({ id });
            req.flash(`succ`, `Categoria eliminada`);
            return res.redirect(`/transaction/category/`);
        });
    }
    LoadRoutes() {
        // this.router.get(`/transaction/category`, OnSession, this.RenderDashboard);
        this.router.get(`/transaction/category/`, auth_1.OnSession, this.RenderList);
        this.router.get(`/transaction/category/create`, auth_1.OnSession, this.RenderCreate);
        this.router.get(`/transaction/category/update/:id`, auth_1.OnSession, this.RenderUpdate);
        this.router.post(`/transaction/category/create`, auth_1.OnSession, this.CreatePost);
        this.router.post(`/transaction/category/delete/:id`, auth_1.OnSession, this.AddDeleteAt);
        this.router.post(`/transaction/category/update/:id`, auth_1.OnSession, this.UpdatePost);
        return this.router;
    }
}
exports.default = new CategoryController();

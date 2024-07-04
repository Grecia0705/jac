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
const ProductModel_1 = __importDefault(require("../../../models/control/product/ProductModel"));
const var_1 = require("../../../var");
class ProductController extends BaseController_1.default {
    constructor() {
        super();
        this.view = `s/control/product`;
        this.url = `/control/product`;
        this.model = ProductModel_1.default;
    }
    // public async RenderDashboard(req: Request, res: Response) {
    //     // const 
    //     const Params = {};
    //     return res.render(`s/control/product/dashboard.hbs`, Params)
    // }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.query.pag | 0;
            const limit = req.query.limit | 10;
            const list = ProductModel_1.default.GetPagination({ pag, limit });
            const Params = {
                list: yield list
            };
            return res.render(`s/control/product/list.hbs`, Params);
        });
    }
    RenderCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const Params = {};
            return res.render(`s/control/product/create.hbs`, Params);
        });
    }
    RenderUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = ProductModel_1.default.GetById({ id });
            const Params = {
                data: yield data
            };
            return res.render(`s/control/product/update.hbs`, Params);
        });
    }
    CreatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { name, description } = req.body;
                const data = { name, description, createId: user.userId };
                yield ProductModel_1.default.Create({ data });
                req.flash(var_1.TypesFlash.success, var_1.Languaje.messages.success.create);
                return res.redirect(`/control/product`);
            }
            catch (error) {
                console.log(error);
                req.flash(var_1.TypesFlash.error, var_1.Languaje.messages.danger.create);
                return res.redirect(`/control/product`);
            }
        });
    }
    UpdatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = req.params.id;
                const { name, description } = req.body;
                const data = { name, description, createId: user.userId };
                yield ProductModel_1.default.Update({ id, data });
                req.flash(var_1.TypesFlash.success, var_1.Languaje.messages.success.create);
                return res.redirect(`/control/product`);
            }
            catch (error) {
                console.log(error);
                req.flash(var_1.TypesFlash.error, var_1.Languaje.messages.danger.create);
                return res.redirect(`/control/product`);
            }
        });
    }
    AddDeleteAt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const result = ProductModel_1.default.AtDelete({ id });
            req.flash(`succ`, `Maquina eliminada`);
            return res.redirect(`/control/product`);
        });
    }
    LoadRoutes() {
        // this.router.get(`${this.pathUrl}`, OnSession, this.RenderDashboard);
        this.router.get(`/control/product/`, auth_1.OnSession, this.RenderList);
        this.router.get(`/control/product/create`, auth_1.OnSession, this.RenderCreate);
        this.router.get(`/control/product/update/:id`, auth_1.OnSession, this.RenderUpdate);
        this.router.post(`/control/product/create`, auth_1.OnSession, this.CreatePost);
        this.router.post(`/control/product/update/:id`, auth_1.OnSession, this.UpdatePost);
        return this.router;
    }
}
exports.default = new ProductController();

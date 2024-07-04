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
const StockModel_1 = __importDefault(require("../../models/stock/StockModel"));
const var_1 = require("../../var");
class RawmatterController extends BaseController_1.default {
    constructor() {
        super();
        this.pathView = `s/stock`;
        this.pathUrl = `/stock`;
        this.model = StockModel_1.default;
    }
    RenderDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.render(`s/stock/dashboard.hbs`);
        });
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = req.query.limit | 10;
            const pag = req.query.pag | 0;
            const list = StockModel_1.default.GetPagination({ pag, limit });
            const Params = {
                list: yield list
            };
            return res.render(`s/stock/list.hbs`, Params);
        });
    }
    RenderCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.render(`s/stock/create.hbs`);
        });
    }
    RenderUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = StockModel_1.default.GetById({ id });
            const Params = {
                data: yield data
            };
            return res.render(`s/stock/update.hbs`, Params);
        });
    }
    CreatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { description, quantity, price } = req.body;
                console.log(price);
                const data = { description, createId: user.userId,
                    price: parseFloat(price),
                    quantity: Number(quantity)
                };
                yield StockModel_1.default.Create({ data });
                req.flash(var_1.TypesFlash.success, var_1.Languaje.messages.success.create);
                return res.redirect(this.pathView);
            }
            catch (error) {
                console.log(error);
                req.flash(var_1.TypesFlash.error, var_1.Languaje.messages.danger.create);
                return res.redirect(`/stock`);
            }
        });
    }
    UpdatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = req.params.id;
                const { description, quantity, price } = req.body;
                const data = { description, createId: user.userId, price, quantity: Number(quantity) };
                yield StockModel_1.default.Update({ id, data });
                req.flash(var_1.TypesFlash.success, var_1.Languaje.messages.success.create);
                return res.redirect(`/stock`);
            }
            catch (error) {
                console.log(error);
                req.flash(var_1.TypesFlash.error, var_1.Languaje.messages.danger.create);
                return res.redirect(`/stock`);
            }
        });
    }
    AddDeleteAt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = StockModel_1.default.AtDeleteStock({ id });
                req.flash(`succ`, `Transacción eliminada`);
            }
            catch (error) {
                console.log(error);
            }
            return res.redirect(`/stock`);
        });
    }
    LoadRoutes() {
        this.router.get(`/stock`, auth_1.OnSession, this.RenderList);
        this.router.get(`/stock/list`, auth_1.OnSession, this.RenderList);
        this.router.get(`/stock/create`, auth_1.OnSession, this.RenderCreate);
        this.router.get(`/stock/update/:id`, auth_1.OnSession, this.RenderUpdate);
        this.router.post(`/stock/create`, auth_1.OnSession, this.CreatePost);
        this.router.post(`/stock/delete/:id`, auth_1.OnSession, this.AddDeleteAt);
        this.router.post(`/stock/update/:id`, auth_1.OnSession, this.UpdatePost);
        return this.router;
    }
}
exports.default = new RawmatterController();

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
const RawmatterModel_1 = __importDefault(require("../../../models/control/rawmatter/RawmatterModel"));
const var_1 = require("../../../var");
class RawmatterController extends BaseController_1.default {
    constructor() {
        super();
        this.view = `s/control/rawmatter`;
        this.url = `/control/rawmatter`;
        this.model = RawmatterModel_1.default;
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.query.pag | 0;
            const limit = req.query.limit | 10;
            const list = RawmatterModel_1.default.GetPagination({ pag, limit });
            const Params = {
                list: yield list
            };
            return res.render(`s/control/rawmatter/list.hbs`, Params);
        });
    }
    RenderCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const Params = {};
            return res.render(`s/control/rawmatter/create.hbs`, Params);
        });
    }
    RenderUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = RawmatterModel_1.default.GetById({ id });
            const Params = {
                data: yield data
            };
            return res.render(`s/control/rawmatter/update.hbs`, Params);
        });
    }
    CreatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { name, description, code, kg, gr } = req.body;
                const data = { name, description, code,
                    createId: user.userId,
                    kg: Number(kg),
                    gr: Number(gr)
                };
                const descriptionHts = `Creación de Materia Prima: Nombre:${name} Descripción:${description}`;
                yield RawmatterModel_1.default.Create({ data, userId: user.userId, description: descriptionHts });
                req.flash(var_1.TypesFlash.success, var_1.Languaje.messages.success.create);
                return res.redirect(`/control/rawmatter`);
            }
            catch (error) {
                console.log(error);
                req.flash(var_1.TypesFlash.error, var_1.Languaje.messages.danger.create);
                return res.redirect(`/control/rawmatter`);
            }
        });
    }
    UpdatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = req.params.id;
                const { name, description, code, kg, gr } = req.body;
                const data = { name, description, code,
                    createId: user.userId,
                    kg: Number(kg),
                    gr: Number(gr) | 0
                };
                const descriptionHts = `Actualización de materia.  Código:${code} Nombre:${name} Peso:${kg}.${gr}`;
                yield RawmatterModel_1.default.Update({ id, data, userId: user.userId, description: descriptionHts });
                req.flash(var_1.TypesFlash.success, var_1.Languaje.messages.success.create);
                return res.redirect(`/control/rawmatter`);
            }
            catch (error) {
                console.log(error);
                req.flash(var_1.TypesFlash.error, var_1.Languaje.messages.danger.create);
                return res.redirect(`/control/rawmatter`);
            }
        });
    }
    AddDeleteAt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = req.user;
            const result = RawmatterModel_1.default.AtDelete({ id, userId: user.userId, description: `Eliminación de materia prima` });
            req.flash(`succ`, `Maquina eliminada`);
            return res.redirect(`/control/rawmatter/`);
        });
    }
    LoadRoutes() {
        // this.router.get(`/control/rawmatter`, OnSession, this.RenderDashboard);
        this.router.get(`/control/rawmatter/`, auth_1.OnSession, this.RenderList);
        this.router.get(`/control/rawmatter/create`, auth_1.OnSession, this.RenderCreate);
        this.router.get(`/control/rawmatter/update/:id`, auth_1.OnSession, this.RenderUpdate);
        this.router.post(`/control/rawmatter/create`, auth_1.OnSession, this.CreatePost);
        this.router.post(`/control/rawmatter/update/:id`, auth_1.OnSession, this.UpdatePost);
        this.router.get(`/control/rawmatter/delete/:id`, auth_1.OnSession, this.AddDeleteAt);
        return this.router;
    }
}
exports.default = new RawmatterController();

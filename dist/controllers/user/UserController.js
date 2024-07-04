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
const UserModel_1 = __importDefault(require("../../models/user/UserModel"));
const MachineModel_1 = __importDefault(require("../../models/control/machine/MachineModel"));
const ProductModel_1 = __importDefault(require("../../models/control/product/ProductModel"));
const RawmatterModel_1 = __importDefault(require("../../models/control/rawmatter/RawmatterModel"));
const ControlModel_1 = __importDefault(require("../../models/control/ControlModel"));
const auth_1 = require("../../middleware/auth");
class UserController extends BaseController_1.default {
    DashboardController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = UserModel_1.default.CountBy({ filter: {} });
            const machine = MachineModel_1.default.CountAll();
            const product = ProductModel_1.default.CountAll();
            const rawmatter = RawmatterModel_1.default.CountAll();
            const control = ControlModel_1.default.CountAll();
            return res.render(`s/dashboard.hbs`, {
                ubication: `Resumen`,
                user: yield user,
                machine: yield machine,
                product: yield product,
                rawmatter: yield rawmatter,
                control: yield control,
            });
        });
    }
    StaticticsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.render(`s/statictics.hbs`, {
                ubication: `Resumen`,
            });
        });
    }
    // render dashboard
    RenderDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const countPromise = UserModel_1.default.CountBy({ filter: {} });
            const Params = {
                count: yield countPromise
            };
            return res.render(`s/user/dashboard.hbs`, Params);
        });
    }
    // render list
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.params.pag | 0;
            const limit = req.params.limit | 10;
            const users = UserModel_1.default.GetUsers({ pag, limit });
            const countPromise = UserModel_1.default.CountBy({ filter: {} });
            const Params = {
                list: yield users,
                next: `/users/list?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/users/list?pag=${pag - 1}`,
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
            return res.render(`s/user/list.hbs`, Params);
        });
    }
    // render create
    RenderCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const Params = {};
            return res.render(`s/user/create.hbs`, Params);
        });
    }
    // render show and update
    RenderShow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield UserModel_1.default.FindUserById({ id });
            if (null == user) {
                req.flash(`err`, `Usuario no encontrado.`);
                return res.redirect(`/users/list`);
            }
            const Params = { data: user };
            return res.render(`s/user/show.hbs`, Params);
        });
    }
    // logic register
    CreateUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const NewUser = {
                    createBy: user.userId,
                    email: req.body.email,
                    lastname: req.body.lastname,
                    name: req.body.name,
                    password: yield UserModel_1.default.HashPassword({ password: req.body.password }),
                    username: req.body.username
                };
                yield UserModel_1.default.CreateUser({ data: NewUser });
                req.flash(`succ`, `Usuario creado.`);
                return res.redirect(`/user/list`);
            }
            catch (error) {
                console.log(error);
                req.flash(`err`, `No se pudo crear el usuario.`);
                return res.redirect(`/user/list`);
            }
        });
    }
    LoadRouters() {
        this.router.get(`/dashboard`, auth_1.OnSession, this.DashboardController);
        this.router.get(`/statictics`, auth_1.OnSession, this.StaticticsController);
        this.router.get(`/user`, auth_1.OnSession, this.RenderDashboard);
        this.router.get(`/user/list`, auth_1.OnSession, this.RenderList);
        this.router.get(`/user/create`, auth_1.OnSession, this.RenderCreate);
        this.router.get(`/user/:id/update`, auth_1.OnSession, this.RenderShow);
        this.router.post(`/user/create`, auth_1.OnSession, this.CreateUserPost);
        return this.router;
    }
}
exports.default = new UserController();

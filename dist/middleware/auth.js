"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffSession = exports.OnSession = void 0;
const OnSession = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        req.flash("err", "Debes iniciar sessión.");
        res.redirect("/login");
    }
};
exports.OnSession = OnSession;
const OffSession = function (req, res, next) {
    if (!req.isAuthenticated()) {
        next();
    }
    else {
        req.flash("err", "No puedes visitar esa pagina.");
        res.redirect("/dashboard");
    }
};
exports.OffSession = OffSession;

import { NextFunction } from "express";

export const OnSession = function(req: any, res: any, next: NextFunction) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("err", "Debes iniciar sessión.");
        res.redirect("/login");
    }
};

export const OffSession = function(req: any, res: any, next: NextFunction) {
    if (!req.isAuthenticated()) {
        next();
    } else {
        req.flash("err", "No puedes visitar esa pagina.");
        res.redirect("/dashboard");
    }
};

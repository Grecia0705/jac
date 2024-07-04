"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers = {
    ifeq(path, page, options) {
        if (path === page) {
            console.log(this);
            return options.fn(`bello`);
        }
        return options.inverse(`no bello`);
    },
    validRoot(userRol, options) {
        const toRetunr = userRol == `ROOT` ? options.fn(true) : options.inverse(false);
        console.log(toRetunr);
        return toRetunr;
    },
    formatDate(date, options) {
        if (typeof date == `string`)
            return date;
        return `${date.toString().split(`GMT`)[0]}`;
    },
    PriceQuantity(price, quantity, options) {
        return price * quantity;
    }
};
exports.default = Helpers;

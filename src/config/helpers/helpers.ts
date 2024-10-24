import Handlebars from "express-handlebars";

const Helpers = {
    ifeq(path: string, page: string, options: any) {

        if (path === page) {
            return options.fn(`bello`);
          }
        return options.inverse(`no bello`);
    },
    
    validRoot(userRol: any, options: any) {
        const toRetunr = userRol == `ROOT` ? options.fn(true) : options.inverse(false);
        return toRetunr;
    },

    equal(id1: string, id2: string, options: any) {
        const toRetunr = id1 == id2 ? options.fn(true) : options.inverse(false);
        return toRetunr;
    },

    formatDate(date: any, options: any) {
        if(typeof date == `string`) return date; 
        return `${date.toString().split(`GMT`)[0]}`
    },

    PriceQuantity(price:number, quantity:number, options: any) {
        return price*quantity;
    }
    
};

export default Helpers;

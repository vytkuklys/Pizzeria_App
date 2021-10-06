'use strict';

export default class LocalStore {
    static getMenu() {
        const menu = JSON.parse(localStorage.getItem('menu'));
        return menu ? menu : [];
    }

    static addPizzaToMenu(pizza) {
        const menu = LocalStore.getMenu();
        menu.push(pizza);
        localStorage.setItem('menu', JSON.stringify(menu));
    }

    static isNameUnique(name) {
        const menu = LocalStore.getMenu();
        if (!menu.length) return true;
        return menu.map(pizza => pizza.name == name ? 1 : 0).reduce((accumulator, curr) => accumulator + curr) ? false : true;
    }

    static removePizza(title) {
        const pizzas = LocalStore.getMenu();
        pizzas.forEach((pizza, index) => {
            if (pizza.name === title) {
                pizzas.splice(index, 1);
            }
        });
        localStorage.setItem('menu', JSON.stringify(pizzas));
    }
}
'use strict';
import LocalStorage from './LocalStorage.js';

const openFormBtns = document.querySelectorAll('.js-open-form-btn');
const closeFormBtn = document.querySelector('.js-popup__exit');
const closeConfirmationBtn = document.querySelector('.js-confirm__keep-btn');
const addPizzaBtn = document.querySelector('.js-popup__add-pizza');
const inputTopping = document.querySelector('.js-popup__topping');
const sortByPriceBtn = document.querySelector('.js-sort-by-price');
const sortByHotnessBtn = document.querySelector('.js-sort-by-hotness');
const sortByDateBtn = document.querySelector('.js-sort-by-date');

const handleMenu = () => {
    const menu = LocalStorage.getMenu();
    const items = createItemsHTML(menu.length);
    menu.forEach((pizza, index) => addDataToMenuItem(pizza, items[index]));
    items.forEach(item => renderMenuItem(item));
}

const addPizza = e => {
    e.preventDefault();
    if (!isFormValid()) return;
    const pizza = collectData();
    if (pizza.name && LocalStorage.isNameUnique(pizza.name)) {
        LocalStorage.addPizzaToMenu(pizza);
    } else {
        document.querySelector('.c-popup__title').focus();
        return;
    }
    const item = createItemsHTML(1);
    addDataToMenuItem(pizza, item[0]);
    renderMenuItem(item[0]);
    closeForm();
}

const isFormValid = () => {
    const title = document.querySelector('.c-popup__name');
    const price = document.querySelector('.c-popup__price');

    if (!title.checkValidity()) {
        title.focus();
        return false;
    }
    if (!price.checkValidity()) {
        price.focus();
        return false;
    }
    if (!inputTopping.checkValidity() && !areToppingsAdded()) {
        inputTopping.focus();
        return false;
    }
    return true;
}

const areToppingsAdded = () => {
    const toppings = document.querySelector('.c-render__toppings')
    return (toppings.firstChild);
}

const collectData = () => {
    const title = document.querySelector('.c-popup__name').value;
    const price = parseFloat(document.querySelector('.c-popup__price').value);
    const hotness = getHotness();
    const toppings = getToppings();
    const photo = getPhoto();
    const pizza = {
        name: title,
        price: price,
        hotness: hotness,
        toppings: [...toppings],
        photo: photo
    }
    return (pizza);
}

const getHotness = () => {
    const values = Array
        .from(document.querySelectorAll('input[name="hotness"]'))
        .filter((item) => item.checked)
        .map((item) => item.value);
    return values.length ? Number(values[0]) : -1;
}

const getToppings = () => {
    const toppings = document.querySelector('.c-render__toppings')
    const values = [];

    while (toppings.firstChild) {
        values.push(toppings.firstChild.textContent);
        toppings.removeChild(toppings.firstChild);
    }
    if (inputTopping.value)
        values.push(inputTopping.value);
    return values;
}

const getPhoto = () => {
    const values = Array
        .from(document.querySelectorAll('input[name="photo"]'))
        .filter((item) => item.checked)
        .map((item) => item.value);
    return values.length ? values[0] : '';
}

const createItemsHTML = length => {
    const result = [];
    while (length-- > 0) {
        const menu = document.createElement('section');
        const photo = document.createElement('div');
        const info = document.createElement('div');
        const name = document.createElement('p');
        const toppings = document.createElement('p');
        const bottom = document.createElement('div');
        const price = document.createElement('p');
        const btn = document.createElement('btn');

        menu.classList.add('c-menu');
        photo.classList.add('c-menu__photo');
        info.classList.add('c-menu__info');
        name.classList.add('c-menu__name');
        toppings.classList.add('c-menu__toppings');
        bottom.classList.add('c-menu__bottom')
        price.classList.add('c-menu__price');
        btn.classList.add('c-menu__btn');

        info.append(name, toppings);
        bottom.append(price, btn);
        menu.append(photo, info, bottom);
        result.push(menu);
        btn.addEventListener('click', (e) => showConfirmation(e.target));
    }
    return result;
}

const showConfirmation = item => {
    const prompt = document.querySelector('.c-confirm');
    const btn = document.createElement('button');
    const btn_container = document.querySelector('.c-confirm__btns');
    let title = item.parentNode.parentNode;

    if (title.classList.contains('c-menu'))
        title = title.getAttribute('data-item');
    btn.classList.add('c-confirm__delete-btn');
    btn.setAttribute('data-delete', title);
    btn.addEventListener('click', (e) => deleteMenuItem(e.target), {
        once: true
    });
    btn.textContent = 'Delete';
    btn_container.appendChild(btn);
    prompt.classList.remove("h-hide");
    renderBlur();
}

const closeConfirmation = e => {
    if (e) e.preventDefault();
    const popup = document.querySelector('.c-confirm');
    const btn = document.querySelector('.c-confirm__delete-btn');

    btn.parentNode.removeChild(btn);
    popup.classList.add('h-hide');
    removeBlur();
}

const addDataToMenuItem = (pizza, item) => {
    if (pizza.photo) {
        item.querySelector('.c-menu__photo').style.backgroundImage = `url(${pizza.photo})`;;
    }
    item.querySelector('.c-menu__name').textContent = pizza.name;
    addChillies(item, pizza.hotness);
    item.querySelector('.c-menu__price').textContent = `${'$' + Number(pizza.price).toFixed(2)}`;
    item.querySelector('.c-menu__btn').textContent = 'Delete';
    item.querySelector('.c-menu__toppings').textContent = `${'Toppings: ' + pizza.toppings.join(', ')+'.'}`;
    item.setAttribute('data-item', pizza.name);
}

const addChillies = (item, hotness) => {
    let i = hotness;
    //appending spaces
    item.querySelector('.c-menu__name').append("\u00A0");
    item.querySelector('.c-menu__name').append("\u00A0");
    item.querySelector('.c-menu__name').append("\u00A0");
    while (i-- > 0) {
        const img = document.createElement('img');
        img.setAttribute('src', 'images/chilli.svg');
        img.setAttribute('width', '20');
        img.setAttribute('height', '20');
        img.setAttribute('alt', 'chilli');
        img.classList.add('c-menu__chilly');
        item.querySelector('.c-menu__name').appendChild(img);
    }
}

const renderMenuItem = (item) => {
    if (!item) return;
    const screen = document.querySelector('.c-render');
    screen.querySelector('.js-open-form-btn').classList.add('h-hide');
    screen.appendChild(item);
}

const renderForm = () => {
    const popup = document.querySelector('.c-popup');
    popup.classList.remove('h-hide');
    renderBlur();
}

const renderBlur = () => {
    const blur = document.createElement('div');
    blur.classList.add('h-blur');
    document.body.appendChild(blur);
}

const closeForm = e => {
    if (e) e.preventDefault();
    const popup = document.querySelector('.c-popup');
    popup.classList.add('h-hide');
    clearForm();
    removeBlur();
}

const clearForm = () => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type == 'text' || input.type == 'number') {
            input.value = '';
        } else {
            input.setAttribute('checked', false);
            input.removeAttribute('checked');
        }
    });
}

const removeBlur = () => {
    const blur = document.querySelector('.h-blur');
    blur.parentNode.removeChild(blur);
}

const deleteMenuItem = (item) => {
    const title = item.getAttribute('data-delete');
    const menu = document.querySelector((`[data-item="${title}"]`));
    if (menu.classList.contains('c-menu')) {
        menu.parentNode.removeChild(menu);
    }
    LocalStorage.removePizza(title);
    closeConfirmation();
}

const deleteTopping = e => {
    e.preventDefault();
    e.target.parentNode.removeChild(e.target);
}

const addTopping = () => {
    const input = inputTopping.value;
    if (!input) return;
    if (input.includes(' ') && !input.includes('"')) {
        renderTopping(input.trim());
        inputTopping.value = '';
    }
    if (input.includes('"') && input.match(/["]/g || []).length == 2) {
        renderTopping(input);
        inputTopping.value = '';
    }
}

const renderTopping = input => {
    input = input.replace(/[^a-zA-Z0-9 '-]/g, "");
    if (!input.length || input.includes('\n\t\r\b')) return;
    const btn = document.createElement('button');
    const container = document.querySelector('.c-render__toppings')

    btn.setAttribute("class", "c-popup__topping js-delete-topping");
    btn.setAttribute("type", "button");
    btn.addEventListener('click', (e) => deleteTopping(e), {
        once: true
    });
    btn.innerText = `${input}`;
    container.appendChild(btn);
}

const sortByPrice = () => {
    if (sortByPriceBtn.classList.contains('h-active')) return;
    const menu = LocalStorage.getMenu();
    if (!menu.length) return;
    menu.sort((a, b) => a.price - b.price);
    changeMenuOrder(menu);
    styleFilterBtn(sortByPriceBtn);
}

const sortByHotness = () => {
    if (sortByHotnessBtn.classList.contains('h-active')) return;
    const menu = LocalStorage.getMenu();
    if (!menu.length) return;
    menu.sort((a, b) => b.hotness - a.hotness);
    changeMenuOrder(menu);
    styleFilterBtn(sortByHotnessBtn);
}

const sortByDate = () => {
    if (sortByDateBtn.classList.contains('h-active')) return;
    const menu = LocalStorage.getMenu();
    if (!menu.length) return;
    changeMenuOrder(menu);
    styleFilterBtn(sortByDateBtn);
}

const changeMenuOrder = (menu) => {
    const current = document.querySelectorAll('.c-menu');

    current.forEach((item, index) => {
        addDataToMenuItem(menu[index], item);
    })
}

const styleFilterBtn = btn => {
    const btns = document.querySelectorAll('.c-filters__btn');

    btns.forEach(b => b.classList.remove('h-active'));
    btn.classList.add('h-active');
}

handleMenu();

openFormBtns.forEach(btn => btn.addEventListener('click', renderForm));
closeFormBtn.addEventListener('click', (e) => closeForm(e));
closeConfirmationBtn.addEventListener('click', (e) => closeConfirmation(e));
addPizzaBtn.addEventListener('click', (e) => addPizza(e));
inputTopping.addEventListener('keyup', addTopping);
sortByPriceBtn.addEventListener('click', sortByPrice);
sortByHotnessBtn.addEventListener('click', sortByHotness);
sortByDateBtn.addEventListener('click', sortByDate);
'use strict';

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

let counter = dataBase.length;

const modalAdd = document.querySelector('.modal__add'),
    addAd = document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    modalItem = document.querySelector('.modal__item'),
    catalog = document.querySelector('.catalog'),
    modalBtnWarning = document.querySelector('.modal__btn-warning'),
    modalFileInput = document.querySelector('.modal__file-input'),
    modalFileBtn = document.querySelector('.modal__file-btn'),
    modalImageAdd = document.querySelector('.modal__image-add'),
    searchInput = document.querySelector('.search__input'),
    menu = document.querySelector('.menu'),
    menuContainer = document.querySelector('.menu__container');

const modalImageItem = document.querySelector('.modal__image-item'),
    modalDescriptionItem = document.querySelector('.modal__description-item'),
    modalHeaderItem = document.querySelector('.modal__header-item'),
    modalCostItem = document.querySelector('.modal__cost-item'),
    modalStatusItem = document.querySelector('.modal__status-item');

const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

const elementsModalSubmit = [...modalSubmit.elements]
    .filter(elem => elem.tagName !== 'BUTTON');

const infoPhoto = {};

const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));

const closeModal = event => {
    const target = event.target;

    if (target.closest('.modal__close') ||
    target.classList.contains('modal') ||
    event.code === 'Escape') {
        modalAdd.classList.add('hide');
        modalItem.classList.add('hide');
        document.removeEventListener('keydown', closeModal);
        modalSubmit.reset();
        modalImageAdd.src = srcModalImage;
        modalFileBtn.textContent = textFileBtn;
        checkForm();
    }
};

const renderCard = (DB = dataBase) => {
    catalog.textContent = '';
    
    DB.forEach((item, i) => {
        catalog.insertAdjacentHTML('beforeend', `
            <li class="card" data-id-item="${item.id}">
                <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
                <div class="card__description">
                    <h3 class="card__header">${item.nameItem}</h3>
                    <div class="card__price">${item.costItem} ₽</div>
                </div>
            </li>
        `);
    });
};

searchInput.addEventListener('input', () => {
    const valueSearch = searchInput.value.trim().toLowerCase();

    if (valueSearch.length > 2) {
        const result = dataBase.filter(item => item.nameItem.toLowerCase().includes(valueSearch) || 
        item.descriptionItem.toLowerCase().includes(valueSearch));
        renderCard(result);
    }
});

const checkForm = () => {
    const validForm = elementsModalSubmit.every(elem => elem.value);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : '';
};

modalFileInput.addEventListener('change', event => {
    const target = event.target;

    const reader = new FileReader();

    const file = target.files[0];

    infoPhoto.filename = file.name;
    infoPhoto.size = file.size;

    reader.readAsBinaryString(file);

    reader.addEventListener('load', event => {
        if (infoPhoto.size < 200000) {
            modalFileBtn.textContent = infoPhoto.filename;
            infoPhoto.base64 = btoa(event.target.result);
            modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
        } else {
            modalFileBtn.textContent = 'Максимальный размер файла - 200кб';
            modalFileInput.value = '';
            checkForm();
        }
    });


});

modalSubmit.addEventListener('input', checkForm);

modalSubmit.addEventListener('submit', event => {
    event.preventDefault();
    const itemObj = {};
    for (const elem of elementsModalSubmit) {
        itemObj[elem.name] = elem.value;
    }
    itemObj.id = counter++;
    itemObj.image = infoPhoto.base64;
    dataBase.push(itemObj);
    closeModal({target: modalAdd});
    saveDB();
    renderCard();
});

addAd.addEventListener('click', () => {
    modalAdd.classList.remove('hide');
    modalBtnSubmit.disabled = true;
    document.addEventListener('keydown', closeModal);
});

modalAdd.addEventListener('click', closeModal);

catalog.addEventListener('click', () => {
    const target = event.target;
    const card = target.closest('.card');
    
    if (card) {
        console.log(dataBase);
        
        const item = dataBase.find(obj => obj.id === +card.dataset.idItem);
        
        modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
        modalDescriptionItem.textContent = item.descriptionItem;
        modalHeaderItem.textContent = item.nameItem;
        modalCostItem.textContent = `${item.costItem} ₽`;
        modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У';
        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModal);
    }
});

menuContainer.addEventListener('click', event => {
    const target = event.target;

    if (target.tagName === 'A') {
        const result = dataBase.filter(item => item.category === target.dataset.category);

        renderCard(result);
    }
});

modalItem.addEventListener('click', closeModal);

renderCard();
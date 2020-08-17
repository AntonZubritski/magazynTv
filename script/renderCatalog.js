let innerContent = document.getElementById("innerContent");
let sideBar = document.getElementById("sidebar");
let cartCount = [];

//Добавить в корзину
const btnActiveGood = () => {
    let btnGoods = document.querySelectorAll('.btnGoods');
    if (cartCountStorSplit !== 0){
        for (let btnGood of btnGoods) {
            for (let cartActive of cartCountStorSplit)
                if (cartActive === btnGood.dataset.id) {
                    btnGood.classList.add("active2");
                    btnGood.innerHTML = "Удалить из корзины";
                }
        }
    }
};

//Удалить из корзины
let btnClick = e => {
    let id = e.getAttribute('data-id');
    console.log(id);

//Ищет класс 'active2', слайсит его из массива и перезаписывает local Storage
    if (e.classList.contains('active2')) {
        cartCount.map(function (el, index) {
            if(el === id) {

                e.classList.remove("active2");
                e.innerHTML = "Купить";
                cartCount.splice(index,1);
                localStorage.setItem('Key', JSON.stringify(cartCount));
            }
        });
        counter();

    } else {
        e.classList.add("active2");
        e.innerHTML = "Удалить из корзины";
        cartCount.push(id);
        localStorage.setItem('Key', JSON.stringify(cartCount));
        counter();
    }
    console.log(cartCount);
};

// Рендер постеров(фильмов) на страницу через get 'posterInfo' => constructor.js
function renderCat() {

    filmArray.map((film, key) =>{
        innerContent.innerHTML += film.posterInfo
    })
}
// Рендер  обратно в каталог и сносит модалку
function catalogList() {
    if (innerContent !== null){

        innerContent.innerHTML = "";
        renderCat();
        innerContent.classList.remove("modalCatalog");
        sideBar.style.display = "flex";
    }
}

// Promise // Ожидание запроса
if (innerContent){

    new Promise( async function (resolve, reject) {
        resolve(await jsonFilmFeed())
    }).then(function () {
        filmArray = filmArrayArray.map((arr, index) => {
            if (index <= 9){return  filmArrayArray[index].concat(filmArrayArray[index+1])}
        });
        filmArray = filmArrayArray[0].concat(filmArrayArray[1],filmArrayArray[2],filmArrayArray[3],filmArrayArray[4]);

    })
        .then(() =>  jsonTreilerArray())
        .then(function () {
            catalogList();
        })
        .then(()=>{
            btnActiveGood();
        });

}

//---------------------------------Modal window
//Отлавливает нужный data-id и рендерит модалку из filmArray[id] через конструктор и гет запрос modalInfo
let index = (i) => {
    let treilerId = document.getElementById("treiler");

    const attr = i.getAttribute("data-id");
    innerContent.innerHTML = "";
    console.log('data-id',attr);

    innerContent.innerHTML = filmArray[attr].modalInfo;
    innerContent.classList.add("modalCatalog");

    sideBar.style.display = "none";
};

//---------------------------------Modal END

//---------------------------------Modal Coment
//---------------------------------Coment END

// Счетчик товаров и обновление // Проверка на запись в localStorage - что б не выкидывало ошибку
if (localStorage.getItem('Key') !== null) {
    replaceCount();

    function replaceCount() {
        cartCountStor = localStorage.getItem('Key').replace(/[^,\d;]/g, '');
        cartCountStorSplit = cartCountStor.split(',');
        cartCount = cartCountStorSplit;
    }
}

// Запуск счетчика из cart.js при загрузке
window.onload = function(){
    counter();
};
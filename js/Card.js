'use strict';

(function () {

  /**
   * Конструктор карточки с описанием объявления.
   * @param {Object} data - Данные объявления.
   * @param {string} data.offer.title - Заголовок объявления.
   * @param {string} data.author.avatar - Ссылка на изображение аватара автора.
   * @param {string} data.offer.address - Адрес в объявлении.
   * @param {number} data.offer.price - Цена за ночь.
   * @param {string} data.offer.type - Тип жилья.
   * @param {number} data.offer.rooms - Количество комнат.
   * @param {string} data.offer.checkin - Время заезда.
   * @param {string} data.offer.checkout - Время выезда.
   * @param {string} data.offer.description - Описание объявления.
   * @param {Array} data.offer.features - Приемущества аппартаментов.
   * @param {Array} data.offer.photos - Фотографии аппартаментов.
   */
  function Card(data) {
    this.template = document.querySelector('#card').cloneNode(true).content;
    this.template.querySelector('.popup__title').textContent = data.offer.title;
    this.template.querySelector('.popup__avatar').setAttribute('src', data.author.avatar);
    this.template.querySelector('.popup__text--address').textContent = data.offer.address;
    this.template.querySelector('.popup__text--price').textContent = data.offer.price + ' ₽/ночь';
    this.template.querySelector('.popup__type').textContent = this.getType(data.offer.type);
    this.template.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей.';
    this.template.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout + '.';
    this.template.querySelector('.popup__description').textContent = data.offer.description;

    this.closeButton = this.template.querySelector('.popup__close');

    this.featuresList = this.template.querySelector('.popup__features');
    this.featuresList.textContent = '';
    if (data.offer.features.length > 0) {
      this.featuresList.appendChild(this.getFeatures(data.offer.features));
    }

    this.photosList = this.template.querySelector('.popup__photos');
    this.photosList.textContent = '';
    if (data.offer.photos.length > 0) {
      this.photosList.appendChild(this.getPhotos(data.offer.photos));
    }
  }

  /**
   * Переводит название типа жилья на русский язык и возвращает его.
   * @param {string} type - Тип жилья.
   * @return {string}
   */
  Card.prototype.getType = function (type) {
    var current;
    switch (type) {
      case 'flat':
        current = 'Квартира';
        break;
      case 'bungalo':
        current = 'Бунгало';
        break;
      case 'house':
        current = 'Дом';
        break;
      case 'palace':
        current = 'Дворец';
        break;
      default:
        current = 'Неизвестно';
    }
    return current;
  };

  /**
   * Возвращает сгенерированные приемущества в виде HTML-элемента.
   * @param {Array} features - Приемущества.
   * @return {HTMLElement}
   */
  Card.prototype.getFeatures = function (features) {
    var fragment = document.createDocumentFragment();
    features.forEach(function (feature) {
      var item = {
        element: document.createElement('li'),
        class: 'popup__feature popup__feature--' + feature
      };
      item.element.className = item.class;
      fragment.appendChild(item.element);
    });
    return fragment;
  };

  /**
   * Возвращает сгенерированные изображения в виде HTML-элемента.
   * @param {Array} photos - Ссылки на фотографии.
   * @return {HTMLElement}
   */
  Card.prototype.getPhotos = function (photos) {
    var fragment = document.createDocumentFragment();
    photos.forEach(function (photo) {
      var image = {
        element: document.createElement('img'),
        class: 'popup__photo',
        width: 45,
        height: 40
      };
      image.element.className = image.class;
      image.element.setAttribute('src', photo);
      image.element.setAttribute('width', image.width);
      image.element.setAttribute('height', image.height);
      fragment.appendChild(image.element);
    });
    return fragment;
  };

  /**
   * Показывает карточку с описанием объявления.
   * @param {HTMLElement} landscape - Контейнер, в котором должна находится карточка.
   */
  Card.prototype.show = function (landscape) {
    this.landscape = landscape;
    this.onCloseButtonClick = this.hide.bind(this);
    this.onKeydown = this.keydown.bind(this);
    document.addEventListener('keydown', this.onKeydown);
    this.closeButton.addEventListener('click', this.onCloseButtonClick);
    this.landscape.appendChild(this.template);
  };

  /** Прячет (удаляет) карточку с описанием объявления. */
  Card.prototype.hide = function () {
    this.closeButton.removeEventListener('click', this.onCloseButtonClick);
    this.landscape.removeChild(this.landscape.querySelector('.map__card'));
    document.removeEventListener('keydown', this.onKeydown);
  };

  /** Слушатель нажатия на клавишу.
   * @param {KeyboardEvent} evt - Событие нажатия на клавишу.
   */
  Card.prototype.keydown = function (evt) {
    if (evt.keyCode === window.utils.keycode.ESC) {
      this.hide();
    }
  };

  window.Card = Card;
})();

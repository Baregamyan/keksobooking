'use strict';

(function () {

  /** Настройки для моков */
  var Config = {
    TITLES: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
    PRICE: {MIN: 1000, MAX: 10000},
    TYPES: ['palace', 'flat', 'house', 'bungalo'],
    ROOMS: {MIN: 1, MAX: 5},
    GUESTS: {MIN: 1, MAX: 8},
    CHECKIN_TIMES: ['12:00', '13:00', '14:00'],
    CHECKOUT_TIMES: ['12:00', '13:00', '14:00'],
    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    DESCRIPTIONS: '',
    PHOTOS: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
    LOCATION: {
      X: {MIN: 0},
      Y: {MIN: 130, MAX: 630}
    }
  };

  /**
    * Конструктор создания моков-объявлений.
    * @param {number} number - Порядковый номер объявления.
    * @param {Object} config - Настройки объявления.
    * @param {Array} config.TITLES - Заголовки объявлений.
    * @param {Array} config.CHECKIN_TIMES - Время заселения в аппартаменты.
    * @param {Array} config.CHECKOUT_TIMES - Время выселения из аппартаментов.
    * @param {Array} config.FEATURES - Приемущества аппартаментов.
    * @param {Array} config.DESCRIPTIONS - Описание объявления.
    * @param {Array} config.PHOTOS - Ссылки на фотографии.
    * @param {number} config.PRICE.MIN - Минимально-возможная цена.
    * @param {number} config.PRICE.MAX - Максимально-возможная цена.
    * @param {number} config.GUESTS.MIN - Минимальное количество гостей.
    * @param {number} config.GUESTS.MAX - Максимальное количество гостей.
    * @param {number} config.LOCATION.X.MIN - Минимально-возможное расположение объявления на карте по горизонтали.
    * @param {number} config.LOCATION.Y.MIN - Минимально-возможное расположение объявления на карте по вертикали.
    * @param {number} config.LOCATION.Y.MIN - Максимально-возможное расположение объявления на карте по вертикали.
    * @return {Object} - Возвращает мок.
    */
  function Mock(number, config) {
    this.config = config || Config;
    this.author = {
      avatar: 'img/avatars/user0' + (number + 1) + '.png'
    };
    this.offer = {
      title: this.config.TITLES[window.utils.randomInit(0, this.config.TITLES.length - 1)],
      address: window.utils.randomInit() + ', ' + window.utils.randomInit(),
      price: window.utils.randomInit(this.config.PRICE.MIN, this.config.PRICE.MAX),
      type: this.config.TYPES[window.utils.randomInit(0, this.config.TYPES.length - 1)],
      rooms: window.utils.randomInit(this.config.ROOMS.MIN, this.config.ROOMS.MAX - 1),
      guests: window.utils.randomInit(this.config.GUESTS.MIN, this.config.GUESTS.MAX - 1),
      checkin: this.config.CHECKIN_TIMES[window.utils.randomInit(0, this.config.CHECKIN_TIMES.length - 1)],
      checkout: this.config.CHECKOUT_TIMES[window.utils.randomInit(0, this.config.CHECKOUT_TIMES.length - 1)],
      features: this.config.FEATURES.slice(window.utils.randomInit(0, this.config.FEATURES.length)),
      description: '',
      photos: window.utils.shuffle(this.config.PHOTOS)
    };
    this.location = {
      x: window.utils.randomInit(this.config.LOCATION.X.MIN, this.getMapWidth()),
      y: window.utils.randomInit(this.config.LOCATION.Y.MIN, this.config.LOCATION.Y.MAX)
    };
    return this;
  }

  /**
   * Возвращает ширину карты.
   * @return {number}
   */
  Mock.prototype.getMapWidth = function () {
    var _map = document.querySelector('.map');
    return _map.offsetWidth;
  };

  window.Mock = Mock;

})();

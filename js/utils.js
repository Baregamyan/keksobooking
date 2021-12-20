'use strict';

(function () {

  /** Кейкоды клавиш */
  var Keycode = {
    ESC: 27,
    ENTER: 13
  };

  /**
   * Возвращает случайное число.
   * @param {number} min - Минимально-возможное число.
   * @param {number} max - Максимально-возможное число.
   * @return {number}
   */
  function getRandomInit(min, max) {
    var _min = min || 0;
    var _max = max || 700;
    var _rand = _min + Math.random() * (_max - _min);
    return Math.round(_rand);
  }

  /**
   * Перемешивает элеметы в массиве и возвращает перемешанный массив.
   * @param {Array} array - Массив.
   * @return {Array}
   */
  function shuffleArray(array) {
    var uniques = [];
    var i = 0;
    while (i < array.length) {
      var _element = array[window.utils.randomInit(0, array.length - 1)];
      if (!uniques.includes(_element)) {
        uniques.push(_element);
        i++;
      }
    }
    return uniques;
  }

  /**
   * Конструктор сообщения.
   * @param {HTMLElement} template - HTML-элемент.
   */
  function Message(template) {
    this.template = template;
    this.hasCloseButton = false;
    this.main = document.querySelector('main');
  }

  /**
   * Показывает сообщение.
   * @param {boolean} hasCloseButton - Содержит ли сообщение кнопку закрытия.
   */
  Message.prototype.show = function (hasCloseButton) {
    if (hasCloseButton) {
      this.button = this.template.querySelector('.error__button');
      this.onButtonClick = this.close.bind(this);
      this.button.addEventListener('click', this.onButtonClick);
      this.isCloseButton = true;
    }
    this.onKeydown = this.keydown.bind(this);
    this.main.appendChild(this.template);
    document.addEventListener('keydown', this.onKeydown);
  };

  /**
   * Показывает сообщение.
   * @param {boolean} hasCloseButton - Содержит ли сообщение кнопку закрытия.
   */
  Message.prototype.close = function () {
    if (this.hasCloseButton) {
      this.button.removeEventListener('click', this.onButtonClick);
    }
    document.removeEventListener('keydown', this.onKeydown);
    this.main.lastElementChild.remove();
  };

  Message.prototype.keydown = function (evt) {
    if (evt.keyCode === Keycode.ESC) {
      this.close();
    }
  };

  window.utils = {
    Message: Message,
    keycode: Keycode,
    randomInit: getRandomInit,
    shuffle: shuffleArray
  };
})();



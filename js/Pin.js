'use strict';

(function () {
  /**
   * Конструкор метки объявления на карте.
   * Возвращает HTML-элемент отметки.
   * @param {string} title - Заголовок объявления.
   * @param {string} avatar - Ссылка за аватар автора объявления.
   * @param {number} x - Положение метки на карте по горизонтали.
   * @param {number} y - Положение метки на карте по вертикали.
   * @return {HTMLElement}
   */
  function Pin(title, avatar, x, y) {
    this.title = title;
    this.avatar = avatar;
    this.x = x;
    this.y = y;

    this.template = document.querySelector('#pin').cloneNode(true).content;
    this.pin = this.template.querySelector('.map__pin');
    this.location = {
      x: this.x + (this.pin.offsetWidth / 2),
      y: this.y - this.pin.offsetHeight
    };

    this.pin.style.left = this.location.x + 'px';
    this.pin.style.top = this.location.y + 'px';
    this.pin.firstElementChild.setAttribute('src', this.avatar);
    this.pin.firstElementChild.setAttribute('alt', this.title);

    return this.pin;
  }

  window.Pin = Pin;

})();

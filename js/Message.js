'use strict';

function Message(text, result, form) {
  this.text = text;
  this.result = result;
  this.form = form || false;
  this.show();
}

Message.prototype.show = function () {
  this.main = document.querySelector('main');

  this.messageTemplate = document.querySelector('#' + this.result).cloneNode(true).content;
  this.messageTemplate.querySelector('.' + this.result + '__message').textContent = this.text;

  this.onKeydown = this.keydown.bind(this);
  this.onCloseButtonClick = this.hide.bind(this);

  if (this.result === 'error') {
    this.closeButton = this.messageTemplate.querySelector('.error__button');
    this.closeButton.addEventListener('click', this.onCloseButtonClick);
  }

  this.main.appendChild(this.messageTemplate);
  document.addEventListener('keydown', this.onKeydown);
};

Message.prototype.hide = function () {
  if (this.closeButton) {
    this.closeButton.removeEventListener('click', this.onCloseButtonClick);
  }
  this.main.lastElementChild.remove();
  document.removeEventListener('keydown', this.onKeydown);
  if (this.form) {
    this.form.disable();
  }
};

Message.prototype.keydown = function (evt) {
  if (evt.keyCode === window.utils.keycode.ESC) {
    this.hide();
  }
};

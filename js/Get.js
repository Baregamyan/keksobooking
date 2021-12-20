'use strict';

(function () {
  var Config = {
    200: {
      MESSAGE: 'Ура! Объявление успешно отправлено!',
      IS_SUCCESS: true,
    },
    400: {
      MESSAGE: 'Ошибка! Проблема с адресом получения данных. Попробуйте обновить страницу.',
      IS_SUCCESS: false
    },
    401: {
      MESSAGE: 'Ошибка! Вы не авторизованы. Зарегестрируйтесь или войдите под своим логином и обновите страницу.',
      IS_SUCCESS: false
    },
    403: {
      MESSAGE: 'Вам запрещено получать данные с сервера. Свяжитесь с администратором или поробуйте снова позже.',
      IS_SUCCESS: false
    },
    404: {
      MESSAGE: 'Ошибка! Ошибка сервера. Возможно, ведутся работы. Попробуйте снова чуть позже.',
      IS_SUCCESS: false
    },
    500: {
      MESSAGE: 'Ошибка! Проверьте введённые данные и повторите отправку объявления.',
      IS_SUCCESS: false
    },
    0: {
      MESSAGE: 'Ошибка! Возможно, у Вас пропал интернет или у нас упал сервер.',
      IS_SUCCESS: false
    },
    TIMEOUT: {
      MS: 10000,
      MESSAGE: 'УПС: Время ожидания прошло. Проверьте скорость интернета.'
    },
    UNKNOW_ERROR: 'Неизвестная ошибка! Перезагрузите сайт.'
  };

  function Get(landScape) {
    this.landScape = landScape;
    this.config = Config;

    this.xhr = new XMLHttpRequest();

    this.xhr.responseType = 'json';
    this.xhr.timeout = this.config.TIMEOUT.MS;

    this.xhr.open('GET', 'https://javascript.pages.academy/keksobooking');

    this.onXhrLoad = this.load.bind(this);
    this.onXhrError = this.error.bind(this);
    this.onXhrTimeout = this.timeout.bind(this, this.config.TIMEOUT.MESSAGE);

    this.xhr.addEventListener('load', this.onXhrLoad);
    this.xhr.addEventListener('error', this.onXhrError);
    this.xhr.addEventListener('timeout', this.onXhrTimeout);

    this.xhr.send();
  }

  Get.prototype.load = function () {
    var config = this.config[this.xhr.status];
    var message;
    var result;
    if (config) {
      message = config.MESSAGE;
      if (config.IS_SUCCESS) {
        result = 'success';
        this.landScape.activate(this.xhr.response);
      } else {
        result = 'error';
      }
    } else {
      result = 'error';
      message = this.config.UNKNOW_ERROR;
    }
    this.message = new window.Message(message, result);
  };

  Get.prototype.error = function () {
    var config = this.currentConfig[this.xhr.status];
    var message;
    if (config) {
      message = config.MESSAGE;
    } else {
      message = this.currentConfig.UNKNOW_ERROR;
    }
    this.message = new window.Message(message, 'error');
  };

  Get.prototype.timeout = function (message) {
    this.message = new window.Message(message, 'error');
  };

  window.Get = Get;
})();

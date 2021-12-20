'use strict';

(function () {

  /** Настройки для формы. */
  var Config = {
    200: {
      MESSAGE: 'Ура! Объявление успешно отправлено!',
      IS_SUCCESS: true
    },
    400: {
      MESSAGE: 'Ошибка! Проблема с адресом отправки. Попробуйте снова чуть позже.',
      IS_SUCCESS: false
    },
    401: {
      MESSAGE: 'Ошибка! Вы не авторизованы. Зарегестрируйтесь или войдите под своим логином и поробуйте снова.',
      IS_SUCCESS: false
    },
    403: {
      MESSAGE: 'Вам запрещено отправлять объявление. Свяжитесь с администратором или поробуйте снова позже.',
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

  function Upload(form) {
    this.config = Config;
    this.form = form;
    this.formEl = this.form.form;

    var data = new FormData(this.formEl);
    this.xhr = new XMLHttpRequest();

    this.xhr.responseType = 'json';
    this.xhr.timeout = this.config.TIMEOUT.MS;

    this.xhr.open('POST', 'https://javascript.pages.academy/keksobooking');

    this.onXhrLoad = this.load.bind(this);
    this.onXhrError = this.error.bind(this);
    this.onXhrTimeout = this.timeout.bind(this, this.config.TIMEOUT.MESSAGE);

    this.xhr.addEventListener('load', this.onXhrLoad);
    this.xhr.addEventListener('error', this.onXhrError);
    this.xhr.addEventListener('timeout', this.onXhrTimeout);

    this.xhr.send(data);
  }

  Upload.prototype.load = function () {
    var config = this.config[this.xhr.status];
    var message;
    var result;
    if (config) {
      message = config.MESSAGE;
      if (config.IS_SUCCESS) {
        result = 'success';
      } else {
        result = 'error';
      }
    } else {
      result = 'error';
      message = this.config.UNKNOW_ERROR;
    }
    this.message = new window.Message(message, result, this.form);
  };

  Upload.prototype.error = function () {
    var config = this.config[this.xhr.status];
    var message;
    if (config) {
      message = config.MESSAGE;
    } else {
      message = this.config.UNKNOW_ERROR;
    }
    this.message = new window.Message(message, 'error', this.form);
  };

  Upload.prototype.timeout = function (message) {
    this.message = new window.Message(message, 'error', this.form);
  };

  window.Upload = Upload;
})();

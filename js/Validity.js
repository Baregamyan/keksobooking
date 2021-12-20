'use strict';

(function () {

  /** Настройки для валидации. */
  var Config = {
    TITLE: {
      LENGTH: {
        MIN: 30,
        MAX: 100,
        getRule: function (type) {
          var text = type === 'min' ? ' меньше ' + this.MIN + ' cимволов.' : ' больше ' + this.MAX + ' символов.';
          return 'Длина поля не должна быть ' + text;
        }
      },
    },
    PRICE: {
      BUNGALO: {
        MIN: 0,
        MAX: 1000000,
        getRule: function (type) {
          if (type === 'min') {
            return 'Цена должна быть больше ' + this.MIN + '.';
          } else {
            return 'Цена не должна превышать ' + this.MAX + '.';
          }
        }
      },
      FLAT: {
        MIN: 1000,
        MAX: 1000000,
        getRule: function (type) {
          if (type === 'min') {
            return 'Цена должна быть больше ' + this.MIN + '.';
          } else {
            return 'Цена не должна превышать ' + this.MAX + '.';
          }
        }
      },
      HOUSE: {
        MIN: 5000,
        MAX: 1000000,
        getRule: function (type) {
          if (type === 'min') {
            return 'Цена должна быть больше ' + this.MIN + '.';
          } else {
            return 'Цена не должна превышать ' + this.MAX + '.';
          }
        }
      },
      PALACE: {
        MIN: 10000,
        MAX: 1000000,
        getRule: function (type) {
          if (type === 'min') {
            return 'Цена должна быть меньше ' + this.MIN + '.';
          } else {
            return 'Цена не должна превышать ' + this.MAX + '.';
          }
        }
      },
      REGEXP: {
        RULE: 'Поле может содержать только цифры.',
        VALUE: new RegExp('[0-9]')
      }
    },
    ROOM: {
      1: {
        TEXT: 'Одна комната вмещает только 1-го гостя.',
        CAPACITY: [1]
      },
      2: {
        TEXT: 'Две комнаты вмещают в себя от 1-ого до 2-ух гостей.',
        CAPACITY: [1, 2]
      },
      3: {
        TEXT: 'Три комнаты вмещают в себя от 1-ого до 3-ёх гостей.',
        CAPACITY: [1, 2, 3]
      },
      100: {
        TEXT: 'Не для гостей.',
        CAPACITY: [0]
      }
    }
  };

  /**
   * Конструктор валидации.
   * @param {Object} inputs - Поля в форме.
   * @param {HTMLElement} inputs.title - Поле с заголовком объявления.
   * @param {HTMLElement} input.address - Поле с адресом объявления.
   * @param {HTMLElement} input.type - Поле с выбором типа жилья.
   * @param {HTMLElement} input.price - Поле с ценой за сутки.
   * @param {HTMLElement} input.timein - Поле с временем заезда.
   * @param {HTMLElement} input.timeout - Поле с временем выезда.
   * @param {HTMLElement} input.rooms - Поле с количество комнат.
   * @param {HTMLElement} input.capacity - Поле с количеством гостей.
   */
  function Validity(inputs) {
    this.input = inputs;
    this.fields = Object.values(this.input);
    this.config = Config;
    this.rules = [];
    this.checks = {
      title: [this.checkLength, this.checkEmpty],
      price: [this.checkEmpty, this.checkNumberValue, this.checkSymbols],
      rooms: [this.setEnableCapacity],
      time: [this.syncTime]
    };
  }

  /** Иницирует валидацию. Навешивает слушатели события на нужные поля. */
  Validity.prototype.init = function () {
    this.onAddressKeydown = this.keydown.bind(this);
    this.onTypeFieldChange = this.changeMinPrice.bind(this);
    this.onTimeChange = this.syncTime.bind(this);
    this.input.type.addEventListener('change', this.onTypeFieldChange);
    this.input.address.addEventListener('keydown', this.onAddressKeydown);
    this.input.timein.addEventListener('change', this.onTimeChange);
    this.input.timeout.addEventListener('change', this.onTimeChange);
    this.onFieldFocus = this.focus.bind(this);
    for (var i = 0; i < this.fields.length; i++) {
      this.fields[i].addEventListener('focus', this.onFieldFocus);
    }
    this.changeMinPrice();
    this.setEnableCapacity();
  };

  /**
   * Событие нажатия на клавишу для отмены действия.
   * @param {Object} evt - Объект события.
   */
  Validity.prototype.keydown = function (evt) {
    evt.preventDefault();
  };

  /**
   * Синхронизирует время заезда и время выезда.
   * @param {Object} evt - Объект события.
   */
  Validity.prototype.syncTime = function (evt) {
    var target = evt.target;
    var value = target[target.selectedIndex].value;
    var options;
    if (target.name === 'timein') {
      options = Array.from(this.input.timeout.children);
    } else {
      options = Array.from(this.input.timein.children);
    }
    options.forEach(function (option) {
      if (option.value === value) {
        option.toggleAttribute('selected', true);
      }
    });
  };

  /**
   * Событие фокуса на поле.
   * @param {Object} evt - Объект события.
   */
  Validity.prototype.focus = function (evt) {
    var field = evt.target;
    this.onFieldInput = this.check.bind(this, field);
    this.onFieldBlur = this.blur.bind(this, field);
    field.addEventListener('input', this.onFieldInput);
    field.addEventListener('blur', this.onFieldBlur);
  };

  /**
   * Событие потери фокуса на поле.
   * @param {HTMLElement} field - Поле, фокус которого был потерян.
   */
  Validity.prototype.blur = function (field) {
    field.removeEventListener('input', this.onFieldInput);
  };

  /**
   * Прогон поля по проверкам.
   * @param {HTMLElement} element - Поле, которое необходимо прогнать.
   */
  Validity.prototype.check = function (element) {
    this.isValid = true;
    var field = {
      element: element,
      rules: [],
      errors: [],
      getValue: function () {
        return this.element.value;
      },
      getName: function () {
        return this.element.name;
      },
      isRulesShowed: function () {
        return this.element.nextElementSibling ? true : false;
      }
    };
    var _currentChecks = this.checks[field.getName()];
    if (_currentChecks) {
      field.config = this.config[field.getName().toUpperCase()];
      for (var i = 0; i < _currentChecks.length; i++) {
        var _check = _currentChecks[i];
        _check.call(this, field);
      }
      this.renderRules(field);
      if (field.errors.length) {
        this.isValid = false;
        field.element.setCustomValidity(field.errors.join('\n'));
        field.element.style = 'box-shadow: 0px 0px 2px 2px red; outline: 1px solid red';
      } else {
        field.element.setCustomValidity('');
        field.element.style = 'box-shadow: 0px 0px 2px 2px green; outline: 1px solid green';
      }
    }
  };

  /**
   * Проверка на минимально и максимально допустимое значение.
   * @param {HTMLElement} field - Поле ввода.
   */
  Validity.prototype.checkNumberValue = function (field) {
    var _config = field.config[this.currentType.toUpperCase()];
    var _value = field.getValue();
    var rules = [];

    function checkMin() {
      var rule = {};
      var text = _config.getRule('min');
      rule.text = text;
      field.rules.push(rule);
      if (_value > _config.MIN) {
        rule.valid = true;
      } else {
        rule.valid = false;
        field.errors.push(rule.text);
      }
      rules.push(rule);
    }

    function checkMax() {
      var rule = {};
      var text = _config.getRule('max');
      rule.text = text;
      field.rules.push(rule);
      if (_value < _config.MAX) {
        rule.valid = true;
      } else {
        rule.valid = false;
        field.errors.push(rule.text);
      }
      rules.push(rule);
    }

    checkMin();
    checkMax();
  };

  Validity.prototype.checkSymbols = function (field) {
    var _value = field.getValue();
    var _config = field.config.REGEXP;
    var rule = {};
    rule.text = _config.RULE;

    if (!_config.VALUE.test(_value)) {
      rule.valid = false;
      field.errors.push(rule.RULE);
    } else {
      rule.valid = true;
    }
    field.rules.push(rule);
  };

  Validity.prototype.checkLength = function (field) {
    var _value = field.getValue();
    var _config = field.config.LENGTH;
    var rules = [];

    function checkMin() {
      var rule = {};
      var text = _config.getRule('min');
      rule.text = text;
      field.rules.push(rule);
      if (_value.length > _config.MIN) {
        rule.valid = true;
      } else {
        rule.valid = false;
        field.errors.push(rule.text);
      }
      rules.push(rule);
    }

    function checkMax() {
      var rule = {};
      var text = _config.getRule('max');
      rule.text = text;
      field.rules.push(rule);
      if (_value.length < _config.MAX) {
        rule.valid = true;
      } else {
        rule.valid = false;
        field.errors.push(rule.text);
      }
      rules.push(rule);
    }

    checkMin();
    checkMax();
  };

  Validity.prototype.checkEmpty = function (field) {
    var _value = field.getValue();
    var rule = {};
    rule.valid = true;
    rule.text = 'Поле должно быть заполнено.';
    if (!_value.length) {
      field.errors.push(rule.text);
      rule.valid = false;
    }
    field.rules.push(rule);
  };

  /** Изменение цены в зависимости от типа аппартаментов. */
  Validity.prototype.changeMinPrice = function () {
    this.currentType = this.input.type[this.input.type.selectedIndex].value;

    var _config = this.config.PRICE;
    var _min = _config[this.currentType.toUpperCase()].MIN;

    /** Меняем плейсхолдер на минимальную цену. */
    this.input.price.placeholder = _min;
    this.input.price.setAttribute('min', _min);
  };

  /** Устанавливает возможное количество гостей (вместимость) в аппартаментах в зависимости от количества комнат */
  Validity.prototype.setEnableCapacity = function () {
    var roomsQuantity = this.input.rooms[this.input.rooms.selectedIndex].value;
    var _config = this.config.ROOM[roomsQuantity];
    var options = Array.from(this.input.capacity.children);
    options.forEach(function (capacity) {
      if (_config.CAPACITY.includes(+capacity.value)) {
        capacity.toggleAttribute('disabled', false);
        capacity.toggleAttribute('selected', true);
      } else {
        capacity.toggleAttribute('disabled', true);
      }
    });
  };

  Validity.prototype.renderRules = function (input) {
    var rulesList;
    if (input.isRulesShowed()) {
      rulesList = input.element.nextSibling;
      rulesList.textContent = '';
      fillList(rulesList);
    } else {
      input.element.parentNode.insertBefore(createRulesList(), input.element.nextSibling);
      input.isRulesRendered = true;
    }

    function createRulesList() {
      var list = document.createElement('ul');
      list.className = 'rules';
      list.style = 'padding: 0px; list-style: none; margin: 0px';
      return fillList(list);
    }

    function fillList(list) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < input.rules.length; i++) {
        var rule = input.rules[i];
        var item = createRule(rule);
        fragment.appendChild(item);
      }
      list.appendChild(fragment);
      return list;
    }

    function createRule(rule) {
      var item = document.createElement('li');
      item.className = 'rule';
      item.textContent = rule.text;
      if (rule.valid) {
        item.style = 'padding-top: 5px; padding-bottom: 5px; margin: 0px; color: green';/** TODO: Переписать в стили?  */
      } else {
        item.style = 'padding-top: 5px; padding-bottom: 5px; margin: 0px; color: red';
      }
      return item;
    }
  };

  Validity.prototype.cancel = function () {
    this.input.type.removeEventListener('change', this.onTypeFieldChange);
    this.input.address.removeEventListener('input', this.onAddressInput);
    this.input.timein.removeEventListener('change', this.onTimeChange);
    this.input.timeout.removeEventListener('change', this.onTimeChange);

    for (var i = 0; i < this.fields.length; i++) {
      this.fields[i].removeEventListener('focus', this.onFieldFocus);
    }
  };

  Validity.prototype.checkAll = function () {
    for (var i = 0; i < this.fields.length; i++) {
      var field = this.fields[i];
      this.check(field);
    }
  };

  window.Validity = Validity;
})();

'use strict';

(function () {
  var OFFERS_MAX_QUANTITY = 5;

  var Config = {
    COORDS_LIMIT: {
      Y: {
        MIN: 130,
        MAX: 630
      }
    },
    PRICE_LEVEL: {
      MIDDLE: {
        MIN: 10000,
        MAX: 50000
      },
      LOW: {
        MIN: null,
        MAX: 10000
      },
      HIGHT: {
        MIN: 10000,
        MAX: null
      }
    }
  };

  /** Конструктор карты. */
  function Landscape() {
    this.config = Config;
    this.landscape = document.querySelector('.map');
    this.pin = {
      element: this.landscape.querySelector('.map__pin--main'),
      getX: function () {
        return this.element.offsetLeft;
      },
      getY: function () {
        return this.element.offsetTop;
      },
      changePosition: function (shift, container, config) {
        var Coord = {
          x: this.getX() - shift.x,
          y: this.getY() - shift.y
        };
        if (Coord.x < 0) {
          Coord.x = 0;
        } else if (Coord.x > container.offsetWidth - this.element.offsetWidth) {
          Coord.x = container.offsetWidth - this.element.offsetWidth;
        }
        if (Coord.y < config.Y.MIN) {
          Coord.y = config.Y.MIN;
        } else if (Coord.y > config.Y.MAX) {
          Coord.y = config.Y.MAX;
        }

        this.element.style.top = Coord.y + 'px';
        this.element.style.left = Coord.x + 'px';
      }
    };

    this.isCardOpen = false;
    this.isOffersRendered = false;

    this.onPinClick = this.click.bind(this);
    this.onPinKeydown = this.keydown.bind(this);

    this.pin.element.addEventListener('click', this.onPinClick);
    this.pin.element.addEventListener('keydown', this.onPinKeydown);

    this.filter = {
      element: this.landscape.querySelector('.map__filters'),
      getType: function () {
        return this.element.querySelector('[name="housing-type"]').value;
      },
      getPrice: function () {
        return this.element.querySelector('[name="housing-price"]').value;
      },
      getRooms: function () {
        return this.element.querySelector('[name="housing-rooms"]').value;
      },
      getGuests: function () {
        return this.element.querySelector('[name="housing-guests"]').value;
      },
      getFeatures: function () {
        var checked = [];
        var features = this.element.querySelectorAll('.map__checkbox:checked');
        features.forEach(function (feature) {
          checked.push(feature.value);
        });
        return checked;
      }
    };

    this.form = new window.Form(this);
    this.form.disable.bind(this);
    this.form.setAddress(this.pin.getX(), this.pin.getY(true));

  }

  Landscape.prototype.click = function (evt) {
    evt.preventDefault();


    this.onPinMousedown = this.mousedown.bind(this);
    this.pin.element.addEventListener('mousedown', this.onPinMousedown);
    this.activate();
  };

  Landscape.prototype.mousedown = function (evt) {
    evt.preventDefault();

    this.startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    this.onMousemove = this.mousemove.bind(this);
    this.onMouseup = this.mouseup.bind(this);

    document.addEventListener('mousemove', this.onMousemove);
    document.addEventListener('mouseup', this.onMouseup);
  };

  Landscape.prototype.mousemove = function (evtMove) {
    evtMove.preventDefault();
    var shift = {
      x: this.startCoords.x - evtMove.clientX,
      y: this.startCoords.y - evtMove.clientY
    };

    this.startCoords = {
      x: evtMove.clientX,
      y: evtMove.clientY
    };

    this.onMouseup = this.mouseup.bind(this);
    document.addEventListener('mouseup', this.onMouseup);

    this.pin.changePosition(shift, this.landscape, this.config.COORDS_LIMIT);
    this.form.setAddress(this.pin.getX() + (this.pin.element.offsetWidth / 2), this.pin.getY() + (this.pin.element.offsetHeight));
  };

  Landscape.prototype.mouseup = function (evtUp) {
    evtUp.preventDefault();

    document.removeEventListener('mousemove', this.onMousemove);
    document.removeEventListener('mouseup', this.onMouseup);
  };

  Landscape.prototype.activate = function () {
    this.pin.element.removeEventListener('click', this.onPinClick);
    this.landscape.classList.toggle('map--faded', false);
    this.form.enable();
    this.form.setAddress(this.pin.getX(), this.pin.getY());
    this.data = this.getMocks(OFFERS_MAX_QUANTITY);
    this.renderOffers(this.data);
    this.onFilterFormChange = this.renderOffers.bind(this, this.data);

    this.filter.element.addEventListener('change', this.onFilterFormChange);
  };

  Landscape.prototype.deactivate = function () {
    if (this.isOffersRendered) {
      this.cleanLandscape();
    }
    this.pin.element.addEventListener('click', this.onPinClick);
    this.filter.element.removeEventListener('change', this.onFilterFormChange);
    this.landscape.classList.toggle('map--faded', true);
  };

  Landscape.prototype.filterType = function (data) {
    var type = this.filter.getType();
    var filteredData;
    if (type !== 'any') {
      filteredData = data.filter(function (item) {
        return item.offer.type === type;
      });
    } else {
      filteredData = data;
    }
    return filteredData;
  };

  Landscape.prototype.filterPrice = function (data) {
    var config = this.config.PRICE_LEVEL[this.filter.getPrice().toUpperCase()];
    var filteredData;
    if (!config) {
      filteredData = data;
    } else {
      filteredData = data.filter(function (item) {
        return item.offer.price <= config.MAX && item.offer.price >= config.MIN;
      });
    }
    return filteredData;
  };

  Landscape.prototype.filterRooms = function (data) {
    var rooms = this.filter.getRooms();
    var filteredData;
    if (rooms === 'any') {
      filteredData = data;
    } else {
      filteredData = data.filter(function (item) {
        return item.offer.rooms === +rooms;
      });
    }
    return filteredData;
  };

  Landscape.prototype.filterFeatures = function (data) {
    var features = this.filter.getFeatures();
    var filteredData;
    if (!features.length) {
      filteredData = data;
    } else {
      features.forEach(function (feature) {
        filteredData = data.filter(function (item) {
          return item.offer.features.includes(feature);
        });
      });
    }
    return filteredData;
  };

  Landscape.prototype.filterGuests = function (data) {
    var guests = this.filter.getGuests();
    var filteredData;
    if (guests === 'any') {
      filteredData = data;
    } else {
      filteredData = data.filter(function (item) {
        return item.offer.guests === +guests;
      });
    }
    return filteredData;
  };

  Landscape.prototype.filterData = function (data) {
    var filters = [
      this.filterType.bind(this),
      this.filterPrice.bind(this),
      this.filterRooms.bind(this),
      this.filterFeatures.bind(this),
      this.filterGuests.bind(this)
    ];

    var filteredData = filters.reduce(function (acc, current) {
      return current(acc);
    }, data);

    return filteredData;
  };

  Landscape.prototype.cleanLandscape = function () {
    var _offers = this.landscape.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (_offers) {
      _offers.forEach(function (offer) {
        offer.remove();
      });
      this.isOffersRendered = false;
    }
  };

  /**
   * Генерирует и возвращает моки.
   * @param {number} quantity - Количество моков.
   * @return {Array} - Моки.
   */
  Landscape.prototype.getMocks = function (quantity) {
    this.quantity = quantity || 8;
    var mocks = [];
    for (var i = 0; i < this.quantity; i++) {
      var mock = new window.Mock(i);
      mocks.push(mock);
    }
    return mocks;
  };

  /**
   * Отрисовывает объявления.
   * @param {Array} offers - Объявления.
   */
  Landscape.prototype.renderOffers = function (offers) {
    this.cleanLandscape();
    var filteredOffers = this.filterData(offers);
    if (filteredOffers.length > OFFERS_MAX_QUANTITY) {
      offers = filteredOffers.slice(0, OFFERS_MAX_QUANTITY + 1);
    }
    var _container = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < filteredOffers.length; i++) {
      var offer = filteredOffers[i];
      var pin = new window.Pin(offer.offer.title, offer.author.avatar, offer.location.x, offer.location.y);
      var onPinClick = this.showCard.bind(this, offer);
      pin.addEventListener('click', onPinClick);
      fragment.appendChild(pin);
    }
    _container.appendChild(fragment);
    this.isOffersRendered = true;
  };

  /**
   * Показывает карточку с описанием объявления.
   * @param {Array} data - Данные объявления.
   */
  Landscape.prototype.showCard = function (data) {
    this.card = new window.Card(data);
    if (this.isCardOpen) {
      this.closeCard.bind(this);
    }
    this.card.show(this.landscape);

    this.isCardOpen = true;
  };

  /** Закрывает карточку с описанием объявления. */
  Landscape.prototype.closeCard = function () {
    this.isCardOpen = false;
    this.card.hide(this.landscape);
  };

  /**
   * Слушатель нажатия клавиши.
   * @param {KeyboardEvent} evt - Событие нажатия клавиши.
   */
  Landscape.prototype.keydown = function (evt) {
    if (evt.keyCode === window.utils.ENTER) {
      this.init.bind(this);
    }
  };

  window.Landscape = Landscape;
})();

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var numOfPlayer = 0;
var targetDOM = {};
var targetField = {};
var players = [];
var spys = [];
var result = {};
var broadcasterID = '';
var log = '';

var parseResult = function parseResult(result) {
  var keys = Object.keys(result);
  players = new Array(numOfPlayer);
  spys = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var partsOfStr = key.split('_');
    var type = partsOfStr[0];
    var index = partsOfStr[1];
    if (type == 'player') {
      players[index] = result[key];
    }
  }
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var partsOfStr = key.split('_');
    var type = partsOfStr[0];
    var index = partsOfStr[1];
    if (type == 'status') {
      if (result[key] == 'on') {
        spys.push(players[index]);
      }
    }
  }
};

var write_log = function write_log(text) {
  log = log + "\n" + text;
  targetField.forceUpdate();
};

var getPlayerKeys = function getPlayerKeys(num) {
  var results = [];
  for (var i = 0; i < num; i++) {
    results.push("player" + '_' + i);
  }
  return results;
};

var getStatusKeys = function getStatusKeys(num) {
  var results = [];
  for (var i = 0; i < num; i++) {
    results.push("status" + '_' + i);
  }
  return results;
};

var Broadcaster = React.createClass({
  displayName: 'Broadcaster',

  getInitialState: function getInitialState() {
    return { broadcasterID: '' };
  },
  handleChange: function handleChange(e) {
    broadcasterID = e.target.value;
    this.setState({ broadcasterID: e.target.value });
  },
  render: function render() {
    return React.createElement(
      'form',
      { className: 'commentForm' },
      React.createElement('input', {
        type: 'text',
        placeholder: 'empty',
        value: this.state.broadcasterID,
        onChange: this.handleChange
      })
    );
  }
});

var TextFiled = React.createClass({
  displayName: 'TextFiled',

  getInitialState: function getInitialState() {
    targetField = this;
    return { mlog: log };
  },
  handleChange: function handleChange(e) {
    this.setState({ mlog: e.target.value });
  },
  render: function render() {
    this.setState({ mlog: log });
    return React.createElement('textarea', {
      autoComplete: 'off',
      wrap: 'logical',
      spellCheck: 'false',
      value: this.state.mlog
    });
  }
});

var NumberOfPlayers = React.createClass({
  displayName: 'NumberOfPlayers',

  getInitialState: function getInitialState() {
    return { num: 0 };
  },
  handleNumnberChange: function handleNumnberChange(e) {
    var target_value = e.target.value;

    if (target_value < 0) {
      target_value = 0;
    } else if (target_value > 5) {
      target_value = 5;
    }

    numOfPlayer = target_value;
    this.setState({ num: target_value });
    targetDOM.forceUpdate();
  },
  render: function render() {
    return React.createElement(
      'form',
      { className: 'commentForm' },
      React.createElement('input', {
        type: 'number',
        placeholder: 0,
        value: this.state.num,
        onChange: this.handleNumnberChange
      })
    );
  }
});

var Form = React.createClass({
  displayName: 'Form',

  getInitialState: function getInitialState() {
    var result = {};
    var keys = getPlayerKeys(numOfPlayer);
    var status = getStatusKeys(numOfPlayer);
    for (iter in keys) {
      result.set(iter, "");
    }
    for (var iter in status) {
      result.set(iter, false);
    }
    targetDOM = this;
    return result;
  },

  handleChange: function handleChange(type, name, e) {
    var change = {};
    change[name] = e.target.value;
    this.setState(change);
  },
  render: function render() {
    result = this.state;
    targetDOM = this;
    var indents = [];
    for (var i = 0; i < numOfPlayer; i++) {
      indents.push(React.createElement('input', {
        'data-tag': i,
        type: 'text',
        placeholder: 'Player ID...',
        value: this.state["player" + '_' + i],
        key: "player" + '_' + i,
        onChange: this.handleChange.bind(this, 'player', 'player' + '_' + i)
      }));
      indents.push(React.createElement('input', {
        type: 'checkbox',
        key: "status" + '_' + i,
        value: this.state["status" + '_' + i],
        onChange: this.handleChange.bind(this, 'status', 'status' + '_' + i)
      }));
    }
    return React.createElement(
      'form',
      { className: 'commentForm' },
      indents
    );
  }
});

var CreateButton = function (_React$Component) {
  _inherits(CreateButton, _React$Component);

  function CreateButton() {
    _classCallCheck(this, CreateButton);

    var _this = _possibleConstructorReturn(this, (CreateButton.__proto__ || Object.getPrototypeOf(CreateButton)).call(this));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(CreateButton, [{
    key: 'handleClick',
    value: function handleClick() {
      parseResult(result);
      write_log('creating game...');
      $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/api/spy",
        data: JSON.stringify({ players: players, spys: spys, broadcasterID: broadcasterID }),
        success: function success(data) {
          var result = data.result;
          try {
            var json = JSON.parse(result);
          } catch (e) {
            return write_log('data error');
          }
          if (json.error) {
            return write_log(json.error);
          } else {
            return write_log(json.result);
          }
        },
        dataType: "json"
      });
    }
  }, {
    key: 'render',
    value: function render() {

      return React.createElement(
        'button',
        { type: 'button', onClick: this.handleClick },
        '开始游戏.'
      );
    }
  }]);

  return CreateButton;
}(React.Component);

var Compact = function (_React$Component2) {
  _inherits(Compact, _React$Component2);

  function Compact() {
    _classCallCheck(this, Compact);

    return _possibleConstructorReturn(this, (Compact.__proto__ || Object.getPrototypeOf(Compact)).apply(this, arguments));
  }

  _createClass(Compact, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(Broadcaster, null),
        React.createElement(NumberOfPlayers, null),
        React.createElement(Form, null),
        React.createElement(CreateButton, null),
        React.createElement(TextFiled, null)
      );
    }
  }]);

  return Compact;
}(React.Component);

ReactDOM.render(React.createElement(Compact, { name: 'Compact' }), document.getElementById('compact'));
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var numOfPlayer = 0;

var getPlayerKeys = function getPlayerKeys(num) {
  var results = [];
  for (var i = 0; i < num; i++) {
    results.push("player" + i);
  }
  return results;
};

var NumberOfPlayers = React.createClass({
  displayName: "NumberOfPlayers",

  handleNumnberChange: function handleNumnberChange(e) {
    numOfPlayer = e.target.value;
  },
  render: function render() {
    return React.createElement(
      "form",
      { className: "commentForm" },
      React.createElement("input", {
        type: "number",
        placeholder: numOfPlayer,
        value: numOfPlayer,
        onChange: this.handleNumnberChange
      })
    );
  }
});

var Form = React.createClass({
  displayName: "Form",

  getInitialState: function getInitialState() {
    var result = {};
    var keys = getPlayerKeys();
    for (iter in keys) {
      result.set(iter, "");
    }
    return result;
  },

  handleChange: function handleChange(name, e) {
    var change = {};
    change[name] = e.target.value;
    this.setState(change);
  },
  render: function render() {
    var indents = [];
    for (var i = 0; i < numOfPlayer; i++) {
      indents.push(React.createElement("input", {
        "data-tag": i,
        type: "text",
        placeholder: "Player ID...",
        value: this.state.get("player" + i),
        onChange: this.handleChange.bind(this, "player" + i)
      }));
    }
    return React.createElement(
      "form",
      { className: "commentForm" },
      indents
    );
  }
});

var CreateButton = function (_React$Component) {
  _inherits(CreateButton, _React$Component);

  function CreateButton() {
    _classCallCheck(this, CreateButton);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CreateButton).call(this));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(CreateButton, [{
    key: "handleClick",
    value: function handleClick() {}
  }, {
    key: "render",
    value: function render() {
      var text = this.state.liked ? 'liked' : 'haven\'t liked';
      return React.createElement(
        "div",
        { onClick: this.handleClick },
        "You ",
        text,
        " this. Click to toggle."
      );
    }
  }]);

  return CreateButton;
}(React.Component);

ReactDOM.render(React.createElement(NumberOfPlayers, { name: "NumberOfPlayers" }), document.getElementById('numofplayer'));

ReactDOM.render(React.createElement(Form, { name: "CreateButton" }), document.getElementById('createbutton'));

ReactDOM.render(React.createElement(Form, { name: "Form" }), document.getElementById('form'));
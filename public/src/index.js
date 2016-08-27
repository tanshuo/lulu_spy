
var numOfPlayer = 0;
var targetDOM = {};
var players = [];
var spys = [];
var result = {};
var broadcasterID = '';

var parseResult = function(result){
  var keys = Object.keys(result)
  players = new Array(numOfPlayer);
  spys = [];
  for(var i = 0; i < keys.length; i++){
    var key = keys[i];
    var partsOfStr = key.split('_');
    var type = partsOfStr[0];
    var index = partsOfStr[1];
    if(type == 'player'){
      players[index] = result[key];
    }
  }
   for(var i = 0; i < keys.length; i++){
    var key = keys[i];
    var partsOfStr = key.split('_');
    var type = partsOfStr[0];
    var index = partsOfStr[1];
    if(type == 'status'){
      if(result[key] == 'on'){
        spys.push(players[index]);
      }
    }
  }
}

var getPlayerKeys = function(num){
  var results = [];
  for(var i = 0; i < num; i++){
    results.push("player" + '_' + i);
  }
  return results;
};

var getStatusKeys = function(num){
  var results = [];
  for(var i = 0; i < num; i++){
    results.push("status" + '_' + i);
  }
  return results;
};

var Broadcaster = React.createClass({
  getInitialState: function() {
    return {broadcasterID : ''};
  },
    handleChange : function(e){
      broadcasterID = e.target.value;
      this.setState({broadcasterID : e.target.value});
    },
    render: function(){
       return (
        <form className="commentForm">
          <input
            type="text"
            placeholder='empty'
            value={this.state.broadcasterID}
            onChange={this.handleChange}
          />
        </form>
      );
    }
});

var NumberOfPlayers = React.createClass({
  getInitialState: function() {
    return {num : 0};
  },
    handleNumnberChange : function(e){
      var target_value = e.target.value;
      
      if(target_value < 0){
        target_value = 0;
       
      }
      else if(target_value > 5){
        target_value = 5;
       
      }
      
      numOfPlayer = target_value;
      this.setState({num : target_value});
      targetDOM.forceUpdate();
    },
    render: function(){
       return (
        <form className="commentForm">
          <input
            type="number"
            placeholder={0}
            value={this.state.num}
            onChange={this.handleNumnberChange}
          />
        </form>
      );
    }
});


var Form = React.createClass({
  getInitialState: function() {
    var result = {};
    var keys = getPlayerKeys(numOfPlayer);
    var status = getStatusKeys(numOfPlayer);
    for(iter in keys){
      result.set(iter, "");
    }
    for(var iter in status){
      result.set(iter, false);
    }
    targetDOM = this;
    return result;
  },
 
  handleChange: function(type, name, e) {
    var change = {};
    change[name] = e.target.value;
    this.setState(change);
    
  },
  render: function() {
    result = this.state;
    targetDOM = this;
    var indents = [];
    for (var i = 0; i < numOfPlayer; i++) {
     indents.push(
        <input
          data-tag={i}
          type="text"
          placeholder="Player ID..."
          value={this.state[("player" + '_' + i)]}
          key={"player" + '_' + i}
          onChange={this.handleChange.bind(this, 'player', 'player' + '_' + i)}
        />
      );
      indents.push(
        <input 
          type="checkbox" 
          key={"status" + '_' + i}
          value={this.state[("status" + '_' + i)]}
          onChange={this.handleChange.bind(this, 'status', 'status' + '_' + i)}
        />
      );
      
    }
    return (
      <form className="commentForm">
        {indents}
      </form>
    );
  }
});

class CreateButton extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    parseResult(result);
    $.post(
        "http://mofangvr.com:30001/api/spy/start",
        {players : players, spys : spys, broadcasterID : broadcasterID},
        function(data) {
           alert('page content: ' + data);
        }
    );
  }
  render() {
    
    return (
      <button type="button" onClick={this.handleClick}>
        开始游戏.
      </button>
    );
  }
}

class Compact extends React.Component {
  render() {
    return (
      <div>
        <Broadcaster
         
        />
        <NumberOfPlayers
         
        />
        <Form
         
        />
        <CreateButton
         
        />
      </div>
    );
  }
  
}

ReactDOM.render(
  <Compact name="Compact" />,
  document.getElementById('compact')
);



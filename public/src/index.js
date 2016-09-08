
var numOfPlayer = 0;
var targetDOM = {};
var targetField = {};
var players = [];
var spys = [];
var result = {};
var broadcasterID = '';
var whoToKill = '';
var log = '';

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

var write_log = function(text){
  log = log + "\n" + text;
  targetField.forceUpdate();
};

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

var BlackList = React.createClass({
  getInitialState: function() {
    return {who_to_kill : ''};
  },
    handleChange : function(e){
      whoToKill = e.target.value;
      this.setState({who_to_kill : e.target.value});
    },
    render: function(){
       return (
        <form className="commentForm">
          <input
            type="text"
            placeholder='将要被杀死的玩家ID'
            value={this.state.who_to_kill}
            onChange={this.handleChange}
          />
        </form>
      );
    }
});

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
            placeholder='房间号'
            value={this.state.broadcasterID}
            onChange={this.handleChange}
          />
        </form>
      );
    }
});

var TextFiled = React.createClass({
    getInitialState: function() {
      targetField = this;
      return {mlog : log};
    },
    handleChange:  function(e) {
      this.setState({mlog : e.target.value});
    },
    render: function(){
      this.setState({mlog : log});
       return (
        <textarea 
        autoComplete="off" 
        wrap="logical" 
        spellCheck="false"
        value = {this.state.mlog}
        />
      
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
          placeholder="玩家 ID..."
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
    write_log('creating game...');
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: "/api/spy",
      data:  JSON.stringify({players : players, spys : spys, broadcasterID : broadcasterID}),
      success: function(data) {
        var result = data.result;
        try{
          var json = JSON.parse(result);
        }
        catch(e){
          return write_log(result);
        }
        if(json.error){
          return write_log(json.error);
          
        }
        else{
          return write_log(json.result);
        }
      },
      dataType: "json"
    });
  }
  render() {
    
    return (
      <button type="button" onClick={this.handleClick}>
        创建游戏.
      </button>
    );
  }
}

class StartButton extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
   
    write_log('starting game...');
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: "/api/spy/start",
      data:  JSON.stringify({broadcasterID : broadcasterID}),
      success: function(data) {
        var result = data.result;
        try{
          var json = JSON.parse(result);
        }
        catch(e){
          return write_log(result);
        }
        if(json.error){
          return write_log(json.error);
          
        }
        else{
          return write_log(json.result);
        }
      },
      dataType: "json"
    });
  }
  render() {
    
    return (
      <button type="button" onClick={this.handleClick}>
        开始游戏.
      </button>
    );
  }
}

class KillButton extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    parseResult(result);
    write_log('killing player...');
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: "/api/spy/kill",
      data:  JSON.stringify({playerId : whoToKill, broadcasterID : broadcasterID}),
      success: function(data) {
        var result = data.result;
        try{
          var json = JSON.parse(result);
        }
        catch(e){
          return write_log(result);
        }
        if(json.error){
          return write_log(json.error);
          
        }
        else{
          return write_log(json.result);
        }
      },
      dataType: "json"
    });
  }
  render() {
    
    return (
      <button type="button" onClick={this.handleClick}>
        杀死玩家.
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
        <StartButton
         
        />
        <KillButton
         
        />
        <TextFiled
         
        />
        <BlackList
         
        />
        
      </div>
    );
  }
  
}



ReactDOM.render(
  <Compact name="Compact" />,
  document.getElementById('compact')
);




var numOfPlayer = 0;

var getPlayerKeys = function(num){
  var results = [];
  for(var i = 0; i < num; i++){
    results.push("player" + i);
  }
  return results;
};

var NumberOfPlayers = React.createClass({
    handleNumnberChange : function(e){
      numOfPlayer = e.target.value;
    },
     render: function(){
       return (
      <form className="commentForm">
        <input
          type="number"
          placeholder={numOfPlayer}
          value={numOfPlayer}
          onChange={this.handleNumnberChange}
        />
      </form>
    );
     }
});


var Form = React.createClass({
  getInitialState: function() {
    var result = {};
    var keys = getPlayerKeys();
    for(iter in keys){
      result.set(iter, "");
    }
    return result;
  },
 
  handleChange: function(name, e) {
    var change = {};
    change[name] = e.target.value;
    this.setState(change);
  },
  render: function() {
    var indents = [];
    for (var i = 0; i < numOfPlayer; i++) {
     indents.push(
       <input
          data-tag={i}
          type="text"
          placeholder="Player ID..."
          value={this.state.get("player" + i)}
          onChange={this.handleChange.bind(this, "player" + i)}
        />);
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
    
  }
  render() {
    const text = this.state.liked ? 'liked' : 'haven\'t liked';
    return (
      <div onClick={this.handleClick}>
        You {text} this. Click to toggle.
      </div>
    );
  }
}

ReactDOM.render(
  <Form name="Form" />,
  document.getElementById('form')
);
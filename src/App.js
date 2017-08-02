import React, { Component } from 'react';
import './App.css';
import buttons from 'materialize-css';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = { world: [], w: 32, h: 32, generations: 1, on: false, speed: 100 };
  }
  componentWillMount = () => {
    this.createNewWorld();
  }
  createNewWorld = (e) => {

    var h = this.state.h, w = this.state.w, newWorld = [];
    for ( var i = 0, len = h; i < len; ++i ) {
      newWorld[i] = new Array (w);
      for ( var j = 0, len1 = w; j < len1; ++j ) {
        var parameters = e === 0 ? 0 : Math.round(Math.random());
        newWorld[i][j] = parameters;
      }
    }
    this.setState({ world: newWorld, generations: 0 });
  }
  nextgen = () => {

    var world = this.state.world,
        worldNext = [];
    for ( var i = 0, len = this.state.world.length; i < len; ++i ) {
      worldNext[i] = new Array (this.state.world[i].length);
    }
    for ( var x = 0, len1 = world.length; x < len1; ++x ) {
      for ( var y = 0, len2 = world[x].length; y < len2; ++y ) {
        var n = 0;

        for ( var dx = -1; dx <= 1; ++dx ) {
          for ( var dy = -1; dy <= 1; ++dy ) {
            if ( dx === 0 && dy === 0 ) {}
            else if ( world[x + dx] !== undefined && world[x + dx][y + dy] !== undefined && world[x + dx][y + dy]) {
              ++n;

            }
          }
        }

      var g = world[x][y];
      switch (n) {
        case 0:
        case 1:
          g = 0;
          break;
        case 2:
          break;
        case 3:
          g = 1;
          break;
        default:
          g = 0;
      }
      worldNext[x][y] = g;
      }
    }
    let count = this.state.generations + 1;
    this.setState({ world: worldNext.slice(), generations: count })

  }
  componentDidMount = () => {
    this.startTime();
  }
  freezeTime = () => {
    this.setState({on: false});
    clearInterval(this.state.interval);
  }
  startTime = () => {
    if ( this.state.on === true ) {
    } else {
      this.setState({on: true,
        interval: setInterval(function (){
          this.nextgen();
        }.bind(this), this.state.speed)
      });
    }

  }
  flood = () => {
    this.createNewWorld(0);
    this.setState({ on: false });
    clearInterval(this.state.interval);
  }
  createOrKill = (e) => {
    var currentLife = this.state.world.slice();
    currentLife[e.target.dataset.row][e.target.dataset.space] = currentLife[e.target.dataset.row][e.target.dataset.space] === 0 ? 1 : 0;
    this.setState({ world: currentLife});
  }
  render() {
    var createWorld = () => {
      const world = this.state.world.map((row, i) => {
        const species = row.map((item, j) => {
          var space = "unfilled";
          if ( item === 1 ) {space = "filled"} else { space = "unfilled";}
          return (<div key={j} onClick={ this.createOrKill.bind(this) } data-row={i}  data-space={j} className={"square " + space}></div>)})
        return species;
      });
      return world;
    }
    return (
      <div className="App">
        <div className="header">
          <h2>The Game of Life</h2>
        </div>
        <div className="contents">
          <div className="gameboard">{createWorld()}</div>
          <Geography {...this.state}/>
          </div>
          <div className="options-container">
            <div>Generation: {this.state.generations}</div><br/>
            <button className="buttons waves-effect pink accent-3 waves-light btn buttons" onClick={ this.startTime }>Start Time</button>
            <button className="waves-effect pink accent-3 waves-light btn buttons" onClick={ this.freezeTime }>Stop Time</button>
            <button className="waves-effect pink accent-3 waves-light btn buttons" onClick={ this.flood }>Flood</button>
            <button className="waves-effect pink accent-3 waves-light btn buttons" onClick={ this.createNewWorld.bind() }>New World</button>
          </div>
        <Copyright/>
      </div>
    );
  }
}

class Geography extends Component {
  constructor (props) {
    super(props);

    this.state = { geography: [] };
  }
  componentWillMount = () => {
    this.createUniverse();
  }

  createUniverse = () => {
    var h = this.props.h, w = this.props.w;
    var geography = this.state.geography;
    for ( var i = 0, len = h; i < len; ++i ) {
      geography[i] = new Array (w);
      for ( var j = 0, len1 = w; j < len1; ++j ) {
        geography[i][j] = 0;
      }
    }
    this.setState({ geography: geography });
  }
  createGeography = () => {
    const world = this.state.geography.map((row, i) => {
      const species = row.map((item, j) => {
        return (<div key={j} className="space"></div>)})
      return species;
    });
    return world;
  }
  render () {
    return (
      <div className="geography">{ this.createGeography() }</div>
    )
  }
}

class Copyright extends Component {
  render() {
    return (
      <div className="copyright">
        <p>
          &#169;2017&nbsp;
           <a href="https://znicholasbrown.github.io" rel="noopener noreferrer" target="_blank">Z Nicholas Brown</a>
        </p>
      </div>
    )
  }
}

export default App;

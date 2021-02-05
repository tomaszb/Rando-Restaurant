import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

function Restaurant(props){
  let googleURL = "https://maps.google.com/?q=";
  let fullURL = googleURL.concat(encodeURIComponent(props.details.name.concat(" ", props.details.vicinity)));

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  return (
    <div className="Restaurant">
      <div className="RestName"><button className="toGoogle" onClick={() => openInNewTab(fullURL)}>{props.details.name}</button></div>
      <div className="Rating"><span className="ratingNum">{props.details.rating}</span>  <span className="ratingCount">(out of {props.details.user_ratings_total} ratings)</span></div>
      <div className="Address">{props.details.vicinity}</div>
    </div>
  )
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {latitude:0, longitude:0, gotLocation:false, gettingRestaurant:false, restaurant:null, allResults:null};
    this.getRestaurant = this.getRestaurant.bind(this);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  }

  forceUpdateHandler(){
    this.forceUpdate();
  };

  getRestaurant = () => {
    this.setState({gettingRestaurant:true});
    if(!this.state.allResults){
      if (this.state.gotLocation){
          fetch("/getRestaurant", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({latitude:this.state.latitude, longitude:this.state.longitude})
        }).then(response => response.json()).then(
          (data) => {
          this.setState({allResults:data['rando'], restaurant:this.getRandom(data['rando']), gettingRestaurant: false});
          }
        )
      }
      else{
        console.log("don't have location!");
      }
    }
    else{
      this.setState({restaurant:this.getRandom(this.state.allResults), gettingRestaurant: false});
    }
  }

  getRandom = (results) => {
    const random = Math.floor(Math.random() * results.length);
    return results[random];
  }
  
  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        gotLocation: true
      });
      this.forceUpdateHandler();
    }, () => {console.log("geoloc error!")}, {timeout:20000});
  }

  render(){
    let button;
    if (this.state.gotLocation && !this.state.gettingRestaurant){
          button = <button className="exeButton" onClick={this.getRestaurant}>
          {this.state.restaurant ? 'Another Rando!' : 'Get Random Restaurant!'}
          </button>;
    }
    else if (this.state.gettingRestaurant){
        button = <button className="exeButton" onClick={this.getRestaurant} disabled>
        <i class="fa fa-spinner fa-spin"></i>   Getting Restaurant...
        </button>;
    }
    else {
          button = <button className="exeButton" onClick={this.getRestaurant} disabled>
          <i class="fa fa-spinner fa-spin"></i>   Getting Location...
          </button>;
    }

    return (
      <div className="App">
        <header className="App-header">
          <img className="logo" src="newlogo.png" alt="logo"/>
        </header>
        <body className="App-body">
            <div className="locationDisplay">
              <div>Your location is (latitude, longitude): </div>
              <div>({this.state.latitude.toFixed(2)}, {this.state.longitude.toFixed(2)})</div> 
            </div>
          {(this.state.restaurant) &&
          <Restaurant details={this.state.restaurant}></Restaurant>
          }
          {button}
        </body>
      </div>
    )
  }
}

export default App;

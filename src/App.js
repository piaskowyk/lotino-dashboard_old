import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Cookies from "js-cookie";
import './style/login.css';
import Login from './views/Login';
import Register from './views/Register';
import Workers from './views/Workers';
import Dashboard from './views/Dashboard';
import Menu from './components/common/Menu';
import logo from './imgs/logo_black_icon.svg';
import Restaurant from './views/Restaurant';
import RestaurantMenu from './views/RestaurantMenu';
import { FaPowerOff, FaExpand } from "react-icons/fa";

import { QueryManager, Endpoints } from './utils/QueryManager.ts';
import NotifyContainter, { notify } from './components/common/Notify';
import OpeningHours from './views/OpeningHours';

class App extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        isFullScreen: false,
        isLoading: false,
      };
      this.logout = this.logout.bind(this);
  }

  isLoggedIn(){
    console.log("Sprawdzanie zalogowania: " + Cookies.get('csrftoken'));
    return typeof Cookies.get('csrftoken') !== "undefined";  
  }

  toogleFullScreen() {
    if(this.state.isFullScreen){
      document.exitFullscreen();
    }
    else {
      document.querySelector("html").requestFullscreen();
    }
    this.setState({
      isFullScreen: !this.state.isFullScreen
    });
  }

  loaderOn() {
		this.setState({
			isLoading: true,
		});
  }
  
	loaderOff() {
		this.setState({
			isLoading: false,
		});
	}

  logout(){
    this.loaderOn();
    
    QueryManager.getQueryExecutor(
      Endpoints.logout
    ).then(data => {
      if(data.status) {
        Cookies.remove('csrftoken');
        // this.props.history.push({
				// 	pathname: '/login'
        // }); 
        window.location = "/login";
      }
      else {
        notify.makeNotifyError("Ups, coś poszło nie tak...");
      }
    }).catch(error => {
      console.log(error);
      notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
    }).finally(() => {this.loaderOff();});
  }

  render() {
    return (
      <BrowserRouter>
      <Switch>
        <Route exact path="/login" render={ (props) => { return <Login /> } } />
        <Route exact path="/register" render={(props) => { return <Register /> } } />
        <Route path="/dashboard/">
          <div className="mainContainer">
          <NotifyContainter />
            <div className="mainTopBar">
              <div className="mainLogoHolder">
                <img src={logo} className="mainLogo" alt="logo" />
                <span>lotino</span>
              </div>
              <div className="mainRightControls">
                <div className="mainRightControlsItem main_icon" onClick={() => this.toogleFullScreen()}>
                  <FaExpand className="mainIcon" />
                </div>
                <div className="mainRightControlsItem main_logout" onClick={() => this.logout()}>
                  <FaPowerOff className="mainIcon" />
                </div>
              </div>
            </div>
            <div className="mainHolder">
              <div className="mainMenuBar">
                <Menu />
              </div>
              <div className="mainContent">
                <Switch>
                  <Route exact path="/dashboard/home" render={ (props) => { return <Dashboard /> } } />
                  <Route exact path="/dashboard/restaurant"  render={ () => { return <Restaurant /> } } />
                  <Route exact path="/dashboard/workers"  render={ () => { return <Workers /> } } />
                  <Route exact path="/dashboard/menu"  render={ () => { return <RestaurantMenu /> } } />
                  <Route exact path="/dashboard/opening_hours"  render={ () => { return <OpeningHours /> } } />
                </Switch>
              </div>
            </div>
          </div>
        </Route>
        <Redirect from="" to={`${this.isLoggedIn() ? '/dashboard/home' : '/login'}`}/>
        </Switch>
      </BrowserRouter>
    );  
  }        
}

export default App;

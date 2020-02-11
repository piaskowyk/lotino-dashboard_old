import React from 'react';
import './../style/index.css';
import './../style/login.css';
import logo from './../imgs/logo_black_icon.svg';
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";
import { QueryManager, Endpoints } from '../utils/QueryManager.ts';
import Loader from '../components/common/Loader';
import NotifyContainter, { notify } from '../components/common/Notify';
import { withRouter } from 'react-router-dom';

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			submitted: false,
			isLoading: false,
		};
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

	submitLogin() {
		this.loaderOn();
		
		QueryManager.getQueryExecutor(
			Endpoints.login, 
			{
				login: this.state.username,
				password: this.state.password,
			}
		).then(data => {
			if(data.status) {
				Cookies.set('csrftoken', data.data.token);
				this.props.history.push({
					pathname: '/dashboard/home'
				}); 
			}
			else {
				notify.makeNotifyError("Niepoprawny login lub hasło.");
			}
		}).catch(error => {
			console.log(error)
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {this.loaderOff();});
	}

	handleUsr(e){
		this.setState({
			username: e.target.value
		});
	}

	handlePwd(e){
		this.setState({
			password: e.target.value
		});
	}

	render() {
		let loader = '';
		if(this.state.isLoading) loader = <Loader />;

		return (
			<div className="containerHolder">
			<NotifyContainter />
			<div className="container">
			{loader}
				<div className={`box-container ${this.state.isLoading ? "blurrMask" : ""}`}>
					<div className="box">
						<div className="logo-wrapper">
							<img src={logo} className="logo" alt="logo" />
							<div className="header">lotino</div>
						</div>
						<div className="input-group">
							<input id="user"
								type="text"
								name="username"
								className="login-input"
								placeholder="Login"
								onChange={this.handleUsr.bind(this)}/> 
						</div>

						<div className="input-group">
							<input
								type="password"
								name="password"
								className="login-input"
								placeholder="Hasło"
								onChange={this.handlePwd.bind(this)}/>
						</div>

						<div className="input-group checkboxGroup">
							<div className="centerCheckboxGroup">
								<input type="checkbox" id="cbx" name="save" className="swipedCheckbox displayNone"/>
								<label htmlFor="cbx" className="toggle"><span></span></label>  
								<span className="label">Loguj automatycznie</span>  
							</div>
						</div>

						<button
							type="button"
							className="login-btn"
							onClick={this
							.submitLogin
							.bind(this)}>Login</button>

						<div className="registerLink">
							<Link className="link" to="/register/">lub zarejestruj się !</Link>
							</div>
					</div>
				</div>
			</div>
			</div>
		);
	}
}

export default withRouter(Login);
import React from 'react';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import './../style/login.css';
import logo from './../imgs/logo.svg';
import { FaAngleLeft } from "react-icons/fa";
import { QueryManager, Endpoints } from '../utils/QueryManager.ts';
import Loader from '../components/common/Loader';
import NotifyContainter, { notify } from '../components/common/Notify';
import { withRouter } from 'react-router-dom';

class Register extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: "",
			surname: "",
			email: "",
			password: "",
			passwordConfirm: "",
			phone: "",
			passwordStrongEnough: false,
			rodo: false,
			rules: false,
			submitted: false,
			isLoading: false,
			dummy: null,
		};
	}
	samePwds = false;
	passwordStrength = "";
	passwordStrengthScore = 0;

	validationInfo = {
		'name': {
			isValid: true,
			errorMessage: ""
		},
		'surname': {
			isValid: true,
			errorMessage: ""
		},
		'email': {
			isValid: true,
			errorMessage: ""
		},
		'phone': {
			isValid: true,
			errorMessage: ""
		},
		'password': {
			isValid: true,
			errorMessage: ""
		},
		'password_confirm': {
			isValid: true,
			errorMessage: ""
		},
		'rodo': {
			isValid: true,
			errorMessage: ""
		},
		'rules': {
			isValid: true,
			errorMessage: ""
		},
	}

	setName(e){
		this.setState({
			name: e.target.value
		})
	}

	setSurname(e){
		this.setState({
			surname: e.target.value
		})
	}

	setMail(e){
		this.setState({
			email: e.target.value
		})
	}

	setPhone(e){
		this.setState({
			phone: e.target.value
		})
	}

	acceptRodo(e){
		this.setState({
			rodo: e.target.value
		})
	}

	acceptRules(e){
		this.setState({
			rules: e.target.value
		})
	}

	describePwdStrength(){
		switch (this.passwordStrengthScore) {
			case 0:
				return 'brak';
			case 1:
				return 'bardzo słabe';
			case 2:
				return 'słabe';
			case 3:
				return 'średnie';
			case 4:
					return 'mocne';
			case 5:
				return 'bardzo silne';
			default:
				return 'słabe';
		} 
	}

	hasNumber(str){
		const numRegex = /[0-9]/;
		return numRegex.test(str);
	}
	hasMixed(str) {
		const smallLetterRegex = /[a-z]/;
		const capitalLetterRegex = /[A-Z]/;
		return smallLetterRegex.test(str) && capitalLetterRegex.test(str);
	}
	hasSpecial(str){
		const specialCharsRegex = /[!#@$%^&*)(+=._-]/;
		return specialCharsRegex.test(str);
	}

	calculatePwdStrength(e){
		let strength = 0;
		if (e.target.value.length > 5)
			strength++;
		if (e.target.value.length > 8)
			strength++;
		if (this.hasNumber(e.target.value))
			strength++;
		if (this.hasSpecial(e.target.value))
			strength++;
		if (this.hasMixed(e.target.value))
			strength++;
		this.passwordStrengthScore = strength;
	}

	setPassword(e){
		let enoughStrong = false;
		this.calculatePwdStrength(e);
		let strength = this.describePwdStrength();
		if (this.passwordStrengthScore > 3){
			enoughStrong = true;
		}
		this.passwordStrength = strength;
		this.setState({
			password: e.target.value,
			passwordStrongEnough: enoughStrong
		})
	}

	setPasswordConfirm(e){
		this.setState({
			passwordConfirm: e.target.value
		})
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

	validForm() {
		let isValid = true;
		this.samePwds = false;

		if(this.state.name === "") {
			this.setErrorMessage('name', false, 'Musiz podać imię.');
			isValid = false;
		}
		else {
			this.setErrorMessage('name', true);
		}

		if(this.state.surname === "") {
			this.setErrorMessage('surname', false, 'Musisz podać nazwisko.');
			isValid = false;
		}
		else {
			this.setErrorMessage('surname', true);
		}

		const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
		if (!(mailRegex.test(this.state.email))){
			this.setErrorMessage('email', false, 'Nie poprawny adres email.');
			isValid = false;
		}
		else {
			this.setErrorMessage('email', true);
		}

		let password = this.state.password;
		let passwordConfirmation = document.getElementById("confirm").value;

		if (password !== passwordConfirmation) {
			this.setErrorMessage('password_confirm', false, 'Podane hasła są różne.');
			isValid = false;
		}
		else {
			this.setErrorMessage('password_confirm', true);
		}

		this.samePwds = true; 
		
		const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
		if (!(phoneRegex.test(this.state.phone))){
			this.setErrorMessage('phone', false, 'Wprowadź poprawny numer telefonu.');
			isValid = false;
		}
		else {
			this.setErrorMessage('phone', true);
		}

		if(!this.state.passwordStrongEnough){
				this.setErrorMessage('password', false, 'Za słabe hasło.');
				isValid = false;
		}
		else {
			this.setErrorMessage('password_confirm', true);
		}

		if(this.state.rodo === false) {
			this.setErrorMessage('rodo', false, 'Musisz zaakceptować regulamin RODO.');
			isValid = false;
		}
		else {
			this.setErrorMessage('rodo', true);
		}

		if(this.state.rules === false) {
			this.setErrorMessage('rules', false, 'Musisz zaakceptować regulamin serwisu.');
			isValid = false;
		}
		else {
			this.setErrorMessage('rules', true);
		}
		
		if(!isValid) {
			notify.makeNotifyError("Niepoprawne dane w formularzu.");
			this.updateView();
		}
		return isValid;
	}

	updateView() {
		this.setState({
			dummy: 1,
		});
	}

	submitRegister(e) {
		e.preventDefault();
		if(!this.validForm()) return;

		this.loaderOn();
		QueryManager.getQueryExecutor(
			Endpoints.ownerRegister, 
			{
				email: this.state.email,
				password: this.state.password,
				password_confirm: this.state.passwordConfirm,
				name: this.state.name,
				surname: this.state.surname,
				phone: this.state.phone,
				accept_rodo: this.state.rodo,
				accept_rules: this.state.rules,
			}
		).then(data => {
			if(data.status) {

				QueryManager.getQueryExecutor(
					Endpoints.login, 
					{
						login: this.state.email,
						password: this.state.password,
					}
				).then(data => {
					if(data.status) {
						Cookies.set('csrftoken', data.data.token);
					}
				}).catch(error => {}).finally(() => {
					this.props.history.push({
						pathname: '/dashboard',
						state: {message: "Witaj, cieszymy się że jesteś!"},
					}); 
				});				
			}
			else {
				let message = '';
				for (var key in data.data.errors) {
					this.setErrorMessage(key, false, data.data.errors[key]);
				}
				notify.makeNotifyError("Niepoprawne dane.");
			}
		}).catch(error => {
			console.log(error);
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {this.loaderOff();});
	}

	getErrorMessage(name) {
		if(this.validationInfo[name].isValid) {
			return '';
		}
		return <div className="errorInfo">{this.validationInfo[name].errorMessage}</div>;
	}

	setErrorMessage(name, valid, message = '') {
		try {
			this.validationInfo[name].isValid = valid;
			this.validationInfo[name].errorMessage = message;
		}
		catch(e) {
			console.log(e);
		}
	}

	getClassForInput(name) {
		if(this.validationInfo[name].isValid) {
			return 'login-input';
		}
		return 'login-input errorInpput';
	}

	render() {
		let loader = '';
		if(this.state.isLoading) loader = <Loader />;

		return (
			<div className="containerHolder">
			<NotifyContainter />
			{loader}
			<div className={`navBox ${this.state.isLoading ? "blurrMask" : ""}`}>
				<Link className="link" to="/login">
					<div className="holder">
						<div><FaAngleLeft className="backIcon" /></div>
						<div className="textAligner">wróc</div>
					</div>
				</Link>
			</div>
			<div className="container registerContainer">
				<div className={`box-container ${this.state.isLoading ? "blurrMask" : ""}`}>
					<div className="box">
					<div className="logo-wrapper">
						<img src={logo} className="logo" alt="logo" />
						<div className="header">Rejestracja</div>
					</div>
					<div className="input-group">
						<label className="login-label" htmlFor="name">Imię:</label>
						<input
							type="text"
							name="name"
							className={this.getClassForInput('name')}
							placeholder="Imię"
							onChange={this.setName.bind(this)}/>
						{this.getErrorMessage('name')}
					</div>
					<div className="input-group">
						<label className="login-label" htmlFor="username">Nazwisko:</label>
						<input type="text" name="surname" className={this.getClassForInput('surname')} placeholder="Nazwisko"
							onChange={this.setSurname.bind(this)}/>
						{this.getErrorMessage('surname')}
					</div>

					<div className="input-group">
						<label className="login-label" htmlFor="email">Email:</label>
						<input type="text" name="email" className={this.getClassForInput('email')}  placeholder="Email" id="mail"
						onChange={this.setMail.bind(this)}/>
						{this.getErrorMessage('email')}
					</div>

					<div className="input-group">
						<label className="login-label" htmlFor="phone">Nr Telefonu:</label>
						<input type="tel" name="phone" className={this.getClassForInput('phone')}  placeholder="Nr telefonu" id="phone"
						onChange={this.setPhone.bind(this)}/>
						{this.getErrorMessage('phone')}
					</div>

					<div className="input-group">
						<label className="login-label" htmlFor="password">Hasło:</label>
						<input
							id="password"
							type="password"
							name="password"
							className={this.getClassForInput('password')}  
							placeholder="Hasło"
							onChange={this.setPassword.bind(this)}/>
						{this.getErrorMessage('password')}
						<div className="pwd-strength">
							<label className="pwd-strength-label">Siła hasła: {this.passwordStrength}</label>
							<progress className="pwd-strength-progress-bar" value={this.passwordStrengthScore} max="5"></progress>
						</div>
					</div>
					<div className="input-group">
						<label className="login-label" htmlFor="confirm">Potwierdź hasło</label>
						<input
							id="confirm"
							type="password"
							name="confirm"
							className={this.getClassForInput('password_confirm')}  
							onChange={this.setPasswordConfirm.bind(this)}
							placeholder="Potwierdź hasło"></input>
							{this.getErrorMessage('password_confirm')}
					</div>

					<div className="input-group checkboxGroup">
						<div className="centerCheckboxGroup">
							<input onChange={this.acceptRodo.bind(this)} type="checkbox" id="rodo_accept"  className="swipedCheckbox displayNone"/>
							<label htmlFor="rodo_accept" className="toggle"><span></span></label>  
							<span className="label">Akceptuję <a className="staticLink" href="#" target="_blank">RODO</a></span>  
						</div>
						{this.getErrorMessage('rodo')}
					</div>

					<div className="input-group checkboxGroup">
						<div className="centerCheckboxGroup">
							<input onChange={this.acceptRules.bind(this)} type="checkbox" id="rules_accept" className="swipedCheckbox displayNone"/>
							<label htmlFor="rules_accept" className="toggle"><span></span></label>  
							<span className="label">Akceptuję <a className="staticLink" href="#" target="_blank">Regulamin</a></span>  
						</div>
						{this.getErrorMessage('rules')}
					</div>

					<button
						type="button"
						className="login-btn"
						onClick={this
						.submitRegister
						.bind(this)}>Zarejestruj się</button>
					</div>
				</div>
			</div>
			</div>
		);
	}
}

export default withRouter(Register);
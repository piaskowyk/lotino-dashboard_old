import React from 'react';
import './../style/workers.css';
import remove from "./../imgs/remove.png";
import edit from "./../imgs/edit-icon.png";
import block from "./../imgs/block.png";
import unblock from "./../imgs/unblock.png";

class Workers extends React.Component {
	constructor(props) {
		super(props);
		this.state ={
			names: ["Donald Trump","Władimir Władimirowicz Putin"], //prawdopodobnie bedzie zmienione w tablice personow
			active: [true, false], //wiec to jest raczej tymczasowe
			name: "",
			surname: "",
			username: "",
			password: "",
		};
	}
	samePwds = false;

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

	setUsername(e){
		this.setState({
			username: e.target.value
		})
	}

	setPassword(e){
		this.setState({
			password: e.target.value
		})
	}

	openAddForm(){
		document.getElementById("addForm").style.display = "block";
	}

	closeAddForm(){
		document.getElementById('addForm').style.display = "none";
	}
	
	addWorker(e){
		e.preventDefault();
		this.samePwds = false;
		let password = document.getElementById("password").value;
		let passwordConfirmation = document.getElementById("confirm").value;
		if (this.state.name === "" || this.state.surname === "" || this.state.username === "" || this.state.password === "")
				return (alert("Wypełnij wszystkie pola formularza!"));

		if (password !== passwordConfirmation)
				return (alert("Podane hasła są różne!"));

		this.samePwds = true; 

		if (this.samePwds){
				//POST request				
		}
	}

	removeWorker(index){
		console.log(index);
	}

	setActive(index, flag){
			let active = this.state.active;
			active[index] = flag;
			this.setState({
			active: active
		})
	}

	render() {
		const listItems =
			this.state.names.map((name, index) =>
				<div key={index}>
					<li className="workers-list" key={index}>{name}</li>
					<button className="btn" onClick={() => this.removeWorker(index)} title="Usuń pracownika">
						<img className="icon" src={remove} alt="" /></button>
					{this.state.active[index] === true ?
						<button className="btn" onClick={() => this.setActive(index, false)} title="Zablokuj pracownika">
							<img className="icon" src={block} alt="" /></button> :
						<button className="btn" onClick={() => this.setActive(index, true)} title="Odblokuj pracownika">
							<img className="icon" src={unblock} alt="" /></button> }  
					<button className="btn" onClick={() => this.removeWorker(index)} title="Edytuj dane pracownika">
						<img className="icon" src={edit} alt=""/></button> 
				</div>);

			return (
				<div className="main-workers-view">
					<div className="workers-view">
						<h2 className="title">Pracownicy Twojej restauracji:</h2>
						{listItems}
					</div>   
					<div className="add-worker">
						<button onClick={this.openAddForm}>Dodaj kolejnego pracownika</button>
						<div className="form-popup" id="addForm">
							<form className="form-container">
								<h4>Wprowadź dane kolejnego pracownika:</h4>
								<div className="input-group">
									<label className="login-label" htmlFor="name">Imię</label>
									<input
										type="text"
										name="name"
										className="login-input"
										placeholder="Imię"
										onChange={this.setName.bind(this)}/>
							</div>
								<div className="input-group">
									<label className="login-label" htmlFor="surname">Nazwisko</label>
									<input
										type="text"
										name="surname"
										className="login-input"
										placeholder="Nazwisko"
										onChange={this.setSurname.bind(this)}/>
								</div>
								<div className="input-group">
									<label className="login-label" htmlFor="username">Nazwa użytkownika</label>
									<input type="text" name="username" className="login-input" placeholder="Login"
									onChange={this.setUsername.bind(this)}/>
								</div>

								<div className="input-group">
									<label className="login-label" htmlFor="password">Hasło</label>
									<input
										id="password"
										type="password"
										name="password"
										className="login-input"
										placeholder="Hasło"
										onChange={this.setPassword.bind(this)}	/>
								</div>
								<div className="input-group">
									<label className="login-label" htmlFor="confirm">Potwierdź hasło</label>
									<input
										id="confirm"
										type="password"
										name="confirm"
										className="login-input"
										placeholder="Potwierdź hasło"	/>
								</div>
								{/* button styling needed */}
								<button 
									type="submit" 
									className="submitBtn" 
									onClick={this.addWorker.bind(this)}>Dodaj pracownika
								</button>
								<button type="button" className="cancel" onClick={this.closeAddForm}>Zamknij</button> 
							</form>
						</div>	
					</div>
				</div> 
			);
    }
  }
  
  export default Workers;
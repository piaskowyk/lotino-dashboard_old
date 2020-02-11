import React from 'react';
import './../style/dashboard.scss';
import { withRouter } from "react-router-dom";
import { QueryManager, Endpoints } from '../utils/QueryManager.ts';
import Loader from '../components/common/Loader';
import NotifyContainter, { notify } from '../components/common/Notify';
import PlacesChart from '../views/PlacesChart'

class Dashboard extends React.Component {

	constructor(props) {
		super(props);
		this.state ={
			isLoading: false,
			data: this.getData(),
			allPlaces: 30
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

	getRandomDataArray() {
		let data = [];
		let openingHour = '08';
		let closingHour = '22';
		let minutes = ":00";
		//nie wiem, w jakim formacie sa przechowywane godziny otwarcia i zamkniecia, dlatego przekombinowane
		for (var i = parseInt(openingHour, 10); i <= parseInt(closingHour, 10); i++) {
			data.push({
				time: i + minutes,
				value: Math.round(60 * Math.random())
			});
		}
		return data;
  }

	getData(){
		//data atribute is an array of objects
		let exampleData = [];
		exampleData.push({
			data: this.getRandomDataArray(),
			title: 'Liczba odwiedzających'
		});
		return exampleData;
	}
	
	getOccupiedPlaces(){
		return 16;
	}

	openUpdateForm(){
		document.getElementById("myForm").style.display = "block";
	}

	closeUpdateForm(){
		document.getElementById('myForm').style.display = "none";
	}

	render() {
		let loader = '';
		if(this.state.isLoading) loader = <Loader type="dashboard"/>;

		return (
			<div className="dashboard-container formContainter">
				<NotifyContainter />
				{loader}
				<div className={`dashboard-container ${this.state.isLoading ? "blurrMask" : ""}`}>
					<div className="mainHeader">Dashboard</div>
					<div>
						<div className="chart">
							<PlacesChart
								data={this.state.data[0].data}
								title={this.state.data[0].title}
								color="#70CAD1"
							/>
						</div>
						<h4>Obecnie zajętych jest {this.getOccupiedPlaces()} miejsc</h4>
						<button onClick={this.openUpdateForm}>Aktualizuj</button>
						<div className="form-popup" id="myForm">
							<form className="form-container">
								<label>Wprowadź liczbę wolnych miejsc:</label>
								<input type="number" value={this.state.allPlaces - this.getOccupiedPlaces()}/>
								{/* button styling needed */}
								<button type="submit" className="submitBtn">Aktualizuj</button>
								<button type="button" className="cancel" onClick={this.closeUpdateForm}>Zamknij</button> 
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
  
export default withRouter(Dashboard);

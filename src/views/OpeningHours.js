import React, { Component } from "react";
import "./../style/map_styles.css";
import "./../style/components/forms.scss";
import "./../style/info.css";
import EmergencyClose from "../components/info/EmergencyClose";
import { withRouter } from "react-router-dom";
import "../style/restaurant.scss";

import { QueryManager, Endpoints } from '../utils/QueryManager.ts';
import Loader from '../components/common/Loader';
import NotifyContainter, { notify } from '../components/common/Notify';

class OpeningHours extends Component {
	constructor(props) {
		super(props);

		let hourArray = [];
			for(let i = 0; i < 7; i++) {
				let isOpen, open, close;
				open = '';
				close = '';
				isOpen = false;
				
				hourArray.push({
					'open': open,
					'close': close,
					'isOpen': isOpen,
				});
			}

		this.state = {
			isLoading: false,
			value: hourArray,
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

	getData() {
		this.loaderOn();
		QueryManager.getQueryExecutor(
			Endpoints.getOpeningHours, null, this.props.history
		).then(data => {
			if(data.status) {
				let form = data.data.opening_hour;
				let hourArray = [];
				for(let i = 0; i < 7; i++) {
					let open = form[this.daysIndex[i]+"_open_hour"];
					if(open != null) {
						open = open.split(":");
						open = open[0] + ":" + open[1];
					}

					let close = form[this.daysIndex[i]+"_close_hour"];
					if(close != null) {
						close = close.split(":");
						close = close[0] + ":" + close[1];
					}

					hourArray.push({
						'open': open,
						'close': close,
						'isOpen': form[this.daysIndex[i]+"_is_open"],
					});
				}
				this.setState({
					value: hourArray,
				});
			}
			else {
				notify.makeNotifyError("Nie poprawny login lub hasło.");
			}
		}).catch(error => {
			console.log(error)
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {this.loaderOff();});
	}

	componentDidMount() {
		this.getData();
	}

	updateData() {
		this.loaderOn();
		let data = {
			friday_close_hour: this.state.value[4].close,
			friday_is_open: this.state.value[4].isOpen,
			friday_open_hour: this.state.value[4].open,

			monday_close_hour: this.state.value[0].close,
			monday_is_open: this.state.value[0].isOpen,
			monday_open_hour: this.state.value[0].open,

			saturday_close_hour: this.state.value[5].close,
			saturday_is_open: this.state.value[5].isOpen,
			saturday_open_hour: this.state.value[5].open,

			sunday_close_hour: this.state.value[6].close,
			sunday_is_open: this.state.value[6].isOpen,
			sunday_open_hour: this.state.value[6].open,

			thursday_close_hour: this.state.value[3].close,
			thursday_is_open: this.state.value[3].isOpen,
			thursday_open_hour: this.state.value[3].open,

			tuesday_close_hour: this.state.value[1].close,
			tuesday_is_open: this.state.value[1].isOpen,
			tuesday_open_hour: this.state.value[1].open,

			wednesday_close_hour: this.state.value[2].close,
			wednesday_is_open: this.state.value[2].isOpen,
			wednesday_open_hour: this.state.value[2].open,
		};

		QueryManager.getQueryExecutor(
			Endpoints.setOpeningHours, data, this.props.history
		).then(data => {
			if(data.status) {
				notify.makeNotifySuccess("Dane zostały zaktualizowane.");
			}
			else {
				notify.makeNotifyError("Sprawdź pooprawność danych.");
			}
		}).catch(error => {
			console.log(error)
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {this.loaderOff();});
	}

	daysName = ['Poniedziałek', 'Wrotek', 'Środa', 'Czwartek', 'Piatek', 'Sobota', 'Niedziela'];
	daysIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'saturday'];

	handleInput(e, index, type){
		let values = this.state.value;
		if(type === 'isOpen'){
			values[index].isOpen = !values[index].isOpen;
		}
		if(type === 'open'){
			values[index].open = e.target.value;
		}
		if(type === 'close'){
			values[index].close = e.target.value;
		}
		this.setState({value: values});
	}
		
	renderDay(item, index){
		return(
			<div key={index}>
			<div className="dayHourGroup">
			<div className="gropuName">{this.daysName[index]}</div>
				<input
					type="text"
					className="standardInputSmall"
					value={item.open}
					onChange={(e) => this.handleInput(e, index, 'open')}/>
				<div> - </div>
				<input
					type="text"
					className="standardInputSmall"
					value={item.close}
					onChange={(e) => this.handleInput(e, index, 'close')}/>
				<div className="checkboxGroup">
					<div className="centerCheckboxGroup">
						<input 
							type="checkbox" 
							id={'idCheck' + index}
							className="swipedCheckbox displayNone"
							value={item.isOpen}
							checked={item.isOpen}
							onChange={(e) => this.handleInput(e, index, 'isOpen')}
						/>
						<label htmlFor={'idCheck' + index} className="toggle"><span></span></label>  
					</div>
				</div>
			</div>
			</div>
		);
	}

	render() {
		let loader = '';
		if(this.state.isLoading) loader = <Loader type="dashboard"/>;

	return (
		<div className="dashboard-container formContainter">
			<NotifyContainter />
			{loader}
			<div className={`dashboard-container ${this.state.isLoading ? "blurrMask" : ""}`}>
			<div className="mainHeader">Godziny otwarcia</div>

				<div className="inputGroup">
					<div className="inputTiele">Godziny otwarcia</div>
					<div className="inputDescription">Uzupełnij dane odnośnie pory w której jest otwarta Twoja restauracja w ciągu tygodnia w formacie HH:MM</div>
					{this.state.value.map((item, index) => {return this.renderDay(item, index)})}
				</div>

				<div className="inputGroup">
					<div className="standardBtn saveHourButton"><span onClick={() => this.updateData()}>Zapisz</span></div>
				</div>

				<EmergencyClose loaderOn={() => this.loaderOn()} loaderOff={() => this.loaderOff()} notify={notify}/>

				</div>
			</div>  
        
		);
	}
}

export default withRouter(OpeningHours);
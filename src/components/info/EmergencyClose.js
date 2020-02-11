import React, { Component } from "react";
import "../../style/info.css";
import "../../style/components/emergency_close.scss";
import { QueryManager, Endpoints } from '../../utils/QueryManager.ts';
import { FaTimes, FaRegEdit } from "react-icons/fa";


class EmergencyClose extends Component{
	constructor(props) {
		super(props);
		this.state = {
			close_all_day: false,
			open_hour: "",
			close_hour: "",
			date: "",
			editedId: 0,
			emergencyCloseList: [],
			editedIndex: 0,
		};
	}

	componentDidMount() {
		QueryManager.getQueryExecutor(
			Endpoints.emergencyGetList, null, null
		).then(data => {
			if(!data.status) return;
			
			this.setState({
				emergencyCloseList: data.data
			});

		}).catch(error => {
			console.log(error);
			this.props.notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => this.props.loaderOff());
	}

	addEmergency() {
		this.props.loaderOn();
		
		let data = {};
		if(this.state.close_all_day) {
			data = {
				close_all_day: this.state.close_all_day,
				open_hour: "00:00",
				close_hour: "00:00",
				date: this.state.date,
			}
		}
		else {
			data = {
				close_all_day: this.state.close_all_day,
				open_hour: this.state.open_hour,
				close_hour: this.state.close_hour,
				date: this.state.date,
			}
		}

		if(this.state.editedId != 0) {
			data['day_id'] = this.state.editedId;
			this.edit(data);
		}
		else {
			this.add(data);
		}

		this.setState({
			editedId: 0,
		});

	}

	add(_data) {
		QueryManager.getQueryExecutor(
			Endpoints.emergencyAdd, _data, null
		).then(data => {
			if(data.status) {
				this.props.notify.makeNotifySuccess("Dane zostały zaktualizowane.");
				let copyArray = this.state.emergencyCloseList;
				copyArray.push(_data);
				this.setState({
					emergencyCloseList: copyArray,
				});
			}
			else {
				this.props.notify.makeNotifyError("Sprawdź pooprawność danych.");
			}
		}).catch(error => {
			console.log(error);
			this.props.notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => this.props.loaderOff());
	}

	edit(_data) {
		QueryManager.getQueryExecutor(
			Endpoints.emergencyEditItem, _data, null
		).then(data => {
			if(data.status) {
				this.props.notify.makeNotifySuccess("Dane zostały zaktualizowane.");
				let copyArray = this.state.emergencyCloseList;
				copyArray[this.state.editedIndex].close_all_day = _data.close_all_day;
				copyArray[this.state.editedIndex].open_hour = _data.open_hour;
				copyArray[this.state.editedIndex].close_hour = _data.close_hour;
				copyArray[this.state.editedIndex].date = _data.date;

				this.setState({
					emergencyCloseList: copyArray,
				});
			}
			else {
				this.props.notify.makeNotifyError("Sprawdź pooprawność danych.");
			}
		}).catch(error => {
			console.log(error);
			this.props.notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => this.props.loaderOff());
	}

	setItemToEdit(item, index) {
		this.setState({
			editedId: item.id,
			close_all_day: item.close_all_day,
			open_hour: item.open_hour,
			close_hour: item.close_hour,
			date: item.date,
			editedIndex: index,
		});
	}

	removeIem(item, index) {
		let arrayCopy = this.state.emergencyCloseList;
		arrayCopy.splice(index, 1);
		this.setState({
			emergencyCloseList: arrayCopy,
		});
		
		QueryManager.getQueryExecutor(
			Endpoints.emergencyRemoveItem, {day_id: item.id}, null
		).then(data => {
			if(data.status) {
				this.props.notify.makeNotifySuccess("Dane zostały zaktualizowane.");
			}
		}).catch(error => {
			console.log(error);
			this.props.notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => this.props.loaderOff());
	}

	renderEmergency(item, index) {
		if(item.close_all_day) {
			return(
				<div key={index}>
					{item.date} - nieczynne cały dzień 
					<span onClick={() => this.setItemToEdit(item, index)}><FaRegEdit/></span>
					<span onClick={() => this.removeIem(item, index)}><FaTimes/></span>
				</div>
			);
		}
		else {
			return(
				<div key={index}>
					{item.date} otwarte od {item.open_hour} do {item.close_hour}
					<span onClick={() => this.setItemToEdit(item, index)}><FaRegEdit/></span>
					<span onClick={() => this.removeIem(item, index)}><FaTimes/></span>
				</div>
			);
		}
	}

	render(){
		return (
			<div className="inputGroup">
				<div className="inputTiele">Awaryjne zamknięcie restauracji</div>
				<div className="inputDescription">Jeśli zdarzy się sytuacja, że twoja restauracja będzie zamknięta lub zmieniły się jej godziny otwarcia w jakimś dniu daj o tym znać uzupełniając poniższy formularz.</div>
				<div className="addEmergencyCloseContainer">

					<div className="itemHolder">
						<div className="itemName">Kiedy</div>
						<input
							type="text"
							className="standardInputSmall"
							value={this.state.date}
							onChange={(e) => this.setState({date: e.target.value})}
						/>
					</div>

					{
					!this.state.close_all_day ? 
						<div className="itemHolder">
							<div className="itemName">Godzina otwarcia</div>
							<input
								type="text"
								className="standardInputSmall"
								value={this.state.open_hour}
								onChange={(e) => this.setState({open_hour: e.target.value})}
							/>
						</div>
					: '' }

					{
					!this.state.close_all_day ?
						<div className="itemHolder">
							<div className="itemName">Godzina zamknięcie</div>
							<input
								type="text"
								className="standardInputSmall"
								value={this.state.close_hour}
								onChange={(e) => this.setState({close_hour: e.target.value})}
							/>
						</div>
					: '' }

					<div className="itemHolder">
						<div className="itemName">Nieczynne cały dzień</div>
						<div className="checkboxGroup">
							<div className="centerCheckboxGroup">
								<input 
									type="checkbox" 
									id="close_all_day"
									className="swipedCheckbox displayNone"
									value={this.state.close_all_day}
									checked={this.state.close_all_day}
									onChange={(e) => {
										this.setState({close_all_day: !this.state.close_all_day});
									}}
								/>
								<label htmlFor="close_all_day" className="toggle"><span></span></label>  
							</div>
						</div>
					</div>

					<div className="itemHolder">
						<div className="standardBtn" onClick={() => this.addEmergency()}><span>Zapisz</span></div>
					</div>


				</div>
				<div className="emergencyCloseList">
					{this.state.emergencyCloseList.map((item, index) => {return this.renderEmergency(item, index)})}
				</div>

			</div>
		);
	}
}
export default EmergencyClose;

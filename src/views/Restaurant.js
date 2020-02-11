import React, { Component } from "react";
import "./../style/map_styles.css";
import "./../style/components/forms.scss";
import "./../style/info.css"
import StandartInput from "../components/info/StandartInput"
import StandarTextArea from "../components/info/StandarTextArea"
import StandartCheckbox from "../components/info/StandartCheckbox"
import LogoSetter from "../components/info/LogoSetter"
import RestaurantGallery from "../components/info/RestaurantGallery"
import MapComponent from "../components/info/MapComponent"
import { withRouter } from "react-router-dom";
import "../style/restaurant.scss";

import { QueryManager, Endpoints } from '../utils/QueryManager.ts';
import Loader from '../components/common/Loader';
import NotifyContainter, { notify } from '../components/common/Notify';

class Restaurant extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			address: "",
			description: "",
			shortDescription: "",
			cords: {
				lat: 50.1261338,
				lon: 19.7922355,
			},
			openingHour: null,
			maxPlaces: 55,
			isActive: false,
			isLoading: false,
			logo: null
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

	loadeRestaurantData() {
		this.loaderOn();
		QueryManager.getQueryExecutor(
			Endpoints.getRestaurant, null, this.props.history
		).then(data => {
			if(data.status) {
				let form = data.data;
				this.setState({
					name: form.name,
					address: form.address,
					shortDescription: form.short_description,
					description: form.description,
					cords: {
						lat: form.lat,
						lon: form.lon,
					},
					isActive: form.is_active,
					maxPlaces: form.max_places,
					logo: form.logo,
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
		this.loadeRestaurantData();
	}

	updateRestaurant() {
		this.loaderOn();
		let data = {
			name: this.state.name,
			address: this.state.address,
			description: this.state.description,
			short_description: this.state.shortDescription,
			lat: this.state.cords.lat,
			lon: this.state.cords.lon,
			is_active: this.state.isActive,
			max_places: this.state.maxPlaces,
		}

		QueryManager.getQueryExecutor(
			Endpoints.editRestaurant, data, this.props.history
		).then(data => {
			if(data.status) {
				notify.makeNotifySuccess("Dane zostały zapisane");
			}
			else {
				notify.makeNotifyError("Nie poprawne dane");
			}
		}).catch(error => {
			console.log(error)
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {this.loaderOff();});
	}

	render() {
		let loader = '';
		if(this.state.isLoading) loader = <Loader type="dashboard"/>;

	return (
			<div className="dashboard-container formContainter">
				<NotifyContainter />
				{loader}
				<div className={`dashboard-container ${this.state.isLoading ? "blurrMask" : ""}`}>
				<div className="mainHeader">Informacje o restauracji</div>

				<LogoSetter value={this.state.logo} onChange={(value) => this.setState({logo: value})} />
					
				<div className="formFloatInput">
					<StandartInput 
						value={this.state.name} 
						onChange={(value) => this.setState({name: value})} 
						placeholder="Nazwa restauracji"
						title="Nazwa restauracji"
						description="Nazwa restauracji będzie wyświetlać się w aplikacji"
					/>

					<StandartInput 
						value={this.state.address}
						onChange={(value) => this.setState({address: value})}  
						placeholder="Adres"
						title="Adres"
						description="Podaj adres swojej restauracji, np. Kraków, Aleja 29 Listopada, 23/12"
					/>
				</div>

					<StandarTextArea 
							value={this.state.description}
							onChange={(value) => this.setState({description: value})}  
							placeholder="Opis restauracji"
							title="Opis"
							description="Opisz swoją restaurację w kilku zdaniach, opis ten będzie wyświetlać się Twoim klientom w aplikacji"
							size="standard"
					/>

					<StandarTextArea 
							value={this.state.shortDescription} 
							onChange={(value) => this.setState({shortDescription: value})} 
							placeholder="Krótki opis restauracji"
							title="Krótki opis"
							description="Opis restauracji który będzie wyświetlać się urzytkownikom aplikacji na mapie restauracji"
							size="min"
					/>

					<StandartInput 
							value={this.state.maxPlaces} 
							onChange={(value) => this.setState({maxPlaces: value})} 
							placeholder="Ilość miejsc"
							title="Ilość miejsc w restauracji"
							description="Podaj ile miejsc jest w twojej restauracji"
							type="number"
					/>

					<MapComponent 
						value={this.state.cords} 
						onChange={(lat, lon) => this.setState({
							cords: {
								lat: lat,
								lon: lon,
							}
						})} 
					/>

					<RestaurantGallery images={['https://via.placeholder.com/728x500.png', 'https://via.placeholder.com/500x500.png', 'https://via.placeholder.com/728x500.png']} />

					<StandartCheckbox
							value={this.state.isActive} 
							onChange={(value) => this.setState({isActive: value})} 
							name="isActive"
							title="Status"
							description="W momencie gdy ustawisz status swojej restauracji na aktywny, stanie się ona widoczna w aplikacji"
					/>

					<div className="inputGroup">
							<div className="standardBtn" onClick={() => this.updateRestaurant()}><span>Zapisz</span></div>
					</div>

					</div>
			</div>  
        
		);
	}
}

export default withRouter(Restaurant);
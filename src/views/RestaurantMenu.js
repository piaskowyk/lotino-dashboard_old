import React, { Component } from "react";
import "./../style/map_styles.css";
import "./../style/components/forms.scss";
import "./../style/info.css";
import { withRouter } from "react-router-dom";
import "../style/restaurant_menu.scss";
import { FaPlus } from "react-icons/fa";
import { QueryManager, Endpoints } from '../utils/QueryManager.ts';
import Loader from '../components/common/Loader';
import NotifyContainter, { notify } from '../components/common/Notify';
import DragSortableList from 'react-drag-sortable';
import Lightbox from 'react-lightbox-component';
import { FaTimes, FaChevronDown, FaChevronUp, FaRegEdit } from "react-icons/fa";
import StandartInput from "../components/info/StandartInput"
import StandarTextArea from "../components/info/StandarTextArea"
import StandartCheckbox from "../components/info/StandartCheckbox"
import NewMenuItemPhotoUploader from "../components/info/NewMenuItemPhotoUploader"

class RestaurantMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			isActiveAddingCategory: false,
			editCategoryIndex: -1,
			newCategoryName: "",
			editedCategoryName: "",
			menuItems: [],
			categories: [],

			showAddDishInCategory: -1,
			newDishObject: {
				name: "",
				ingredients: "",
				description: "",
				id: -1,
			},
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
			Endpoints.getOwnRestaurantMenu, null, this.props.history
		).then(data => {
			if(data.status) {
				this.setState({
					categories: data.data.category
				});
			}
			else {
				notify.makeNotifyError("Nie poprawny login lub hasło.");
			}
		}).catch(error => {
			console.log(error);
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {this.loaderOff();});
	}

	componentDidMount() {
		this.loadeRestaurantData();
	}

	categoryOrderUpdate(sortedList) {
		let stateCategoryList = [];
		for(let i = 0; i < sortedList.length; i++) {
			for(let a = 0; a < this.state.categories.length; a++) {
				if(this.state.categories[a].id == sortedList[i].content.props.data_id) {
					stateCategoryList.push(this.state.categories[a]);
					break;
				}
			}
		}
		this.setState({
			categories: stateCategoryList
		});

		let orderList = [];
		for(let i = 0; i < sortedList.length; i++) {
			orderList.push({
				"category_id": sortedList[i].content.props.data_id,
				"order": i
			});
		}

		this.loaderOn();
		let data = {
			"orders_list": orderList
		}

		QueryManager.getQueryExecutor(
			Endpoints.menuEditCategoryUpdateOrder, data, this.props.history
		).then(data => {
			if(data.status) {
				notify.makeNotifySuccess("Kolejność została zaktualizowana.");
			}
			else {
				notify.makeNotifyError("Nie udało się zaktualizować kolejności.");
			}
		}).catch(error => {
			console.log(error);
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {this.loaderOff();console.log(this.state.categories);});
	}

	getCategoryList() {
		let list = [];
		for(let i = 0; i < this.state.categories.length; i++) {
			list.push({content: (
				<div 
					className={`categoryTail${this.state.editCategoryIndex === i ? ' activeTile' : ''}`} 
					onClick={() => {this.bindToEditCategory(i)}}
					data_id={this.state.categories[i].id}
				>
					{this.state.categories[i].name}
				</div>
			)});
		}
		return list;
	}

	bindToEditCategory(index) {
		if(index === this.state.editCategoryIndex) {
			this.setState({
				isActiveAddingCategory: false,
				editCategoryIndex: -1,
				editedCategoryName: this.state.categories[index].name,
			});
		}
		else {
			this.setState({
				isActiveAddingCategory: false,
				editCategoryIndex: index,
				editedCategoryName: this.state.categories[index].name,
			});
		}
	}

	addNewCategory() {
		this.loaderOn();
		let data = {
			name: this.state.newCategoryName,
		}

		QueryManager.getQueryExecutor(
			Endpoints.menuAddCategory, data, this.props.history
		).then(data => {
			if(data.status) {
				let list = this.state.categories;
				list.push(data.data.category);
				this.setState({
					categories: list,
				});

				notify.makeNotifySuccess("Dodano kategorię.");
			}
			else {
				notify.makeNotifyError("Nie poprawny login lub hasło.");
			}
		}).catch(error => {
			console.log(error)
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {this.loaderOff();});
	}

	updateCategory() {
		this.loaderOn();
		let category_id = this.state.categories[this.state.editCategoryIndex].id;
		let data = {
			category_id: category_id,
			name: this.state.editedCategoryName,
		}

		QueryManager.getQueryExecutor(
			Endpoints.menuEditCategory, data, this.props.history
		).then(data => {
			if(data.status) {
				let categories = this.state.categories;
				categories[this.state.editCategoryIndex].name = this.state.editedCategoryName;
				this.setState({
					categories: categories,
				});

				notify.makeNotifySuccess("Zedytowano kategorię.");
			}
			else {
				notify.makeNotifyError("Nieudało się zaktualizować informacji o kategorii.");
			}
		}).catch(error => {
			console.log(error)
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {this.loaderOff();});
	}

	removeCategory() {
		this.loaderOn();
		let data = {
			category_id: this.state.categories[this.state.editCategoryIndex].id,
		}

		QueryManager.getQueryExecutor(
			Endpoints.menuRemoveCategory, data, this.props.history
		).then(data => {
			if(data.status) {

				let arrayCopy = this.state.categories;
				arrayCopy.splice(this.state.editCategoryIndex, 1);
				this.setState({
					categories: arrayCopy,
					editCategoryIndex: -1,
				});

				notify.makeNotifySuccess("Usunięto kategorię.");
			}
			else {
				notify.makeNotifyError("Nie poprawny login lub hasło.");
			}
		}).catch(error => {
			console.log(error)
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {this.loaderOff();});
	}

	renderImageFunc = (idx, image, toggleLightbox, width, height) => {
		return (
		<div className="fotoItem" key={idx}>
			<img
				alt=""
				key={idx}
				src={image.src}
				className='lightbox-img-thumbnail'
				style={{width: width, height: height}}
				onClick={toggleLightbox.bind(null, idx)} />
		</div>
		)
	}

	imageRender = (url, index) => {
		return {
			index: index,
			src: url,
			title: 'image title',
			description: 'image description'
		}
	}

	moveUpItem() {
		//TODO
	}

	moveDownItem() {
		//TODO
	}

	editItem() {
		//TODO
	}

	removeItem() {
		//TODO
	}

	addNewDish(categoryId) {
		this.loaderOn();
		let data = {
			category: categoryId,
			name: this.state.newDishObject.name,
			description: this.state.newDishObject.description,
			ingredients: this.state.newDishObject.ingredients
		}

		QueryManager.getQueryExecutor(
			Endpoints.addDish, data, this.props.history
		).then(data => {
			if(data.status) {
				//TODO: Dodać nowy element w menu do wyświetlenia, zaktualizaować stan
				notify.makeNotifySuccess("Dodano nowy element do menu.");
			}
			else {
				notify.makeNotifyError("Nie udało dodać się nowego elementu do menu.");
			}
		}).catch(error => {
			console.log(error);
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {this.loaderOff();});
	}

	onSortImage = function(sortedList) {
		console.log("sortedList", sortedList);
		//TODO
	}

	getImageList() {
		let urlList = ["https://via.placeholder.com/728x500.png", "https://via.placeholder.com/728x500.png", "https://via.placeholder.com/728x500.png"];				
		let list = [];
		for(let i = 0; i < urlList.length; i++) {
			list.push({content: (
				<Lightbox 
					images={[this.imageRender(urlList[i], i)]}
					renderImageFunc={this.renderImageFunc} 
				/>
			)});
		}
		return list;
	}

	render() {
		let loader = '';
		if(this.state.isLoading) loader = <Loader type="dashboard"/>;

	return (
			<div className="dashboard-container formContainter">
				<NotifyContainter />
				{loader}
				<div className={`dashboard-container ${this.state.isLoading ? "blurrMask" : ""}`}>
				<div className="mainHeader">Menu</div>

				<div className="categoryContainer inputGroup">
					<div className="inputTiele">Kategorie dań</div>
					<div className="inputDescription">Zarządzaj kategoriami dań w twojej restauracji</div>
					<div className="categoryTailsContainer">
						<DragSortableList 
							items={this.getCategoryList()} 
							onSort={(list) => this.categoryOrderUpdate(list)} 
							placeholder={<div className="categoryTail">TUTAJ</div>} 
							moveTransitionDuration={0.3} 
							type="horizontal"
						/>
						<div 
							className="addNewCategoryTile categoryTail"
							onClick={() => {
								this.setState({
									isActiveAddingCategory: true,
									editCategoryIndex: -1,
								});
							}}
						>
							<span><FaPlus /></span>
							Dodaj nową
						</div>
					</div>
					{
					this.state.isActiveAddingCategory ?
					<div className="addNewCategoryForm">
						<div className="inputGroup">
							<div className="inputDescription">Nazwa kategorii</div>
							<input
								type="text"
								className="mediumInput"
								value={this.state.newCategoryName}
								onChange={(e) => {
									this.setState({
										newCategoryName: e.target.value,
									});
								}}
							/>
						</div>
						<div className="inputGroup">
							<div className="standardBtn" onClick={() => this.addNewCategory()}><span>Zapisz</span></div>
						</div>
					</div>
					: ''
					}

					{
					this.state.editCategoryIndex >= 0 ?
					<div className="addNewCategoryForm">
						<div className="inputGroup">
							<div className="inputDescription">Nazwa kategorii</div>
							<input
								type="text"
								className="mediumInput"
								value={this.state.editedCategoryName}
								onChange={(e) => {
									this.setState({
										editedCategoryName: e.target.value,
									});
								}}
							/>
						</div>
						<div className="inputGroup">
							<div className="standardBtn" onClick={() => this.updateCategory()}><span>Zapisz</span></div>
						</div>
						<div className="inputGroup">
							<div className="standardBtn" onClick={() => this.removeCategory()}><span>Usuń</span></div>
						</div>
					</div>
					: ''
					}
				</div>
				
				<div className="menuHolder">
					<div className="menuCategoryGroup">
						<div className="name">
							Przystawka
							<span className="addNewDish" onClick={() => {}}><FaPlus /></span>
						</div>


						<div className="addDishForm">
							<div className="iconHolder">
								<FaTimes
									className="hideForm" 
									onClick={() => {this.setState({ showAddDishInCategory: -1 })}} 
								/>
							</div>
							<StandartInput 
								value={this.state.newDishObject.name} 
								onChange={(value) => this.setState({
									newDishObject: {
										...value.newDishObject,
										name: value,
									}
								})} 
								placeholder="Nazwa"
								title="Nazwa potrawy"
								description="Podaj nazwę swojego dania"
								type="text"
							/>
							<StandarTextArea 
								value={this.state.newDishObject.ingredients} 
								onChange={(value) => this.setState({
									newDishObject: {
										...value.newDishObject,
										ingredients: value,
									}
								})}
								placeholder="Skład"
								title="Skłądniki potrawy"
								description="Napisz jakie składniki wchodzą w skład tego dania, najlepiej oddziel je przecinkiem."
								size="min"
							/>
							<StandarTextArea 
								value={this.state.newDishObject.description} 
								onChange={(value) => this.setState({
									newDishObject: {
										...value.newDishObject,
										description: value,
									}
								})}
								placeholder="Opis"
								title="Opis"
								description="Opisz swoje danie, daj znać innym by mogli dowiedzieć się jak wspaniałę jest Twoje danie."
								size="min"
							/>

							<NewMenuItemPhotoUploader newDishId={this.state.newDishObject.id} />

							<div className="inputGroup">
								<div className="standardBtn" onClick={() => this.addNewDish(4)}><span>Zapisz</span></div>
							</div>
						</div>
						
						
						<div className="menuItemList">
							<div className="menuItem">
								<div className="actionBar">
									<FaChevronUp 
										className="actionIcon"
										onClick={() => {this.moveUpItem()}}
									/> 
									<FaChevronDown 
										className="actionIcon" 
										onClick={() => {this.moveDownItem()}}
									/>
									<FaRegEdit 
										className="actionIcon" 
										onClick={() => {this.editItem()}} 
									/>
									<FaTimes
										className="actionIcon" 
										onClick={() => {this.removeItem()}} 
									/>
								</div>
								<div className="name">Dzik z rożna</div>
								<div className="ingredients">
									<span>Skład:</span>
									dzik, soczewica, 47 frytek
								</div>
								<div className="description">Takie tam dziki, dobrze że soczewicy dużo, bo szanowny pan obeliks bardzo chciał</div>
								<div className="fotoBar">
									<DragSortableList 
										items={this.getImageList()} 
										onSort={this.onSortImage} 
										placeholder={<div className="imagePlaceholder">TUTAJ</div>} 
										moveTransitionDuration={0.3} 
										type="horizontal"
									/>
									<div className="clear"></div>
								</div>
							</div>
							<div className="menuItem">
								<div className="name">Kotlet drobowy</div>
								<div className="ingredients">
									<span>Skład:</span>
									kurczak, ziemniaki, panierka
								</div>
								<div className="description">Nadkotlet, po prostu. Co tu dużo pisać na temat kotleta</div>
								<div className="fotoBar">
									<Lightbox 
										images={["https://via.placeholder.com/728x500.png", "https://via.placeholder.com/728x500.png"].map(this.imageRender)}
										renderImageFunc={this.renderImageFunc} 
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="menuCategoryGroup">
						<div className="name">Mleko</div>
						<div className="menuItemList">
							<div className="menuItem">
								<div className="name">Dzik z rożna</div>
								<div className="ingredients">
									<span>Skład:</span>
									dzik, soczewica, 47 frytek
								</div>
								<div className="description">Takie tam dziki, dobrze że soczewicy dużo, bo szanowny pan obeliks bardzo chciał</div>
								<div className="fotoBar">
									<Lightbox 
										images={["https://via.placeholder.com/728x500.png", "https://via.placeholder.com/728x500.png", "https://via.placeholder.com/728x500.png"].map(this.imageRender)}
										renderImageFunc={this.renderImageFunc} 
									/>
								</div>
							</div>
							<div className="menuItem">
								<div className="name">Kotlet drobowy</div>
								<div className="ingredients">
									<span>Skład:</span>
									kurczak, ziemniaki, panierka
								</div>
								<div className="description">Nadkotlet, po prostu. Co tu dużo pisać na temat kotleta</div>
								<div className="fotoBar">
									<Lightbox 
										images={["https://via.placeholder.com/728x500.png", "https://via.placeholder.com/728x500.png"].map(this.imageRender)}
										renderImageFunc={this.renderImageFunc} 
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

        </div>
			</div>  
        
		);
	}
}

export default withRouter(RestaurantMenu);
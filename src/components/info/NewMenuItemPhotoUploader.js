import React, { Component } from "react";
import "../../style/info.css";
import Lightbox from 'react-lightbox-component';
import "react-lightbox-component/build/css/index.css";
import { FaTimes } from "react-icons/fa";
import Dropzone from 'react-dropzone';
import { QueryManager, Endpoints } from '../../utils/QueryManager.ts';
import Loader from '../common/Loader';
import NotifyContainter, { notify } from '../common/Notify';
import DragSortableList from 'react-drag-sortable';

class NewMenuItemPhotoUploader extends Component{
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			imageList: [],
			files: [],
		};
	}

	uploadingCounter = 0;

	handleInput(e) {
		this.setState({value: e.target.value});
		this.props.onChange(e.target.value)
	}
	
	_acceptedFiles = [];
	onDrop = (acceptedFiles) => {
		this._acceptedFiles.push(acceptedFiles);
		console.log(acceptedFiles);
	}

	onPreviewDrop = (files) => {
		this.setState({
			files: this.state.files.concat(files),
		});
	}

	removeFile(index) {
		let files = this.state.files.filter((item, _index) => {return _index !== index;});
		this.setState({
			files: files,
		});
	}

	removeItem(index){
		this.loaderOn();
		let data = {
			image_id: this.state.imageList[index].id
		};

		QueryManager.getQueryExecutor(
			Endpoints.removePhotoMenu, data, this.props.history
		).then(data => {
			if(data.status) {
				let images = this.state.imageList.filter((item, _index) => {return _index !== index;});
				this.setState({
					imageList: images,
				});
				notify.makeNotifySuccess("Zdjecie zostało usunięte.");
			}
			else {
				notify.makeNotifyError("Nie udało się usunąć wybranego zdjęcia.");
			}
		}).catch(error => {
			console.log(error);
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {this.loaderOff();});
	}

	loaderOn() {
		this.setState({ isLoading: true });
	}

	loaderOff() {
		this.setState({ isLoading: false });
	}

	uploadImages(menuItemId) {
		if(this.props.newDishId) {
			notify.makeNotifyWarning("Pierwsze zapisz zmiany.");
			return;
		}
		
		if(this.state.isLoading) return;

		this.loaderOn();
		this.uploadingCounter = this.state.files.length;
		for(let i = 0; i < this.uploadingCounter; i++) {
			this.uploadImage(menuItemId, i);
		}
	}

	uploadImage(menuItemId, imageIndex) {
		var formData = new FormData();
		formData.append('file', this.state.files[imageIndex]);
		formData.append('menu_item', menuItemId);
		let uploadedFile = this.state.files[imageIndex];

		QueryManager.getQueryExecutor(
			Endpoints.addPhotoToMenuItem, formData, this.props.history, {raw: true}
		).then(data => {
			if(data.status) {
				let imageListCopy = this.state.imageList;
				imageListCopy.push({
					url: data.data.url,
					id: data.data.id
				});

				this.setState({
					imageList: imageListCopy
				});

				let files = this.state.files.filter((item, _index) => {return uploadedFile !== item;});
				this.setState({
					files: files,
				});

			}
		}).catch(error => {
			console.log(error);
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {
			this.uploadingCounter--;
			if(this.uploadingCounter == 0) {
				notify.makeNotifySuccess("Zakończono dodawanie zdjeć.");
				this.loaderOff();
			}
		});
	}

	onSortImage = function(sortedList) {
		console.log("sortedList", sortedList);
		//TODO
	}

	imageRender = (image, index) => {
		return {
			index: index,
			src: image['url'],
			title: '',
			description: ''
		}
	}

	getImageList() {
		let imageList = this.state.imageList;				
		let list = [];
		for(let i = 0; i < imageList.length; i++) {
			list.push({content: (
				<Lightbox 
					images={[this.imageRender(imageList[i], i)]}
					renderImageFunc={(idx, image, toggleLightbox, width, height) => {
						return (
						<div key={idx}>
							<div className="removeBtn" onClick={(e) => {this.removeItem(i)}}><FaTimes/></div>
							<img
								alt=""
								key={idx}
								src={image.src}
								className='lightbox-img-thumbnail'
								style={{width: width, height: height}}
								onClick={toggleLightbox.bind(null, idx)} />
						</div>
						)
					}} 
				/>
			)});
		}
		return list;
	}

	render(){
		const previewStyle = {
			display: 'inline',
			width: 100,
			height: 100,
		};

		return (
			<div className="inputGroup restaurantGallery">
				<div className="inputTiele">Galeria</div>
				<div className="inputDescription bottomMargin">Dodaj zdjęcia swojej restauracji, możesz zmieniać ich kolejność</div>

				<div className="sortableImageBar">
					<DragSortableList 
						items={this.getImageList()} 
						onSort={this.onSortImage} 
						placeholder={<div className="imagePlaceholder">TUTAJ</div>} 
						moveTransitionDuration={0.3} 
						type="horizontal"
					/>
				</div>


				<Dropzone 
					// onDrop={this.onDrop}
					accept="image/png"
					minSize={0}
					maxSize={5242880}
					onDrop={this.onPreviewDrop}
					multiple={true}
				>
				{({isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, rejectedFiles}) => {
					const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > 5242880;
					return (
						<div {...getRootProps()}>
						<input {...getInputProps()} />
						<div className="smallDropzoneField">
						{!isDragActive && 'Naciśnij albo upuść plik.'}
						{isDragActive && !isDragReject && "Upuść tutaj."}
						{isDragReject && "Nie poprawny format pliku."}
						{isFileTooLarge && (
							<div className="text-danger mt-2">
								Zbyt duży plik
							</div>
						)}
						</div>						
						</div>
					)}
				}
				</Dropzone>
				<div className="previewLabel">Podglad:</div>
				<div className="previewItems">
						{this.state.files.map((file, index) => (
							<div key={index} className="previewImage" onClick={() => {this.removeFile(index)}}>
								<div className="deleteMask"><div><FaTimes/></div></div>
								<img
									alt="Preview"
									key={file.preview}
									src={URL.createObjectURL(file)}
									style={previewStyle}
								/>
							</div>
						))}
				</div>

			</div>
		);
    }
}
export default NewMenuItemPhotoUploader;

import React, { Component } from "react";
import "../../style/info.css";
import Lightbox from 'react-lightbox-component';
import "react-lightbox-component/build/css/index.css";
import { FaTimes } from "react-icons/fa";
import Dropzone from 'react-dropzone'

class RestaurantGallery extends Component{
	constructor(props) {
		super(props);
		let images = this.props.images.map((url, index) => {
			return {
				index: index,
				src: url,
				title: 'image title',
				description: 'image description'
			}
		});
		this.state = {
			images: images,
			files: [],
		};
	}

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
		let images = this.state.images.filter((item, _index) => {return _index !== index;});
		this.setState({
			images: images,
		});
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
				<div className="inputDescription">Dodaj zdjęcia swojej restauracji, możesz zmieniać ich kolejność</div>
				<Lightbox 
					images={this.state.images}
					renderImageFunc={(idx, image, toggleLightbox, width, height) => {
						return (
						<div key={idx}>
							<div className="removeBtn" onClick={(e) => {this.removeItem(idx);}}><FaTimes/></div>
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
					<div className={`standardBtn sendBtn ${this.state.files.length > 0 ? '' : 'displayNone'}`} onClick={() => {}}><span>Wyślij</span></div>
				</div>

			</div>
		);
    }
}
export default RestaurantGallery;

import React, { Component } from "react";
import Dropzone from 'react-dropzone'
import "../../style/info.css"
import { FaTimes } from "react-icons/fa";

import { QueryManager, Endpoints } from '../../utils/QueryManager.ts';
import Loader from '../common/Loader';
import { notify } from '../common/Notify';

class LogoSetter extends Component{
	constructor(props) {
		super(props);
		this.state ={
			rootData: this.props.value,
			isRemoved: false,
			files: [],
			isLoading: false,
		};
	}
	
	_acceptedFiles = [];

	onDrop = (acceptedFiles) => {
		this._acceptedFiles = []
		this._acceptedFiles.push(acceptedFiles);
	}

	onPreviewDrop = (files) => {
		this.state.files = [];
		this.setState({
			files: this.state.files.concat(files),
		});
	}

	removeFile(file) {
		this.setState({
			files: []
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

	send() {
		var formData = new FormData();
		formData.append('file', this.state.files[0]);

		this.loaderOn();
		QueryManager.getQueryExecutor(
			Endpoints.setRestaurantLogo, formData, this.props.history, {raw: true}
		).then(data => {
			if(data.status) {
				notify.makeNotifySuccess("Logo zmienione.");
				this.state.files = [];
				this.props.onChange(data.data.url);
			}
			else {
				notify.makeNotifyError("Nie udało się zmienić logo.");
			}
		}).catch(error => {
			console.log(error)
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {this.loaderOff();});
	}

	removeLogo() {
		this.loaderOn();
		QueryManager.getQueryExecutor(
			Endpoints.removeRestaurantLogo, null, this.props.history
		).then(data => {
			if(data.status) {
				notify.makeNotifySuccess("Logo usunięte.");
				this.setState({
					isRemoved: true
				});
			}
			else {
				notify.makeNotifyError("Nie udało usunąć logo.");
			}
		}).catch(error => {
			console.log(error)
			notify.makeNotifyError("Ups... Coś nie tak z serwerem :/, Za chwilkę to naprawimy.");
		}).finally(() => {this.loaderOff();});
	}

render(){

	const previewStyle = {
		display: 'inline',
		width: 100,
		height: 100,
	};

	return (
		<div className="inputGroup dropzone">
			<div className="inputTiele">Logo restauracji</div>
			<div className="inputDescription">Dodaj logo swojej restauracji</div>
			<Dropzone
				accept="image/png"
				minSize={0}
				maxSize={5242880}
				onDrop={this.onPreviewDrop}
			>
			{({isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, rejectedFiles}) => {
				const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > 5242880;
				return (
					<div {...getRootProps()}>
					<input {...getInputProps()} />
					<div className="smallDropzoneField smallDropzoneFieldLogo">
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
			{this.state.isRemoved || this.state.files.length > 0 ? 
				<div className="previewItems">
						{this.state.files.map((file, index) => (
							<div key={index} className="previewImage" onClick={(file) => {this.removeFile()}}>
								<div className="deleteMask"><div><FaTimes/></div></div>
								<img
									alt="Preview"
									key={file.preview}
									src={URL.createObjectURL(file)}
									style={previewStyle}
								/>
							</div>
						))}
					<div className={`standardBtn sendBtn dropzoneBtn ${this.state.files.length > 0 ? '' : 'displayNone'}`} onClick={() => {this.send()}}><span>Wyślij</span></div>
					{this.state.isLoading ? <Loader type="small"/> : null}
				</div>
				:
				this.props.value ? 
				<div>
					<div className="previewItems">
					<div className="previewImage" onClick={() => {this.removeLogo()}}>
						<div className="deleteMask"><div><FaTimes/></div></div>
							<img
								src={this.props.value}
								style={previewStyle}
								alt=""
							/>
					</div>
					{this.state.isLoading ? <Loader type="small"/> : null}
				</div>
				</div>
				: null
			}
		</div>
	);
	}
}
export default LogoSetter;

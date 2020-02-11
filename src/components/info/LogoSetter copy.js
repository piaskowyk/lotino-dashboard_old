import React, { Component } from "react";
import Dropzone from 'react-dropzone'
import "../../style/info.css"

class LogoSetter extends Component{
    constructor(props) {
        super(props);
        this.state ={
			onChange: this.props.onChangeEvent,
			files: [],
		};
	}

    handleInput(e){
		this.setState({value: e.target.value});
		this.props.onChange(e.target.value)
	}
	
	_acceptedFiles = [];
	onDrop = (acceptedFiles) => {
		this._acceptedFiles.push(acceptedFiles);
		console.log(acceptedFiles);
	  }

	  onPreviewDrop = (files) => {
		console.log(files);
		this.setState({
		  files: this.state.files.concat(files),
		 });
	  }

    render(){
		const previewStyle = {
			display: 'inline',
			width: 100,
			height: 100,
		  };

		return (
			<div className="inputGroup">
				<div className="inputTiele">Logo restauracji</div>
				<div className="inputDescription">Dodaj logo swojej restauracji</div>
				<Dropzone 
					// onDrop={this.onDrop}
					accept="image/png, image/gif"
					minSize={0}
					maxSize={5242880}
					multiple={true}
					onDrop={this.onPreviewDrop}
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
						<ul className="list-group mt-2">
						{acceptedFiles.length > 0 && acceptedFiles.map(acceptedFile => (
							<li className="list-group-item list-group-item-success">
							{acceptedFile.name}
							</li>
						))}
						</ul>
						
						</div>
					)}
				}
				</Dropzone>
				<div>Podglad</div>
						{this.state.files.map((file) => (
						<img
							alt="Preview"
							key={file.preview}
							src={URL.createObjectURL(file)}
							style={previewStyle}
						/>
						))}
			</div>
		);
    }
}
export default LogoSetter;

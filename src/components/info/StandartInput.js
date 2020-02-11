import React, { Component } from "react";
import "../../style/info.css"

class StandartInput extends Component{
    constructor(props) {
			super(props);
			this.state ={
				// value: this.props.value,
				placeholder: this.props.placeholder,
				onChange: this.props.onChangeEvent,
				title: this.props.title,
				description: this.props.description,
				type: this.props.type,
			};
    }

	handleInput(e){
		this.props.onChange(e.target.value)
	}

	render() {
		return (
			<div className="inputGroup">
				<div className="inputTiele">{this.state.title}</div>
				<div className="inputDescription">{this.state.description}</div>
				<input
					type={`${typeof this.state.type === 'undefined' ? "text" : this.state.type}`}
					className="standardInput"
					placeholder={this.state.placeholder}
					value={this.props.value}
					onChange={this.handleInput.bind(this)}/>
			</div>
		);
	}
}
export default StandartInput;

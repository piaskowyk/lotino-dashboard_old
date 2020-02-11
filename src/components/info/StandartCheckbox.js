import React, { Component } from "react";
import "../../style/info.css"

class StandartCheckbox extends Component{
	constructor(props) {
		super(props);
		this.state ={
			name: this.props.name,
			onChange: this.props.onChangeEvent,
			title: this.props.title,
			description: this.props.description,
			type: this.props.type,
		};
	}

	handleInput(e){
		this.props.onChange(!this.props.value);
	}

	render() {
		return (
			<div className="inputGroup">
				<div className="inputTiele">{this.state.title}</div>
				<div className="inputDescription">{this.state.description}</div>
					<div className="checkboxGroup">
						<div className="centerCheckboxGroup">
							<input 
								type="checkbox" 
								id={this.state.name}
								className="swipedCheckbox displayNone"
								checked={this.props.value}
								placeholder={this.state.placeholder}
								// value={this.props.value}
								onChange={this.handleInput.bind(this)}
							/>
							<label htmlFor={this.state.name} className="toggle"><span></span></label>  
							<span className="label"></span>  
						</div>
					</div>
			</div>
		);
    }
}
export default StandartCheckbox;

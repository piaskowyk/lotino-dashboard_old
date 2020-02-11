import React, { Component } from "react";
import "../../style/info.css"

class StandarTextArea extends Component{
    constructor(props) {
        super(props);
        this.state ={
			placeholder: this.props.placeholder,
			title: this.props.title,
			description: this.props.description,
			size: this.props.size,
        };
    }

    handleInput(e){
		this.setState({value: e.target.value});
		this.props.onChange(e.target.value)
    }

    render(){
		return (
			<div className="inputGroup">
				<div className="inputTiele">{this.state.title}</div>
				<div className="inputDescription">{this.state.description}</div>
				<textarea
					className={`standardTextArea standardTextArea_${this.state.size}`}
					placeholder={this.state.placeholder}
					value={this.props.value}
					onChange={this.handleInput.bind(this)}>
				</textarea>
			</div>
			);
    }
}
export default StandarTextArea;

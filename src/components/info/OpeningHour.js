import React, { Component } from "react";
import "../../style/info.css"

class OpeningHour extends Component{
    constructor(props) {
			super(props);

			let hourArray = []
			for(let i = 0; i < 7; i++) {
				let isOpen, open, close;
				if(i < 5) {
					open = '09:00';
					close = '22:00';
					isOpen = true;
				}
				else isOpen = false;
				hourArray.push({
					'open': open,
					'close': close,
					'isOpen': isOpen,
				});
			}

			this.state ={
				value: hourArray,
				placeholder: this.props.placeholder,
				onChange: this.props.onChangeEvent,
			};
    }

		daysName = ['Poniedziałek', 'Wrotek', 'Środa', 'Czwartek', 'Piatek', 'Sobota', 'Niedziela'];

    handleInput(e, index, type){
			let values = this.state.value;
			if(type === 'isOpen'){
				values[index].isOpen = !values[index].isOpen;
			}
			if(type === 'open'){
				values[index].open = e.target.value;
			}
			if(type === 'close'){
				values[index].close = e.target.value;
			}
			this.setState({value: values});
			this.props.onChange(values);
			console.log(e.target.value);
		}
		
		renderDay(item, index){
			return(
				<div key={index}>
				<div className="dayHourGroup">
				<div className="gropuName">{this.daysName[index]}</div>
					<input
						type="text"
						className="standardInputSmall"
						value={item.open}
						onChange={(e) => this.handleInput(e, index, 'open')}/>
					<div> - </div>
					<input
						type="text"
						className="standardInputSmall"
						value={item.close}
						onChange={(e) => this.handleInput(e, index, 'close')}/>
					<div className="checkboxGroup">
						<div className="centerCheckboxGroup">
							<input 
								type="checkbox" 
								id={'idCheck' + index}
								className="swipedCheckbox displayNone"
								value={item.isOpen}
								checked={item.isOpen}
								onChange={(e) => this.handleInput(e, index, 'isOpen')}
							/>
							<label htmlFor={'idCheck' + index} className="toggle"><span></span></label>  
						</div>
					</div>
				</div>
				</div>
			);
		}

    render(){
		return (
			<div className="inputGroup">
				<div className="inputTiele">Godziny otwarcia</div>
				<div className="inputDescription">Uzupełnij dane odnośnie pory w której jest otwarta Twoja restauracja w ciągu tygodnia w formacie HH:MM</div>

				{this.state.value.map((item, index) => {return this.renderDay(item, index)})}

			</div>
		);
    }
}
export default OpeningHour;

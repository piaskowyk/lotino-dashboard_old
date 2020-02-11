import React from 'react';
import './loader.scss';

export default class Loader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			type: this.props.type,
			figure: this.props.figure ? this.props.figure : "default",
		}
	}

	getClassName() {
		switch(this.state.type){
			case 'dashboard': {
				return "loaderDashboard";
			}
			default: {
				return "loader";
			}
		}
	}
	
	render() {
		switch(this.state.type){
			case 'circle': {
				return(
					<div>
						<div className="circleLoader"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>
					</div>
				);
			}
			default: {
				return(
					<div>
						<div className={this.getClassName()}><div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
					</div>
				);
			}
		}
	}
}
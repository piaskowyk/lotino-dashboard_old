import React from 'react';
import { withRouter } from "react-router-dom";
import './menu.css';
import { FaUserFriends, FaUtensils, FaRegClipboard, FaSlidersH, FaTachometerAlt, FaRegClock } from "react-icons/fa";

class Menu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isActive: 0,
		}
	}
	
	checkActiveClass(index) {
		return this.state.isActive === index ? 'menu_isActive' : ''
	}

	render() {
		return(
			<div className="menu_container">

				<div className={`menu_menuItem ${this.checkActiveClass(0)}`}
				onClick={() => {
					this.props.history.push('/dashboard/home');
					this.setState({
						isActive: 0,
					});
				}}
				>
					<div className="menu_menuItemIcon">
						<FaTachometerAlt className="menu_menuItemIconElement" />
					</div>
					<div className="menu_menuItemLabel">
						Dashboard
					</div>
				</div>

				<div className={`menu_menuItem ${this.checkActiveClass(1)}`}
				onClick={() => {
					this.props.history.push('/dashboard/restaurant');
					this.setState({
						isActive: 1,
					});
				}}
				>
					<div className="menu_menuItemIcon">
						<FaUtensils className="menu_menuItemIconElement" />
					</div>
					<div className="menu_menuItemLabel">
						Restauracja
					</div>
				</div>

				<div className={`menu_menuItem ${this.checkActiveClass(2)}`}
				onClick={() => {
					this.props.history.push('/dashboard/menu');
					this.setState({
						isActive: 2,
					});
				}}
				>
					<div className="menu_menuItemIcon">
						<FaRegClipboard className="menu_menuItemIconElement" />
					</div>
					<div className="menu_menuItemLabel">
						Menu
					</div>
				</div>

				<div className={`menu_menuItem ${this.checkActiveClass(5)}`}
				onClick={() => {
					this.props.history.push('/dashboard/opening_hours');
					this.setState({
						isActive: 5,
					});
				}}
				>
					<div className="menu_menuItemIcon">
						<FaRegClock className="menu_menuItemIconElement" />
					</div>
					<div className="menu_menuItemLabel">
						Godziny otwarcia
					</div>
				</div>
				
				<div className={`menu_menuItem ${this.checkActiveClass(3)}`}
				onClick={() => {
					this.props.history.push('/dashboard/workers');
					this.setState({
						isActive: 3,
					});
				}}
				>
					<div className="menu_menuItemIcon">
						<FaUserFriends className="menu_menuItemIconElement" />
					</div>
					<div className="menu_menuItemLabel">
						Pracownicy
					</div>
				</div>

				<div className={`menu_menuItem ${this.checkActiveClass(4)}`}
				onClick={() => {
					this.props.history.push('/dashboard/settings');
					this.setState({
						isActive: 4,
					});
				}}
				>
					<div className="menu_menuItemIcon">
						<FaSlidersH className="menu_menuItemIconElement" />
					</div>
					<div className="menu_menuItemLabel">
						Ustawienia
					</div>
				</div>

			</div>
		);
	}
}

export default withRouter(Menu);
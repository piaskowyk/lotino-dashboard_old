import React from 'react';
import ReactDOM from 'react-dom';
import { FaCheck, FaTimes, FaRegFrownOpen, FaExclamationTriangle, FaRegBookmark } from "react-icons/fa";
import './notify.css';

function makeNotify(message, type) {
	let target = document.querySelector(".notify_notifyContainer");
	if(target) ReactDOM.unmountComponentAtNode(target);
	ReactDOM.render(<Notify message={message} type={type}/>, target);
	setTimeout(function() {
		ReactDOM.unmountComponentAtNode(target)
	}, 5000);
}

function makeNotifySuccess(message) {
	makeNotify(message, "success");
}

function makeNotifyError(message) {
	makeNotify(message, "error");
}

function makeNotifyWarning(message) {
	makeNotify(message, "warning");
}

function makeNotifyInfo(message) {
	makeNotify(message, "info");
}

export default class NotifyContainter extends React.Component {
	// constructor(props) {
	// 	super(props);
	// }
	
	render() {
		return(
			<div className="notify_notifyWrappaer">
				<div className="notify_notifyContainer"></div>
			</div>
		);
	}
}

class Notify extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: props.message,
			type: props.type,
			isVisible: true
		}
	}

	getTypeClass() {
		switch(this.state.type){
			case 'success':
				return "notify_notifySuccess";
			case 'error':
				return "notify_notifyError";
			case 'warning':
				return "notify_notifyWarning";
			case 'info':
				return "notify_notifyInfo";
			default: {
				return "notify_notifyInfo";
			}
		}
	}

	getTypeIcon() {
		switch(this.state.type){
			case 'success':
				return <FaCheck className="notify_icon" />;
			case 'error':
				return <FaRegFrownOpen className="notify_icon" />;
			case 'warning':
				return <FaExclamationTriangle className="notify_icon" />;
			case 'info':
				return <FaRegBookmark className="notify_icon" />;
			default: {
				return <FaRegBookmark className="notify_icon" />;
			}
		}
	}
	
	render() {
		if(!this.state.isVisible) return '';
		return(
			<div className={`notify_notify ${this.getTypeClass()}`}>
				<div className="notify_half">
					<div className="notify_iconHolder">{this.getTypeIcon()}</div>
					<div className="notify_textWlapper">{this.state.message}</div>
				</div>
				<div className="notify_half">
					<div className="notify_iconHolder intify_closeIconHolder"><FaTimes onClick={() => {this.setState({isVisible: false})}} className="notify_icon notify_closeIcon"/></div>
				</div>
			</div>
		);
	}
}

export let notify = {
	makeNotifySuccess,
	makeNotifyError,
	makeNotifyWarning,
	makeNotifyInfo
};
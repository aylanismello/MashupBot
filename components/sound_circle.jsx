import React from 'react';

class SoundCircle extends React.Component {
	constructor(props) {
		super(props);



		this.state = {
			playing: false
		};
	}



	render() {
		// debugger;
		let statusText = this.state.playing ? "ON" : "OFF";
		return(
			<div className="sound-circle"
				onClick={this.props.selectTrack.bind(null, this.props.idx)}>
				{statusText}
			</div>
		);
	}

}

export default SoundCircle;

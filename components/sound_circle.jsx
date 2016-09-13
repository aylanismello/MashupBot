import React from 'react';

class SoundCircle extends React.Component {
	constructor(props) {
		super(props);

		// this.state = {}
	}

	render() {
		// debugger;
		return(
			<div className="sound-circle" value={this.props.idx} onClick={this.props.switchTrack.bind(null, this.props.idx)}>

			</div>
		);
	}

}

export default SoundCircle;

import React from 'react';
import loader from 'webaudio-buffer-loader';

class Oscillator extends React.Component {
	render() {
		return(
			<canvas id={this.canvasId}></canvas>
		);
	}
}

export default Oscillator;

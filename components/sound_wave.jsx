import React from  'react';


const WIDTH = 400;
const HEIGHT = 400;

class SoundWave extends React.Component {
	constructor(props) {
		super(props);
		this.canvasId = `${props.channelName}-${props.idx}`;
		// this.track = props.track;
		this.draw = this.draw.bind(this);
		this.analyser = props.track.analyserNode;
		this.analyseAmp = this.analyseAmp.bind(this);
		// debugger;

	}

	componentDidMount() {
		this.analyseAmp();
	}

	analyseAmp() {
		this.analyser.fftSize = 2048;
		this.bufferLength = this.analyser.frequencyBinCount;
		this.dataArray = new Uint8Array(this.bufferLength);
		this.prepDraw();
	}

	prepDraw() {
		this.canvas = document.querySelector(`#${this.canvasId}`);
		this.ctx = this.canvas.getContext("2d");
		this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
		this.draw();
	}


	draw() {
		let drawFFT = requestAnimationFrame(this.draw);
		this.analyser.getByteTimeDomainData(this.dataArray);

		// background

		this.ctx.fillStyle = 'black';

		this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
		this.ctx.lineWidth = 3;

		this.ctx.strokeStyle = "#59b2a1";
		this.ctx.beginPath();

		// debugger;
		let sliceWidth = WIDTH * 1.0 / this.bufferLength;
		let x = 0;

		for (let i = 0; i < this.bufferLength; i++) {
			let v = this.dataArray[i] / 128.0;
			let y = v * HEIGHT / 6;
			// console.log(`${v}: ${y}`);

			if(i === 0) {
				this.ctx.moveTo(x, y);
			} else {
				this.ctx.lineTo(x, y);
			}

			x += sliceWidth;

		}

		this.ctx.lineTo(WIDTH, HEIGHT / 2);
		this.ctx.stroke();

	}




	render() {
		return (
			<div>
				<canvas className="fft" id={this.canvasId}
					onClick={this.props.selectTrack.bind(null, this.props.idx, this.id)}>
					>

				</canvas>
			</div>
		);
	}
}

export default SoundWave;

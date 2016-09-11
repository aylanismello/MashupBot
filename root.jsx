import React from 'react';
import loader  from 'webaudio-buffer-loader';

const path = './stems';
const bpm = 320.0;
const spb = 60.0 / bpm;

class Root extends React.Component {

	constructor(props) {
		super(props);
		this.play();

		this.state = {
			note: 0
		};

	}


	play() {

		let ctx = new AudioContext();

		let buffers = [
				`${path}/beat.wav`,
				`${path}/acapella.wav`,
				`${path}/melody.wav`
			];

		let sources = [];

		loader(buffers, ctx, (err, loadedBuffers) => {
			loadedBuffers.forEach(buffer => {
					let source = ctx.createBufferSource();
					source.buffer = buffer;
					source.loop = true;
					sources.push(source);

				});

			sources.forEach(source => {
					source.connect(ctx.destination);
					// source.start(0);
			});




		});


		let sixteenthNote = 0;

		let intervalID = window.setInterval(() => {

			this.setState({note: (sixteenthNote++ % 16)});
			// console.log(`${(sixteenthNote++ % 16)}`);



		}, (spb * 1000));

	}


	render() {
		return (
			<div className="circleBase type1">
				{this.state.note}
				{/* WASSUP */}
			</div>
		);

	}
}

export default Root;

import React from 'react';
import loader  from 'webaudio-buffer-loader';
import Slider from './slider';
import Yo from './yo';

const path = './stems';
const bpm = 320.0;
const spb = 60.0 / bpm;

class Root extends React.Component {

	constructor(props) {
		super(props);


		this.state = {
			note: 0,
			loaded: false
		};

		this.contxt = new AudioContext();
		this.sources = [];
		this.createAudioPipeline();

		// this.createMetronome();
	}

	createSource(buffer, channelName) {
		let source = this.contxt.createBufferSource();
		source.buffer = buffer;
		source.loop = true;
		let gainNode = this.contxt.createGain();
		source.connect(gainNode);
		gainNode.connect(this.contxt.destination);

		return {
			source,
			gainNode,
			channelName,
			setGain: (gain) => {
				gainNode.gain.value = gain;
			}
		};
	}



	createAudioPipeline() {

		let buffers = [
				`${path}/beat.wav`,
				`${path}/acapella.wav`,
				`${path}/melody.wav`
			];
			this.buffers = buffers;


		loader(buffers, this.contxt, (err, loadedBuffers) => {
			loadedBuffers.forEach((buffer, idx) => {
				this.sources.push(this.createSource(buffer, buffers[idx]));
			});

			this.sources.forEach(source => source.source.start(0));

			this.setState({loaded: true});
			window.sources = this.sources;
		});

	}

	createMetronome() {

				let sixteenthNote = 0;

				let intervalID = window.setInterval(() => {

					this.setState({note: (sixteenthNote++ % 16)});

				}, (spb * 1000));

	}


	play() {


	}


	render() {

		if (this.state.loaded){
			return (
				<div>
					{this.sources.map(source => {
						return (
							<div>
							<Yo setGain={source.setGain}/>
							{/* <Slider setGain={source.setGain}/> */}
							{source.channelName}
							</div>
						);
					})}

				</div>
			);
	 	} else {
				return (
					<div>
					<h1> LOADING </h1>
					</div>
				);
			}

	}
}

export default Root;

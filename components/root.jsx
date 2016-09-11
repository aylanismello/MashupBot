import React from 'react';
import loader  from 'webaudio-buffer-loader';
import Slider from './slider';
import ReactSlider from './react_slider';
import ProgressCircle from './progress_circle';
import WebAudioScheduler from 'web-audio-scheduler';

const path = './stems';
const bpm = 60;

const TimeSlices = {
	FOUR: 4,
	EIGHT: 8,
	SIXTEEN: 16,
	THIRTYTWO: 32
};

class Root extends React.Component {

	constructor(props) {

		super(props);
		this.state = {
			note: 0,
			loaded: false
		};


		this.createAudioPipeline = this.createAudioPipeline.bind(this);
		this.contxt = new AudioContext();
	  this.sched = new WebAudioScheduler({ context: this.contxt });
		this.channels = [];
		this.startMetronome = this.startMetronome.bind(this);
		this.metronome = this.metronome.bind(this);
		this.createAudioPipeline();

	}


	createChannel(buffer, channelName) {
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
				this.channels.push(this.createChannel(buffer, buffers[idx]));
			});

			this.channels.forEach(channel => {
				channel.setGain(0);
				channel.source.start(0);
			});

			this.setState({loaded: true});
			this.createMetronome(TimeSlices.FOUR);
			// this.createMetronome(TimeSlices.EIGHT);
			// this.createMetronome(TimeSlices.SIXTEEN);
			// this.createMetronome(TimeSlices.THIRTYTWO);
			window.channels = this.channels;
		});

	}



	createMetronome(timeSlice) {
		let bpmMultiplier = Math.log2(timeSlice/2);
		const spb = 60.0 / (bpm * bpmMultiplier);
		let startTime = this.contxt.currentTime;


	}


	play() {


	}


	metronome(e) {
		let t0 = e.playbackTime;
		console.log(`starting metronome at ${e.playbackTime}`);
		this.sched.insert(t0 + 2.000, this.metronome);
	}

	tick(e) {
		// let t0 = e.play
	}

	startMetronome() {
		// console.log('FO SHO');
		this.sched.start(this.metronome);
	}

	render() {

		if (this.state.loaded){
			return (
				<div>
					{this.channels.map(channel => {
						return (
							<div>
							<ReactSlider setGain={channel.setGain}/>
							{channel.channelName}
							</div>
						);
					})}

					<button onClick={this.startMetronome} value="start">START</button>
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

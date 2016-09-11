import React from 'react';
import loader  from 'webaudio-buffer-loader';
import Slider from './slider';
import ReactSlider from './react_slider';
import ProgressCircle from './progress_circle';
import WebAudioScheduler from 'web-audio-scheduler';

const path = './stems';
const bpm = 80;

const TimeSlices = {
	FOUR: 4,
	EIGHT: 8,
	SIXTEEN: 16,
	THIRTYTWO: 32
};

class Root extends React.Component {

	constructor(props) {

		const timeSlice = TimeSlices.THIRTYTWO;

		super(props);
		this.state = {
			note: 0,
			loaded: false,
			playing: false
		};

		let canvas = document.querySelector("#can");
		let ctx = canvas.getContext("2d");
		let max = 2 * Math.PI;

		this.circle = {
			canvas,
			ctx,
			max
		};

		this.drawAtRad = this.drawAtRad.bind(this);
		this.createAudioPipeline = this.createAudioPipeline.bind(this);
		this.contxt = new AudioContext();
	  this.sched = new WebAudioScheduler({ context: this.contxt });
		this.channels = [];
		this.startMetronome = this.startMetronome.bind(this);
		this.metronome = this.metronome.bind(this);
		this.handleUser = this.handleUser.bind(this);
		this.tick = this.tick.bind(this);
		this.createAudioPipeline();



	}




	drawAtRad(startingRadian, strokeLength) {

		this.circle.ctx.clearRect(0, 0, this.circle.canvas.width, this.circle.canvas.height);
		this.circle.ctx.beginPath();
		this.circle.ctx.arc(75, 75, 50, startingRadian, startingRadian + strokeLength);
		this.circle.ctx.stroke();



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



			this.setState({loaded: true});

			window.channels = this.channels;
		});

	}




	metronome(e) {
		let t0 = e.playbackTime;
		console.log(`starting metronome at ${e.playbackTime}`);
		// debugger;



		for (var step = 0; step <= TimeSlices.FOUR; step++) {
			let schedStartTime = t0 + (this.spb * step);

			if (step === TimeSlices.FOUR) {
				this.sched.insert(t0 + (this.spb * TimeSlices.FOUR), this.metronome);
			} else {
				this.sched.insert(schedStartTime, this.tick, {beat: step});
			}
		}

		// this.sched.insert(t0, this.tick, {beat: 0});
		// this.sched.insert(t0 + this.spb, this.tick, {beat: 1});
		// this.sched.insert(t0 + this.spb * 2, this.tick, {beat: 2});
		// this.sched.insert(t0 + this.spb * 3, this.tick, {beat: 3});
		// this.sched.insert(t0 + this.spb * 4, this.metronome);
		//

	}

	tick(e) {
		console.log(`tick ${e.playbackTime} and beat ${e.args.beat}`);

		let arcSize = (this.circle.max / 4.0);
		let startingRad = (e.args.beat / 4.0) * this.circle.max;

		// let endRad = startingRad + arcSize;
		this.drawAtRad(startingRad, arcSize);
		// let t0 = e.play
	}


	handleUser() {
		if (this.state.playing) {
			console.log('stop');
		} else {
			this.startMetronome();
		}
	}

	startMetronome() {
		// console.log('FO SHO');
		let timeSlice = TimeSlices.FOUR;
		let bpmMultiplier = Math.log2(timeSlice/2);
		const spb = 60.0 / (bpm * bpmMultiplier);
		this.spb = spb;
		this.setState({playing: true});
		this.channels.forEach(channel => {
			channel.setGain(0.25);
			channel.source.start(0);
		});
		this.sched.start(this.metronome);

	}


	render() {

		let playerText = this.state.playing ? "STOP" : "START";

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

					<button onClick={this.handleUser} >{playerText}</button>
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

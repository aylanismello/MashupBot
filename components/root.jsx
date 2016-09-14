import React from 'react';
import loader  from 'webaudio-buffer-loader';
import ProgressCircle from './progress_circle';
import WebAudioScheduler from 'web-audio-scheduler';
import Channel from './channel';
import Visualizer from './visualizer';


const path = './stems';
const BEATS_PATH = './stems/beats';
const MELODIES_PATH = './stems/melodies';
const ACAPELLAS_PATH = './stems/acapellas';
const CIRCUMFERENCE = Math.PI * 2;
const GREENISH = "#59b2a1";
const DEFAULT_CHANNEL_GAIN = 0.5;

const TimeSlices = {
	FOUR: 4,
	EIGHT: 8,
	SIXTEEN: 16,
	THIRTYTWO: 32
};

const bpm = 160;
const TIME_SLICE = 32;
// const timeSlice = TimeSlices.THIRTYTWO;

class Root extends React.Component {

	constructor(props) {

		super(props);


		this.state = {
			note: 0,
			loaded: false,
			playing: false,
			buffersLoaded: 0
		};

		this.channels = {
			beat: {},
			acapella: {},
			melody: {}
		};


		this.channelsToSchedule = {
			beat: {
				nextTrackIdx: 0,
				isScheduled: false,
				soundCircleId: `beat-0`
			},
			acapella: {
				nextTrackIdx: 0,
				isScheduled: false,
				soundCircleId: `acapella-0`
			},
			melody: {
				nextTrackIdx: 0,
				isScheduled: false,
				soundCircleId: `melody-0`
			}
		};

		this.circles = {};
		// this.circles = [];


		this.drawAtRad = this.drawAtRad.bind(this);
		this.createAudioPipeline = this.createAudioPipeline.bind(this);
		this.contxt = new AudioContext();

		this.nextTrackIdx = 0;
		this.nextSoundCircleId = `beat-0`;
		this.nextChannel = 'beat';

		// this.canvasContexts = [];



		this.masterGain = this.contxt.createGain();
		this.masterGain.connect(this.contxt.destination);

	  this.sched = new WebAudioScheduler({ context: this.contxt });
		this.startMetronome = this.startMetronome.bind(this);
		this.metronome = this.metronome.bind(this);
		this.handleUser = this.handleUser.bind(this);
		this.tick = this.tick.bind(this);
		this.stopMetronome = this.stopMetronome.bind(this);
		this.setMasterGain = this.setMasterGain.bind(this);
		this.switchTrack = this.switchTrack.bind(this);

		this.setCanvas = this.setCanvas.bind(this);
		this.makeChannelFromBuffers = this.makeChannelFromBuffers.bind(this);
		this.createAudioPipeline();

	}

	setCanvas(id, idx) {


		let canvas = document.querySelector(`#${id}`);
		let ctx = canvas.getContext("2d");

		ctx.lineWidth = 15;
		ctx.strokeStyle = GREENISH;
		let max = 2 * Math.PI;

		let circle = {
			canvas,
			ctx,
			max
		};


		this.circles[id] = circle;
	}



	drawAtRad(startingRadian, strokeLength, restart=false) {

		startingRadian -= Math.PI / 2.0;

		Object.keys(this.circles).forEach(circleKey => {

			let circle = this.circles[circleKey];
			let ctx = circle.ctx;

			if(restart){
				ctx.clearRect(0, 0, circle.canvas.width, circle.canvas.height);
			}

			ctx.beginPath();
			ctx.arc(100, 60, 50, startingRadian, startingRadian + strokeLength);
			ctx.stroke();
		});


	}

	createSubChannel(buffer, pathName, channelGainNode) {
		let source = this.contxt.createBufferSource();
		source.buffer = buffer;
		source.loop = true;
		let gainNode = this.contxt.createGain();
		source.connect(gainNode);
		gainNode.connect(channelGainNode);
		channelGainNode.connect(this.masterGain);

		return {
			source,
			gainNode,
			pathName,
			setGain: (gain) => {
				gainNode.gain.value = gain;
			}
		};
	}


	createAudioPipeline() {

		let buffers = {
			beat: [
				`${BEATS_PATH}/backseat.wav`,
				`${BEATS_PATH}/yonkers.wav`,
				`${BEATS_PATH}/so_fresh.wav`
			],
			melody: [
				`${MELODIES_PATH}/1994.wav`,
				`${MELODIES_PATH}/lullaby.wav`,
				`${MELODIES_PATH}/mercy_me.wav`
			],

			acapella: [
				`${ACAPELLAS_PATH}/bob.wav`,
				`${ACAPELLAS_PATH}/green_light.wav`,
				`${ACAPELLAS_PATH}/gucci.wav`
			]

		};


			Object.keys(buffers).forEach(buffer => {
				this.makeChannelFromBuffers(buffers[buffer], channel => { this.channels[buffer] = channel;} )
			});


	}


	makeChannelFromBuffers(buffers, setChannel) {
		let subChannels = [];
		let channelGainNode = this.contxt.createGain();

		loader(buffers, this.contxt, (err, loadedBuffers) => {
			loadedBuffers.forEach((buffer, idx) => {
				subChannels.push(this.createSubChannel(buffer, buffers[idx], channelGainNode));
			});

			let channel = {
				subChannels,
				channelGainNode,
				setGain: (gain) => {
					channelGainNode.gain.value = gain;
				}
			};

			setChannel(channel);

			this.setState({buffersLoaded: this.state.buffersLoaded + 1});
		});

	}

	metronome(e) {
		let t0 = e.playbackTime;



		Object.keys(this.channelsToSchedule).forEach(channel => {
			this.switchTrack(this.channelsToSchedule[channel].nextTrackIdx,
					this.channelsToSchedule[channel].soundCircleId, channel,
						true);
		});



		for (var step = 0; step <= TIME_SLICE; step++) {
			let schedStartTime = t0 + (this.spb * step);
			if (step === TIME_SLICE) {
				this.sched.insert(t0 + (this.spb * TIME_SLICE), this.metronome);
			} else {
				this.sched.insert(schedStartTime, this.tick, {beat: step});
			}
		}
	}

	tick(e) {
		let arcSize = (CIRCUMFERENCE / (Number(TIME_SLICE) * 1.0));
		let startingRad = ((CIRCUMFERENCE / TIME_SLICE ) * e.args.beat);

		if(e.args.beat === (TIME_SLICE - 1)) {
			this.drawAtRad(startingRad, arcSize, true);
		} else {
			this.drawAtRad(startingRad, arcSize);

		}
	}

	handleUser() {
		if (this.state.playing) {
			this.stopMetronome();
		} else {
			this.startMetronome();
		}
	}

	startMetronome() {
		let timeSlice = TIME_SLICE;
		let bpmMultiplier = Math.log2(timeSlice/2);
		const spb = 60.0 / (bpm * bpmMultiplier);
		this.spb = spb;
		this.setState({playing: true});


		Object.keys(this.channels).forEach(channel =>{
			this.channels[channel].subChannels.forEach((track, idx) => {
				if(idx === 0){
					track.setGain(DEFAULT_CHANNEL_GAIN);
				} else {
					track.setGain(0);
				}
				// track.source.start(0);
			});
		});

		this.sched.start(this.metronome);
	}

	stopMetronome () {
  	this.sched.stop(true);
		this.setMasterGain(0);
  }

	setMasterGain(gain) {
		this.masterGain.gain.value = gain;
	}

	switchTrack(trackIdx, soundCircleId, channel, isScheduled=false) {

		if (!isScheduled) {
			let channelToSchedule = this.channelsToSchedule[channel];
			channelToSchedule.nextTrackIdx = trackIdx;
			// debugger;
			channelToSchedule.soundCircleId = soundCircleId;
			channelToSchedule.isScheduled = isScheduled;

			// console.log(`switching to ${channelToSchedule.nextTrackIdx}`);
			// console.log(`circle id of ${channelToSchedule.soundCircleId}`);
			// console.log(`isScheduled? ${channelToSchedule.isScheduled}`);
			//
			// console.log(``);
			return;
		}


		let selectedTrack = this.channels[channel].subChannels[trackIdx];

		this.resetAllCircles(this.circles);
		// console.log(`received ${soundCircleId}`);
		this.circles[soundCircleId].ctx.strokeStyle = "#45d9e5";

		this.muteAllTracks(this.channels[channel].subChannels);
		selectedTrack.setGain(DEFAULT_CHANNEL_GAIN);

	}

	resetAllCircles(circles) {
		Object.keys(circles).forEach(circle => {
			circles[circle].ctx.strokeStyle = GREENISH;
		});


	}


	muteAllTracks(subChannels) {
		subChannels.forEach(channel => {
			channel.setGain(0);

		});

}

	render() {

		let playerText = this.state.playing ? "STOP" : "START";

		if (this.state.buffersLoaded === 3){
			return (
				<div className="mix-board">

					{Object.keys(this.channels).map((channel, idx) => {
						return (

							<div 	className="channel">
								<Channel
									subChannels={this.channels[channel].subChannels}
									channelName={channel}
									switchTrack={this.switchTrack}
									setChannelGain={this.channels[channel].setGain}
									setCanvas={this.setCanvas}
									defaultGain={DEFAULT_CHANNEL_GAIN}
									key={idx}
									/>
							</div>

						);
					})};

					<button onClick={this.handleUser} >{playerText}</button>
					<Visualizer ctx={this.contxt} masterGain={this.masterGain}/>
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

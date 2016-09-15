import React from 'react';
// import SoundCircle from './sound_circle';
import SoundWave from './sound_wave';
import SoundWaveContainer from './sound_wave_container';
import ReactSlider from './react_slider';


class Channel extends React.Component {

	constructor(props) {
		super(props);
		this.tracks = props.tracks;
	}




	render() {



		let tracksJSX = this.tracks.map((track, idx) => {
			// let playing = (idx === this.state.playingTrackIdx) ? true : false;

			return (
				<div key={idx} className="channel">
					<SoundWaveContainer idx={idx}
						track={track}
						channelName={this.props.channelName}
						/>
				</div>
			);
		});

		return (
			<div>
			<h1 className="channel-name">
				{this.props.channelName}
			</h1>
				{tracksJSX}
				<ReactSlider setGain={this.props.setChannelGain}
				defaultGain={this.props.defaultGain}
				/>
			</div>
		);
	}

}

export default Channel;

import React from 'react';
import SoundCircle from './sound_circle';
import ReactSlider from './react_slider';


class Channel extends React.Component {

	constructor(props) {
		super(props);


		this.subChannels = props.subChannels;
		this.state = {
			playingTrackIdx: 0
		};

	}

	selectTrack(trackIdx, id) {
		this.props.switchTrack(trackIdx, id, this.props.channelName);
		this.setState({playingTrackIdx: trackIdx});
	}



	render() {

		let subChannelsJSX = this.subChannels.map((subChannel, idx) => {
			let playing = (idx === this.state.playingTrackIdx) ? true : false;
			return (
				<div key={idx}>
					<SoundCircle idx={idx}
						selectTrack={this.selectTrack.bind(this)}
						playing={playing}
						setCanvas={this.props.setCanvas}
						channelName={this.props.channelName}
						/>
				</div>
			);
		});

		return (
			<div>
				{this.props.channelName}
				{subChannelsJSX}
				<ReactSlider setGain={this.props.setChannelGain}
				defaultGain={this.props.defaultGain}
				/>
			</div>
		);
	}

}

export default Channel;

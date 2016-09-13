import React from 'react';
import SoundCircle from './sound_circle';
import ReactSlider from './react_slider';


class Channel extends React.Component {

	constructor(props) {
		super(props);





		this.subChannelsJSX = props.subChannels.map((subChannel, idx) => {
			return (
				<div>
				<SoundCircle idx={idx} selectTrack={this.selectTrack.bind(this)}/>
				</div>
			);
		});

	}


	selectTrack(trackIdx) {
		this.props.switchTrack(trackIdx);
	}

	render() {

		return (
			<div>
				{this.subChannelsJSX}
				<ReactSlider setGain={this.props.setChannelGain}/>
			</div>
		);
	}

}

export default Channel;

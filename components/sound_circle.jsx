import React from 'react';


const SoundCircle = ({selectTrack, idx, playing}) => {

	let text = playing ? "ON" : "OFF";

	return (
		<div className="sound-circle"
			onClick={selectTrack.bind(null, idx)}>
			{text}
		</div>
	);
};


export default SoundCircle;

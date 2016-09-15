import { ChannelConstants } from '../actions/channel_actions';
import * as _ from 'lodash';

let defaultChannel = Object.freeze({
	loadedCount: 0
});

const ChannelReducer = (state=defaultChannel, action) => {
	let newState;

	switch (action.type) {
		case ChannelConstants.SET_LOADED_COUNT:
			newState = _.merge({}, state, {loadedCount: action.count});
			return newState;
		default:
			return state;
	}

};

export default ChannelReducer;

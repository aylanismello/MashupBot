import { connect } from 'react-redux';
import App from './app';
import { togglePlay, start } from '../actions/play_actions';
import { setChannelsLoaded } from '../actions/channel_actions';


const mapStateToProps = (state, ownProps) => ({
	selectedTracks: state.track.selectedTracks,
	playing: state.play.playing,
	channelsLoaded: state.channel.loadedCount,
	started: state.play.started
});

const mapDispatchToProps = dispatch => ({
	togglePlay: () => dispatch(togglePlay()),
	setChannelsLoaded: (count) => dispatch(setChannelsLoaded(count)),
	start: () => dispatch(start())
});

export default connect (
	mapStateToProps,
	mapDispatchToProps
)(App);

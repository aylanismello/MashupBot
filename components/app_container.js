import { connect } from 'react-redux';
import App from './app';
import { selectTrack } from '../actions/track_actions';


const mapStateToProps = (state, ownProps) => ({
	selectedTracks: state.track.selectedTracks
});

export default connect (
	mapStateToProps
)(App);

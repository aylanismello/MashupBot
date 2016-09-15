export const ChannelConstants = {
	SET_LOADED_COUNT: 'SET_LOADED_COUNT'
};

export const setChannelsLoaded = (count) => ({
	type: ChannelConstants.SET_LOADED_COUNT,
	count
});

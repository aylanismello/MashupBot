// import * as BONSAI from 'bonsai';
// import React from 'react';
import { Howl } from 'howler';
import loader  from 'webaudio-buffer-loader';

const path = './stems';
document.addEventListener("DOMContentLoaded", () => {


	let bpm = 320.0;
	// SECONDS PER BEAT
	let spb = 60.0 / bpm;


	let ctx = new AudioContext();

	let buffers = [
			`${path}/beat.wav`,
			`${path}/acapella.wav`,
			`${path}/melody.wav`
		];

	let sources = [];

	loader(buffers, ctx, (err, loadedBuffers) => {
		loadedBuffers.forEach(buffer => {
				let source = ctx.createBufferSource();
				source.buffer = buffer;
				source.loop = true;
				sources.push(source);

			});

		sources.forEach(source => {
				source.connect(ctx.destination);
				source.start(0);
		});




	});


	let sixteenthNote = 0;

	let intervalID = window.setInterval(() => {

		console.log(`${(sixteenthNote++ % 16)}`);



	}, (spb * 1000));



});

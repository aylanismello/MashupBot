// import * as BONSAI from 'bonsai';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import { Howl } from 'howler';

document.addEventListener("DOMContentLoaded", () => {

	const root = document.querySelector('#root');

	ReactDOM.render(<Root/>, root);




});

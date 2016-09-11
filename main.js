document.addEventListener("DOMContentLoaded", () => {
	console.log('loaded');
	new Rect(0, 0, 100, 100)
  .addTo(stage)
  .attr('fillColor', 'red')
  .animate('1s', {
    fillColor: 'blue'
  });
});

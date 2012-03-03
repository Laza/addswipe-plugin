<h1>jQuery addSwipe Plugin</h1>
<p>With this plugin you can add swipe action to a layer, and render actions for the left and right swipe move gesture. Works with mouse and touchscreen uniformly. You can also set it up to snap to grid, e.g. window width or a fraction of the width.</p>
<h2>Syntax</h2>
<pre><code>$(layer).addSwipe( leftFn, rightFn, { options } );</code></pre>
<ul>
	<li><code>leftFn</code> the function to be called on left swipe event</li>
	<li><code>rightFn</code> the function to be called on right swipe event</li>
</ul>
<h5>options</h5>
<ul>
	<li><code>minDist</code> minimum distance in pixels that is to be treated as swipe (default = 40)</li> 
	<li><code>snapGrid</code> the grid to snap, 1 means snap to whole width, 2: half width (default = 0, no snap)</li> 
	<li><code>keepWithin</code> the content is not allowed go off the window (default = true)</li>
</ul>
<h5>methods</h5>
<ul>
	<li><code>unswipe</code> detach the swipe functionality from the element</li> 
	<li><code>resetswipe</code> moves the layer to the starting position</li> 
</ul>
<h2>Demo</h2>
<p><a href="http://lazaworx.com/static/addswipe-plugin/sample.html">http://lazaworx.com/static/addswipe-plugin/sample.html</a></p>
<h2>Usage</h2>
<pre><code>
<script src="addswipe.js"></script>
<script>
	$(document).ready(function() {
		// Rendering functions to left and right swipe events
		$('#content').addSwipe(function() {
			$('h3').text("Swiped left!");
		}, function() {
			$('h3').text("Swiped right!");
		}, {
		// Snapping to grid of size equals to the container's
			snapGrid: 1,
		});
		// Triggering the 'resetswipe' method
		$('button').click(function() {
			$('#content').trigger('resetswipe');
		});
	});
</script>
</code></pre>
<h2>Requirements</h2>
<p><a href="http://docs.jquery.com/Downloading_jQuery">jQuery 1.7 or higher</a></p>
<h2>License</h2>
<p>Available for use in all personal or commercial projects under both <a href="MIT-LICENSE.txt">MIT</a> and <a href="GPL-LICENSE.txt">GPL licenses</a>.</p>
<p>Copyright (c) 2012 <a href="http://lazaworx.com">Molnar Laszlo</a></p>

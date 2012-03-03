// addSwipe :: adding swipe gesture support to a layer
// http://lazaworx.com/addswipe-plugin/

(function($) {

	$.extend( $.support, {
		touch: "ontouchend" in document
	});
	
	// Easing function by George Smith
	
	$.extend( jQuery.easing, {
		easeOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		},
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		}
	});
	
	$.fn.addSwipe = function( leftFn, rightFn, settings ) {
		
		settings = $.extend( {}, $.fn.addSwipe.defaults, settings );
		var effect = settings.snapGrid? 'easeOutBack' : 'easeOutQuad';
		
		return this.each(function() {
			
			var t = $(this);
			var xs, dist, ex = 0, tx = 0, tx1 = 0, x0, tt, speed;
			
			t.attr('draggable', 'true');
			
			// retrieving the event's X position
			
			var getX = function(e) {
				return ex = ( e.touches && e.touches.length > 0 )? e.touches[0].clientX : ( e.clientX ? e.clientX : ex );
			};
			
			// registering start position
			
			var setPos = function(e) {
				tx = getX(e);
			};
			
			var noAction = function(e) {
				return false;
			};
			
			// moving the element
			
			var dragMove = function(e) {
				if ( tx ) {
					t.css({
						left: (getX(e) - tx + x0)
					});
				} else { // Wrong dragstart event coordinate :: starting now
					tx = getX(e);
				}
				return false;
			};
			
			// stopped dragging
			
			var dragStop = function(e) {
				
				var dx = getX(e) - tx;
				tx1 = t.position().left;
				
				// detach handlers
				
				if ( $.support.touch ) {
					this.ontouchmove = null;
					this.ontouchend = null;
				} else {
					$(document).off('mousemove', dragMove).off('mouseup click', dragStop);
				}
				
				if ( Math.abs(dx) > settings.minDist ) {
					
					// Swipe detected
					
					var x1, cw = t.parent().width(), tw = t.width(), gw, eff = effect;
					
					speed = 1000 * dx / (new Date().getTime() - tt);
					x1 = tx1 + Math.round(speed / 2);
					
					if ( settings.snapGrid ) {
						gw = cw / settings.snapGrid;
						x1 = Math.round(Math.round(x1 / gw) * gw);
					}

					if ( settings.keepWithin ) {
						if ( x1 < 0 && (tw + x1) < cw ) {
							x1 = cw - tw;
							eff = 'easeOutBack';
						} else if ( x1 > 0 && (tw + x1) > cw ) {
							x1 = 0;
							eff = 'easeOutBack';
						}
					}
					
					t.animate({
						left: x1
					}, 500, eff);
					
					// Calling the appropriate function
					
					if ( dx < 0 ) { 
						if ( $.isFunction(leftFn) ) {
							leftFn.call(); 
						}
					} else if ( $.isFunction(rightFn) ) {
						rightFn.call();
					}
					
				} else {
					
					// Just a small move - let the click event happen
					
					t.animate({
						left: x0
					}, 200);
					
					t.trigger('click');
				}
				
				return false;
			};
			
			// registering start position on touch devices
			
			var touchStart = function(e) {
				
				if ( (e.type === 'touchstart' || e.type === 'touchmove') && 
					(!e.touches || e.touches.length > 1 || t.is(':animated')) ) {
					// >= 2 finger flick
					return true;
				}
				setPos(e);
				dragStart(e);
			};
			
			// start dragging
			
			var dragStart = function(e) {
				
				t.stop(true, false);
				x0 = t.position().left;
				tt = new Date().getTime();
				dist = 0;
				
				if ( $.support.touch ) {
					this.ontouchmove = dragMove;
					this.ontouchend = dragStop;
					return true;
				} else {
					t.off('click');
					t.click(noAction);
					$(document).on({
						'mousemove': dragMove,
						'mouseup': dragStop
					});
					e.cancelBubble = true;
					return false;
				}
			};
			
			// initializing 
			
			if ($.support.touch) {
				this.ontouchstart = touchStart;
			} else {
				t.on({
					'dragstart': dragStart,
					'mousedown': setPos
				});
			}
			
			// reset function
			
			xs = t.position().left;
			
			t.on('resetswipe', function() {
				t.stop(true, false).animate({
					left: xs
				}, 500, 'easeOutBack');
				return false;
			});
			
			// removing the event handler
			
			t.on('unswipe', function() {
				if ( $.support.touch ) {
					this.ontouchmove = null;
					this.ontouchend = null;
					this.ontouchstart = null;
				} else {
					if ( $.isFunction(t.noAction) ) {
						t.off(noAction);
					}
					if ( $.isFunction(t.dragStart) ) {
						t.off(dragStart);
					}
					$(document).off('mousemove', dragMove).off('mouseup', dragStop);
				}
			});
			
			// disabling text selection, because it conflicts with drag
			
			t.on('selectstart', noAction); 

		});
	};
	
	$.fn.addSwipe.defaults = {
		minDist: 40,
		snapGrid: 0,
		keepWithin: true
	};
	
})(jQuery);

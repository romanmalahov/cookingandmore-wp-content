/**
 * Interface Elements for jQuery
 * Draggable
 *
 * http://interface.eyecon.ro
 *
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 */
 
/**
 * Create a draggable element with a number of advanced options including callback, Google Maps type draggables,
 * reversion, ghosting, and grid dragging.
 * 
 * @name Draggable
 * @descr Creates draggable elements that can be moved across the page.
 * @param Hash hash A hash of parameters. All parameters are optional.
 * @option String handle (optional) The jQuery selector matching the handle that starts the draggable
 * @option DOMElement handle (optional) The DOM Element of the handle that starts the draggable
 * @option Boolean revert (optional) When true, on stop-drag the element returns to initial position
 * @option Boolean ghosting (optional) When true, a copy of the element is moved
 * @option Integer zIndex (optional) zIndex depth for the element while it is being dragged
 * @option Float opacity (optional) A number between 0 and 1 that indicates the opacity of the element while being dragged
 * @option Integer grid (optional) (optional) A number of pixels indicating the grid that the element should snap to
 * @option Array grid (optional) A number of x-pixels and y-pixels indicating the grid that the element should snap to
 * @option Integer fx (optional) Duration for the effect (like ghosting or revert) applied to the draggable
 * @option String containment (optional) Define the zone where the draggable can be moved. 'parent' moves it inside parent
 *                           element, while 'document' prevents it from leaving the document and forcing additional
 *                           scrolling
 * @option Array containment An 4-element array (left, top, width, height) indicating the containment of the element
 * @option String axis (optional) Set an axis: vertical (with 'vertically') or horizontal (with 'horizontally')
 * @option Function onStart (optional) Callback function triggered when the dragging starts
 * @option Function onStop (optional) Callback function triggered when the dragging stops
 * @option Function onChange (optional) Callback function triggered when the dragging stop *and* the element was moved at least
 *                          one pixel
 * @option Function onDrag (optional) Callback function triggered while the element is dragged. Receives two parameters: x and y
 *                        coordinates. You can return an object with new coordinates {x: x, y: y} so this way you can
 *                        interact with the dragging process (for instance, build your containment)
 * @option Boolean insideParent Forces the element to remain inside its parent when being dragged (like Google Maps)
 * @option Integer snapDistance (optional) The element is not moved unless it is dragged more than snapDistance. You can prevent
 *                             accidental dragging and keep regular clicking enabled (for links or form elements, 
 *                             for instance)
 * @option Object cursorAt (optional) The dragged element is moved to the cursor position with the offset specified. Accepts value
 *                        for top, left, right and bottom offset. Basically, this forces the cursor to a particular
 *                        position during the entire drag operation.
 * @option Boolean autoSize (optional) When true, the drag helper is resized to its content, instead of the dragged element's sizes
 * @option String frameClass (optional) When is set the cloned element is hidden so only a frame is dragged
 * @type jQuery
 * @cat Plugins/Interface
 * @author Stefan Petre
 */

jQuery.iDrag =	{
	helper : null,
	dragged: null,
	destroy : function()
	{
		return this.each(
			function ()
			{
				if (this.isDraggable) {
					this.dragCfg.dhe.unbind('mousedown', jQuery.iDrag.draginit);
					this.dragCfg = null;
					this.isDraggable = false;
					if(jQuery.browser.msie) {
						this.unselectable = "off";
					} else {
						this.style.MozUserSelect = '';
						this.style.KhtmlUserSelect = '';
						this.style.userSelect = '';
					}
				}
			}
		);
	},
	draginit : function (e)
	{
		if (jQuery.iDrag.dragged != null) {
			jQuery.iDrag.dragstop(e);
			return false;
		}
		var elm = this.dragElem;
		jQuery(document)
			.bind('mousemove', jQuery.iDrag.dragmove)
			.bind('mouseup', jQuery.iDrag.dragstop);
		elm.dragCfg.pointer = jQuery.iUtil.getPointer(e);
		elm.dragCfg.currentPointer = elm.dragCfg.pointer;
		elm.dragCfg.init = false;
		elm.dragCfg.fromHandler = this != this.dragElem;
		jQuery.iDrag.dragged = elm;
		if (elm.dragCfg.si && this != this.dragElem) {
				parentPos = jQuery.iUtil.getPosition(elm.parentNode);
				sliderSize = jQuery.iUtil.getSize(elm);
				sliderPos = {
					x : parseInt(jQuery.css(elm,'left')) || 0,
					y : parseInt(jQuery.css(elm,'top')) || 0
				};
				dx = elm.dragCfg.currentPointer.x - parentPos.x - sliderSize.wb/2 - sliderPos.x;
				dy = elm.dragCfg.currentPointer.y - parentPos.y - sliderSize.hb/2 - sliderPos.y;
				jQuery.iSlider.dragmoveBy(elm, [dx, dy]);
		}
		return jQuery.selectKeyHelper||false;
	},

	dragstart : function(e)
	{
		var elm = jQuery.iDrag.dragged;
		elm.dragCfg.init = true;

		var dEs = elm.style;

		elm.dragCfg.oD = jQuery.css(elm,'display');
		elm.dragCfg.oP = jQuery.css(elm,'position');
		if (!elm.dragCfg.initialPosition)
			elm.dragCfg.initialPosition = elm.dragCfg.oP;

		elm.dragCfg.oR = {
			x : parseInt(jQuery.css(elm,'left')) || 0,
			y : parseInt(jQuery.css(elm,'top')) || 0
		};
		elm.dragCfg.diffX = 0;
		elm.dragCfg.diffY = 0;
		if (jQuery.browser.msie) {
			var oldBorder = jQuery.iUtil.getBorder(elm, true);
			elm.dragCfg.diffX = oldBorder.l||0;
			elm.dragCfg.diffY = oldBorder.t||0;
		}

		elm.dragCfg.oC = jQuery.extend(
			jQuery.iUtil.getPosition(elm),
			jQuery.iUtil.getSize(elm)
		);
		if (elm.dragCfg.oP != 'relative' && elm.dragCfg.oP != 'absolute') {
			dEs.position = 'relative';
		}

		jQuery.iDrag.helper.empty();
		var clonedEl = elm.cloneNode(true);
		
		jQuery(clonedEl).css(
			{
				display:	'block',
				left:		'0px',
				top: 		'0px'
			}
		);
		clonedEl.style.marginTop = '0';
		clonedEl.style.marginRight = '0';
		clonedEl.style.marginBottom = '0';
		clonedEl.style.marginLeft = '0';
		jQuery.iDrag.helper.append(clonedEl);
		
		var dhs = jQuery.iDrag.helper.get(0).style;

		if (elm.dragCfg.autoSize) {
			dhs.width = 'auto';
			dhs.height = 'auto';
		} else {
			dhs.height = elm.dragCfg.oC.hb + 'px';
			dhs.width = elm.dragCfg.oC.wb + 'px';
		}

		dhs.display = 'block';
		dhs.marginTop = '0px';
		dhs.marginRight = '0px';
		dhs.marginBottom = '0px';
		dhs.marginLeft = '0px';

		//remeasure the clone to check if the size was changed by user's functions
		jQuery.extend(
			elm.dragCfg.oC,
			jQuery.iUtil.getSize(clonedEl)
		);

		if (elm.dragCfg.cursorAt) {
			if (elm.dragCfg.cursorAt.left) {
				elm.dragCfg.oR.x += elm.dragCfg.pointer.x - elm.dragCfg.oC.x - elm.dragCfg.cursorAt.left;
				elm.dragCfg.oC.x = elm.dragCfg.pointer.x - elm.dragCfg.cursorAt.left;
			}
			if (elm.dragCfg.cursorAt.top) {
				elm.dragCfg.oR.y += elm.dragCfg.pointer.y - elm.dragCfg.oC.y - elm.dragCfg.cursorAt.top;
				elm.dragCfg.oC.y = elm.dragCfg.pointer.y - elm.dragCfg.cursorAt.top;
			}
			if (elm.dragCfg.cursorAt.right) {
				elm.dragCfg.oR.x += elm.dragCfg.pointer.x - elm.dragCfg.oC.x -elm.dragCfg.oC.hb + elm.dragCfg.cursorAt.right;
				elm.dragCfg.oC.x = elm.dragCfg.pointer.x - elm.dragCfg.oC.wb + elm.dragCfg.cursorAt.right;
			}
			if (elm.dragCfg.cursorAt.bottom) {
				elm.dragCfg.oR.y += elm.dragCfg.pointer.y - elm.dragCfg.oC.y - elm.dragCfg.oC.hb + elm.dragCfg.cursorAt.bottom;
				elm.dragCfg.oC.y = elm.dragCfg.pointer.y - elm.dragCfg.oC.hb + elm.dragCfg.cursorAt.bottom;
			}
		}
		elm.dragCfg.nx = elm.dragCfg.oR.x;
		elm.dragCfg.ny = elm.dragCfg.oR.y;

		if (elm.dragCfg.insideParent || elm.dragCfg.containment == 'parent') {
			parentBorders = jQuery.iUtil.getBorder(elm.parentNode, true);
			elm.dragCfg.oC.x = elm.offsetLeft + (jQuery.browser.msie ? 0 : jQuery.browser.opera ? -parentBorders.l : parentBorders.l);
			elm.dragCfg.oC.y = elm.offsetTop + (jQuery.browser.msie ? 0 : jQuery.browser.opera ? -parentBorders.t : parentBorders.t);
			jQuery(elm.parentNode).append(jQuery.iDrag.helper.get(0));
		}
		if (elm.dragCfg.containment) {
			jQuery.iDrag.getContainment(elm);
			elm.dragCfg.onDragModifier.containment = jQuery.iDrag.fitToContainer;
		}

		if (elm.dragCfg.si) {
			jQuery.iSlider.modifyContainer(elm);
		}

		dhs.left = elm.dragCfg.oC.x - elm.dragCfg.diffX + 'px';
		dhs.top = elm.dragCfg.oC.y - elm.dragCfg.diffY + 'px';
		//resize the helper to fit the clone
		dhs.width = elm.dragCfg.oC.wb + 'px';
		dhs.height = elm.dragCfg.oC.hb + 'px';

		jQuery.iDrag.dragged.dragCfg.prot = false;

		if (elm.dragCfg.gx) {
			elm.dragCfg.onDragModifier.grid = jQuery.iDrag.snapToGrid;
		}
		if (elm.dragCfg.zIndex != false) {
			jQuery.iDrag.helper.css('zIndex', elm.dragCfg.zIndex);
		}
		if (elm.dragCfg.opacity) {
			jQuery.iDrag.helper.css('opacity', elm.dragCfg.opacity);
			if (window.ActiveXObject) {
				jQuery.iDrag.helper.css('filter', 'alpha(opacity=' + elm.dragCfg.opacity * 100 + ')');
			}
		}

		if(elm.dragCfg.frameClass) {
			jQuery.iDrag.helper.addClass(elm.dragCfg.frameClass);
			jQuery.iDrag.helper.get(0).firstChild.style.display = 'none';
		}
		if (elm.dragCfg.onStart)
			elm.dragCfg.onStart.apply(elm, [clonedEl, elm.dragCfg.oR.x, elm.dragCfg.oR.y]);
		if (jQuery.iDrop && jQuery.iDrop.count > 0 ){
			jQuery.iDrop.highlight(elm);
		}
		if (elm.dragCfg.ghosting == false) {
			dEs.display = 'none';
		}
		return false;
	},

	getContainment : function(elm)
	{
		if (elm.dragCfg.containment.constructor == String) {
			if (elm.dragCfg.containment == 'parent') {
				elm.dragCfg.cont = jQuery.extend(
					{x:0,y:0},
					jQuery.iUtil.getSize(elm.parentNode)
				);
				var contBorders = jQuery.iUtil.getBorder(elm.parentNode, true);
				elm.dragCfg.cont.w = elm.dragCfg.cont.wb - contBorders.l - contBorders.r;
				elm.dragCfg.cont.h = elm.dragCfg.cont.hb - contBorders.t - contBorders.b;
			} else if (elm.dragCfg.containment == 'document') {
				var clnt = jQuery.iUtil.getClient();
				elm.dragCfg.cont = {
					x : 0,
					y : 0,
					w : clnt.w,
					h : clnt.h
				};
			}
		} else if (elm.dragCfg.containment.constructor == Array) {
			elm.dragCfg.cont = {
				x : parseInt(elm.dragCfg.containment[0])||0,
				y : parseInt(elm.dragCfg.containment[1])||0,
				w : parseInt(elm.dragCfg.containment[2])||0,
				h : parseInt(elm.dragCfg.containment[3])||0
			};
		}
		elm.dragCfg.cont.dx = elm.dragCfg.cont.x - elm.dragCfg.oC.x;
		elm.dragCfg.cont.dy = elm.dragCfg.cont.y - elm.dragCfg.oC.y;
	},

	hidehelper : function(dragged)
	{
		if (dragged.dragCfg.insideParent || dragged.dragCfg.containment == 'parent') {
			jQuery('body', document).append(jQuery.iDrag.helper.get(0));
		}
		jQuery.iDrag.helper.empty().hide().css('opacity', 1);
		if (window.ActiveXObject) {
			jQuery.iDrag.helper.css('filter', 'alpha(opacity=100)');
		}
	},

	dragstop : function(e)
	{

		jQuery(document)
			.unbind('mousemove', jQuery.iDrag.dragmove)
			.unbind('mouseup', jQuery.iDrag.dragstop);

		if (jQuery.iDrag.dragged == null) {
			return;
		}
		var dragged = jQuery.iDrag.dragged;

		jQuery.iDrag.dragged = null;

		if (dragged.dragCfg.init == false) {
			return false;
		}
		if (dragged.dragCfg.so == true) {
			jQuery(dragged).css('position', dragged.dragCfg.oP);
		}
		var dEs = dragged.style;

		if (dragged.si) {
			jQuery.iDrag.helper.css('cursor', 'move');
		}
		if(dragged.dragCfg.frameClass) {
			jQuery.iDrag.helper.removeClass(dragged.dragCfg.frameClass);
		}

		if (dragged.dragCfg.revert == false) {
			if (dragged.dragCfg.fx > 0) {
				if (!dragged.dragCfg.axis || dragged.dragCfg.axis == 'horizontally') {
					var x = new jQuery.fx(dragged,{duration:dragged.dragCfg.fx}, 'left');
					x.custom(dragged.dragCfg.oR.x,dragged.dragCfg.nRx);
				}
				if (!dragged.dragCfg.axis || dragged.dragCfg.axis == 'vertically') {
					var y = new jQuery.fx(dragged,{duration:dragged.dragCfg.fx}, 'top');
					y.custom(dragged.dragCfg.oR.y,dragged.dragCfg.nRy);
				}
			} else {
				if (!dragged.dragCfg.axis || dragged.dragCfg.axis == 'horizontally')
					dragged.style.left = dragged.dragCfg.nRx + 'px';
				if (!dragged.dragCfg.axis || dragged.dragCfg.axis == 'vertically')
					dragged.style.top = dragged.dragCfg.nRy + 'px';
			}
			jQuery.iDrag.hidehelper(dragged);
			if (dragged.dragCfg.ghosting == false) {
				jQuery(dragged).css('display', dragged.dragCfg.oD);
			}
		} else if (dragged.dragCfg.fx > 0) {
			dragged.dragCfg.prot = true;
			var dh = false;
			if(jQuery.iDrop && jQuery.iSort && dragged.dragCfg.so) {
				dh = jQuery.iUtil.getPosition(jQuery.iSort.helper.get(0));
			}
			jQuery.iDrag.helper.animate(
				{
					left : dh ? dh.x : dragged.dragCfg.oC.x,
					top : dh ? dh.y : dragged.dragCfg.oC.y
				},
				dragged.dragCfg.fx,
				function()
				{
					dragged.dragCfg.prot = false;
					if (dragged.dragCfg.ghosting == false) {
						dragged.style.display = dragged.dragCfg.oD;
					}
					jQuery.iDrag.hidehelper(dragged);
				}
			);
		} else {
			jQuery.iDrag.hidehelper(dragged);
			if (dragged.dragCfg.ghosting == false) {
				jQuery(dragged).css('display', dragged.dragCfg.oD);
			}
		}

		if (jQuery.iDrop && jQuery.iDrop.count > 0 ){
			jQuery.iDrop.checkdrop(dragged);
		}
		if (jQuery.iSort && dragged.dragCfg.so) {
			jQuery.iSort.check(dragged);
		}
		if (dragged.dragCfg.onChange && (dragged.dragCfg.nRx != dragged.dragCfg.oR.x || dragged.dragCfg.nRy != dragged.dragCfg.oR.y)){
			dragged.dragCfg.onChange.apply(dragged, dragged.dragCfg.lastSi||[0,0,dragged.dragCfg.nRx,dragged.dragCfg.nRy]);
		}
		if (dragged.dragCfg.onStop)
			dragged.dragCfg.onStop.apply(dragged);
		return false;
	},

	snapToGrid : function(x, y, dx, dy)
	{
		if (dx != 0)
			dx = parseInt((dx + (this.dragCfg.gx * dx/Math.abs(dx))/2)/this.dragCfg.gx) * this.dragCfg.gx;
		if (dy != 0)
			dy = parseInt((dy + (this.dragCfg.gy * dy/Math.abs(dy))/2)/this.dragCfg.gy) * this.dragCfg.gy;
		return {
			dx : dx,
			dy : dy,
			x: 0,
			y: 0
		};
	},

	fitToContainer : function(x, y, dx, dy)
	{
		dx = Math.min(
				Math.max(dx,this.dragCfg.cont.dx),
				this.dragCfg.cont.w + this.dragCfg.cont.dx - this.dragCfg.oC.wb
			);
		dy = Math.min(
				Math.max(dy,this.dragCfg.cont.dy),
				this.dragCfg.cont.h + this.dragCfg.cont.dy - this.dragCfg.oC.hb
			);

		return {
			dx : dx,
			dy : dy,
			x: 0,
			y: 0
		}
	},

	dragmove : function(e)
	{
		if (jQuery.iDrag.dragged == null || jQuery.iDrag.dragged.dragCfg.prot == true) {
			return;
		}

		var dragged = jQuery.iDrag.dragged;

		dragged.dragCfg.currentPointer = jQuery.iUtil.getPointer(e);
		if (dragged.dragCfg.init == false) {
			distance = Math.sqrt(Math.pow(dragged.dragCfg.pointer.x - dragged.dragCfg.currentPointer.x, 2) + Math.pow(dragged.dragCfg.pointer.y - dragged.dragCfg.currentPointer.y, 2));
			if (distance < dragged.dragCfg.snapDistance){
				return;
			} else {
				jQuery.iDrag.dragstart(e);
			}
		}

		var dx = dragged.dragCfg.currentPointer.x - dragged.dragCfg.pointer.x;
		var dy = dragged.dragCfg.currentPointer.y - dragged.dragCfg.pointer.y;

		for (var i in dragged.dragCfg.onDragModifier) {
			var newCoords = dragged.dragCfg.onDragModifier[i].apply(dragged, [dragged.dragCfg.oR.x + dx, dragged.dragCfg.oR.y + dy, dx, dy]);
			if (newCoords && newCoords.constructor == Object) {
				dx = i != 'user' ? newCoords.dx : (newCoords.x - dragged.dragCfg.oR.x);
				dy = i != 'user' ? newCoords.dy : (newCoords.y - dragged.dragCfg.oR.y);
			}
		}

		dragged.dragCfg.nx = dragged.dragCfg.oC.x + dx - dragged.dragCfg.diffX;
		dragged.dragCfg.ny = dragged.dragCfg.oC.y + dy - dragged.dragCfg.diffY;

		if (dragged.dragCfg.si && (dragged.dragCfg.onSlide || dragged.dragCfg.onChange)) {
			jQuery.iSlider.onSlide(dragged, dragged.dragCfg.nx, dragged.dragCfg.ny);
		}

		if(dragged.dragCfg.onDrag)
			dragged.dragCfg.onDrag.apply(dragged, [dragged.dragCfg.oR.x + dx, dragged.dragCfg.oR.y + dy]);
			
		if (!dragged.dragCfg.axis || dragged.dragCfg.axis == 'horizontally') {
			dragged.dragCfg.nRx = dragged.dragCfg.oR.x + dx;
			jQuery.iDrag.helper.get(0).style.left = dragged.dragCfg.nx + 'px';
		}
		if (!dragged.dragCfg.axis || dragged.dragCfg.axis == 'vertically') {
			dragged.dragCfg.nRy = dragged.dragCfg.oR.y + dy;
			jQuery.iDrag.helper.get(0).style.top = dragged.dragCfg.ny + 'px';
		}
		
		if (jQuery.iDrop && jQuery.iDrop.count > 0 ){
			jQuery.iDrop.checkhover(dragged);
		}
		return false;
	},

	build : function(o)
	{
		if (!jQuery.iDrag.helper) {
			jQuery('body',document).append('<div id="dragHelper"></div>');
			jQuery.iDrag.helper = jQuery('#dragHelper');
			var el = jQuery.iDrag.helper.get(0);
			var els = el.style;
			els.position = 'absolute';
			els.display = 'none';
			els.cursor = 'move';
			els.listStyle = 'none';
			els.overflow = 'hidden';
			if (window.ActiveXObject) {
				el.unselectable = "on";
			} else {
				els.mozUserSelect = 'none';
				els.userSelect = 'none';
				els.KhtmlUserSelect = 'none';
			}
		}
		if (!o) {
			o = {};
		}
		return this.each(
			function()
			{
				if (this.isDraggable || !jQuery.iUtil)
					return;
				if (window.ActiveXObject) {
					this.onselectstart = function(){return false;};
					this.ondragstart = function(){return false;};
				}
				var el = this;
				var dhe = o.handle ? jQuery(this).find(o.handle) : jQuery(this);
				if(jQuery.browser.msie) {
					dhe.each(
						function()
						{
							this.unselectable = "on";
						}
					);
				} else {
					dhe.css('-moz-user-select', 'none');
					dhe.css('user-select', 'none');
					dhe.css('-khtml-user-select', 'none');
				}
				this.dragCfg = {
					dhe: dhe,
					revert : o.revert ? true : false,
					ghosting : o.ghosting ? true : false,
					so : o.so ? o.so : false,
					si : o.si ? o.si : false,
					insideParent : o.insideParent ? o.insideParent : false,
					zIndex : o.zIndex ? parseInt(o.zIndex)||0 : false,
					opacity : o.opacity ? parseFloat(o.opacity) : false,
					fx : parseInt(o.fx)||null,
					hpc : o.hpc ? o.hpc : false,
					onDragModifier : {},
					pointer : {},
					onStart : o.onStart && o.onStart.constructor == Function ? o.onStart : false,
					onStop : o.onStop && o.onStop.constructor == Function ? o.onStop : false,
					onChange : o.onChange && o.onChange.constructor == Function ? o.onChange : false,
					axis : /vertically|horizontally/.test(o.axis) ? o.axis : false,
					snapDistance : o.snapDistance ? parseInt(o.snapDistance)||0 : 0,
					cursorAt: o.cursorAt ? o.cursorAt : false,
					autoSize : o.autoSize ? true : false,
					frameClass : o.frameClass || false
					
				};
				if (o.onDragModifier && o.onDragModifier.constructor == Function)
					this.dragCfg.onDragModifier.user = o.onDragModifier;
				if (o.onDrag && o.onDrag.constructor == Function)
					this.dragCfg.onDrag = o.onDrag;
				if (o.containment && ((o.containment.constructor == String && (o.containment == 'parent' || o.containment == 'document')) || (o.containment.constructor == Array && o.containment.length == 4) )) {
					this.dragCfg.containment = o.containment;
				}
				if(o.fractions) {
					this.dragCfg.fractions = o.fractions;
				}
				if(o.grid){
					if(typeof o.grid == 'number'){
						this.dragCfg.gx = parseInt(o.grid)||1;
						this.dragCfg.gy = parseInt(o.grid)||1;
					} else if (o.grid.length == 2) {
						this.dragCfg.gx = parseInt(o.grid[0])||1;
						this.dragCfg.gy = parseInt(o.grid[1])||1;
					}
				}
				if (o.onSlide && o.onSlide.constructor == Function) {
					this.dragCfg.onSlide = o.onSlide;
				}

				this.isDraggable = true;
				dhe.each(
					function(){
						this.dragElem = el;
					}
				);
				dhe.bind('mousedown', jQuery.iDrag.draginit);
			}
		)
	}
};

/**
 * Destroy an existing draggable on a collection of elements
 * 
 * @name DraggableDestroy
 * @descr Destroy a draggable
 * @type jQuery
 * @cat Plugins/Interface
 * @example $('#drag2').DraggableDestroy();
 */

jQuery.fn.extend(
	{
		DraggableDestroy : jQuery.iDrag.destroy,
		Draggable : jQuery.iDrag.build
	}
);/**
 * Interface Elements for jQuery
 * Droppables
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *   
 *
 */

/**
 * With the Draggables plugin, Droppable allows you to create drop zones for draggable elements.
 *
 * @name Droppable
 * @cat Plugins/Interface
 * @param Hash options A hash of options
 * @option String accept The class name for draggables to get accepted by the droppable (mandatory)
 * @option String activeclass When an acceptable draggable is moved, the droppable gets this class
 * @option String hoverclass When an acceptable draggable is inside the droppable, the droppable gets
 *                           this class
 * @option String tolerance  Choose from 'pointer', 'intersect', or 'fit'. The pointer options means
 *                           that the pointer must be inside the droppable in order for the draggable
 *                           to be dropped. The intersect option means that the draggable must intersect
 *                           the droppable. The fit option means that the entire draggable must be
 *                           inside the droppable.
 * @option Function onDrop   When an acceptable draggable is dropped on a droppable, this callback is
 *                           called. It passes the draggable DOMElement as a parameter.
 * @option Function onHover  When an acceptable draggable is hovered over a droppable, this callback
 *                           is called. It passes the draggable DOMElement as a parameter.
 * @option Function onOut    When an acceptable draggable leaves a droppable, this callback is called.
 *                           It passes the draggable DOMElement as a parameter.
 * @example                  $('#dropzone1').Droppable(
 *                             {
 *                               accept : 'dropaccept', 
 *                               activeclass: 'dropzoneactive', 
 *                               hoverclass:	'dropzonehover',
 *                               ondrop:	function (drag) {
 *                                              alert(this); //the droppable
 *                                              alert(drag); //the draggable
 *                                        },
 *                               fit: true
 *                             }
 *                           )
 */

jQuery.iDrop = {
	fit : function (zonex, zoney, zonew, zoneh)
	{
		return 	zonex <= jQuery.iDrag.dragged.dragCfg.nx && 
				(zonex + zonew) >= (jQuery.iDrag.dragged.dragCfg.nx + jQuery.iDrag.dragged.dragCfg.oC.w) &&
				zoney <= jQuery.iDrag.dragged.dragCfg.ny && 
				(zoney + zoneh) >= (jQuery.iDrag.dragged.dragCfg.ny + jQuery.iDrag.dragged.dragCfg.oC.h) ? true :false;
	},
	intersect : function (zonex, zoney, zonew, zoneh)
	{
		return 	! ( zonex > (jQuery.iDrag.dragged.dragCfg.nx + jQuery.iDrag.dragged.dragCfg.oC.w)
				|| (zonex + zonew) < jQuery.iDrag.dragged.dragCfg.nx 
				|| zoney > (jQuery.iDrag.dragged.dragCfg.ny + jQuery.iDrag.dragged.dragCfg.oC.h) 
				|| (zoney + zoneh) < jQuery.iDrag.dragged.dragCfg.ny
				) ? true :false;
	},
	pointer : function (zonex, zoney, zonew, zoneh)
	{
		return	zonex < jQuery.iDrag.dragged.dragCfg.currentPointer.x
				&& (zonex + zonew) > jQuery.iDrag.dragged.dragCfg.currentPointer.x 
				&& zoney < jQuery.iDrag.dragged.dragCfg.currentPointer.y 
				&& (zoney + zoneh) > jQuery.iDrag.dragged.dragCfg.currentPointer.y
				? true :false;
	},
	overzone : false,
	highlighted : {},
	count : 0,
	zones : {},
	
	highlight : function (elm)
	{
		if (jQuery.iDrag.dragged == null) {
			return;
		}
		var i;
		jQuery.iDrop.highlighted = {};
		var oneIsSortable = false;
		for (i in jQuery.iDrop.zones) {
			if (jQuery.iDrop.zones[i] != null) {
				var iEL = jQuery.iDrop.zones[i].get(0);
				if (jQuery(jQuery.iDrag.dragged).is('.' + iEL.dropCfg.a)) {
					if (iEL.dropCfg.m == false) {
						iEL.dropCfg.p = jQuery.extend(
							jQuery.iUtil.getPositionLite(iEL),
							jQuery.iUtil.getSizeLite(iEL)
						);//jQuery.iUtil.getPos(iEL);
						iEL.dropCfg.m = true;
					}
					if (iEL.dropCfg.ac) {
						jQuery.iDrop.zones[i].addClass(iEL.dropCfg.ac);
					}
					jQuery.iDrop.highlighted[i] = jQuery.iDrop.zones[i];
					//if (jQuery.iSort && jQuery.iDrag.dragged.dragCfg.so) {
					if (jQuery.iSort && iEL.dropCfg.s && jQuery.iDrag.dragged.dragCfg.so) {
						iEL.dropCfg.el = jQuery('.' + iEL.dropCfg.a, iEL);
						elm.style.display = 'none';
						jQuery.iSort.measure(iEL);
						iEL.dropCfg.os = jQuery.iSort.serialize(jQuery.attr(iEL, 'id')).hash;
						elm.style.display = elm.dragCfg.oD;
						oneIsSortable = true;
					}
					if (iEL.dropCfg.onActivate) {
						iEL.dropCfg.onActivate.apply(jQuery.iDrop.zones[i].get(0), [jQuery.iDrag.dragged]);
					}
				}
			}
		}
		//if (jQuery.iSort && jQuery.iDrag.dragged.dragCfg.so) {
		if (oneIsSortable) {
			jQuery.iSort.start();
		}
	},
	/**
	 * remeasure the droppable
	 * 
	 * useful when the positions/dimensions for droppables 
	 * are changed while dragging a element
	 * 
	 * this works for sortables too but with a greate processor 
	 * penality because remeasures each sort items too
	 */
	remeasure : function()
	{
		jQuery.iDrop.highlighted = {};
		for (i in jQuery.iDrop.zones) {
			if (jQuery.iDrop.zones[i] != null) {
				var iEL = jQuery.iDrop.zones[i].get(0);
				if (jQuery(jQuery.iDrag.dragged).is('.' + iEL.dropCfg.a)) {
					iEL.dropCfg.p = jQuery.extend(
						jQuery.iUtil.getPositionLite(iEL),
						jQuery.iUtil.getSizeLite(iEL)
					);
					if (iEL.dropCfg.ac) {
						jQuery.iDrop.zones[i].addClass(iEL.dropCfg.ac);
					}
					jQuery.iDrop.highlighted[i] = jQuery.iDrop.zones[i];
					
					if (jQuery.iSort && iEL.dropCfg.s && jQuery.iDrag.dragged.dragCfg.so) {
						iEL.dropCfg.el = jQuery('.' + iEL.dropCfg.a, iEL);
						elm.style.display = 'none';
						jQuery.iSort.measure(iEL);
						elm.style.display = elm.dragCfg.oD;
					}
				}
			}
		}
	},
	
	checkhover : function (e)
	{
		if (jQuery.iDrag.dragged == null) {
			return;
		}
		jQuery.iDrop.overzone = false;
		var i;
		var applyOnHover = false;
		var hlt = 0;
		for (i in jQuery.iDrop.highlighted)
		{
			var iEL = jQuery.iDrop.highlighted[i].get(0);
			if ( 
					jQuery.iDrop.overzone == false
					 && 
					jQuery.iDrop[iEL.dropCfg.t](
					 	iEL.dropCfg.p.x, 
						iEL.dropCfg.p.y, 
						iEL.dropCfg.p.wb, 
						iEL.dropCfg.p.hb
					)
					 
			) {
				if (iEL.dropCfg.hc && iEL.dropCfg.h == false) {
					jQuery.iDrop.highlighted[i].addClass(iEL.dropCfg.hc);
				}
				//chec if onHover function has to be called
				if (iEL.dropCfg.h == false &&iEL.dropCfg.onHover) {
					applyOnHover = true;
				}
				iEL.dropCfg.h = true;
				jQuery.iDrop.overzone = iEL;
				//if(jQuery.iSort && jQuery.iDrag.dragged.dragCfg.so) {
				if(jQuery.iSort && iEL.dropCfg.s && jQuery.iDrag.dragged.dragCfg.so) {
					jQuery.iSort.helper.get(0).className = iEL.dropCfg.shc;
					jQuery.iSort.checkhover(iEL);
				}
				hlt ++;
			} else if(iEL.dropCfg.h == true) {
				//onOut function
				if (iEL.dropCfg.onOut) {
					iEL.dropCfg.onOut.apply(iEL, [e, jQuery.iDrag.helper.get(0).firstChild, iEL.dropCfg.fx]);
				}
				if (iEL.dropCfg.hc) {
					jQuery.iDrop.highlighted[i].removeClass(iEL.dropCfg.hc);
				}
				iEL.dropCfg.h = false;
			}
		}
		if (jQuery.iSort && !jQuery.iDrop.overzone && jQuery.iDrag.dragged.so) {
			jQuery.iSort.helper.get(0).style.display = 'none';
			//jQuery('body').append(jQuery.iSort.helper.get(0));
		}
		//call onhover
		if(applyOnHover) {
			jQuery.iDrop.overzone.dropCfg.onHover.apply(jQuery.iDrop.overzone, [e, jQuery.iDrag.helper.get(0).firstChild]);
		}
	},
	checkdrop : function (e)
	{
		var i;
		for (i in jQuery.iDrop.highlighted) {
			var iEL = jQuery.iDrop.highlighted[i].get(0);
			if (iEL.dropCfg.ac) {
				jQuery.iDrop.highlighted[i].removeClass(iEL.dropCfg.ac);
			}
			if (iEL.dropCfg.hc) {
				jQuery.iDrop.highlighted[i].removeClass(iEL.dropCfg.hc);
			}
			if(iEL.dropCfg.s) {
				jQuery.iSort.changed[jQuery.iSort.changed.length] = i;
			}
			if (iEL.dropCfg.onDrop && iEL.dropCfg.h == true) {
				iEL.dropCfg.h = false;
				iEL.dropCfg.onDrop.apply(iEL, [e, iEL.dropCfg.fx]);
			}
			iEL.dropCfg.m = false;
			iEL.dropCfg.h  = false;
		}
		jQuery.iDrop.highlighted = {};
	},
	destroy : function()
	{
		return this.each(
			function()
			{
				if (this.isDroppable) {
					if (this.dropCfg.s) {
						id = jQuery.attr(this,'id');
						jQuery.iSort.collected[id] = null;
						jQuery('.' + this.dropCfg.a, this).DraggableDestroy();
					}
					jQuery.iDrop.zones['d' + this.idsa] = null;
					this.isDroppable = false;
					this.f = null;
				}
			}
		);
	},
	build : function (o)
	{
		return this.each(
			function()
			{
				if (this.isDroppable == true || !o.accept || !jQuery.iUtil || !jQuery.iDrag){
					return;
				}
				this.dropCfg = {
					a : o.accept,
					ac: o.activeclass||false, 
					hc:	o.hoverclass||false,
					shc: o.helperclass||false,
					onDrop:	o.ondrop||o.onDrop||false,
					onHover: o.onHover||o.onhover||false,
					onOut: o.onOut||o.onout||false,
					onActivate: o.onActivate||false,
					t: o.tolerance && ( o.tolerance == 'fit' || o.tolerance == 'intersect') ? o.tolerance : 'pointer',
					fx: o.fx ? o.fx : false,
					m: false,
					h: false
				};
				if (o.sortable == true && jQuery.iSort) {
					id = jQuery.attr(this,'id');
					jQuery.iSort.collected[id] = this.dropCfg.a;
					this.dropCfg.s = true;
					if(o.onChange) {
						this.dropCfg.onChange = o.onChange;
						this.dropCfg.os = jQuery.iSort.serialize(id).hash;
					}
				}
				this.isDroppable = true;
				this.idsa = parseInt(Math.random() * 10000);
				jQuery.iDrop.zones['d' + this.idsa] = jQuery(this);
				jQuery.iDrop.count ++;
			}
		);
	}
};

/**
 * Destroy an existing droppable on a collection of elements
 * 
 * @name DroppableDestroy
 * @descr Destroy a droppable
 * @type jQuery
 * @cat Plugins/Interface
 * @example $('#drag2').DroppableDestroy();
 */

jQuery.fn.extend(
	{
		DroppableDestroy : jQuery.iDrop.destroy,
		Droppable : jQuery.iDrop.build
	}
);

 
/**
 * Recalculate all Droppables
 *
 * @name $.recallDroppables
 * @type jQuery
 * @cat Plugins/Interface
 * @example $.recallDroppable();
 */

jQuery.recallDroppables = jQuery.iDrop.remeasure;/**
 * Interface Elements for jQuery
 * FX - scroll to
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *   
 *
 */
/**
 * Applies a scrolling effect to document until the element gets into viewport
 */
jQuery.fn.extend (
	{
		/**
		 * @name ScrollTo
		 * @description scrolls the document until the lement gets into viewport
		 * @param Mixed speed animation speed, integer for miliseconds, string ['slow' | 'normal' | 'fast']
		 * @param String axis (optional) whatever to scroll on vertical, horizontal or both axis ['vertical'|'horizontal'|null]
		 * @param String easing (optional) The name of the easing effect that you want to use.
		 * @type jQuery
		 * @cat Plugins/Interface
		 * @author Stefan Petre
		 */
		ScrollTo : function(speed, axis, easing) {
			o = jQuery.speed(speed);
			return this.queue('interfaceFX',function(){
				new jQuery.fx.ScrollTo(this, o, axis, easing);
			});
		},
		/**
		 * @name ScrollToAnchors
		 * @description all links to '#elementId' will animate scroll
		 * @param Mixed speed animation speed, integer for miliseconds, string ['slow' | 'normal' | 'fast']
		 * @param String axis (optional) whatever to scroll on vertical, horizontal or both axis ['vertical'|'horizontal'|null]
		 * @param String easing (optional) The name of the easing effect that you want to use.
		 * @type jQuery
		 * @cat Plugins/Interface
		 * @author Stefan Petre
		 */
		/*inspired by David Maciejewski www.macx.de*/
		ScrollToAnchors : function(speed, axis, easing) {
			return this.each(
				function()
				{
					jQuery('a[@href*="#"]', this).click(
						function(e)
						{
							parts = this.href.split('#');
							jQuery('#' + parts[1]).ScrollTo(speed, axis, easing);
							return false;
						}
					);
				}
			)
		}
	}
);

jQuery.fx.ScrollTo = function (e, o, axis, easing)
{
	var z = this;
	z.o = o;
	z.e = e;
	z.axis = /vertical|horizontal/.test(axis) ? axis : false;
	z.easing = easing;
	p = jQuery.iUtil.getPosition(e);
	s = jQuery.iUtil.getScroll();
	z.clear = function(){clearInterval(z.timer);z.timer=null;jQuery.dequeue(z.e, 'interfaceFX');};
	z.t=(new Date).getTime();
	s.h = s.h > s.ih ? (s.h - s.ih) : s.h;
	s.w = s.w > s.iw ? (s.w - s.iw) : s.w;
	z.endTop = p.y > s.h ? s.h : p.y;
	z.endLeft = p.x > s.w ? s.w : p.x;
	z.startTop = s.t;
	z.startLeft = s.l;
	z.step = function(){
		var t = (new Date).getTime();
		var n = t - z.t;
		var p = n / z.o.duration;
		if (t >= z.o.duration+z.t) {
			z.clear();
			setTimeout(function(){z.scroll(z.endTop, z.endLeft)},13);
		} else {
			if (!z.axis || z.axis == 'vertical') {
				if (!jQuery.easing || !jQuery.easing[z.easing]) {
					st = ((-Math.cos(p*Math.PI)/2) + 0.5) * (z.endTop-z.startTop) + z.startTop;
				} else {
					st = jQuery.easing[z.easing](p, n, z.startTop, (z.endTop - z.startTop), z.o.duration);
				}
			} else {
				st = z.startTop;
			}
			if (!z.axis || z.axis == 'horizontal') {
				if (!jQuery.easing || !jQuery.easing[z.easing]) {
					sl = ((-Math.cos(p*Math.PI)/2) + 0.5) * (z.endLeft-z.startLeft) + z.startLeft;
				} else {
					sl = jQuery.easing[z.easing](p, n, z.startLeft, (z.endLeft - z.startLeft), z.o.duration);
				}
			} else {
				sl = z.startLeft;
			}
			z.scroll(st, sl);
		}
	};
	z.scroll = function (t, l){window.scrollTo(l, t);};
	z.timer=setInterval(function(){z.step();},13);
};/**
 * Interface Elements for jQuery
 * Sortables
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *   
 *
 */

/**
 * Allows you to resort elements within a container by dragging and dropping. Requires
 * the Draggables and Droppables plugins. The container and each item inside the container
 * must have an ID. Sortables are especially useful for lists.
 * 
 * @see Plugins/Interface/Draggable
 * @see Plugins/Interface/Droppable
 * @author Stefan Petre
 * @name Sortable
 * @cat Plugins/Interface
 * @param Hash options        A hash of options
 * @option String accept      The class name for items inside the container (mandatory)
 * @option String activeclass The class for the container when one of its items has started to move
 * @option String hoverclass  The class for the container when an acceptable item is inside it
 * @option String helperclass The helper is used to point to the place where the item will be 
 *                            moved. This is the class for the helper.
 * @option Float opacity      Opacity (between 0 and 1) of the item while being dragged
 * @option Boolean ghosting   When true, the sortable is ghosted when dragged
 * @option String tolerance   Either 'pointer', 'intersect', or 'fit'. See Droppable for more details
 * @option Boolean fit        When true, sortable must be inside the container in order to drop
 * @option Integer fx         Duration for the effect applied to the sortable
 * @option Function onchange  Callback that gets called when the sortable list changed. It takes
 *                            an array of serialized elements
 * @option Boolean floats     True if the sorted elements are floated
 * @option String containment Use 'parent' to constrain the drag to the container
 * @option String axis        Use 'horizontally' or 'vertically' to constrain dragging to an axis
 * @option String handle      The jQuery selector that indicates the draggable handle
 * @option DOMElement handle  The node that indicates the draggable handle
 * @option Function onHover   Callback that is called when an acceptable item is dragged over the
 *                            container. Gets the hovering DOMElement as a parameter
 * @option Function onOut     Callback that is called when an acceptable item leaves the container.
 *                            Gets the leaving DOMElement as a parameter
 * @option Object cursorAt    The mouse cursor will be moved to the offset on the dragged item
 *                            indicated by the object, which takes "top", "bottom", "left", and
 *                            "right" keys
 * @option Function onStart   Callback function triggered when the dragging starts
 * @option Function onStop    Callback function triggered when the dragging stops
 * @example                   $('ul').Sortable(
 *                            	{
 *                            		accept : 'sortableitem',
 *                            		activeclass : 'sortableactive',
 *                             		hoverclass : 'sortablehover',
 *                             		helperclass : 'sorthelper',
 *                             		opacity: 	0.5,
 *                             		fit :	false
 *                             	}
 *                             )
 */

jQuery.iSort = {
	changed : [],
	collected : {},
	helper : false,
	inFrontOf: null,
	
	start : function ()
	{
		if (jQuery.iDrag.dragged == null) {
			return;
		}
		var shs, margins,c, cs;
		
		jQuery.iSort.helper.get(0).className = jQuery.iDrag.dragged.dragCfg.hpc;
		shs = jQuery.iSort.helper.get(0).style;
		shs.display = 'block';
		jQuery.iSort.helper.oC = jQuery.extend(
			jQuery.iUtil.getPosition(jQuery.iSort.helper.get(0)),
			jQuery.iUtil.getSize(jQuery.iSort.helper.get(0))
		);
		
		shs.width = jQuery.iDrag.dragged.dragCfg.oC.wb + 'px';
		shs.height = jQuery.iDrag.dragged.dragCfg.oC.hb + 'px';
		//shs.cssFloat = jQuery.iDrag.dragged.dragCfg.oF;
		margins = jQuery.iUtil.getMargins(jQuery.iDrag.dragged);
		shs.marginTop = margins.t;
		shs.marginRight = margins.r;
		shs.marginBottom = margins.b;
		shs.marginLeft = margins.l;
		if (jQuery.iDrag.dragged.dragCfg.ghosting == true) {
			c = jQuery.iDrag.dragged.cloneNode(true);
			cs = c.style;
			cs.marginTop = '0px';
			cs.marginRight = '0px';
			cs.marginBottom = '0px';
			cs.marginLeft = '0px';
			cs.display = 'block';
			jQuery.iSort.helper.empty().append(c);
		}
		jQuery(jQuery.iDrag.dragged).after(jQuery.iSort.helper.get(0));
		jQuery.iDrag.dragged.style.display = 'none';
	},
	
	check : function (e)
	{
		if (!e.dragCfg.so && jQuery.iDrop.overzone.sortable) {
			if (e.dragCfg.onStop)
				e.dragCfg.onStop.apply(dragged);
			jQuery(e).css('position', e.dragCfg.initialPosition || e.dragCfg.oP);
			jQuery(e).DraggableDestroy();
			jQuery(jQuery.iDrop.overzone).SortableAddItem(e);
		}
		jQuery.iSort.helper.removeClass(e.dragCfg.hpc).html('&nbsp;');
		jQuery.iSort.inFrontOf = null;
		var shs = jQuery.iSort.helper.get(0).style;
		shs.display = 'none';
		jQuery.iSort.helper.after(e);
		if (e.dragCfg.fx > 0) {
			jQuery(e).fadeIn(e.dragCfg.fx);
		}
		jQuery('body').append(jQuery.iSort.helper.get(0));
		var ts = [];
		var fnc = false;
		for(var i=0; i<jQuery.iSort.changed.length; i++){
			var iEL = jQuery.iDrop.zones[jQuery.iSort.changed[i]].get(0);
			var id = jQuery.attr(iEL, 'id');
			var ser = jQuery.iSort.serialize(id);
			if (iEL.dropCfg.os != ser.hash) {
				iEL.dropCfg.os = ser.hash;
				if (fnc == false && iEL.dropCfg.onChange) {
					fnc = iEL.dropCfg.onChange;
				}
				ser.id = id;
				ts[ts.length] = ser;
			}
		}
		jQuery.iSort.changed = [];
		if (fnc != false && ts.length > 0) {
			fnc(ts);
		}
	},
	
	checkhover : function(e,o)
	{
		if (!jQuery.iDrag.dragged)
			return;
		var cur = false;
		var i = 0;
		if ( e.dropCfg.el.size() > 0) {
			for (i = e.dropCfg.el.size(); i >0; i--) {
				if (e.dropCfg.el.get(i-1) != jQuery.iDrag.dragged) {
					if (!e.sortCfg.floats) {
						if ( 
						(e.dropCfg.el.get(i-1).pos.y + e.dropCfg.el.get(i-1).pos.hb/2) > jQuery.iDrag.dragged.dragCfg.ny  
						) {
							cur = e.dropCfg.el.get(i-1);
						} else {
							break;
						}
					} else {
						if (
						(e.dropCfg.el.get(i-1).pos.x + e.dropCfg.el.get(i-1).pos.wb/2) > jQuery.iDrag.dragged.dragCfg.nx && 
						(e.dropCfg.el.get(i-1).pos.y + e.dropCfg.el.get(i-1).pos.hb/2) > jQuery.iDrag.dragged.dragCfg.ny  
						) {
							cur = e.dropCfg.el.get(i-1);
						}
					}
				}
			}
		}
		//helpos = jQuery.iUtil.getPos(jQuery.iSort.helper.get(0));
		if (cur && jQuery.iSort.inFrontOf != cur) {
			jQuery.iSort.inFrontOf = cur;
			jQuery(cur).before(jQuery.iSort.helper.get(0));
		} else if(!cur && (jQuery.iSort.inFrontOf != null || jQuery.iSort.helper.get(0).parentNode != e) ) {
			jQuery.iSort.inFrontOf = null;
			jQuery(e).append(jQuery.iSort.helper.get(0));
		}
		jQuery.iSort.helper.get(0).style.display = 'block';
	},
	
	measure : function (e)
	{
		if (jQuery.iDrag.dragged == null) {
			return;
		}
		e.dropCfg.el.each (
			function ()
			{
				this.pos = jQuery.extend(
					jQuery.iUtil.getSizeLite(this),
					jQuery.iUtil.getPositionLite(this)
				);
			}
		);
	},
	
	serialize : function(s)
	{
		var i;
		var h = '';
		var o = {};
		if (s) {
			if (jQuery.iSort.collected[s] ) {
				o[s] = [];
				jQuery('#' + s + ' .' + jQuery.iSort.collected[s]).each(
					function ()
					{
						if (h.length > 0) {
							h += '&';
						}
						h += s + '[]=' + jQuery.attr(this,'id');
						o[s][o[s].length] = jQuery.attr(this,'id');
					}
				);
			} else {
				for ( a in s) {
					if (jQuery.iSort.collected[s[a]] ) {
						o[s[a]] = [];			
						jQuery('#' + s[a] + ' .' + jQuery.iSort.collected[s[a]]).each(
							function ()
							{
								if (h.length > 0) {
									h += '&';
								}
								h += s[a] + '[]=' + jQuery.attr(this,'id');
								o[s[a]][o[s[a]].length] = jQuery.attr(this,'id');
							}
						);
					}
				}
			}
		} else {
			for ( i in jQuery.iSort.collected){
				o[i] = [];
				jQuery('#' + i + ' .' + jQuery.iSort.collected[i]).each(
					function ()
					{
						if (h.length > 0) {
							h += '&';
						}
						h += i + '[]=' + jQuery.attr(this,'id');
						o[i][o[i].length] = jQuery.attr(this,'id');
					}
				);
			}
		}
		return {hash:h, o:o};
	},
	
	addItem : function (e)
	{
		if ( !e.childNodes ) {
			return;
		}
		return this.each(
			function ()
			{
				if(!this.sortCfg || !jQuery(e).is('.' +  this.sortCfg.accept))
					jQuery(e).addClass(this.sortCfg.accept);
				jQuery(e).Draggable(this.sortCfg.dragCfg);
			}
		);
	},
	
	destroy: function()
	{
		return this.each(
			function()
			{
				jQuery('.' + this.sortCfg.accept).DraggableDestroy();
				jQuery(this).DroppableDestroy();
				this.sortCfg = null;
				this.isSortable = null;
			}
		);
	},
	
	build : function (o)
	{
		if (o.accept && jQuery.iUtil && jQuery.iDrag && jQuery.iDrop) {
			if (!jQuery.iSort.helper) {
				jQuery('body',document).append('<div id="sortHelper">&nbsp;</div>');
				jQuery.iSort.helper = jQuery('#sortHelper');
				jQuery.iSort.helper.get(0).style.display = 'none';
			}
			this.Droppable(
				{
					accept :  o.accept,
					activeclass : o.activeclass ? o.activeclass : false,
					hoverclass : o.hoverclass ? o.hoverclass : false,
					helperclass : o.helperclass ? o.helperclass : false,
					/*onDrop: function (drag, fx) 
							{
								jQuery.iSort.helper.after(drag);
								if (fx > 0) {
									jQuery(drag).fadeIn(fx);
								}
							},*/
					onHover: o.onHover||o.onhover,
					onOut: o.onOut||o.onout,
					sortable : true,
					onChange : 	o.onChange||o.onchange,
					fx : o.fx ? o.fx : false,
					ghosting : o.ghosting ? true : false,
					tolerance: o.tolerance ? o.tolerance : 'intersect'
				}
			);
			
			return this.each(
				function()
				{
					var dragCfg = {
						revert : o.revert? true : false,
						zindex : 3000,
						opacity : o.opacity ? parseFloat(o.opacity) : false,
						hpc : o.helperclass ? o.helperclass : false,
						fx : o.fx ? o.fx : false,
						so : true,
						ghosting : o.ghosting ? true : false,
						handle: o.handle ? o.handle : null,
						containment: o.containment ? o.containment : null,
						onStart : o.onStart && o.onStart.constructor == Function ? o.onStart : false,
						onDrag : o.onDrag && o.onDrag.constructor == Function ? o.onDrag : false,
						onStop : o.onStop && o.onStop.constructor == Function ? o.onStop : false,
						axis : /vertically|horizontally/.test(o.axis) ? o.axis : false,
						snapDistance : o.snapDistance ? parseInt(o.snapDistance)||0 : false,
						cursorAt: o.cursorAt ? o.cursorAt : false
					};
					jQuery('.' + o.accept, this).Draggable(dragCfg);
					this.isSortable = true;
					this.sortCfg = {
						accept :  o.accept,
						revert : o.revert? true : false,
						zindex : 3000,
						opacity : o.opacity ? parseFloat(o.opacity) : false,
						hpc : o.helperclass ? o.helperclass : false,
						fx : o.fx ? o.fx : false,
						so : true,
						ghosting : o.ghosting ? true : false,
						handle: o.handle ? o.handle : null,
						containment: o.containment ? o.containment : null,
						floats: o.floats ? true : false,
						dragCfg : dragCfg
					}
				}
			);
		}
	}
};

jQuery.fn.extend(
	{
		Sortable : jQuery.iSort.build,
		/**
		 * A new item can be added to a sortable by adding it to the DOM and then adding it via
		 * SortableAddItem. 
		 *
		 * @name SortableAddItem
		 * @param DOMElement elem A DOM Element to add to the sortable list
		 * @example $('#sortable1').append('<li id="newitem">new item</li>')
		 *                         .SortableAddItem($("#new_item")[0])
		 * @type jQuery
		 * @cat Plugins/Interface
		 */
		SortableAddItem : jQuery.iSort.addItem,
		/**
		 * Destroy a sortable
		 *
		 * @name SortableDestroy
		 * @example $('#sortable1').SortableDestroy();
		 * @type jQuery
		 * @cat Plugins/Interface
		 */
		SortableDestroy: jQuery.iSort.destroy
	}
);

/**
 * This function returns the hash and an object (can be used as arguments for $.post) for every 
 * sortable in the page or specific sortables. The hash is based on the 'id' attributes of 
 * container and items.
 *
 * @params String sortable The id of the sortable to serialize
 * @name $.SortSerialize
 * @type String
 * @cat Plugins/Interface
 */

jQuery.SortSerialize = jQuery.iSort.serialize;/**
 * Interface Elements for jQuery
 * utility function
 *
 * http://interface.eyecon.ro
 *
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 *
 */

jQuery.iUtil = {
	getPosition : function(e)
	{
		var x = 0;
		var y = 0;
		var es = e.style;
		var restoreStyles = false;
		if (jQuery(e).css('display') == 'none') {
			var oldVisibility = es.visibility;
			var oldPosition = es.position;
			restoreStyles = true;
			es.visibility = 'hidden';
			es.display = 'block';
			es.position = 'absolute';
		}
		var el = e;
		while (el){
			x += el.offsetLeft + (el.currentStyle && !jQuery.browser.opera ?parseInt(el.currentStyle.borderLeftWidth)||0:0);
			y += el.offsetTop + (el.currentStyle && !jQuery.browser.opera ?parseInt(el.currentStyle.borderTopWidth)||0:0);
			el = el.offsetParent;
		}
		el = e;
		while (el && el.tagName  && el.tagName.toLowerCase() != 'body')
		{
			x -= el.scrollLeft||0;
			y -= el.scrollTop||0;
			el = el.parentNode;
		}
		if (restoreStyles == true) {
			es.display = 'none';
			es.position = oldPosition;
			es.visibility = oldVisibility;
		}
		return {x:x, y:y};
	},
	getPositionLite : function(el)
	{
		var x = 0, y = 0;
		while(el) {
			x += el.offsetLeft || 0;
			y += el.offsetTop || 0;
			el = el.offsetParent;
		}
		return {x:x, y:y};
	},
	getSize : function(e)
	{
		var w = jQuery.css(e,'width');
		var h = jQuery.css(e,'height');
		var wb = 0;
		var hb = 0;
		var es = e.style;
		if (jQuery(e).css('display') != 'none') {
			wb = e.offsetWidth;
			hb = e.offsetHeight;
		} else {
			var oldVisibility = es.visibility;
			var oldPosition = es.position;
			es.visibility = 'hidden';
			es.display = 'block';
			es.position = 'absolute';
			wb = e.offsetWidth;
			hb = e.offsetHeight;
			es.display = 'none';
			es.position = oldPosition;
			es.visibility = oldVisibility;
		}
		return {w:w, h:h, wb:wb, hb:hb};
	},
	getSizeLite : function(el)
	{
		return {
			wb:el.offsetWidth||0,
			hb:el.offsetHeight||0
		};
	},
	getClient : function(e)
	{
		var h, w, de;
		if (e) {
			w = e.clientWidth;
			h = e.clientHeight;
		} else {
			de = document.documentElement;
			w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
			h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
		}
		return {w:w,h:h};
	},
	getScroll : function (e)
	{
		var t=0, l=0, w=0, h=0, iw=0, ih=0;
		if (e && e.nodeName.toLowerCase() != 'body') {
			t = e.scrollTop;
			l = e.scrollLeft;
			w = e.scrollWidth;
			h = e.scrollHeight;
			iw = 0;
			ih = 0;
		} else  {
			if (document.documentElement) {
				t = document.documentElement.scrollTop;
				l = document.documentElement.scrollLeft;
				w = document.documentElement.scrollWidth;
				h = document.documentElement.scrollHeight;
			} else if (document.body) {
				t = document.body.scrollTop;
				l = document.body.scrollLeft;
				w = document.body.scrollWidth;
				h = document.body.scrollHeight;
			}
			iw = self.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0;
			ih = self.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0;
		}
		return { t: t, l: l, w: w, h: h, iw: iw, ih: ih };
	},
	getMargins : function(e, toInteger)
	{
		var el = jQuery(e);
		var t = el.css('marginTop') || '';
		var r = el.css('marginRight') || '';
		var b = el.css('marginBottom') || '';
		var l = el.css('marginLeft') || '';
		if (toInteger)
			return {
				t: parseInt(t)||0,
				r: parseInt(r)||0,
				b: parseInt(b)||0,
				l: parseInt(l)
			};
		else
			return {t: t, r: r,	b: b, l: l};
	},
	getPadding : function(e, toInteger)
	{
		var el = jQuery(e);
		var t = el.css('paddingTop') || '';
		var r = el.css('paddingRight') || '';
		var b = el.css('paddingBottom') || '';
		var l = el.css('paddingLeft') || '';
		if (toInteger)
			return {
				t: parseInt(t)||0,
				r: parseInt(r)||0,
				b: parseInt(b)||0,
				l: parseInt(l)
			};
		else
			return {t: t, r: r,	b: b, l: l};
	},
	getBorder : function(e, toInteger)
	{
		var el = jQuery(e);
		var t = el.css('borderTopWidth') || '';
		var r = el.css('borderRightWidth') || '';
		var b = el.css('borderBottomWidth') || '';
		var l = el.css('borderLeftWidth') || '';
		if (toInteger)
			return {
				t: parseInt(t)||0,
				r: parseInt(r)||0,
				b: parseInt(b)||0,
				l: parseInt(l)||0
			};
		else
			return {t: t, r: r,	b: b, l: l};
	},
	getPointer : function(event)
	{
		var x = event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)) || 0;
		var y = event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop)) || 0;
		return {x:x, y:y};
	},
	traverseDOM : function(nodeEl, func)
	{
		func(nodeEl);
		nodeEl = nodeEl.firstChild;
		while(nodeEl){
			jQuery.iUtil.traverseDOM(nodeEl, func);
			nodeEl = nodeEl.nextSibling;
		}
	},
	purgeEvents : function(nodeEl)
	{
		jQuery.iUtil.traverseDOM(
			nodeEl,
			function(el)
			{
				for(var attr in el){
					if(typeof el[attr] === 'function') {
						el[attr] = null;
					}
				}
			}
		);
	},
	centerEl : function(el, axis)
	{
		var clientScroll = jQuery.iUtil.getScroll();
		var windowSize = jQuery.iUtil.getSize(el);
		if (!axis || axis == 'vertically')
			jQuery(el).css(
				{
					top: clientScroll.t + ((Math.max(clientScroll.h,clientScroll.ih) - clientScroll.t - windowSize.hb)/2) + 'px'
				}
			);
		if (!axis || axis == 'horizontally')
			jQuery(el).css(
				{
					left:	clientScroll.l + ((Math.max(clientScroll.w,clientScroll.iw) - clientScroll.l - windowSize.wb)/2) + 'px'
				}
			);
	},
	fixPNG : function (el, emptyGIF) {
		var images = jQuery('img[@src*="png"]', el||document), png;
		images.each( function() {
			png = this.src;				
			this.src = emptyGIF;
			this.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + png + "')";
		});
	}
};

// Helper function to support older browsers!
[].indexOf || (Array.prototype.indexOf = function(v, n){
	n = (n == null) ? 0 : n;
	var m = this.length;
	for (var i=n; i<m; i++)
		if (this[i] == v)
			return i;
	return -1;
});
/* 
	jQuery TextAreaResizer plugin
	Created on 17th January 2008 by Ryan O'Dell 
	Version 1.0.4
	
	Converted from Drupal -> textarea.js
	Found source: http://plugins.jquery.com/misc/textarea.js
	$Id: textarea.js,v 1.11.2.1 2007/04/18 02:41:19 drumm Exp $

	1.0.1 Updates to missing global 'var', added extra global variables, fixed multiple instances, improved iFrame support
	1.0.2 Updates according to textarea.focus
	1.0.3 Further updates including removing the textarea.focus and moving private variables to top
	1.0.4 Re-instated the blur/focus events, according to information supplied by dec

	
*/
(function($) {
	/* private variable "oHover" used to determine if you're still hovering over the same element */
	var textarea, staticOffset;  // added the var declaration for 'staticOffset' thanks to issue logged by dec.
	var iLastMousePos = 0;
	var iMin = 32;
	var grip;
	/* TextAreaResizer plugin */
	$.fn.TextAreaResizer = function() {
		return this.each(function() {
		    textarea = $(this).addClass('processed'), staticOffset = null;

			// 18-01-08 jQuery bind to pass data element rather than direct mousedown - Ryan O'Dell
		    // When wrapping the text area, work around an IE margin bug.  See:
		    // http://jaspan.com/ie-inherited-margin-bug-form-elements-and-haslayout
		    $(this).wrap('<div class="resizable-textarea"><span></span></div>')
		      .parent().append($('<div class="grippie"></div>').bind("mousedown",{el: this} , startDrag));

		    var grippie = $('div.grippie', $(this).parent())[0];
		    grippie.style.marginRight = (grippie.offsetWidth - $(this)[0].offsetWidth) +'px';

		});
	};
	/* private functions */
	function startDrag(e) {
		textarea = $(e.data.el);
		textarea.blur();
		iLastMousePos = mousePosition(e).y;
		staticOffset = textarea.height() - iLastMousePos;
		textarea.css('opacity', 0.25);
		$(document).mousemove(performDrag).mouseup(endDrag);
		return false;
	}

	function performDrag(e) {
		var iThisMousePos = mousePosition(e).y;
		var iMousePos = staticOffset + iThisMousePos;
		if (iLastMousePos >= (iThisMousePos)) {
			iMousePos -= 5;
		}
		iLastMousePos = iThisMousePos;
		iMousePos = Math.max(iMin, iMousePos);
		textarea.height(iMousePos + 'px');
		if (iMousePos < iMin) {
			endDrag(e);
		}
		return false;
	}

	function endDrag(e) {
		$(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
		textarea.css('opacity', 1);
		textarea.focus();
		textarea = null;
		staticOffset = null;
		iLastMousePos = 0;
	}

	function mousePosition(e) {
		return { x: e.clientX + document.documentElement.scrollLeft, y: e.clientY + document.documentElement.scrollTop };
	};
})(jQuery);


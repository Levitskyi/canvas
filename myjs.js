$(function() {
"use strict";
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var bcanvas = document.getElementById('Canvas');
var backCanvas = bcanvas.getContext("2d");
var lastX, lastY;
var canMouseX;
var canMouseY;
var isMouseDown = false;
var modeName = "paint";
var history_draw = new Array();
var incr = 0;
	function handleMouseDown(e) {
		//canMouseX = parseInt(e.pageX - $("#myCanvas").offset().left);
		//canMouseY = parseInt(e.pageY - $("#myCanvas").offset().top);
		/*console.log(e.clientY);
		console.log(e.pageY);*/
		
		// Put your mousedown stuff here
		lastX = canMouseX;
		lastY = canMouseY;
		isMouseDown = true;
	}
	function handleMouseUp(e) {
		//canMouseX = parseInt(e.pageX - $("#myCanvas").offset().left);
		//canMouseY = parseInt(e.pageY - $("#myCanvas").offset().top);
		//draw image on backCanvas and after in main canvas
		backCanvas.drawImage(canvas,0,0);
		ctx.drawImage(bcanvas, 0,0);
		//to history canvas		
		history_draw[incr] = document.getElementById('myCanvas').toDataURL();		
		incr++;
		// Put your mouseup stuff here		
		isMouseDown = false;
	}
	function handleMouseOut(e) {
		//canMouseX = parseInt(e.pageX - $("#myCanvas").offset().left);
		//canMouseY = parseInt(e.pageY - $("#myCanvas").offset().top);

		// Put your mouseOut stuff here
		if(isMouseDown) {
			isMouseDown = true;			
		}else {
			isMouseDown = false;			
		}		
		
	}
	function handleMouseMove(e) {
		canMouseX = parseInt(e.pageX - $("#myCanvas").offset().left);
		canMouseY = parseInt(e.pageY - $("#myCanvas").offset().top);		
		
	}	
	$("#myCanvas").mousedown(function (e) {
		handleMouseDown(e);
		ctx.strokeStyle = $('#colorpick').val();
		ctx.lineWidth = $('#with_line').val();
	});
	$("#myCanvas").mousemove(function (e) {
		handleMouseMove(e);		
		if(isMouseDown){
			switch (modeName) {
		case "paint":
            drawPaint(canMouseX,canMouseY);
            break;
        case "rectangle":
            drawRectangle(canMouseX, canMouseY);
            break;        
		case "circle":
            drawCircle(canMouseX,canMouseY);
            break;
		case "square":
            drawSquare(canMouseX, canMouseY);
            break;
		case "line":
			drawLine(canMouseX, canMouseY);
		break;
        default:
            break;
			}
		}
		    
	});
	$("#myCanvas").mouseup(function (e) {
		handleMouseUp(e);				
	});
	$("#myCanvas").mouseout(function (e) {
		handleMouseOut(e);			
	});
	$('html').mouseup(function(){
		isMouseDown = false;
		backCanvas.drawImage(canvas,0,0);
		ctx.drawImage(bcanvas, 0,0);		
	});	
	
	
	function drawPaint(x,y){
			ctx.beginPath();
			ctx.lineJoin = "round";
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(canMouseX, canMouseY);
			ctx.closePath();
			ctx.stroke();
			lastX = x; lastY = y;
			ctx.lineJoin = 'miter';
	}
	function drawCircle(canMouseX,canMouseY) {
			var dx = Math.abs(lastX - canMouseX);
			var dy = Math.abs(lastY - canMouseY);
			var midX = (lastX + canMouseX) / 2;
			var midY = (lastY + canMouseY) / 2;
			var r = Math.sqrt(dx * dx + dy * dy) / 2;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();			
			ctx.arc(midX, midY, r, 0, 2 * Math.PI, true);
			ctx.stroke();
    }	
	function drawRectangle(canMouseX, canMouseY) {
			var width = canMouseX - lastX;
			var height = canMouseY - lastY;
			ctx.clearRect(0, 0, canvas.width, canvas.height);		
			ctx.beginPath();			
			ctx.rect(lastX, lastY, width, height);    
			ctx.stroke();
	}
	function drawSquare(canMouseX, canMouseY) {
			var width = Math.abs(canMouseX - lastX) * (canMouseX < lastX ? -1 : 1);
			var height = Math.abs(width) * (canMouseY < lastY ? -1 : 1);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();			
			ctx.rect(lastX, lastY, width, height);
			ctx.stroke();
	}
	function drawLine(canMouseX, canMouseY) {		
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();					
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(canMouseX, canMouseY);			
			ctx.stroke();	
	}
	function clearArea() {
		// Use the identity matrix while clearing the canvas
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		backCanvas.setTransform(1, 0, 0, 1, 0, 0);
		backCanvas.clearRect(0, 0, backCanvas.canvas.width, backCanvas.canvas.height);
	}
	function canvasToImage(){
		/*var img = new Image();
		var can = document.getElementById('myCanvas');   
		img.src = can.toDataURL();
		var toimage = document.getElementById('for_img');    
		toimage.appendChild(img);*/	
		document.getElementById('canvasImg').src = document.getElementById('myCanvas').toDataURL();
	}
	(function downloadImg() {	
		$('#downloadImage').click(function(){						
			$(this).attr({
				'download':'myImage',
				'href':document.getElementById('myCanvas').toDataURL()
			});	
		});	
	})();
	$('#clearArea').click(clearArea);
	$('#canvasToImg').click(canvasToImage);
	$('#drawLine').click(function(){
		modeName = "line";		
	});
	$('#drawPaint').click(function(){
		modeName = "paint";
	});
	$('#drawCircle').click(function(){
		modeName = "circle";
	});
	$('#drawRect').click(function(){
		modeName = "rectangle";
	});
	$('#drawSquare').click(function(){
		modeName = "square";
	});

	/* manipilations with buttons*/
		$('#drawNavigation span#drawPaint').addClass('active');
		$('#drawNavigation span').click(function(){
			$('#drawNavigation span').removeClass('active');
			$(this).addClass('active');
		});
	/*image weight*/
	$('#downloadImage').mouseenter(function(){		
		var contentType = 'image/png';
		var b64Data = (document.getElementById('myCanvas').toDataURL()).split(',')[1];
		var blob = b64toBlob(b64Data, contentType);
		//var blobUrl = URL.createObjectURL(blob);						
		$('.bottom').text(''+formatSize(blob.size)+' .png');		
	});
	function formatSize(length){
	var i = 0, type = ['б','Кб','Мб','Гб','Тб','Пб'];
	while((length / 1000 | 0) && i < type.length - 1) {
		length /= 1000;
		i++;
	}
	return length.toFixed(2) + ' ' + type[i];
	}
	function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
	}
	/*width line picker*/
	$('#with_line').mousemove(function(){
		var line_width = $('#with_line').val();		
		$('span.range_width').text(''+line_width+'');		
	});
	function toBackImage() {
		if(incr >= 2){
		clearArea();
		var len_history_draw = history_draw.length;		
		document.getElementById('hiddenImg').src = history_draw[len_history_draw-2];
		backCanvas.drawImage(document.getElementById('hiddenImg'), 0,0);
		ctx.drawImage(document.getElementById('hiddenImg'), 0,0);		
		history_draw.pop();
		incr = len_history_draw-1;
		}else{
		clearArea();
		history_draw.pop();
			if(len_history_draw === undefined){
				incr = 0;
			}			
		}				
	}
	/*  some changes with history on array	*/
	$('#toBackImage').click(function(){
		toBackImage();		
	});
	
});//end
// File	  :	udf.js
// Author :	Alexander Ustyuzhanin
// HAW Hamburg, CJ1, SS2017
// User-defined functions for Web Convolution project
 
var userDefinedExpression;
var udfTimes = [];
var udfOriginalValues = []; // stores complete function for modfication
var udfValues = [];
var udfConvoResult = []; // array similar to signalArray3
var udfCorrResult = []; // array similar to signalArray3
var leftLimiter;
var rightLimiter;
var isUdfDisabled = true;
var udfNeedsParsing = true; // TODO - implement detection of text field change

function onPageLoadUdf() {
	// toggleUDF();
	opdlUDF.disabled = true;
}

function toggleUDF() {
	isUdfDisabled = !isUdfDisabled; // toggle
	opdlUDF.disabled = isUdfDisabled;
	if (!isUdfDisabled) { 
		if (udfNeedsParsing) parseMathExpr();
		document.getElementById("functionList1").value = "7";
		plot1(brd);
		
	}
	
	return false;
}

function parseMathExpr() {
	userDefinedExpression = document.getElementById("txtUserExpression").value; // get UDF from the text field
	// var eval_x = document.getElementById("txtEvalPoint").value; // get evaluation point (for testing)
	// leftLimiter = parseFloat( document.getElementById("txtLeftLimiter").value );
	// rightLimiter = parseFloat( document.getElementById("txtRightLimiter").value ); 
	updateUdfLimits();
	var udfDivId = "divUDF"; // HTML element for displaying the pretty function
	var texDisplayFieldId = "divTexExpr"; // HTML element for displaying the pretty function
	
	var node = math.parse(userDefinedExpression); // build expression tree - http://mathjs.org/docs/expressions/expression_trees.html
	var code = node.compile(); // compile to JS code 
	var texExpr = node.toTex(); // compile to LaTeX for printing
	// var scope = { x : eval_x };
	// var result = code.eval(scope); 
	// updateUDTexExpression(texExpr);
	// document.getElementById("txtEvalRes").value = result;
	// displayTex(udfDivId, texDisplayFieldId, texExpr);
	
	var input = [ 0, 1 ];
	var output = evaluateCurrentUserDefinedFunction(input);
	udfOriginalValues = evaluateCurrentUserDefinedFunction(samplePoints);
	udfValues = udfOriginalValues.slice();
	// plotUDF(brd); // call for (re)drawing
	
	return false; // prevent page reload
}

// function displayTex(udf_id, disp_id, tex) {
	// var udf_div = document.getElementById(udf_id);
	// var disp_div = udf_div.getElementsByClassName(disp_id)[0]; // TODO: works by class but not by id
	
	// disp_div.innerHTML = "$" + tex + "$"; // inline display
	// disp_div.innerHTML = "$$" + tex + "$$"; // formula display
// }


function updateUDTexExpression(TeX) {
    var QUEUE = MathJax.Hub.queue;  // shorthand for the queue
    var math = null;                // the element jax for the math output.
    //  Get the element jax when MathJax has produced it
	QUEUE.Push(function () {
		math = MathJax.Hub.getAllJax("divTexExpr")[0];
    });
	QUEUE.Push(["Text",math,"\\displaystyle{"+TeX+"}"]);
}

function evaluateCurrentUserDefinedFunction(values) { // this assumes user input format like x^2 + 5*x
	len = values.length;
	var ret = new Array(2); // eval returns a vector of all inputs concatenated with output
	var output = new Array(len);
	
	for(i = 0; i < len; ++i) {
		ret = math.eval(['x = ' + values[i], userDefinedExpression]); // [x, f(x)]
		output[i] = ret[1]; // select f(x)
	}
	
	// udfValues = output;
	return output;
}

function evaluateCurrentUserDefinedFunctionAtValue(value) { // this assumes user input format like x^2 + 5*x
	var ret = new Array(2); // eval returns a vector of all inputs concatenated with output
	ret = math.eval(['x = ' + value, userDefinedExpression]); // [x, f(x)]

	return ret[1]; // select f(x)
}

// This function plots the currently evaluated user-defined function on the passed board 
function plotUDF(board) {
	var graphUDF = board.create('curve', [[0],[0]], {strokeColor:'#FF0000', strokeWidth:1.5}); // red
	graphUDF.updateDataArray = function(){
		 this.dataX = samplePoints;
		 this.dataY = udfValues; 
	};
	
	board.update();
}

function convolveWithUDF(brd2){
	convoCorr = 0;
    graph3.updateDataArray = function(){ 
        udfConvoResult = conv(signalArray1, udfValues); // for now convolving with the first selected function
        scaleResult(udfConvoResult);
        
        generateResultPoints(udfTimes, udfConvoResult); 	// X-axis points for graph 3
        this.dataX = udfTimes;  // X axis values for graph 2 on the upper board
        this.dataY = udfConvoResult;  // Y axis values for graph 2 on the upper board
        
    };
	
    brd2.update();
    pnt.moveTo([100,0]); // take red point out of sight
	
	return false;
}

// Gets and plots the correlation values for the selected functions
function correlateWithUDF(brd2){
	convoCorr = 1;
    graph3.updateDataArray = function(){ 
        udfCorrResult = xcorr(signalArray1, udfValues);
        scaleResult(udfCorrResult);
        
        generateResultPoints(udfTimes, udfCorrResult); // X-axis points for graph 3
        this.dataX = udfTimes;
        this.dataY = udfCorrResult;
    };
    brd2.update();
    pnt.moveTo([100,0]);
    
	return false;
}

function updateUdfLimits() {
	// leftLimiter = parseFloat( document.getElementById("txtLeftLimiter").value );
	// rightLimiter = parseFloat( document.getElementById("txtRightLimiter").value ); 
	leftLimiter = $( "#slider-range" ).slider( "values", 0 );
	rightLimiter = $( "#slider-range" ).slider( "values", 1 );
	// console.log("Updated udf limits");
	return false;
}

function applyRectToUDF(left, right, samplePoints) {
	var crossedLeft = false;
	var leftIndex, rightIndex;
	udfValues = udfOriginalValues.slice();
	for (i = 0; i < samplePoints.length; i++) {
		if (!crossedLeft) { if (samplePoints[i]>=left) {crossedLeft = true; leftIndex = i; } }
		else { if (samplePoints[i]>=right) {rightIndex = i; break; } }
	}
	
	for (i = 0; i < udfValues.length; i++) {
		if (i < leftIndex) udfValues[i] = 0;
		if (i > rightIndex) udfValues[i] = 0;
	}
	
	// plotUDF(brd);
	plot1(brd);
	
	console.log("Modified UDF plot");
	return false;
}

function applyStepToUDF(start, samplePoints) {
	var startIndex;
	for (i = 0; i < samplePoints.length; i++) {
		if (samplePoints[i]>=start) {startIndex = i; break;}
	}
	for (i = 0; i < udfValues.length; i++) {
		if (i < startIndex) udfValues[i] = 0;
	}	
	
	// plotUDF(brd);
	plot1(brd);
	
	return false;
}

function updateUdfSliderLimits(board) { // I know it's ugly, but it will have to do for now
	leftLimiter = board.getBoundingBox()[0];
	rightLimiter = -1*currentLeftBound;
	
	$('#slider-range').slider( "option", "min", leftLimiter );
	$('#slider-range').slider( "option", "max", rightLimiter );
	 
	// console.log("Updated slider limits");
	
	return false;
}
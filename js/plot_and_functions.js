   
   var s1 = [] , s2 = [], s3 = [];
  
  function start(brd,brd2, d){
      console.log("before");
      var W = 1;
      graph1 = brd.create('curve',[[0],[0]]); 
      graph2 = brd.create('curve',[[0],[0]], {strokeColor:'#00ff00',strokeWidth:1.5}); 
      graph3 = brd2.create('curve',[[0],[0]], {strokeWidth:2});
      graph1.updateDataArray = function(){ 
       var x_y_values;
        x_y_values = rect(null,W);
        this.dataX = x_y_values[0];
        this.dataY = x_y_values[1];
        s1 = x_y_values[1];
        
    }
    graph2.updateDataArray = function(){ 
        var x_y_values;
        x_y_values = triangle(d, W);
        this.dataX = x_y_values[0];
        this.dataY = x_y_values[1];
        s2 = x_y_values[1];
        
    }
    
    brd.update();
    
    
   // console.log(s1);
    //console.log(s2);
   
    //console.log(s3[1]);
   
    console.log("after");
  }
  function doCorrelation(brd2){
      
  }
  function doConvo(brd2){
     graph3.updateDataArray = function(){ 
        
        s3 = conv(s1 , s2);
        this.dataX = s3[0];
        this.dataY = s3[1];
        
    }
    brd2.update();
    console.log(s3[1]);
  }
  
  function plot1(brd){

        var dropDown1 = document.getElementById("functionList1");
        var signal = dropDown1.value; 
        var W = 1;
        //change the Y attribute of the graph to the new function 
    graph1.updateDataArray = function(){ 
        var x_y_values;
            if (signal == "1"){
                x_y_values = rect(null, W);
            }
            else if (signal == "2"){
                x_y_values = triangle(null, W);
            }
            else if (signal == "3"){
               x_y_values = gaussian();
            }
            else if (signal == "4"){
               x_y_values = sinc();
           };
	this.dataX = x_y_values[0];
        this.dataY = x_y_values[1];
        s1 = x_y_values[1];
       }
       
    brd.update();
    
   
    //console.log(graph1.numberPoints);
  }
  
  function plot2(brd, d){
       var dropDown2 = document.getElementById("functionList2");
        var signal2 = dropDown2.value; 
       
        var W = 1;
        //change the Y attribute of the graph to the new function 
    graph2.updateDataArray = function(){  
       var x_y_values;
            if (signal2 == "1"){
                x_y_values = triangle(d, W);
            }
            else if (signal2 == "2"){
                x_y_values = rect(d, W);
            }
            else if (signal2 == "3"){
               x_y_values = gaussian(d);
            }
            else if (signal2 == "4"){
               x_y_values = sinc(d);
           };
           this.dataX = x_y_values[0];
           this.dataY = x_y_values[1];
           s2 = x_y_values[1];
       }
    
    brd.update();
    
    
  }
  
  
  function gaussian(d = null){ 
       var x = [], y = [], A = 1; 
       
        if (d == null) {
            
            for (t = -3; t <= 3; ) {
            x.push(t);
            y.push(A*Math.exp(-1*(t)*(t))); 
            t = t + 0.1;
            }
        }
        else {
            for (t = -3; t <= 3; ) {
            x.push(t);
            y.push(A*Math.exp(-1*(t - d.Value())*(t - d.Value()))); 
            t = t + 0.1;
            }
       
      }
        return [x, y];
  }
  
  function zeroPad(x1, x2){
	//Input: Two arrays, returns the zero padded arrays
        
	x1=x1.concat(Array(x2.length-1).fill(0));
	x2=x2.concat(Array(x1.length-1).fill(0));
	return [x1,x2];
}
function conv(x1, x2){
	//returns the convolution of the input arrays
        var t_out = [];
	x=zeroPad(x1,x2);
	x1=x[0]; x2=x[1]; N=x[0].length;
	y=Array(N).fill(0); //preallocating
        var t_range = N/10;
        var t_start = -1*t_range/2, t_end = t_range/2;
	for(t = t_start ; t < t_end;){
            t_out.push(t);
            t = t + 0.1;
	}
        
        for(n=0;n<N;++n){
		for(k=0;k<N;++k){
			if(k>n) break;
			y[n] += x1[k]*x2[n-k];
		}
	}
           
	return [t_out,y];
}

//TO BE IMPLEMENTED
function convFast(x1,x2){//need to find a working library for fft and ifft (with standard radix2 butterfly algorithm)
	x=zeroPad(x1,x2);
	x1=x[0]; x2=x[1];
	return ifft(fft(x1)*fft(x2));
}
  
  function triangle(d, W){
    var x = [], y = [], A = 1;
      if (d == null){
         
        for (t = -3; t <= 3; ) {
            x.push(t);
            if (Math.abs(2*t/W) > 1) { y.push(0); }
            if (Math.abs(2*t/W) <= 1) { y.push(A*(1 - Math.abs(2*t/W))); }
            t = t + 0.1;
        }
        
      }
      else {
          for (t = -3; t <= 3; ) {
            x.push(t);
            if (Math.abs(2*(t-d.Value())/W) > 1) { y.push(0); }
            if (Math.abs(2*(t-d.Value())/W) <= 1) { y.push(A*(1 - Math.abs(2*(t-d.Value())/W))); }
            t = t + 0.1;
        }
         
       }
       return [x, y];
  }
  
  function sinc(d = null) {
   var x = [], y = [], A = 1;
    if (d == null) 
    {
         for (t = -3; t <= 3; ) {
            x.push(t);
            if ((t) == 0) { y.push(1); }
            else { y.push(A*Math.sin(t)/(t))};
            t = t + 0.1;
        }
    }
    else {
        for (t = -3; t <= 3; ) {
            x.push(t);
            if ((t - d.Value()) == 0) { y.push(A*1); }
            else { y.push(A*Math.sin(t - d.Value())/(t - d.Value()))};
            t = t + 0.1;
        }
    }
    return [x, y];
}

function rect(d = null, W) {
   
    var x = [], y = [], A = 1;
    if (d == null){
        for (t = -3; t <= 3; ) {
            x.push(t);
            if (Math.abs(t) > (W*1/2)) {y.push(0);}
            //if (Math.abs(t) == (W*1/2)) {y.push(A*1/2);}
            if (Math.abs(t) < W*1/2) {y.push(A*1)};
            t = t + 0.1;
        }
    }
    else {
        for (t = -3; t <= 3; ) {
            x.push(t);
            if (Math.abs(t - d.Value()) > (W*1/2)) {y.push(0);}
            if (Math.abs(t - d.Value()) == (W*1/2)) {y.push(A*1/2);}
            if (Math.abs(t - d.Value()) < (W*1/2)) {y.push(A*1)};
            t = t + 0.1;
        }
    }
    return [x, y];
}



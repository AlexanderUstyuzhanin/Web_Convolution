//Author: Nicola Giaconi

//ZERO_PADDING
function zeroPad(x1, x2){
	//Input: Two arrays, returns the zero padded arrays
	x1=x1.concat(Array(x2.length-1).fill(0));
	x2=x2.concat(Array(x1.length-1).fill(0));
	return [x1,x2];
}

//FLIPPING ARRAY
function flip(x){
	//returns an array which is the index-reversed version of the input array
	N=x.length;
	x_flipped=Array(N).fill(0); 
	for(i=0;i<N;++i){
		x_flipped[N-i-1] = x[i];
	}
	return x_flipped;
}

//CONVOLUTION
function conv(x1, x2){
	//returns the convolution of the input arrays
	x=zeroPad(x1,x2); 					//Zero-padding
	x1=x[0]; x2=x[1]; N=x[0].length;	
	y=Array(N).fill(0); 				//Preallocating
	for(n=0;n<N;++n){					//for-loop implementation following definition
		for(k=0;k<N;++k){
			if(k>n) break;
			y[n] += x1[k]*x2[n-k];
		}
	}
	return y;
}

//CORRELATION
function xcross(x1, x2){
	//returns the cross-correlation of the input arrays					
	x=zeroPad(x1,flip(x2)); 			//Zero-padding and index-reversing
	x1=x[0]; x2=x[1]; N=x[0].length;	
	y=Array(N).fill(0); 				//Preallocating
	for(n=0;n<N;++n){					//for-loop implementation following definition
		for(k=0;k<N;++k){
			if(k>n) break;
			y[n] += x1[k]*x2[n-k];
		}
	}
	return y;
}

//RECT FUNCTION
function rect(x, width=1, shift=0){
	//return the rect function of the input array x, centered on shift, and of width w.
	N=x.length;
	y=Array(N).fill(0);
	for(i=0;i<x.length;++i){
		delta=Math.abs((x[i]-shift)/width);
		if 		(delta > 1/2) 	{y[i]=0;}
		else if (delta == 1/2) 	{y[i]=1/2;}
		else 					{y[i]=1;}
	}
	return y;
}

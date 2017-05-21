function zeroPad(x1, x2){
	//Input: Two arrays, returns the zero padded arrays
	x1=x1.concat(Array(x2.length-1).fill(0));
	x2=x2.concat(Array(x1.length-1).fill(0));
	return [x1,x2];
}
function conv(x1, x2){
	//returns the convolution of the input arrays
	x=zeroPad(x1,x2);
	x1=x[0]; x2=x[1]; N=x[0].length;
	y=Array(N).fill(0); //preallocating
	for(n=0;n<N;++n){
		for(k=0;k<N;++k){
			if(k>n) break;
			y[n] += x1[k]*x2[n-k];
		}
	}
	return y;
}

//TO BE IMPLEMENTED
function convFast(x1,x2){//need to find a working library for fft and ifft (with standard radix2 butterfly algorithm)
	x=zeroPad(x1,x2);
	x1=x[0]; x2=x[1];
	return ifft(fft(x1)*fft(x2));
}

console.log(conv([11,23,4,5,6,2],[9,5,7]));
//console.log(convFast([11,23,4,5,6,2],[9,5,7]));
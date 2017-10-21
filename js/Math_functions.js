//Author: Nicola Giaconi
//Last revision: 21/10/2017
//Math functions for Web-based Convolution Demonstrator

//ZERO_PADDING
function zeroPad(x1, x2){
    //returns the zero padded arrays
    //input: numeric arrays x1 and x2
    x1 = x1.concat(Array(x2.length-1).fill(0));
    x2 = x2.concat(Array(x1.length-1).fill(0));
    return [x1,x2];
}

//FLIPPING ARRAY
function flip(x){
    //returns the index-reverse array of the input array
    //input: numeric array x
    const N = x.length;
    var x_flipped = Array(N).fill(0);
    for(let i=0 ; i<N ; ++i){
        x_flipped[N-i-1] = x[i];
    }
    return x_flipped;
}

//CONVOLUTION
function conv(x1, x2){
    //returns the linear convolution of the input arrays
    //input: numeric arrays x1 and x2
    //Zero-padding
    var x = zeroPad(x1,x2);
    x1 = x[0];
    x2 = x[1];
    const N = x[0].length;
    var y = Array(N).fill(0);
    //for-loop implementation following definition
    for(let n=0 ; n<N ; ++n){
        for(let k=0 ; k<N ; ++k){
            if(k>n){
                break;
            }
            y[n] += x1[k]*x2[n-k];
        }
    }
    return y;
}

//CORRELATION
function xcorr(x1, x2){
    //returns the cross-correlation of the input arrays
    //input: numeric arrays x1 and x2
    //Zero-padding and index-reversing
    var x = zeroPad(x1,flip(x2));
    x1 = x[0];
    x2 = x[1];
    const N = x[0].length;
    var y = Array(N).fill(0);
    //for-loop implementation following definition
    for(let n=0 ; n<N ; ++n){
        for(let k=0 ; k<N ; ++k){
            if(k>n){
                break;
            }
            y[n] += x1[k]*x2[n-k];
        }
    }
    return y;
}

//RECT FUNCTION
function rect(x, width=1, shift=0){
    //returns the rect function of the input array x, centered on shift, and of width w
    //input: numeric array x, numeric width (default 1), numeric shift (default 0)
    const N = x.length;
    var y = Array(N).fill(0);
    var delta;
    for(let i=0 ; i<N ; ++i){
        delta = Math.abs((x[i]-shift)/width);
        if(delta > 1/2){
            y[i]=0;
        }
        else if(delta == 1/2){
            y[i]=1/2;
        }
        else{
            y[i]=1;
        }
    }
    return y;
}

//TRIANGLE FUNCTION
function tri(x, width=1, shift=0){
    //returns the triangle function of the input array x, centered on shift, and of width w
    //input: numeric array x, numeric width (default 1), numeric shift (default 0)
    const N = x.length;
    var y = Array(N).fill(0);
    var delta;
    for(let i=0 ; i<N ; ++i){
        delta = (x[i]-shift)/width;
        if(Math.abs(delta) > 1/2){
            y[i] = 0;
        }
        else if(delta >= 0 && delta <= 1/2){
            y[i] = 1-2*(x[i]-shift)/width;
        }
        else if(delta < 0 && delta >= -1/2){
            y[i] = 1+2*(x[i]-shift)/width;
        }
    }
    return y;
}

//STEP FUNCTION
function step(x, shift=0) {
    //returns the step function of the input array x, centered on shift
    //input: numeric array x, numeric shift (default 0)
    const N = x.length;
    var y = Array(N).fill(0);
    var delta;
    for(let i=0 ; i<N ; ++i){
        delta=x[i]-shift;
        if(delta >= 0){
            y[i]=1;
        }
        else{
            y[i]=0;
        }
    }
    return y;
}

//SINC FUNCTION
function sinc(x, width=1, shift=0) {
    //returns the sinc function of the input array x
    //input: numeric array x, numeric width (default 1), numeric shift (default 0)
    const N = x.length;
    var y = Array(N).fill(0);
    var delta;
    for(let i=0 ; i<N ; ++i){
        delta=(x[i]-shift)/width;
        if(delta == 0){
            y[i]=1;
        }
        else{
            y[i] = Math.sin(delta)/delta;
        }
    }
    return y;
}

//NORMALIZED GAUSSIAN FUNCTION
function gaussian(x, vari=1, expect=0) {
    //returns the gaussian-normalized function of the input array x, with
    //expectation expect, and variance vari
    //input: numeric array x, numeric vari (default 1), numeric expect (default 0)
    const N = x.length;
    var y = Array(N).fill(0);
    for(let i=0;i<N;++i){
        y[i] = Math.exp(-Math.pow((x[i]-expect),2)/(2*vari))/(Math.sqrt(2*Math.PI*vari));
    }
    return y;
}

//DIRAC FUNCTION
function dirac(x, shift=0) {
    //returns the dirac function of the input array x, centered on shift
    //input: numeric array x, numeric shift (default 0)
    var hit = 0;
    const N = x.length;
    var y = Array(N).fill(0);
    for(let i=0 ; i<N ; ++i){
        if(x[i]>=shift && hit==0){
            y[i]=1;
            ++hit;
        }
        else{
            y[i] = 0;
        }
    }
    return y;
}

//DIRAC-COMB FUNCTION
function diracComb(x) {
    //returns the dirac-comb function of the input array x
    //input: numeric array x
    const N = x.length;
    var y = Array(N).fill(0);
    var xMin = Math.ceil(Math.min.apply(Math,x));
    for(let i=0 ; i<N ; ++i){
        if(x[i]<xMin){
            y[i] = 0;
        }
        else{
            y[i] = 1;
            //xMin updates after every peak
            ++xMin;
        }
    }
    return y;
}

//ONE-SIDED DECREASING EXPONENTIAL FUNCTION
function oneSideExp(x, rate=1){
    //returns the one-sided decreasing exponential function of the input array x
    //input: numeric array x
    const N = x.length;
    var y = Array(N).fill(0);
    for(let i=0 ; i<N ; ++i){
        if(x[i]<0){
            y[i] = 0;
        }
        else{
            y[i] = Math.exp(-Math.abs(rate)*x[i]);
        }
    }
    return y;
}

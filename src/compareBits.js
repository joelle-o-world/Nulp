function compareBits(a, b) {
    //console.log("Comparing", a, "and", b);
    if(a.isWord) {
        if(b.isPunc)
            return false;
        if(b.isWord)
            return a.w == b.w;
        if(b.isQ) {
            return b.fits(a);
        }
    }
    if(a.isPunc) {
        if(b.isPunc && a.str == b.str)
            return true;
        else
            return false;
    }
    if(a.isQ) {
        if(b.isQ) {
            return a.print == b.print;
        } else if(b.isWord) {
            return compareBits(b, a);
        } else if(b.isPunc) {
            return false;
        }
    }

    console.log("D: words/compareBits.js came to no conclsion", a, b);
}
module.exports = compareBits;

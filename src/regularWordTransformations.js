var regularWordTransformations = {

    "plur>noun": function(w) {
        var l = w.length;
        if(w[l-1] == "s" && w[l-2] != "s")
            if(w[l-2] == "e")
                if(w[l-3] == "s" || w[l-3] == "x")
                    return w.slice(0, l-2);
                else if(w[l-3] == "i")
                    return w.slice(0, l-3) + "y";
                else
                    return w.slice(0, l-1);
            else
                return w.slice(0, l-1);
        else
            return false;
    },


    "noun>plur": function(w) {
        var l = w.length;
        if(w[l-1] == "s" || w[l-1] == "x")
            return w + "es";
        else if(w[l-1] == "y")
            return w.slice(0, l-1) + "ies";
        else
            return w + "s";
    },

    "noun>adj": function(w) {
        return [w+"like", w+"y", w+"ish"];
    }
}
module.exports = regularWordTransformations;

var init_history_elements = function(){
    cleanup()
    init_general_resources()

    points = gen_line_points()
    text_coords = gen_line_text_coords(-100, false, true)
    text_coords2 = gen_line_text_coords(30, true, true)

    for (i in points){
        path.add(points[i]);
        label_array.push(gentext(text_coords[i].coords, data[i][1], 'big', text_coords[i].rotation))
        label_array2.push(gentext(text_coords2[i].coords, data[i][0], 'small', text_coords2[i].rotation, 'bold'))
    }

    path.smooth()
    shift_strings_history('right', 'line', 'history')
}

var shift_strings_history = function(side, shape, datatype){
    for (i in data) data[i][1] = data[i][1].trim()

    var max_string_length = Math.max.apply(0, data.map(function(d){return d[1].length}))
    
    for (i in data){
        str = data[i][1].trim()
        diff = max_string_length - str.length
        res = ''
        for (var j = 0; j<diff; j++) res += ' '
        
        if (shape == 'circle'){
            if (i < data.length / 2) label_array[i].content = str + res
            else label_array[i].content = res + str
            
        } else if (shape == 'spiral'){
            if (text_coords[i].rotation % 360 >= 180 && text_coords[i].rotation % 360 < 270) {label_array[i].content = str + res; console.log('aa')}
            else {label_array[i].content = res + str; console.log('bb')}
            if (data[i][1] == 'tax hike' || data[i][1] == 'capitalism rises'|| data[i][1] == 'cellics invasion') label_array[i].content = str + res
            if (data[i][1] == 'economic boom' || data[i][1] == 'end of bartering') label_array[i].content = res + str
        }
        else {
            if (side == 'right') label_array[i].content = res + str
            else label_array[i].content = str + res
        }
    }
}
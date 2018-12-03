// history parameters
var add_placeholder_dates = false;
var max_dates_in_history = 20;


// loads history csv file and manipulates it based on the previous parameters
var load_history = function(){
    Papa.parse('data/history.csv', {
        download: true,
        dynamicTyping: true,
        complete: function(results) {
            data = results.data.splice(1, results.data.length);
            
            // cut dates over max_dates_in_history
            if (max_dates_in_history != undefined && max_dates_in_history != 0) data = data.splice(0, max_dates_in_history)
            if (add_placeholder_dates == true) add_placeholder_dates(data, 10)

            init_history_elements()
        }
    })
}

// adds a placeholder date every interval years
var add_placeholder_dates = function(data, interval){
    start_date = Math.min.apply(0, data.map(function(d){return d[0]}))
    start_date = Math.round(start_date / 10) * 10
    interval_value = interval
    cur_date = start_date
    end_date = Math.ceil(Math.max.apply(0, data.map(function(d){return d[0]}))/100) * 100
    while (cur_date <= end_date){
        // check if there aren't already events at that particular date that we are trying to insert
        if (!data.some(function(d){return d[0] == cur_date}))  
            data.splice(data.indexOf(data.find(function(d){return d[0] > cur_date})), 0, [cur_date, ''])
        cur_date += interval_value
    }

}


var gen_line_text_coords_for_history = function(offset, second_set, proportional) {
    var cur_points = [];
    if (offset == undefined) offset = -50
    
    if (proportional){
        for (i in data) {
            var min_year = Math.min.apply(0, data.map(function(d){return d[0]}))
            var max_year = Math.max.apply(0, data.map(function(d){return d[0]}))
            var date_diff = max_year - min_year + 20
            var this_x = line_w * (data[i][0] - min_year)/date_diff

            cur_points.push({
                coords: new Point(padding_h/2 + this_x + (second_set?130:0), line_y + offset),
                rotation: 45
            })
        }
    } else {
        var space_between_points = parseInt(line_w / data.length)

        for (i in data) {
            cur_points.push({
                coords: new Point(padding_h/2 + i*space_between_points, line_y + offset),
                rotation: 45
            })
        }
    }

    return cur_points;
}


var init_history_elements = function(){
    cleanup()
    init_general_resources()

    points = gen_line_points()
    text_coords = gen_line_text_coords_for_history(-100, false, true)
    text_coords2 = gen_line_text_coords_for_history(30, true, true)

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

            if (data[i][1] == 'tax hike' || data[i][1] == 'cellics invasion') label_array[i].content = str + res
            
        } else if (shape == 'spiral'){
            if (text_coords[i].rotation % 360 > 90 && text_coords[i].rotation % 360 < 270) label_array[i].content = res + str
            else label_array[i].content = str + res
        }
        else {
            if (side == 'right') label_array[i].content = res + str
            else label_array[i].content = str + res
        }
    }

    fix_text_rotation(text_coords2)
}


var fix_text_rotation = function(textarray){
    for (elem in textarray){
        console.log(textarray[elem].rotation);
        console.log(label_array2[elem].content)
    }
}
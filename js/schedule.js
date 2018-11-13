var gen_text_coords_for_schedule = function(v_offset){
    var cur_points = [];
    if (v_offset == undefined) v_offset = 0

    for (i in data) {
        var event_boundaries = compute_event_start_end(data[i])
        var this_x = (event_boundaries[0] + event_boundaries[1])*0.5

        cur_points.push({
           coords: new Point(padding_h/2 + this_x, line_y - 160 + v_offset),
           rotation: 90
        })
    }

    return cur_points
}


var gen_circle_text_coords_for_schedule = function(radius){
    var cur_points = [];

    if (radius == undefined) var radius = start_radius + 150

    var d_factor = compute_total_schedule_length()

    for (i in data) {
        var event_boundaries = compute_event_start_end(data[i])
        var this_x = (event_boundaries[0] + event_boundaries[1])*0.5

        cur_points.push({
           coords: new Point(
                width/2 + Math.cos(2 * Math.PI * this_x / d_factor) * radius, 
                height/2 + Math.sin(2 * Math.PI * this_x / d_factor) * radius),
           rotation: ((this_x > d_factor/2? Math.PI : 0) +2 * Math.PI * this_x/d_factor) * 180 / Math.PI
        })
    }

    return cur_points
}

var gen_spiral_text_coords_for_schedule = function(radius){
    var cur_points = [];

    if (radius == undefined) var radius = start_radius + 400

    var d_factor = compute_total_schedule_length()

    for (i in data) {
        var event_boundaries = compute_event_start_end(data[i])
        var this_x = (event_boundaries[0] + event_boundaries[1])*0.5

        /*
        if (i != 0) {
            var event_boundaries2 = compute_event_start_end(data[i-1])
            var this_x2 = (event_boundaries[0] + event_boundaries[1])*0.5
            radius = radius - 20*(this_x - this_x2)/(d_factor/data.length);
        } else */radius = radius - 20

        cur_points.push({
           coords: new Point(
                width/2 + Math.cos(4 * Math.PI * this_x / d_factor) * radius, 
                line_y + Math.sin(4 * Math.PI * this_x / d_factor) * radius),
           rotation: (4 * Math.PI * this_x / data.length) * 180 / Math.PI
        })
    }

    return cur_points
}

var add_circle_weekday_names = function(){
    var cur_date = data[0][1]
    var text_coords3 = gen_circle_text_coords_for_schedule(start_radius - 60)
    label_array2.push(gentext(text_coords3[1].coords, data[0][0] + '\n' + data[0][1], 'big', text_coords3[1].rotation + 90, 'bold'))
    
    for (i in data){
        if (data[i][1] != cur_date) {
            label_array2.push(gentext(text_coords3[i].coords, data[i][0] + '\n' + data[i][1], 'big', text_coords3[i].rotation + 90, 'bold'))
            cur_date = data[i][1]
        } 
    }
}


var add_line_weekday_names = function(){
    var cur_date = data[0][1]
    var text_coords3 = gen_text_coords_for_schedule(200)
    label_array2.push(gentext(text_coords3[1].coords, data[0][0] + '\n' + data[0][1], 'big', text_coords3[1].rotation - 90, 'bold'))
    
    for (i in data){
        if (data[i][1] != cur_date) {
            label_array2.push(gentext(text_coords3[i].coords, data[i][0] + '\n' + data[i][1], 'big', text_coords3[i].rotation - 90, 'bold'))
            cur_date = data[i][1]
        } 
    }   
}

var gen_circle_text_coords_for_schedule_hours = function(){
    var cur_points = [];

    var radius = start_radius + 75
    var d_factor = compute_total_schedule_length()

    for (i in data) {
        var event_boundaries = compute_event_start_end(data[i])
        var this_x = (event_boundaries[0] + event_boundaries[1])*0.5

        cur_points.push({
           coords: new Point(
                width/2 + Math.cos(2 * Math.PI * event_boundaries[0] / d_factor) * radius, 
                height/2 + Math.sin(2 * Math.PI * event_boundaries[0] / d_factor) * radius),
           rotation: ((this_x > d_factor/2? Math.PI : 0) + 2 * Math.PI * event_boundaries[0]/d_factor) * 180 / Math.PI
        })
        cur_points.push({
           coords: new Point(
                width/2 + Math.cos(2 * Math.PI * event_boundaries[1] / d_factor) * radius, 
                height/2 + Math.sin(2 * Math.PI * event_boundaries[1] / d_factor) * radius),
           rotation: ((this_x > d_factor/2? Math.PI : 0) + 2 * Math.PI * event_boundaries[1]/d_factor) * 180 / Math.PI
        })
    }

    return cur_points
}

var gen_line_text_coords_for_schedule_hours = function(){
    cur_points = [];
    for (i in data){
        var event_boundaries = compute_event_start_end(data[i])
        cur_points.push({
            coords: new Point(padding_h/2 + event_boundaries[0], line_y - 70),
            rotation: 90
        })
        cur_points.push({
            coords: new Point(padding_h/2 + event_boundaries[1], line_y - 70),
            rotation: 90
        })

    }
    return cur_points
}

var compute_total_schedule_length = function(){
    return (compute_event_start_end(data[data.length - 1])[1])
}

var compute_event_start_end = function(dataline){
    var h_start = dataline[3]
    var h_end = dataline[4]

    var date_diff = compute_date_diff(data[0][1], data[data.length - 1][1]) + 1

    var this_date_x = line_w * compute_date_diff(dataline[1], data[0][1]) / date_diff

    var hour_start = h_start.split(':')[0] + h_start.split(':')[1]
    var this_event_x = this_date_x + hour_start * (line_w/date_diff) / 2400
    var hour_end = h_end.split(':')[0] + h_end.split(':')[1]

    if (dataline[2] == 'Sleep') hour_end = parseInt(hour_start) + parseInt(hour_end)

    var this_event_x2 = this_date_x + hour_end * (line_w/date_diff) / 2400 + 0.1

    return [this_event_x, this_event_x2]
}

var compute_circle_coords = function(point, day, h_start, h_end, dataline){
    var v_offset = 50
    var cur_points = [];
    var event_boundaries = compute_event_start_end(dataline)
    var radius = start_radius + 40

    var d_factor = compute_total_schedule_length()

    cur_points.push(
        new Point(
            width/2 + Math.cos(2 * Math.PI * (event_boundaries[0]) / d_factor) * radius, 
            height/2 + Math.sin(2 * Math.PI * (event_boundaries[0]) / d_factor) * radius))

    cur_points.push(
        new Point(
            width/2 + Math.cos(2 * Math.PI * (event_boundaries[1]*0.25 + event_boundaries[0]*0.75) / d_factor) * radius, 
            height/2 + Math.sin(2 * Math.PI * (event_boundaries[1]*0.25 + event_boundaries[0]*0.75) / d_factor) * radius))

    cur_points.push(
        new Point(
            width/2 + Math.cos(2 * Math.PI * (event_boundaries[1] + event_boundaries[0])*0.5 / d_factor) * radius, 
            height/2 + Math.sin(2 * Math.PI * (event_boundaries[1] + event_boundaries[0])*0.5 / d_factor) * radius))
    
    cur_points.push(
        new Point(
            width/2 + Math.cos(2 * Math.PI * (event_boundaries[1]*0.75 + event_boundaries[0]*0.25) / d_factor) * radius, 
            height/2 + Math.sin(2 * Math.PI * (event_boundaries[1]*0.75 + event_boundaries[0]*0.25) / d_factor) * radius))
    

    cur_points.push(
        new Point(
            width/2 + Math.cos(2 * Math.PI * event_boundaries[1] / d_factor)*radius, 
            height/2 + Math.sin(2 * Math.PI * event_boundaries[1] / d_factor)*radius))
            
    return cur_points
}


var compute_line_coords = function(point, day, h_start, h_end, dataline){
    var v_offset = 50
    var cur_points = [];
    var event_boundaries = compute_event_start_end(dataline)

    cur_points.push(new Point(padding_h/2 + event_boundaries[0], point.y + 10 - v_offset))
    cur_points.push(new Point(padding_h/2 + event_boundaries[1], point.y + 10 - v_offset))
    return cur_points
}
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
    var offset = 100

    var d_factor = compute_total_schedule_length()

    for (i in data) {
        var event_boundaries = compute_event_start_end(data[i])
        var this_x = (event_boundaries[0] + event_boundaries[1])*0.5

        /*
        if (i != 0) {
            var event_boundaries2 = compute_event_start_end(data[i-1])
            var this_x2 = (event_boundaries[0] + event_boundaries[1])*0.5
            radius = radius - 20*(this_x - this_x2)/(d_factor/data.length);
        } else radius = radius - 20 */

        radius = radius - 20

        cur_points.push({
           coords: new Point(
                width/2 + Math.cos(4 * Math.PI * this_x / d_factor) * (radius + offset), 
                line_y + Math.sin(4 * Math.PI * this_x / d_factor) * (radius + offset)
                ),
           rotation: (4 * Math.PI * this_x / d_factor) * 180 / Math.PI
        })
    }

    return cur_points
}

var add_spiral_weekday_names = function(){
    var cur_date = data[0][1]
    var text_coords3 = gen_spiral_text_coords_for_schedule(start_radius + 250)
    label_array2.push(gentext(text_coords3[1].coords, data[0][0] + '\n' + data[0][1], 'big', text_coords3[1].rotation + 90, 'bold'))
    
    for (i in data){
        if (data[i][1] != cur_date) {
            label_array2.push(gentext(text_coords3[i].coords, data[i][0] + '\n' + data[i][1], 'big', text_coords3[i].rotation + 90, 'bold'))
            cur_date = data[i][1]
        } 
    }
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

var gen_spiral_text_coords_for_schedule_hours = function(){
    var cur_points = [];

    var radius = start_radius + 400
    var offset = 50
    var d_factor = compute_total_schedule_length()

    for (i in data) {
        

        var event_boundaries = compute_event_start_end(data[i])
        var this_x = (event_boundaries[0] + event_boundaries[1])*0.5

        radius = (start_radius + 400) - 20*event_boundaries[0]/(d_factor/data.length);
        cur_points.push({
           coords: new Point(
                width/2 + Math.cos(4 * Math.PI * event_boundaries[0] / d_factor) * (radius + offset), 
                line_y + Math.sin(4 * Math.PI * event_boundaries[0] / d_factor) * (radius + offset)
                ),
           rotation: ((this_x > d_factor/2? Math.PI : 0) + 4 * Math.PI * event_boundaries[0]/d_factor) * 180 / Math.PI
        })

        radius = (start_radius + 400) - 20*event_boundaries[1]/(d_factor/data.length);
        cur_points.push({
           coords: new Point(
                width/2 + Math.cos(4 * Math.PI * event_boundaries[1] / d_factor) * (radius + offset), 
                line_y + Math.sin(4 * Math.PI * event_boundaries[1] / d_factor) * (radius + offset)
                ),
           rotation: ((this_x > d_factor/2? Math.PI : 0) + 4 * Math.PI * event_boundaries[1]/d_factor) * 180 / Math.PI
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


var compute_spiral_coords = function(point, day, h_start, h_end, dataline){
    var v_offset = 50
    var cur_points = [];
    var event_boundaries = compute_event_start_end(dataline)
    var radius = start_radius + 400

    var d_factor = compute_total_schedule_length()
    radius = (start_radius + 400) - 20*event_boundaries[0]/(d_factor/data.length);
    cur_points.push(
        new Point(
            width/2 + Math.cos(4 * Math.PI * (event_boundaries[0]) / d_factor) * radius, 
            line_y + Math.sin(4 * Math.PI * (event_boundaries[0]) / d_factor) * radius))

    var midpoint = (event_boundaries[1]*0.25 + event_boundaries[0]*0.75)
    radius = (start_radius + 400) - 20*midpoint/(d_factor/data.length);
    cur_points.push(
        new Point(
            width/2 + Math.cos(4 * Math.PI * (midpoint) / d_factor) * radius, 
            line_y + Math.sin(4 * Math.PI * (midpoint) / d_factor) * radius))

    var midpoint = (event_boundaries[1]*0.5 + event_boundaries[0]*0.5)
    radius = (start_radius + 400) - 20*midpoint/(d_factor/data.length);
    cur_points.push(
        new Point(
            width/2 + Math.cos(4 * Math.PI * (midpoint) / d_factor) * radius, 
            line_y + Math.sin(4 * Math.PI * (midpoint) / d_factor) * radius))

    var midpoint = (event_boundaries[1]*0.75 + event_boundaries[0]*0.25)
    radius = (start_radius + 400) - 20*midpoint/(d_factor/data.length);
    cur_points.push(
        new Point(
            width/2 + Math.cos(4 * Math.PI * (midpoint) / d_factor) * radius, 
            line_y + Math.sin(4 * Math.PI * (midpoint) / d_factor) * radius))

    radius = (start_radius + 400) - 20*event_boundaries[1]/(d_factor/data.length);
    cur_points.push(
        new Point(
            width/2 + Math.cos(4 * Math.PI * event_boundaries[1] / d_factor)*radius, 
            line_y + Math.sin(4 * Math.PI * event_boundaries[1] / d_factor)*radius))
            
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


var gen_spiral_points_for_schedule = function(proportional, radius_decrease_rate){
    var cur_points = []
    var radius = start_radius + 400;
    var anglestep = 360/data.length;
    if (proportional == undefined) proportional = false
    if (radius_decrease_rate == undefined) radius_decrease_rate = 40;

    for (var i = 0; i< data.length + 3; i++) {
        radius = radius - radius_decrease_rate;
            cur_points.push(
            new Point(
                width/2 + Math.cos(4 * Math.PI * i / data.length)*radius, 
                line_y + Math.sin(4 * Math.PI * i / data.length)*radius 
                ))      
    }

    return cur_points
}


var init_schedule_elements = function(){
    cleanup()
    init_general_resources()

    if (shapetype == 'line'){
        points = gen_line_points()
        text_coords = gen_text_coords_for_schedule(-200)
        text_coords2 = gen_line_text_coords_for_schedule_hours()
    } else if (shapetype == 'circle'){
        points = gen_circle_points()
        text_coords = gen_circle_text_coords_for_schedule()
        text_coords2 = gen_circle_text_coords_for_schedule_hours()
    } else if (shapetype == 'spiral'){
        points = gen_spiral_points_for_schedule(false, 20)
        text_coords = gen_spiral_text_coords_for_schedule()
        text_coords2 = gen_spiral_text_coords_for_schedule_hours()
    }

    for (i in points) {
        path.add(points[i]);

        new_path = new Path()
        if (i < data.length) new_path.strokeColor = colormap[data[i][2]]
        new_path.strokeWidth = 10
        new_path.strokeCap = 'round'


        if (shapetype == 'line') coords = compute_line_coords(points[i], data[i][1], data[i][3], data[i][4], data[i])
        else if (shapetype == 'circle') coords = compute_circle_coords(points[i], data[i][1], data[i][3], data[i][4], data[i])
        else if (i < data.length) coords = compute_spiral_coords(points[i], data[i][1], data[i][3], data[i][4], data[i])

        for (elem in coords) new_path.add(coords[elem])

        new_path.smooth()

        schedule_paths.push(new_path)

    }

    for (i in data){
        label_array.push(gentext(text_coords[i].coords, data[i][3] + data[i][2], 'big', text_coords[i].rotation))
        schedule_smalltexts.push(gentext(text_coords2[i*2].coords, data[i][3], 'small', text_coords2[i*2].rotation))
        schedule_smalltexts.push(gentext(text_coords2[i*2 + 1].coords, data[i][4], 'small', text_coords2[i*2 + 1].rotation))
    }

    if (shapetype == 'line') add_line_weekday_names()
    else if (shapetype == 'circle') add_circle_weekday_names()
    else add_spiral_weekday_names()

    shift_strings('right', 'circle', 'schedule')

    if (shapetype == 'circle') path.closed = true
    else path.closed = false
    path.smooth()

}
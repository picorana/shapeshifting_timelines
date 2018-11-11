var data;
var width = document.getElementById('thecanvas').width
var height = document.getElementById('thecanvas').height
var padding_h = 150
var animation_duration = 50;
var last_click_frame = 0;
var cur_frame = 0;
var path;

var colors = ['#ECD078', '#D95b43', '#C02942', '#542437', '#53777A'];
var prev_color;
var new_color;

var points;
var new_points;

var line_y = 500;
var line_w = width - padding_h;
var start_radius = line_w * 0.25; 

var node_distances = [];
var datatype = 'schedule_recurrent';
var label_array = [];
var label_array2 = [];
var text_coords = [];
var text_coords2 = [];
var text_coords3 = [];
var schedule_paths = [];

var max_dates_in_history = 20;


var shift_strings = function(side, shape, datatype){

    if (datatype == 'history'){
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
                
            }
            else {
                if (side == 'right') label_array[i].content = res + str
                else label_array[i].content = str + res
            }
        }
    } else {

        var max_string_length = Math.max.apply(0, data.map(function(d){return d[2].length}))
        
        for (i in data){
            str = data[i][2].trim()
            diff = max_string_length - str.length
            res = ''
            for (var j = 0; j<diff; j++) res += ' '
            
            if (shape == 'circle'){
                if (i < data.length / 2) label_array[i].content = str + res
                else label_array[i].content = res + str
                
            }
            else {
                if (side == 'right') label_array[i].content = res + str
                else label_array[i].content = str + res 
            }
        }
    }
}


// generates the positions of all the points on a line
var gen_line_points = function(){
   var cur_points = [];
   var space_between_points = parseInt(line_w / data.length)
   
   //for (i in data) cur_points.push(new Point(padding_h/2 + node_distances[i] * 20, line_y))
   for (i in data) cur_points.push(new Point(padding_h/2 + i*space_between_points, line_y))

   return cur_points;
}


var gen_line_text_coords = function(offset, second_set){
   var cur_points = [];
   if (offset == undefined) offset = -50
   var space_between_points = parseInt(line_w / data.length)

    if (datatype == 'moon'){
       for (i in data) {
           cur_points.push({
               coords: new Point(padding_h/2 + i*space_between_points, line_y + offset - 50),
           rotation: 45
        })
       }
    } else if (datatype == 'history'){
       for (i in data) {
           cur_points.push({
               coords: new Point(padding_h/2 + i*space_between_points - (!second_set? 120 : 0), line_y + offset),
           rotation: 45
        })
       }
    
    } else {
        for (i in data) {
           cur_points.push({
               coords: new Point(padding_h/2 + i*space_between_points, line_y + offset),
           rotation: 45
        })
       }
    }
  

   return cur_points;
}


// generates the positions of all the points on a circle
var gen_circle_points = function(){
    var cur_points = []
    var radius = start_radius;

    for (i in data) cur_points.push(
        new Point(
            width/2 + Math.cos( - Math.PI/2 + 2 * Math.PI * i / data.length)*radius, 
            height/2 + Math.sin( - Math.PI/2 + 2 * Math.PI * i / data.length)*radius 
            ))

    return cur_points
}


var gen_circle_text_coords = function (radius, second_set) {
    var cur_points = []

    if (radius == undefined) radius = start_radius + 160;
    if (!second_set && datatype == 'history') shift_strings('left', 'circle')

    for (i in data) cur_points.push(
        { 
            coords: new Point(
                width/2 + Math.cos(-Math.PI/2 + 2 * Math.PI * i / data.length)*radius, 
                height/2 + Math.sin(-Math.PI/2 + 2 * Math.PI * i / data.length)*radius 
                ),
            rotation:  ((i < data.length/2 ? 0 : Math.PI) - Math.PI/2 + 2 * Math.PI * i / data.length) * 180 / Math.PI
        }
    )

    return cur_points
}


// generates the positions of all the points on a spiral
var gen_spiral_points = function(){
    var cur_points = []
    var radius = start_radius + 400;
    var anglestep = 360/data.length;

    for (i in data) {
        radius = radius - 20;
        cur_points.push(
            new Point(
                width/2 + Math.cos(4 * Math.PI * i / data.length)*radius, 
                height/2 + Math.sin(4 * Math.PI * i / data.length)*radius 
                ))
    }
    return cur_points
}


var gen_spiral_text_coords = function(offset, second_set){
    var cur_points = []
    radius = start_radius + 400;
    if (offset == undefined) offset = 0

    for (i in data) {
        radius = radius - 20;
        cur_points.push({ 
                coords: new Point(
                    width/2 + Math.cos(4 * Math.PI * i / data.length)*(radius + offset), 
                    height/2 + Math.sin(4 * Math.PI * i / data.length)*(radius + offset) 
                    ),
                rotation: (((i > data.length/4 && i<data.length*0.5) ? 0 : Math.PI) + 4 * Math.PI * i / data.length) * 180 / Math.PI
            })
    }
    
    return cur_points
}


var draw_circle = function(){
    document.getElementById('line_btn').style.backgroundColor = 'white'
    document.getElementById('spiral_btn').style.backgroundColor = 'white'
    document.getElementById('circle_btn').style.backgroundColor = 'gray'
    last_click_frame = cur_frame;
    new_color = colors[parseInt(Math.random()*colors.length)]
    new_points = gen_circle_points()
    text_coords = gen_circle_text_coords(undefined, false)
    if (datatype == 'history') text_coords2 = gen_circle_text_coords(start_radius - 50, true)
    if (datatype == 'moon') text_coords2 = gen_circle_text_coords(start_radius + 80, true)
    path.closed = true
}


var draw_line = function(){
    document.getElementById('line_btn').style.backgroundColor = 'gray'
    document.getElementById('spiral_btn').style.backgroundColor = 'white'
    document.getElementById('circle_btn').style.backgroundColor = 'white'
    last_click_frame = cur_frame;         
    new_color = colors[parseInt(Math.random()*colors.length)]
    new_points = gen_line_points()
    text_coords = gen_line_text_coords(-100, false)
    if (datatype == 'history') text_coords2 = gen_line_text_coords(70, true)
    path.closed = false
}

var draw_spiral = function(){
    document.getElementById('line_btn').style.backgroundColor = 'white'
    document.getElementById('spiral_btn').style.backgroundColor = 'gray'
    document.getElementById('circle_btn').style.backgroundColor = 'white'
    last_click_frame = cur_frame;            
    new_color = colors[parseInt(Math.random()*colors.length)]
    new_points = gen_spiral_points()
    text_coords = gen_spiral_text_coords(120)
    if (datatype == 'history') text_coords2 = gen_spiral_text_coords( - 50, true)
    path.closed = false
}

var draw_history = function(){
    datatype = 'history';
    init()
}

var draw_moon = function(){
    datatype = 'moon';
    init()
}

var draw_schedule = function(){
    datatype = 'schedule';
    init()
}


var compute_date_diff = function(date1, date2){
    var date1 = new Date(date1);
    var date2 = new Date(date2);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    return diffDays;
}


var compute_event_start_end = function(h_start, h_end, dataline){
    var date_diff = compute_date_diff(data[0][1], data[data.length - 1][1]) + 1
    var this_date_x = line_w * compute_date_diff(dataline[1], data[0][1]) / date_diff
    var hour_start = h_start.split(':')[0] + h_start.split(':')[1]
    var this_event_x = this_date_x + hour_start * (line_w/date_diff) / 2400
    var hour_end = h_end.split(':')[0] + h_end.split(':')[1]
    if (dataline[2] == 'Sleep') hour_end = parseInt(hour_start) + parseInt(hour_end)

    var this_event_x2 = this_date_x + hour_end * (line_w/date_diff) / 2400 + 0.1

    return [this_event_x, this_event_x2]
}


var compute_line_coords = function(point, day, h_start, h_end, dataline){
    var v_offset = 50
    var cur_points = [];
    var event_boundaries = compute_event_start_end(h_start, h_end, dataline)

    cur_points.push(new Point(padding_h/2 + event_boundaries[0], point.y + 10 - v_offset))
    cur_points.push(new Point(padding_h/2 + event_boundaries[1], point.y + 10 - v_offset))
    return cur_points
}


var gen_line_text_coords_for_schedule_hours = function(){
    cur_points = [];
    for (i in data){
        var event_boundaries = compute_event_start_end(data[i][3], data[i][4], data[i])
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


var gen_text_coords_for_schedule = function(){
    var cur_points = [];

    for (i in data) {
        var event_boundaries = compute_event_start_end(data[i][3], data[i][4], data[i])
        var this_x = (event_boundaries[0] + event_boundaries[1])*0.5

        cur_points.push({
           coords: new Point(padding_h/2 + this_x, line_y - 160),
           rotation: 90
        })
    }

    return cur_points
}


var draw = function(){

    // cleanup
    if (path != undefined) path.remove()
    for (i in label_array) label_array[i].remove()
    for (i in label_array2) label_array2[i].remove()

    label_array = []
    label_array2 = []
    text_coords = []
    text_coords2 = []

    prev_color = colors[parseInt(Math.random()*colors.length)];
    new_color = colors[parseInt(Math.random()*colors.length)];

    path = new Path();
    path.strokeColor = prev_color 
    path.strokeWidth = 30;
    path.strokeCap = 'round';
    
    if (datatype == 'history'){
        var maxdistance = data[data.length - 1][0] - data[0][0]
        for (var i = 0; i < data.length; i++){
            node_distances.push((data[i][0] - data[0][0]))
        }
    }

    points = gen_line_points()
    text_coords = gen_text_coords_for_schedule()
    if (datatype == 'schedule_recurrent') text_coords2 = gen_line_text_coords_for_schedule_hours()
    if (datatype == 'history') text_coords2 = gen_line_text_coords(40, true)
    
    for (i in points) {
        path.add(points[i]);
       
        if (datatype == 'moon'){
            img = new Raster({
                source: 'res/' + i%8 + '.png',
                position: new Point(points[i].x, points[i].y - 70)
            })
            img.scale(0.08)
            label_array.push(img)

            text = new PointText(text_coords[i].coords);
            text.style.justification = 'center';
            text.fillColor = 'black';
            text.fontFamily = 'monospace'
            text.fontSize = 18

            label_array2.push(text)
            
            text.content = data[i][1] + '\n' + data[i][2];

        } else if (datatype == 'history'){
            text = new PointText(text_coords[i].coords);
            text.style.justification = 'center';
            text.fillColor = 'black';
            text.fontFamily = 'monospace'
            text.fontSize = 19

            label_array.push(text)
            
            text.content = data[i][1];
            text.rotation = text_coords[i].rotation

            text = new PointText(text_coords2[i].coords);
            text.justification = 'center';
            text.fillColor = 'black';
            text.fontSize = 16
            text.style.fontWeight = 'bold'

            text.content = data[i][0];
            text.rotation = text_coords2[i].rotation

            label_array2.push(text)
        } else if (datatype == 'schedule_non_recurrent' || datatype == 'schedule_recurrent'){

            new_path = new Path()
            new_path.strokeColor = colors[parseInt(Math.random() * colors.length)]
            new_path.strokeWidth = 20
            new_path.strokeCap = 'round'

            coords = compute_line_coords(points[i], data[i][1], data[i][3], data[i][4], data[i])

            for (elem in coords) new_path.add(coords[elem])

            schedule_paths.push(new_path)

            text = new PointText(text_coords[i].coords);
            text.style.justification = 'center';
            text.fillColor = 'black';
            text.fontFamily = 'monospace'
            text.fontSize = 18

            label_array.push(text)
            
            text.content = data[i][3] + data[i][2];
            text.rotation = text_coords[i].rotation

            text = new PointText(text_coords2[i*2].coords);
            text.style.justification = 'center';
            text.fillColor = 'black';
            text.fontFamily = 'monospace'
            text.fontSize = 12

            text.content = data[i][3]
            text.rotation = text_coords2[i*2].rotation

            text = new PointText(text_coords2[i*2 + 1].coords);
            text.style.justification = 'center';
            text.fillColor = 'black';
            text.fontFamily = 'monospace'
            text.fontSize = 12

            text.content = data[i][4]
            text.rotation = text_coords2[i*2 + 1].rotation
        }
    }
    
    shift_strings('right', 'line', 'schedule')

    path.smooth()
    path.closed = false
}


var easeColor = function(prev_color, new_color, anim_percent){
    prev_rgb = new Color(prev_color)
    new_rgb = new Color(new_color)
    
    var x_r = (new_rgb.red - prev_rgb.red) * anim_percent;
    var x_g = (new_rgb.green - prev_rgb.green) * anim_percent;
    var x_b = (new_rgb.blue - prev_rgb.blue) * anim_percent;

    return new Color(prev_rgb.red + x_r, prev_rgb.green + x_g, prev_rgb.blue + x_b)
}


var handle_animation_done = function(){
    for (var i = 0; i < data.length; i++){
        var segment = path.segments[i];
        segment.point.x =  new_points[i].x
        segment.point.y =  new_points[i].y
    }
    points = new_points;
    path.smooth()
}


var move_labels = function(){
    for (i in label_array){
        label_array[i].position = text_coords[i].coords
        label_array[i].rotation = text_coords[i].rotation
        if (text_coords2 != undefined && text_coords2.length > 0){
            label_array2[i].position = text_coords2[i].coords
            label_array2[i].rotation = text_coords2[i].rotation
        }
    }
}


var onFrame = function(event) {
    cur_frame += 1;
    if (cur_frame - last_click_frame > animation_duration) {
        prev_color = new_color;
        return;
    }
    if (cur_frame < animation_duration + 1) return;
    
    var anim_percent = (cur_frame - last_click_frame)/animation_duration
    path.strokeColor = easeColor(prev_color, new_color, anim_percent)

    for (i in label_array){
        if (anim_percent < 0.5) {
            if (datatype == 'moon') label_array[i].opacity = label_array[i].opacity - 0.1 
            else label_array[i].fillColor.alpha = - anim_percent * 2
        }
        else if (anim_percent == 0.5) move_labels()
        else {
            if (datatype == 'moon') {}//label_array[i].opacity = anim_percent*2 - 0.5
            else label_array[i].fillColor.alpha = anim_percent*2 - 0.5
        }
    }
    
    for (i in label_array2){
        if (anim_percent < 0.5) {
            label_array2[i].fillColor.alpha = - anim_percent * 2
        }
        else if (anim_percent == 0.5) move_labels()
        else {
            label_array2[i].fillColor.alpha = anim_percent*2 - 0.5
        }
    }

    for (var i = 0; i < data.length; i++){
        var segment = path.segments[i];
        segment.point.y = segment.point.y + (new_points[i].y - segment.point.y)*anim_percent;
        segment.point.x = segment.point.x + (new_points[i].x - segment.point.x)*anim_percent;
    }
   
    path.smooth()

    if (cur_frame - last_click_frame == animation_duration) handle_animation_done()

}


var load_history = function(){
    Papa.parse('data/history.csv', {
        download: true,
        dynamicTyping: true,
        complete: function(results) {
            data = results.data.splice(1, results.data.length);
            if (max_dates_in_history != undefined && max_dates_in_history != 0){
                data = data.splice(0, max_dates_in_history)
            }
            
            if (true){
                start_date = 900
                interval_value = 10
                cur_date = start_date
                end_date = Math.ceil(Math.max.apply(0, data.map(function(d){return d[0]}))/100) * 100
                while (cur_date <= end_date){
                    if (! data.some(function(d){return d[0] == cur_date})) 
                        data.splice(data.indexOf(data.find(function(d){return d[0] > cur_date})), 0, [cur_date, ''])
                    cur_date += interval_value
                }
            }
            
            draw()
        }
    })
}

var load_schedule_recurrent = function(){
    Papa.parse('data/scheduler.csv', {
        download: true,
        dynamicTyping: true,
        complete: function(results) {
            data = results.data.splice(1, results.data.length);

            // fixed data formatting
            for (i in data){
                data[i][1] = data[i][1].split('/')[1] + '/' + data[i][1].split('/')[0] + '/2018'
            }
            if (true){ data = data.splice(0, 16)}
            data = data.filter(function(d){return d[2] != 'Wake up'})
            //if (true){ data = data.splice(0, 30)}
            console.log(data)

            draw()
        }
    })
}


var load_schedule_non_recurrent = function(){
    Papa.parse('data/schedulenr.csv', {
        download: true,
        dynamicTyping: true,
        complete: function(results) {
            data = results.data.splice(1, results.data.length);
            console.log(data)
            //if (true){
                //start_date = 900
                //interval_value = 10
                //cur_date = start_date
                //end_date = Math.ceil(Math.max.apply(0, data.map(function(d){return d[0]}))/100) * 100
                //while (cur_date <= end_date){
                    //if (! data.some(function(d){return d[0] == cur_date})) 
                        //data.splice(data.indexOf(data.find(function(d){return d[0] > cur_date})), 0, [cur_date, ''])
                    //cur_date += interval_value
                //}
            //}
            
            //console.log(data)
            draw()
        }
    })
}


var load_moon = function(){
    data = [
        ['u1F311', 'new\nmoon', '09/09'],
        ['u1F312', 'waxing\ncrescent', '09/13'],
        ['u1F313', 'first\nquarter', '09/16'],
        ['u1F314', 'waxing\ngibbous', '09/20'],
        ['u1F315', 'full\nmoon', '09/24'],
        ['u1F316', 'waning\ngibbous', '09/28'],
        ['u1F317', 'last\nquarter', '10/02'],
        ['u1F318', 'waning\ncrescent', '10/05'],
        ['u1F311', 'new\nmoon', '10/08'],
        ['u1F312', 'waxing\ncrescent', '10/12'],
        ['u1F313', 'first\nquarter', '10/16'],
        ['u1F314', 'waxing\ngibbous', '10/20'],
        ['u1F315', 'full\nmoon', '10/24'],
        ['u1F316', 'waning\ngibbous', '10/28'],
        ['u1F317', 'last\nquarter', '10/31'],
        ['u1F318', 'waning\ncrescent', '11/03']
    ]

    draw()
}


var init = function(){

    var path = null;
    switch (datatype){
        case 'history':
            console.log('loading history')
            load_history(); 
            break;
        case 'moon':
            load_moon(); break;
        case 'schedule_recurrent' : load_schedule_recurrent(); break;
        case 'schedule_non_recurrent' : load_schedule_non_recurrent(); break;
        default         : load_history(); break;
    }

}

document.getElementById('circle_btn').onclick = draw_circle
document.getElementById('line_btn').onclick = draw_line
document.getElementById('spiral_btn').onclick = draw_spiral
document.getElementById('history_btn').onclick = draw_history
document.getElementById('moon_btn').onclick = draw_moon
document.getElementById('schedule_btn').onclick = draw_schedule
init()

var data;
var canvas = document.getElementById('thecanvas'); 
var width = canvas.width
var height = canvas.height
var animation_duration = 50;
var last_click_frame = 0;
var cur_frame = 0;
var path;

var colors = ['#ECD078', '#D95b43', '#C02942', '#542437', '#53777A'];
var prev_color;
var new_color;

var points;
var new_points;

var node_distances = [];
var datatype = 'schedule_recurrent';
var shapetype = 'spiral';
var label_array = [];
var label_array2 = [];
var label_array3 = [];
var text_coords = [];
var text_coords2 = [];
var text_coords3 = [];
var schedule_paths_coords = [];
var schedule_paths = [];
var schedule_smalltexts = [];
var new_schedule_paths = [];

var colormap = {}

var line_y, line_w, start_radius, big_text_font_size, big_line_stroke_size, small_text_font_size, small_lines_stroke_size, padding_h = 0;
var radius_decrease_rate = 70;

// set parameters according to screen resolution
if (window.screen.availWidth > 3000){
	line_y = height/2 - 170;
	line_w = width - padding_h;
	start_radius = line_w * 0.13; 

	big_text_font_size = 20;
	small_text_font_size = 15;
	big_line_stroke_size = 30;
	small_lines_stroke_size = 15;

	padding_h = 500;
} else {
	line_y = height/2 - 50;
	line_w = width - padding_h;
	start_radius = line_w * 0.15; 

	big_text_font_size = 18;
	small_text_font_size = 15;
	big_line_stroke_size = 30;
	small_lines_stroke_size = 15;

	padding_h = 200;
}


var shift_strings = function(side, shape, datatype){

    if (datatype == 'history') shift_strings_history(side, shape, datatype)
    else {
        var max_string_length = Math.max.apply(0, data.map(function(d){return d[2].length}))
        
        for (i in data){
            str = data[i][2].trim()
            diff = max_string_length - str.length
            res = ''
            for (var j = 0; j<diff; j++) res += ' '

            if (datatype == 'schedule'){
                var event_boundaries = compute_event_start_end(data[i])
                var d_factor = compute_total_schedule_length()
                
                if ((event_boundaries[0] + event_boundaries[1])*0.5 > d_factor * 0.5) label_array[i].content = res + str
                else label_array[i].content = str + res

            }
            else if (shape == 'circle'){
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
   var space_between_points = Math.round(line_w / data.length)

   for (var i in data) cur_points.push(new Point(padding_h/2 + i*space_between_points, line_y))

   return cur_points;
}


var gen_line_text_coords = function(offset, second_set, proportional){
   var cur_points = [];
   if (offset == undefined) offset = -50
   var space_between_points = parseInt(line_w / data.length)

    if (datatype == 'moon'){
       for (i in data) {
           cur_points.push({
               coords: new Point(padding_h/2 + i*space_between_points, line_y + offset - 50),
           rotation: 0
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

    for (var i in data) cur_points.push(
        new Point(
            width/2 + Math.cos( - Math.PI/2 + 2 * Math.PI * i / data.length)*radius, 
            height/2 + Math.sin( - Math.PI/2 + 2 * Math.PI * i / data.length)*radius 
            ))

    return cur_points
}


var gen_circle_text_coords = function (radius, second_set, proportional) {
    var cur_points = []

    if (radius == undefined) radius = start_radius + 160;
    if (!second_set && datatype == 'history') shift_strings('left', 'circle', 'history')



    for (i in data) {

        if (proportional){

            var min_date = Math.min.apply(0, data.map(function(d){return d[0]}))
            var max_date = Math.max.apply(0, data.map(function(d){return d[0]}))
            var date_diff = max_date - min_date + 10
            var this_x = data.length*(data[i][0] - min_date)/date_diff

            cur_points.push({ 

            coords: new Point(
                width/2 + Math.cos(-Math.PI/2 + 2 * Math.PI * this_x / data.length)*radius, 
                height/2 + Math.sin(-Math.PI/2 + 2 * Math.PI * this_x / data.length)*radius 
                ),
            rotation:  ((i < data.length/2 ? 0 : Math.PI) - Math.PI/2 + 2 * Math.PI * this_x / data.length) * 180 / Math.PI
            })
        }
        else {
            cur_points.push({ 

            coords: new Point(
                width/2 + Math.cos(-Math.PI/2 + 2 * Math.PI * i / data.length)*radius, 
                height/2 + Math.sin(-Math.PI/2 + 2 * Math.PI * i / data.length)*radius 
                ),
            rotation:  ((i < data.length/2 ? 0 : Math.PI) - Math.PI/2 + 2 * Math.PI * i / data.length) * 180 / Math.PI
            })
        }


}

    return cur_points
}


// generates the positions of all the points on a spiral
var gen_spiral_points = function(proportional, radius_decrease_rate){
    var cur_points = []
    var radius = start_radius + 400;
    var anglestep = 360/data.length;
    if (proportional == undefined) proportional = false
    if (radius_decrease_rate == undefined) radius_decrease_rate = 40;

    for (i in data) {
        radius = radius - radius_decrease_rate;
        if (proportional){

            var min_date = Math.min.apply(0, data.map(function(d){return d[0]}))
            var max_date = Math.max.apply(0, data.map(function(d){return d[0]}))
            var date_diff = max_date - min_date + 10
            var this_x = data.length*(data[i][0] - min_date)/date_diff

            cur_points.push(
            new Point(
                width/2 + Math.cos(4 * Math.PI * this_x / data.length)*radius, 
                line_y + Math.sin(4 * Math.PI * this_x / data.length)*radius 
                ))
        } else {
            cur_points.push(
            new Point(
                width/2 + Math.cos(4 * Math.PI * i / data.length)*radius, 
                line_y + Math.sin(4 * Math.PI * i / data.length)*radius 
                ))    
        }
        
    }
    return cur_points
}


var gen_spiral_text_coords = function(offset, proportional){
    var cur_points = []
    radius = start_radius + 400;
    if (proportional == undefined) proportional = false
    if (offset == undefined) offset = 0

    for (var i in data) {

        var min_date = Math.min.apply(0, data.map(function(d){return d[0]}))
        var max_date = Math.max.apply(0, data.map(function(d){return d[0]}))
        var date_diff = max_date - min_date + 10
        var this_x = data.length*(data[i][0] - min_date)/date_diff

        if (proportional === true){

            if (i !== 0) radius = radius - 40*(data[i][0] - data[i-1][0])/(date_diff/data.length);
            else raidus = radius - 40

            cur_points.push({ 
                coords: new Point(
                    width/2 + Math.cos(4 * Math.PI * this_x / data.length)*(radius + offset), 
                    line_y + Math.sin(4 * Math.PI * this_x / data.length)*(radius + offset) 
                    ),
                rotation: (4 * Math.PI * this_x / data.length) * 180 / Math.PI
            })
        } else {

            radius = radius - 40;

            cur_points.push({ 
                coords: new Point(
                    width/2 + Math.cos(4 * Math.PI * i / data.length)*(radius + offset), 
                    line_y + Math.sin(4 * Math.PI * i / data.length)*(radius + offset) 
                    ),
                rotation: (((i > data.length/4 && i<data.length*0.5) ? 0 : Math.PI) + 4 * Math.PI * i / data.length) * 180 / Math.PI
            })
        } 
        
        
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
    text_coords = gen_circle_text_coords(start_radius + 200, false)
    if (datatype == 'history') {
        text_coords = gen_circle_text_coords(start_radius + 180, false, true)
        text_coords2 = gen_circle_text_coords(start_radius - 50, true, true)
    }
    else if (datatype == 'moon') text_coords2 = gen_circle_text_coords(start_radius + 80, true)
    else if (datatype == 'schedule_recurrent'){
        new_points = gen_circle_points()
        text_coords = gen_circle_text_coords_for_schedule(720)
        text_coords2 = gen_circle_text_coords_for_schedule_hours(10)
        text_coords3 = gen_circle_text_coords_for_schedule(start_radius - 60, true)
        new_schedule_paths = gen_schedule_paths(points, 'circle')
        shift_strings_schedule();
    }
    path.closed = true
    path.smooth()
}


var draw_line = function(){
    document.getElementById('line_btn').style.backgroundColor = 'gray'
    document.getElementById('spiral_btn').style.backgroundColor = 'white'
    document.getElementById('circle_btn').style.backgroundColor = 'white'
    last_click_frame = cur_frame;         
    new_color = colors[parseInt(Math.random()*colors.length)]
    new_points = gen_line_points()
    text_coords = gen_line_text_coords(-100, false)
    if (datatype == 'history') {
    	text_coords = gen_line_text_coords_for_history(-100, false, true)
    	text_coords2 = gen_line_text_coords_for_history(30, true, true)
    	shift_strings_history('right')
    }
    if (datatype == 'moon') text_coords2 = gen_line_text_coords(-40, true)
    if (datatype == 'schedule_recurrent') {
        text_coords = gen_line_text_coords_for_schedule(-260, 1)
        text_coords3 = gen_line_text_coords_for_schedule(60)
        for (var item in text_coords3) text_coords3[item].rotation += 90
        text_coords2 = gen_line_text_coords_for_schedule(-80, 2)
        new_schedule_paths = gen_schedule_paths(new_points, 'line')
    }
    path.closed = false
}

var draw_spiral = function(){
    document.getElementById('line_btn').style.backgroundColor = 'white'
    document.getElementById('spiral_btn').style.backgroundColor = 'gray'
    document.getElementById('circle_btn').style.backgroundColor = 'white'
    last_click_frame = cur_frame;            
    new_color = colors[parseInt(Math.random()*colors.length, 10)]
    new_points = gen_spiral_points()
    text_coords = gen_spiral_text_coords(140)
    if (datatype == 'history') {
        new_points = gen_spiral_points()
        text_coords = gen_spiral_text_coords(140, true)
        text_coords2 = gen_spiral_text_coords(-80, true)
        shift_strings('whatever', 'spiral', 'history')
    }
    else if (datatype == 'moon'){
        text_coords2 = gen_spiral_text_coords(60)
    } else if (datatype == 'schedule_recurrent'){
        new_points = gen_spiral_points_for_schedule(false, 60)
        text_coords = gen_spiral_text_coords_for_schedule(undefined, 120)
        text_coords2 = gen_spiral_text_coords_for_schedule_hours()
        text_coords3 = gen_spiral_text_coords_for_schedule(start_radius, - 50, true)
        new_schedule_paths = gen_schedule_paths(points, 'spiral')
        //shift_strings_schedule();
    }
    path.closed = false
    path.smooth()
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
    datatype = 'schedule_recurrent';
    init()
}


var cleanup = function(){
    if (path != undefined) path.remove()
    for (var i in label_array) label_array[i].remove()
    for (var i in label_array2) label_array2[i].remove()
    for (var i in label_array3) label_array3[i].remove()
    for (var i in schedule_paths) schedule_paths[i].remove()
    for (var i in schedule_smalltexts) schedule_smalltexts[i].remove()


    label_array = []
    label_array2 = []
    label_array3 = []
    text_coords = []
    text_coords2 = []
    schedule_paths = []
    schedule_smalltexts = []
}


var init_general_resources = function(){
    prev_color = colors[parseInt(Math.random()*colors.length, 10)];
    new_color = colors[parseInt(Math.random()*colors.length, 10)];

    path = new Path();
    path.strokeColor = prev_color 
    path.strokeWidth = big_line_stroke_size;
    path.strokeCap = 'round';
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
        
        if (label_array[i].rotation % 360 > 90 && label_array[i].rotation % 360 < 270) label_array[i].rotation += 180
    }

    for (i in label_array2){
	    label_array2[i].position = text_coords2[i].coords
        label_array2[i].rotation = text_coords2[i].rotation

        if (label_array2[i].rotation % 360 > 90 && label_array2[i].rotation % 360 < 270) label_array2[i].rotation += 180
    }

    for (i in label_array3){
        label_array3[i].position = text_coords3[i].coords
        label_array3[i].rotation = text_coords3[i].rotation

        if (label_array3[i].rotation % 360 > 90 && label_array3[i].rotation % 360 < 270) label_array3[i].rotation += 180
    }

    for (i in schedule_smalltexts){
   		schedule_smalltexts[i].position = text_coords2[i].coords
   		schedule_smalltexts[i].rotation = text_coords2[i].rotation

   		if (schedule_smalltexts[i].rotation % 360 > 90 && schedule_smalltexts[i].rotation % 360 < 270) schedule_smalltexts[i].rotation += 180
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

    for (var i in label_array){
        if (anim_percent < 0.5) {
            if (datatype == 'moon') label_array[i].opacity = label_array[i].opacity - 0.1 
            else label_array[i].fillColor.alpha = - anim_percent * 2
        }
        else if (anim_percent === 0.5) move_labels()
        else {
            if (datatype == 'moon') {}//label_array[i].opacity = anim_percent*2 - 0.5
            else label_array[i].fillColor.alpha = anim_percent*2 - 0.5
        }
    }
    
    if (label_array2 != undefined){
        for (var i in label_array2){
            if (anim_percent < 0.5) {
                label_array2[i].fillColor.alpha = - anim_percent * 2
            }
            else if (anim_percent === 0.5) move_labels()
            else {
                label_array2[i].fillColor.alpha = anim_percent*2 - 0.5
            }
        }
    }

    if (label_array3 != undefined){
        for (var i in label_array3){
            if (anim_percent < 0.5) {
                label_array3[i].fillColor.alpha = - anim_percent * 2
            }
            else if (anim_percent === 0.5) move_labels()
            else {
                label_array3[i].fillColor.alpha = anim_percent*2 - 0.5
            }
        }
    }

    if (schedule_smalltexts != undefined){
        for (var i in schedule_smalltexts){
            //if (label_array2[i] == undefined) break
            if (anim_percent < 0.5) {
                schedule_smalltexts[i].fillColor.alpha = - anim_percent * 2
            }
            else if (anim_percent === 0.5) move_labels()
            else {
                schedule_smalltexts[i].fillColor.alpha = anim_percent*2 - 0.5
            }
        }
    }

    for (var i = 0; i < data.length; i++){
        var segment = path.segments[i];
        segment.point.y = segment.point.y + (new_points[i].y - segment.point.y)*anim_percent;
        segment.point.x = segment.point.x + (new_points[i].x - segment.point.x)*anim_percent;
    }

    if (schedule_paths != undefined && new_schedule_paths != undefined){
        for (var i in schedule_paths){
            for (var j in schedule_paths[i].segments){
                var segment = schedule_paths[i].segments[j];
                segment.point.y = segment.point.y + (new_schedule_paths[i][j].y - segment.point.y)*anim_percent;
                segment.point.x = segment.point.x + (new_schedule_paths[i][j].x - segment.point.x)*anim_percent;
            }
            schedule_paths[i].smooth()
        }
    }
   
    path.smooth()

    if (cur_frame - last_click_frame == animation_duration) handle_animation_done()

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


var load_schedule_recurrent = function(){
    Papa.parse('data/scheduler.csv', {
        download: true,
        dynamicTyping: true,
        complete: function(results) {
            // remove first line of csv
            data = results.data.splice(1, results.data.length);

            // fix date formatting
            data = fix_date_formatting(data)

            //remove wake up event
            data = data.filter(function(d){return d[2] != 'Wake up'})

            // generate colormap to have the colors fixed for each event
            colormap = generate_colormap(data, colors)

            // limit amount of data
            data = data.splice(0, 14)

            init_schedule_elements()
        }
    })
}


document.getElementById('circle_btn').onclick = draw_circle
document.getElementById('line_btn').onclick = draw_line
document.getElementById('spiral_btn').onclick = draw_spiral
document.getElementById('history_btn').onclick = draw_history
document.getElementById('moon_btn').onclick = draw_moon
document.getElementById('schedule_btn').onclick = draw_schedule
document.getElementById('screenshot_btn').onclick = function(){console.log('taking screenshot'); document.write('<img src="'+canvas.toDataURL('png')+'"/>');}
init()

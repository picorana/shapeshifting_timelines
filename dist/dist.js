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
var data;
var width = document.getElementById('thecanvas').width
var height = document.getElementById('thecanvas').height
var padding_h = 500
var animation_duration = 50;
var last_click_frame = 0;
var cur_frame = 0;
var path;

var big_text_font_size = 16;
var small_text_font_size = 14;

var colors = ['#ECD078', '#D95b43', '#C02942', '#542437', '#53777A'];
var prev_color;
var new_color;

var points;
var new_points;

var line_y = height/2 - 180;
var line_w = width - padding_h;
// start radius was line_w * 0.15 on 4k display
var start_radius = line_w * 0.10; 

var node_distances = [];
var datatype = 'schedule_recurrent';
var shapetype = 'spiral';
var label_array = [];
var label_array2 = [];
var text_coords = [];
var text_coords2 = [];
var text_coords3 = [];
var schedule_paths = [];
var schedule_smalltexts = [];

var max_dates_in_history = 20;
var colormap = {}


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
   var space_between_points = parseInt(line_w / data.length)
   
   //for (i in data) cur_points.push(new Point(padding_h/2 + node_distances[i] * 20, line_y))
   for (i in data) cur_points.push(new Point(padding_h/2 + i*space_between_points, line_y))

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
    } else if (datatype == 'history'){
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
            for (i in data) {
                cur_points.push({
                    coords: new Point(padding_h/2 + i*space_between_points, line_y + offset),
                rotation: 45
                })
            }
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


var gen_spiral_text_coords = function(offset, second_set, proportional){
    var cur_points = []
    radius = start_radius + 400;
    if (proportional == undefined) proportional = false
    if (offset == undefined) offset = 0

    for (i in data) {

        var min_date = Math.min.apply(0, data.map(function(d){return d[0]}))
        var max_date = Math.max.apply(0, data.map(function(d){return d[0]}))
        var date_diff = max_date - min_date + 10
        var this_x = data.length*(data[i][0] - min_date)/date_diff

        if (proportional){

            if (i != 0) radius = radius - 40*(data[i][0] - data[i-1][0])/(date_diff/data.length);
            else raidus = radius - 40

            cur_points.push({ 
                coords: new Point(
                    width/2 + Math.cos(4 * Math.PI * this_x / data.length)*(radius + offset), 
                    line_y + Math.sin(4 * Math.PI * this_x / data.length)*(radius + offset) 
                    ),
                rotation: (((i > data.length/4 && i<data.length*0.5) ? 0 : Math.PI) + 4 * Math.PI * this_x / data.length) * 180 / Math.PI
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
    text_coords = gen_circle_text_coords(undefined, false)
    if (datatype == 'history') {
        text_coords = gen_circle_text_coords(undefined, false, true)
        text_coords2 = gen_circle_text_coords(start_radius - 50, true, true)
    }
    else if (datatype == 'moon') text_coords2 = gen_circle_text_coords(start_radius + 80, true)
    else if (datatype == 'schedule_recurrent'){
        // not working
        text_coords = gen_circle_text_coords_for_schedule()
        text_coords2 = gen_circle_text_coords_for_schedule_hours()
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
    if (datatype == 'history') text_coords2 = gen_line_text_coords(70, true)
    if (datatype == 'moon') text_coords2 = gen_line_text_coords(-40, true)
    path.closed = false
}

var draw_spiral = function(){
    document.getElementById('line_btn').style.backgroundColor = 'white'
    document.getElementById('spiral_btn').style.backgroundColor = 'gray'
    document.getElementById('circle_btn').style.backgroundColor = 'white'
    last_click_frame = cur_frame;            
    new_color = colors[parseInt(Math.random()*colors.length)]
    new_points = gen_spiral_points()
    text_coords = gen_spiral_text_coords(140)
    if (datatype == 'history') {
        new_points = gen_spiral_points()
        text_coords = gen_spiral_text_coords(100, false, true)
        text_coords2 = gen_spiral_text_coords( - 80, true, true)
        shift_strings('whatever', 'spiral', 'history')
    }
    else if (datatype == 'moon'){
        text_coords2 = gen_spiral_text_coords(60)
    } else if (datatype == 'schedule_recurrent'){

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
    for (i in label_array) label_array[i].remove()
    for (i in label_array2) label_array2[i].remove()
    for (i in schedule_paths) schedule_paths[i].remove()
    for (i in schedule_smalltexts) schedule_smalltexts[i].remove()


    label_array = []
    label_array2 = []
    text_coords = []
    text_coords2 = []
}


var init_general_resources = function(){
    prev_color = colors[parseInt(Math.random()*colors.length)];
    new_color = colors[parseInt(Math.random()*colors.length)];

    path = new Path();
    path.strokeColor = prev_color 
    path.strokeWidth = 20;
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

        if (text_coords2 != undefined && text_coords2.length > 0 && label_array2[i] != undefined){
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
    
    if (label_array2 != undefined){
        for (i in label_array2){
            //if (label_array2[i] == undefined) break
            if (anim_percent < 0.5) {
                label_array2[i].fillColor.alpha = - anim_percent * 2
            }
            else if (anim_percent == 0.5) move_labels()
            else {
                label_array2[i].fillColor.alpha = anim_percent*2 - 0.5
            }
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
                start_date = Math.min.apply(0, function(d){return d[0]})
                interval_value = 10
                cur_date = start_date
                end_date = Math.ceil(Math.max.apply(0, data.map(function(d){return d[0]}))/100) * 100
                while (cur_date <= end_date){
                    if (! data.some(function(d){return d[0] == cur_date})) 
                        data.splice(data.indexOf(data.find(function(d){return d[0] > cur_date})), 0, [cur_date, ''])
                    cur_date += interval_value
                }
            }
            
            init_history_elements()
        }
    })
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
            data = data.splice(0, 20)

            init_schedule_elements()
        }
    })
}


var load_schedule_non_recurrent = function(){
    Papa.parse('data/schedulenr.csv', {
        download: true,
        dynamicTyping: true,
        complete: function(results) {
            data = results.data.splice(1, results.data.length);



            init_schedule_elements()
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

    init_moon_elements()
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

var init_moon_elements = function(){
    cleanup()
    init_general_resources()

    points = gen_circle_points()
    text_coords = gen_circle_text_coords(undefined, false)
    text_coords2 = gen_circle_text_coords(start_radius + 80, true)

    for (i in points) {
        // load pictures
        path.add(points[i]);
        img = new Raster({
            source: 'res/' + i%8 + '.png',
            position: text_coords[i].coords
        })
        img.scale(0.08)
        label_array.push(img)

        // generate labels
        label_array2.push(gentext(text_coords2[i].coords, data[i][1] + '\n' + data[i][2], 'big', text_coords2[i].rotation))
    }

    path.closed = true
    path.smooth()
}
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
fix_date_formatting = function(data){
    return data.map(function(d){return [d[0], d[1].split('/')[1] + '/' + d[1].split('/')[0] + '/2018', d[2], d[3], d[4]]})
}

compute_date_diff = function(date1, date2){
    var date1 = new Date(date1);
    var date2 = new Date(date2);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    return diffDays;
}

generate_colormap = function(data, colors){
    var colormap = {}
    for (i in data){
        if (colormap[data[i][2]] == undefined) colormap[data[i][2]] = colors[i%colors.length]
    }
    return colormap
}

gentext = function(coords, content, size, rotation, weight){
    text = new PointText(coords);
    text.style.justification = 'center';
    text.fillColor = 'black';
    text.fontFamily = 'monospace'
    text.fontSize = (size == 'big'? big_text_font_size : small_text_font_size)
    text.fontWeight = weight

    text.content = content;
    text.rotation = rotation;

    return text
}

easeColor = function(prev_color, new_color, anim_percent){
    prev_rgb = new Color(prev_color)
    new_rgb = new Color(new_color)
    
    var x_r = (new_rgb.red - prev_rgb.red) * anim_percent;
    var x_g = (new_rgb.green - prev_rgb.green) * anim_percent;
    var x_b = (new_rgb.blue - prev_rgb.blue) * anim_percent;

    return new Color(prev_rgb.red + x_r, prev_rgb.green + x_g, prev_rgb.blue + x_b)
}
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
var start_radius = line_w * 0.35; 

var node_distances = [];
var datatype = 'history';
var label_array = [];
var label_array2 = [];
var text_coords = [];
var text_coords2 = [];

var max_dates_in_history = 10;


// generates the positions of all the points on a line
var gen_line_points = function(){
   var cur_points = [];
   var space_between_points = parseInt(line_w / data.length)
   
   //for (i in data) cur_points.push(new Point(padding_h/2 + node_distances[i] * 20, line_y))
   for (i in data) cur_points.push(new Point(padding_h/2 + i*space_between_points, line_y))

   return cur_points;
}


var gen_line_text_coords = function(offset){
   var cur_points = [];
   if (offset == undefined) offset = -50
   var space_between_points = parseInt(line_w / data.length)
   
   //for (i in data) cur_points.push(new Point(padding_h/2 + node_distances[i] * 20, line_y))
   for (i in data) cur_points.push({
       coords: new Point(padding_h/2 + i*space_between_points, line_y + offset),
       rotation: 45
   })

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


var gen_circle_text_coords = function (radius) {
    var cur_points = []

    if (radius == undefined) radius = start_radius + 150;

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
    var radius = start_radius;
    var anglestep = 360/data.length;

    for (i in data) {
        radius = radius - 10;
        cur_points.push(
            new Point(
                width/2 + Math.cos(4 * Math.PI * i / data.length)*radius, 
                height/2 + Math.sin(4 * Math.PI * i / data.length)*radius 
                ))
    }
    return cur_points
}


var gen_spiral_text_coords = function(){
    var cur_points = []
    var radius = start_radius;

    for (i in data) {
        radius = radius - 10;
        cur_points.push({ 
                coords: new Point(
                    width/2 + Math.cos(4 * Math.PI * i / data.length)*(radius + 40), 
                    height/2 + Math.sin(4 * Math.PI * i / data.length)*(radius + 40) 
                    ),
                rotation: (4 * Math.PI * i / data.length) * 180 / Math.PI
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
    text_coords = gen_circle_text_coords()
    if (datatype == 'history') text_coords2 = gen_circle_text_coords(start_radius - 50)
    path.closed = true
}


var draw_line = function(){
    document.getElementById('line_btn').style.backgroundColor = 'gray'
    document.getElementById('spiral_btn').style.backgroundColor = 'white'
    document.getElementById('circle_btn').style.backgroundColor = 'white'
    last_click_frame = cur_frame;         
    new_color = colors[parseInt(Math.random()*colors.length)]
    new_points = gen_line_points()
    text_coords = gen_line_text_coords(-100)
    if (datatype == 'history') text_coords2 = gen_line_text_coords(70)
    path.closed = false
}

var draw_spiral = function(){
    document.getElementById('line_btn').style.backgroundColor = 'white'
    document.getElementById('spiral_btn').style.backgroundColor = 'gray'
    document.getElementById('circle_btn').style.backgroundColor = 'white'
    last_click_frame = cur_frame;            
    new_color = colors[parseInt(Math.random()*colors.length)]
    new_points = gen_spiral_points()
    text_coords = gen_spiral_text_coords()
    if (datatype == 'history') text_coords2 = gen_spiral_text_coords(start_radius - 50)
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

var draw = function(){

    

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

    points = gen_circle_points()
    text_coords = gen_circle_text_coords()
    if (datatype == 'history') text_coords2 = gen_circle_text_coords(start_radius - 50)
    
    for (i in points) {
        path.add(points[i]);
       
        if (datatype == 'moon'){
            img = new Raster({
                source: 'res/' + i%8 + '.png',
                position: new Point(points[i].x, points[i].y - 70)
            })
            img.scale(0.08)
            label_array.push(img)
        } else if (datatype == 'history'){
            text = new PointText(text_coords[i].coords);
            text.style.justification = 'center';
            text.fillColor = 'black';
            text.fontSize = 16
           
            if (data[i][1].length > 10){
                aux_d = data[i][1].split(' ')
                aux_i = Math.ceil(aux_d.length/3)
                aux_s = ''
                for (j in aux_d) {
                    aux_s += aux_d[j] + ' '
                    if (j != 0 && j % aux_i == 0) aux_s += '\n'
                }
                data[i][1] = aux_s
            }

            label_array.push(text)
            
            text.content = data[i][1];
            text.rotation = text_coords[i].rotation

            text = new PointText(text_coords2[i].coords);
            text.justification = 'center';
            text.fillColor = 'black';
            text.fontSize = 16
            text.style.fontWeight = 'bold'
           
            if (data[i][1].length > 10){
                aux_d = data[i][1].split(' ')
                aux_i = Math.ceil(aux_d.length/3)
                aux_s = ''
                for (j in aux_d) {
                    aux_s += aux_d[j] + ' '
                    if (j != 0 && j % aux_i == 0) aux_s += '\n'
                }
                data[i][1] = aux_s
            }

            text.content = data[i][0];
            text.rotation = text_coords2[i].rotation

            label_array2.push(text)
        }
    }

    path.smooth()
    path.closed = true
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
        label_array2[i].position = text_coords2[i].coords
        label_array2[i].rotation = text_coords2[i].rotation
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
            if (datatype == 'moon') label_array2[i].opacity = label_array2[i].opacity - 0.1 
            else label_array2[i].fillColor.alpha = - anim_percent * 2
        }
        else if (anim_percent == 0.5) move_labels()
        else {
            if (datatype == 'moon') {}
            else label_array2[i].fillColor.alpha = anim_percent*2 - 0.5
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


var draw_random = function(){
    
}


var load_history = function(){
    Papa.parse('data/history.csv', {
        download: true,
        dynamicTyping: true,
        complete: function(results) {
            data = results.data.splice(1, results.data.length);
            console.log(data)
            draw()
        }
    })
}


var load_moon = function(){
    data = [
        ['u1F311'],
        ['u1F312'],
        ['u1F313'],
        ['u1F314'],
        ['u1F315'],
        ['u1F316'],
        ['u1F317'],
        ['u1F318'],
        ['u1F311'],
        ['u1F312'],
        ['u1F313'],
        ['u1F314'],
        ['u1F315'],
        ['u1F316'],
        ['u1F317'],
        ['u1F318']
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
        case 'schedule' : console.warn('function not yet implemented'); return;
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

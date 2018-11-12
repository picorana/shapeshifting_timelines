window.gen_circle_text_coords_for_schedule = function(){
    var cur_points = [];

    var radius = start_radius + 150

    for (i in data) {
        var event_boundaries = compute_event_start_end(data[i][3], data[i][4], data[i])
        var this_x = (event_boundaries[0] + event_boundaries[1])*0.5

        cur_points.push({
           coords: new Point(
                width/2 + Math.cos(2 * Math.PI * this_x / 850) * radius, 
                height/2 + Math.sin(2 * Math.PI * this_x / 850) * radius),
           rotation: (2 * Math.PI * this_x/850) * 180 / Math.PI
        })
    }

    return cur_points
}


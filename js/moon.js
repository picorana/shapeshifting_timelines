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
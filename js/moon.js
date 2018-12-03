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

var init_moon_elements = function(){
    cleanup()
    init_general_resources()

    points = gen_circle_points()
    text_coords = gen_circle_text_coords(start_radius + 100, false)
    text_coords2 = gen_circle_text_coords(start_radius + 150, true)

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
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
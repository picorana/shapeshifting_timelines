window.fix_date_formatting = function(data){
    return data.map(function(d){return [d[0], d[1].split('/')[1] + '/' + d[1].split('/')[0] + '/2018', d[2], d[3], d[4]]})
}

window.compute_date_diff = function(date1, date2){
    var date1 = new Date(date1);
    var date2 = new Date(date2);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    return diffDays;
}

window.generate_colormap = function(data, colors){
    var colormap = {}
    for (i in data){
        if (colormap[data[i][2]] == undefined) colormap[data[i][2]] = colors[i%colors.length]
    }
    return colormap
}

window.gentext = function(coords, content, size, rotation, weight){
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

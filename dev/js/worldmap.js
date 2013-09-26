/*
 * worldmap
 * https://github.com/motherjones/worldmap
 *
 * Copyright (c) 2013 Mother Jones Data Desk
 * Licensed under the MIT license.
 */
"use strict";

(function($) {
    var map_svg = $(worldmap);
    $('#worldmap').append(map_svg);

    var tooltip = jQuery('<div id="tooltip" style="display: none; position: absolute;"><p>text</p></div>');
    $('body').prepend(tooltip);

    var tooltip_template = "<h4>{thedunce}</h4> \
        <h5>{themistake}</h5> \
        <p>{whyitswrong}</p> \
        <p><a href='{source1}'>{source1}</a></p> \
    ";
    var compiled_tooltip = dust.compile(tooltip_template, 'tooltip');
    dust.loadSource(compiled_tooltip);


    var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?key=0ArKGUjhunNIudHBJVjkzMkp4X2VOUW5NU1FOelE2VFE&output=html';

    $(document).ready(function() {

            Tabletop.init( { 
                key: public_spreadsheet_url,
                callback: function(dataset) {
                    configure_worldmap(dataset);
                },
                simpleSheet: true 
            } )
    });


    var configure_worldmap = function(dataset) {
        for (var i =0; i < dataset.length; i++) {
            var data = dataset[i];

            if (!data.tooltip) { continue; }
            var dumb_shape = document.getElementById(data.tooltip)
            if (!dumb_shape) { continue; }

            if (dumb_shape) {
                dumb_shape.setAttribute('class', 'has_tooltip');
            }

            var shape = jQuery('#' + data.tooltip);
            shape.attr('fill', '#6DCDE9');

            dust.render('tooltip', data, function(err, out) {
                shape.attr('data-tooltip', out);
            });

            shape.bind('mouseout', function(){
                tooltip.css('display', 'none');
            });
            shape.bind('mousemove', function(e){
                tooltip
                    .css('left', e.pageX + 10)
                    .css('top', e.pageY + 10)
                    .css('display', 'block')
                    .html(jQuery(this).attr('data-tooltip'));
            });
            shape.click(function(e){
                console.log('click');
                for (var i =0; i < dataset.length; i++) {
                    var data = dataset[i];

                    if (!data.tooltip) { continue; }
                    var shape = $('#' + data.tooltip);
                    shape.unbind('mouseout');
                    shape.unbind('mousemove');
                }
                tooltip.css('left', e.pageX + 10)
                    .css('top', e.pageY + 10)
                    .css('display', 'block')
                    .html(jQuery(this).attr('data-tooltip'));
                
                if(e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true;
                }
                return false;
            });


        }

        $(document).click(function() {
            for (var i =0; i < dataset.length; i++) {
                var data = dataset[i];

                if (!data.tooltip) { continue; }

                var shape = $('#' + data.tooltip);

                shape.bind('mousemove', function(e){
                  tooltip.css('left', e.pageX + 10)
                    .css('top', e.pageY + 10)
                    .css('display', 'block')
                    .html($(this).attr('data-tooltip'));
                });
                shape.bind('mouseout', function(){
                  tooltip.css('display', 'none');
                });
                tooltip.css('display', 'none');
            }
        });
    };

}(jQuery));

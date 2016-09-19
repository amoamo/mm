jQuery(function($) {'use strict',
  	$(document).ready(function() {
        var tpl = {
            "category": '../templates/qa/category.mst',
            "qa": '../templates/qa/qa.mst'
        };
        var api = {
            "category": "/category",
            "qa": '/qa'
        };
        function renderCategory() {
            $.get(tpl.category, function(template) {
                $.get(api.category, function(category){
                    var rendered = Mustache.render(template, {
                        "category": category
                    });
                    $('#qa-filter').append(rendered);
                    $(".dropdown-menu li").on("click", function(){
                        var me = $(this);
                        var id = me.attr("data-id");
                        $('.dropdown-menu li').removeClass('active');
                        me.addClass('active');
                        $('.dropdown-chose').html(me.find('a').html());
                        renderQa(id);
                    });
                }, 'JSON')
            });
        }
        function renderQa(id) {
            var url = tpl.qa;
            if (id != undefined) {
                url += '/' + id;
            }
            $.get(url, function(template) {
                $.get(api.qa, function(qa){
                    var rendered = Mustache.render(template, {
                        "qa": qa
                    });
                    $('#qa-details').html(rendered);
                }, 'JSON')
            });
        }
        renderCategory();
        renderQa();
    })
});

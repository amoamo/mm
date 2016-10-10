
// 到时候为空就好了，知道了吧
//$HOST = '';
$HOST = 'http://127.0.0.1:8989';

jQuery(function($) {'use strict',
  	$(document).ready(function() {
        var tpl = {
            "category": '../templates/qa/category.mst',
            "qa": '../templates/qa/qa.mst'
        };
        var api = {
            "category": $HOST+"/category",
            "qa": $HOST+'/qa'
        };
        function initPortfolio() {
            var $portfolio_selectors = $('.portfolio-filter >li>a');
            var $portfolio = $('.portfolio-items');
            $portfolio_selectors.on('click', function(){
                $portfolio_selectors.removeClass('active');
                $(this).addClass('active');
                var selector = $(this).attr('data-filter');
                $portfolio.isotope({ filter: selector });
                return false;
            });
            $('#portfolio-items').imagesLoaded( function() {
                $portfolio.isotope({
                    //filter: '.*',
                    itemSelector : '.portfolio-item',
                    layoutMode : 'fitRows'
                });
            })
        }
        function renderCategory() {
            $.get(tpl.category, function(template) {
                $.get(api.category, function(category){
                    var rendered = Mustache.render(template, {
                        "category": category
                    });
                    $('.portfolio-filter').append(rendered);
                    renderQa('all');
                }, 'JSON')
            });
        }
        function renderQa(id) {
            $.get(tpl.qa, function(template) {
                $.get(api.qa + '/' + id, function(qa){
                    var rendered = Mustache.render(template, {
                        "qa": qa
                    });
                    $('#qa-details').html(rendered);
                    initPortfolio();
                }, 'JSON')
            });
        }
        renderCategory();
    })
});

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
                        "category": category,
                        "item": function() {
                            var me = this;
                            var item = {};
                            for(var k in me) {
                                item = me;
                                item.trimCategoryName = me.name.replace(/ /g, '');
                                return item;
                            }
                        }
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
                        "qa": qa,
                        "item": function() {
                            var me = this;
                            var item = {};
                            for(var k in me) {
                                item = me;
                                item.trimCategoryName = me.categoryName.replace(/ /g, '');
                                return item;
                            }
                        }
                    });
                    $('#qa-details').html(rendered);
                    initPortfolio();
                }, 'JSON')
            });
        }
        renderCategory();
    })
});

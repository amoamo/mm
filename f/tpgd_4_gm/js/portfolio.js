jQuery(function($) {'use strict',
	// portfolio filter
	$(window).load(function(){'use strict';
        var tpl = {
            "products": "/templates/products/products.mst",
            "category": "/templates/products/category.mst"
        };
        var api = {
            "products": "/products/all",
            "category": "/category"
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
        function renderProducts() {
            $.get(tpl.products, function(template) {
                $.get(api.products, function(products){
                    var rendered = Mustache.render(template, {
                        "products": products
                    });
                    $('#portfolio-items').html(rendered);
                    initPortfolio();
                }, 'JSON')
            });
        }
        function renderCategory() {
            $.get(tpl.category, function(template) {
                $.get(api.category, function(category){
                    var rendered = Mustache.render(template, {
                        "category": category
                    });
                    $('.portfolio-filter').append(rendered);
                    renderProducts();
                }, 'JSON')
            });
        }
        renderCategory();
	});
});

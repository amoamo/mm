jQuery(function($) {'use strict',
	// portfolio filter
	$(window).load(function(){'use strict';
        var tpl = {
            "products": "/templates/products/products.mst",
            "brand": "/templates/products/brand.mst"
        };
        var api = {
            "products": "/products/all",
            "brand": "/brand"
        };
		var $portfolio_selectors = $('.portfolio-filter >li>a');
		var $portfolio = $('.portfolio-items');
        $portfolio_selectors.on('click', function(){
            $portfolio_selectors.removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $portfolio.isotope({ filter: selector });
            return false;
        });

        function initPortfolio() {
            $('#portfolio-items').imagesLoaded( function() {
                $portfolio.isotope({
                    filter: '.products',
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
                    renderBrand();
                    initPortfolio();
                }, 'JSON')
            });
        }
        function renderBrand() {
            $.get(tpl.brand, function(template) {
                $.get(api.brand, function(brand){
                    var rendered = Mustache.render(template, {
                        "brand": brand
                    });
                    $('#portfolio-items').append(rendered);
                }, 'JSON')
            });
        }
        renderProducts();
	});
});

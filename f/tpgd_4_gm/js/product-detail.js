jQuery(function($) {'use strict',
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
  	$(document).ready(function() {
        var slideMax = 4;
        var tpl = {
            "description": '../templates/product-detail/description.mst',
            "specification": '../templates/product-detail/specification.mst',
            "qa": '../templates/product-detail/qa.mst',
            "featured": '../templates/product-detail/featured.mst'
        };
        var api = {
            "description": '/pd',
            "specification": '/ps',
            "qa": '/qa',
            "featured": '/products/feature'
        };
        var id = $.getUrlParam('id');
        function renderProductInfo() {
            $.get(tpl.description, function(template) {
                $.get(api.description + '/' + id, function(description){
                    var rendered = Mustache.render(template, description);
                    $('#description').html(rendered);
                }, 'JSON')
            });
            $.get(tpl.specification, function(template) {
                $.get(api.specification + '/' + id, function(specification){
                    var rendered = Mustache.render(template, {
                        "specification": specification,
                        "item": function() {
                            var me = this;
                            var item = {};
                            for(var k in me) {
                                item.key = k;
                                item.value = me[k];
                                return item;
                            }
                        }
                    });
                    $('#specification').html(rendered);
                }, 'JSON')
            });
            $.get(tpl.qa, function(template) {
                $.get(api.qa, function(qa){
                    var rendered = Mustache.render(template, {
                        "qa": qa
                    });
                    $('#qa').html(rendered);
                }, 'JSON')
            });
        }
        function renderFeatured() {
            $.get(tpl.featured, function(template) {
                $.get(api.featured, function(featured){
                    var data = {};
                    data.products = [];
                    var product;
                    var id;
                    var tmp = [];
                    var item = {};
                    var products = featured || [];
                    var max = parseInt(products.length / slideMax);
                    var num = 0;
                    data.slideFlag = products.length > slideMax ? true : false;
                    for(var i = 0; i <= max; i++) {
                        for (var j = 0; i * slideMax + j < products.length && j < slideMax; j++) {
                            product = products[i * slideMax + j];
                            tmp.push(product);
                        }
                        data.products.push({
                            idx: i,
                            info: tmp.concat()
                        });
                        tmp = [];
                    }
                    var rendered = Mustache.render(template, {
                        "slideFlag": data.slideFlag,
                        "slide": data.products,
                        "item": function() {
                            return this.info;
                        }
                    });
                    $('#related-pro').html(rendered);
                }, 'JSON')
            });
        }
        renderProductInfo();
        renderFeatured();
    })
});

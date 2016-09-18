jQuery(function($) {'use strict',
  	$(document).ready(function() {
        var slideMax = 4;
        var tpl = {
            "description": '../templates/product-detail/description.mst',
            "specification": '../templates/product-detail/specification.mst',
            "qa": '../templates/product-detail/qa.mst',
            "featured": '../templates/product-detail/featured.mst'
        };
        function renderProductInfo() {
            $.get(tpl.description, function(template) {
                //第一个tab
                var description = {
                    "longDescription": "long_description",
                    "brandName": "brand_name",
                    "brandImage": "brand_image"
                };
                var rendered = Mustache.render(template, description);
                $('#description').html(rendered);
            });
            $.get(tpl.specification, function(template) {
                //第二个tab
                var specification = {
                    "specification": [{"11": "value11"}, {"22": "value22"}]
                };
                var rendered = Mustache.render(template, {
                    "specification": specification.specification,
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
            });
            $.get(tpl.qa, function(template) {
                //第三个tab
                var qa = {
                    "qa": [{
                        "1": {
                            "categoryName": "category_name",
                            "question": "question_string1",
                            "answer": "answer_string1"
                        }
                    },{
                        "2": {
                            "categoryName": "category_name",
                            "question": "question_string2",
                            "answer": "answer_string2"
                        }
                    }]
                };
                var rendered = Mustache.render(template, {
                    "qa": qa.qa,
                    "item": function() {
                        var me = this;
                        for(var k in me) {
                            me[k].qid = k;
                            return me[k];
                        }
                    }
                });
                $('#qa').html(rendered);
            });
        }
        function renderFeatured() {
            $.get(tpl.featured, function(template) {
                debugger;
                //featured
                var featured = {
                    "products": [{
                        111: {"name": "product name1", "category": "category name1", "image": "image url1"}
                    },{
                        222: {"name": "product name2", "category": "category name2", "image": "image url2"}
                    },{
                        333: {"name": "product name2", "category": "category name2", "image": "image url2"}
                    },{
                        444: {"name": "product name2", "category": "category name2", "image": "image url2"}
                    },{
                        555: {"name": "product name2", "category": "category name2", "image": "image url2"}
                    }]
                };
                var data = {};
                data.products = [];
                var product;
                var id;
                var tmp = [];
                var item = {};
                var products = featured.products || [];
                var max = parseInt(products.length / slideMax);
                var num = 0;
                data.slideFlag = products.length > slideMax ? true : false;
                for(var i = 0; i <= max; i++) {
                    for (var j = 0; i * slideMax + j < products.length && j < slideMax; j++) {
                        product = products[i * slideMax + j];
                        for (k in product) {
                            product[k].pid = k;
                            id = k;
                        }
                        tmp.push(product[id]);
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
            });
        }
        renderProductInfo();
        renderFeatured();
    })
});

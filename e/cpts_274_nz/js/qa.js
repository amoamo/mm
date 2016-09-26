jQuery(function($) {'use strict',
  	$(document).ready(function() {
        var tpl = {
            "detail": '../templates/qa/detail.mst',
            "modal": '../templates/qa/modal.mst',
            "productFilter": '../templates/qa/product-filter.mst',
            "product": '../templates/qa/product.mst'
        };
        var api = {
            "qa": "/qa",
            "product": "/products/all",
            "add": '/admin/qa',
            "del": '/admin/qa'
        };
        function renderQa() {
            getQaData('all');
            $.get(tpl.productFilter, function(template) {
                $.get(api.product, function(product){
                    var rendered = Mustache.render(template, {
                        "product": product
                    });
                    $('#product-filter').append(rendered);
                    $(".dropdown-menu li").on("click", function(){
                        var me = $(this);
                        var id = me.attr("data-id");
                        $('.dropdown-menu li').removeClass('active');
                        me.addClass('active');
                        $('.dropdown-chose').html(me.find('a').html());
                        getQaData(id);
                    });
                }, 'JSON')
            });
        }
        function getQaData(id) {
            $.get(tpl.detail, function(template) {
                $.get(api.qa + '/' + id, function(qa){
                    var rendered = Mustache.render(template, {
                        "qa": qa
                    });
                    $('#qa-container').html(rendered);
                }, 'JSON')
            });
        }
        function bindBehavior() {
            //删除
            $('.panel').on('click', '.del-qa', function(){
                var me = $(this);
                var id = me.attr('data-id');
                var params = {
                    "id": id
                };
                $.post(api.del, params, function(res){
                    window.location.reload();
                }, 'JSON')
            });
            //编辑
            $('.panel').on('click', '.edit-qa', function(){
                var me = $(this);
                var id = me.attr('data-id');
                var question = me.attr('data-question');
                var answer = me.attr('data-answer');
                renderModal({
                    "question": question,
                    "answer": answer
                });
                $('#addModal').attr('data-type', 'edit').modal('show');
                $('#addModal').off('shown.bs.modal.edit').on('shown.bs.modal.edit', function () {
                    if ($('#addModal').attr('data-type') != 'edit') {
                        return;
                    }
                    renderProduct();
                    onSubmit(id);
                });
            })
            //增加
            $('.panel').on('click', '.add-qa', function(){
                renderModal({});
                $('#addModal').attr('data-type', 'add').modal('show');
                $('#addModal').off('shown.bs.modal.add').on('shown.bs.modal.add', function () {
                    if ($('#addModal').attr('data-type') != 'add') {
                        return;
                    }
                    renderProduct();
                    onSubmit(-1);
                });
            })
        }
        function renderModal(data) {
            $.get(tpl.modal, function(template) {
                var rendered = Mustache.render(template, data);
                $('.modal-body').html(rendered);
            });
        }
        function renderProduct() {
            $.get(tpl.product, function(template) {
                $.get(api.product, function(product){
                    var rendered = Mustache.render(template, {
                        "product": product
                    });
                    $('#product-selector').html(rendered);
                }, 'JSON')
            });
        }
        function onSubmit(id) {
            $('.add-submit').click(function(){
                var question = $.trim($('.form-question').val());
                var answer = $.trim($('.form-answer').val());
                var productId = $('#product-selector').find('option:selected').attr('data-id');
                var params = {};
                params[id] = JSON.stringify({
                    "productId": productId,
                    "question": question,
                    "answer": answer
                });
                $.post(api.add, params, function(res){
                    window.location.reload();
                }, 'JSON')
            })
        }
        renderQa();
        bindBehavior();
    })
});



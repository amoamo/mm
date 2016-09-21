jQuery(function($) {'use strict',
  	$(document).ready(function() {
        var tpl = {
            "detail": '../templates/category/detail.mst',
            "modal": '../templates/category/modal.mst'
        };
        var api = {
            "category": "/category",
            "add": '/admin/category',
            "del": '/admin/category'
        };
        function renderCategory() {
            $.get(tpl.detail, function(template) {
                $.get(api.category, function(category){
                    var rendered = Mustache.render(template, {
                        "category": category,
                        "categoryLength": category.length
                    });
                    $('#category-container').html(rendered);
                }, 'JSON')
            });
        }
        function bindBehavior() {
            //删除
            $('.panel').on('click', '.del-category', function(){
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
            $('.panel').on('click', '.edit-category', function(){
                var me = $(this);
                var id = me.attr('data-id');
                var name = me.attr('data-name');
                renderModal({"name": name});
                $('#addModal').attr('data-type', 'edit').modal('show');
                $('#addModal').off('shown.bs.modal.edit').on('shown.bs.modal.edit', function () {
                    if ($('#addModal').attr('data-type') != 'edit') {
                        return;
                    }
                    $('.add-submit').click(function(){
                        var name = $.trim($('.form-category-name').val());
                        var params = {};
                        params[id] = JSON.stringify({"name": name});
                        $.post(api.add, params, function(res){
                            window.location.reload();
                        }, 'JSON')
                    })
                });
            })
            //增加
            $('.panel').on('click', '.add-category', function(){
                renderModal({"name": ""});
                $('#addModal').attr('data-type', 'add').modal('show');
                $('#addModal').off('shown.bs.modal.add').on('shown.bs.modal.add', function () {
                    if ($('#addModal').attr('data-type') != 'add') {
                        return;
                    }
                    $('.add-submit').click(function(){
                        var name = $.trim($('.form-category-name').val());
                        var params = {};
                        params = {
                            "-1": JSON.stringify({"name": name})
                        };
                        $.post(api.add, params, function(res){
                            window.location.reload();
                        }, 'JSON')
                    })
                });
            })
        }
        function renderModal(data) {
            $.get(tpl.modal, function(template) {
                var rendered = Mustache.render(template, data);
                $('.modal-body').html(rendered);
            });
        }
        renderCategory();
        bindBehavior();
    })
});


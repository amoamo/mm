jQuery(function($) {'use strict',
  	$(document).ready(function() {
        var tpl = {
            "product": '../templates/product/detail.mst',
            "modal": '../templates/product/modal.mst'
        };
        var api = {
            "product": "/api/products/all",
            "category": "/category",
            "brand": "/brand",
            "add": '/api/admin/product',
            "del": '/api/admin/product',
            "upload": '/api/upload'
        };
        function renderProduct() {
            $.get(tpl.product, function(template) {
                $.get(api.product, function(product){
                    var rendered = Mustache.render(template, {
                        "product": product,
                        "productLength": product.length
                    });
                    $('#product-container').html(rendered);
                }, 'JSON')
            });
        }
        function bindBehavior() {
            //删除
            $('.panel').on('click', '.del-product', function(){
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
            $('.panel').on('click', '.edit-product', function(){
                var me = $(this);
                var id = me.attr('data-id');
                var name = me.attr('data-name');
                renderModal();
                $('#addModal').attr('data-type', 'edit').modal('show');
                $('#addModal').off('shown.bs.modal.edit').on('shown.bs.modal.edit', function () {
                    if ($('#addModal').attr('data-type') != 'edit') {
                        return;
                    }
                    renderUploader();
                    $('.add-submit').click(function(){
                        var name = $.trim($('.form-product-name').val());
                        var imageUrl = $('#exampleInputFile').attr('data-image');
                        var params = {};
                        params[id] = JSON.stringify({"name": name, "image": imageUrl});
                        $.post(api.add, params, function(res){
                            window.location.reload();
                        }, 'JSON')
                    })
                });
            })
            //增加
            $('.panel').on('click', '.add-product', function(){
                renderModal();
                $('#addModal').attr('data-type', 'add').modal('show');
                $('#addModal').off('shown.bs.modal.add').on('shown.bs.modal.add', function () {
                    if ($('#addModal').attr('data-type') != 'add') {
                        return;
                    }
                    renderUploader();
                    $('.add-submit').click(function(){
                        var name = $.trim($('.form-product-name').val());
                        var imageUrl = $('#exampleInputFile').attr('data-image');
                        var params = {};
                        params = {
                            "-1": JSON.stringify({"name": name, "image": imageUrl})
                        };
                        $.post(api.add, params, function(res){
                            window.location.reload();
                        }, 'JSON')
                    })
                });
            })
        }
        function renderModal(data) {
            data = data || {};
            $.get(tpl.modal, function(template) {
                var rendered = Mustache.render(template, data);
                $('.modal-body').html(rendered);
            });
        }
        function renderUploader() {
            $('#drag-and-drop-zone').dmUploader({
                url: api.upload,
                dataType: 'json',
                allowedTypes: 'image/*',
                onBeforeUpload: function(id){
                    $.uploader.updateFileStatus(id, 'default', 'Uploading...');
                },
                onNewFile: function(id, file){
                    $.uploader.addFile('#upload-files', id, file, 'mult');
                    /*** Begins Image preview loader ***/
                    if (typeof FileReader !== "undefined"){
                        var reader = new FileReader();
                        // Last image added
                        var img = $('#upload-files').find('.upload-image-preview').eq(0);
                        reader.onload = function (e) {
                            img.attr('src', e.target.result);
                        }
                        reader.readAsDataURL(file);
                    } else {
                        // Hide/Remove all Images if FileReader isn't supported
                        $('#upload-files').find('.upload-image-preview').remove();
                    }
                    /*** Ends Image preview loader ***/
                },
                onComplete: function(){
                },
                onUploadProgress: function(id, percent){
                    var percentStr = percent + '%';
                    $.uploader.updateFileProgress(id, percentStr);
                },
                onUploadSuccess: function(id, data){
                    $.uploader.updateFileStatus(id, 'success', 'Upload Complete');
                    $.uploader.updateFileProgress(id, '100%');
                    $('.progress-striped').remove();
                    $('#exampleInputFile').attr('data-image', data.image);
                },
                onUploadError: function(id){
                    $.uploader.updateFileStatus(id, 'error', 'Upload Error, Try Again');
                }
            });
        }
        renderProduct();
        bindBehavior();
    })
});


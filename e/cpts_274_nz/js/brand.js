jQuery(function($) {'use strict',
  	$(document).ready(function() {
        var tpl = {
            "brand": '../templates/brand/detail.mst',
            "modal": '../templates/brand/modal.mst'
        };
        var api = {
            "brand": "/brand",
            "add": '/admin/brand',
            "edit": '/admin/brand',
            "del": '/admin/brand',
            "upload": '/upload'
        };
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        function renderBrand() {
            $.get(tpl.brand, function(template) {
                $.get(api.brand, function(brand){
                    var rendered = Mustache.render(template, {
                        "brand": brand,
                        "brandLength": brand.length
                    });
                    $('#brand-container').html(rendered);
                }, 'JSON')
            });
        }
        function bindBehavior() {
            //删除
            $('.panel').on('click', '.del-brand', function(){
                var me = $(this);
                var id = me.attr('data-id');
                var params = {
                    "id": id,
                    "type": "del"
                };
                $.post(api.del, params, function(res){
                    window.location.reload();
                }, 'JSON')
            });
            //编辑
            $('.panel').on('click', '.edit-brand', function(){
                var me = $(this);
                var id = me.attr('data-id');
                var name = me.attr('data-name');
                renderModal({"name": name});
                $('#addModal').attr('data-type', 'edit').modal('show');
                $('#addModal').off('shown.bs.modal.edit').on('shown.bs.modal.edit', function () {
                    if ($('#addModal').attr('data-type') != 'edit') {
                        return;
                    }
                    renderUploader();
                    $('.add-submit').click(function(){
                        var name = $.trim($('.form-brand-name').val());
                        var imageUrl = $('#exampleInputFile').attr('data-image');
                        var params = {};
                        params = JSON.stringify({"name": name, "image": imageUrl, "type": "edit", "id": id});
                        $.post(api.edit, params, function(res){
                            window.location.reload();
                        }, 'JSON')
                    })
                });
            })
            //增加
            $('.panel').on('click', '.add-brand', function(){
                renderModal({"name": ""});
                $('#addModal').attr('data-type', 'add').modal('show');
                $('#addModal').off('shown.bs.modal.add').on('shown.bs.modal.add', function () {
                    if ($('#addModal').attr('data-type') != 'add') {
                        return;
                    }
                    renderUploader();
                    $('.add-submit').click(function(){
                        var name = $.trim($('.form-brand-name').val());
                        var imageUrl = $('#exampleInputFile').attr('data-image');
                        var params = {};
                        params = JSON.stringify({"name": name, "image": imageUrl, "type": "add", "id": -1});
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
        function renderUploader() {
            $('#drag-and-drop-zone').dmUploader({
                url: api.upload,
                dataType: 'json',
                allowedTypes: 'image/*',
                onBeforeUpload: function(id){
                    $.uploader.updateFileStatus(id, 'default', 'Uploading...');
                },
                onNewFile: function(id, file){
                    $.uploader.addFile('#upload-files', id, file, 'single');
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
        renderBrand();
        bindBehavior();
    })
});


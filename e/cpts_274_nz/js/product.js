jQuery(function($) {'use strict',
  	$(document).ready(function() {
        var tpl = {
            "product": '../templates/product/detail.mst',
            "modal": '../templates/product/modal.mst',
            "specification": '../templates/product/specification.mst',
            "category": '../templates/product/category.mst',
            "brand": '../templates/product/brand.mst'
        };
        var api = {
            "product": "/products/all",
            "category": "/category",
            "brand": "/brand",
            "add": '/admin/product',
            "del": '/admin/product',
            "upload": '/upload',
            "details": '/details'
        };
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
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
        function renderCategory(name) {
            $.get(tpl.category, function(template) {
                $.get(api.category, function(category){
                    var rendered = Mustache.render(template, {
                        "category": category,
                        "selectFlag": function() {
                            if (name == this.name) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    });
                    $('#category-selector').html(rendered);
                }, 'JSON')
            });
        }
        function renderBrand(name) {
            $.get(tpl.brand, function(template) {
                $.get(api.brand, function(brand){
                    var rendered = Mustache.render(template, {
                        "brand": brand,
                        "selectFlag": function() {
                            if (name == this.name) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    });
                    $('#brand-selector').html(rendered);
                }, 'JSON')
            });
        }
        function bindBehavior() {
            //删除
            $('.panel').on('click', '.del-product', function(){
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
            $('.panel').on('click', '.edit-product', function(){
                var me = $(this);
                var id = me.attr('data-id');
                var name = me.attr('data-name');
                $.get(api.details + '/' + id, function(details){
                    var specifications = details.specifications || {};
                    var specificationsArr = [];
                    var i = 0;
                    $.each(specifications, function(k,v) {
                        specificationsArr.push({
                            num: i,
                            name: k,
                            content: v
                        })
                        i++;
                    });
                    var category = details.category || '';
                    var brand = details.brand || '';
                    details.specificationsArr = specificationsArr;
                    details.specificationNum = specificationsArr.length;
                    renderModal(details);
                    $('#addModal').attr('data-type', 'edit').modal('show');
                    $('#addModal').off('shown.bs.modal.edit').on('shown.bs.modal.edit', function () {
                        if ($('#addModal').attr('data-type') != 'edit') {
                            return;
                        }
                        //加载category下拉
                        renderCategory(category);
                        //加载brand下拉
                        renderBrand(brand);
                        //加载上传图片组件
                        renderUploader();
                        //绑定add事件
                        onAddSpecification();
                        //绑定delete事件
                        onDelSpecification();
                        //绑定删除图片事件
                        onDelImage();
                        //绑定submit事件
                        onSubmit(id);
                    });
                }, 'JSON')
            })
            //增加
            $('.panel').on('click', '.add-product', function(){
                renderModal();
                $('#addModal').attr('data-type', 'add').modal('show');
                $('#addModal').off('shown.bs.modal.add').on('shown.bs.modal.add', function () {
                    if ($('#addModal').attr('data-type') != 'add') {
                        return;
                    }
                    //加载category下拉
                    renderCategory();
                    //加载brand下拉
                    renderBrand();
                    //加载上传图片组件
                    renderUploader();
                    //绑定add事件
                    onAddSpecification();
                    //绑定delete事件
                    onDelSpecification();
                    //绑定删除图片事件
                    onDelImage();
                    //绑定submit事件
                    onSubmit(-1);
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
                    $('#upload-file' + id).attr('data-image', data.image);
                },
                onUploadError: function(id){
                    $.uploader.updateFileStatus(id, 'error', 'Upload Error, Try Again');
                    $('#upload-file' + id).attr('data-image', '');
                }
            });
        }
        function onAddSpecification() {
            //增加specification
            $('.add-specification').off('click').on('click', function(){
                $.get(tpl.specification, function(template) {
                    var rendered = Mustache.render(template, {
                    });
                    $('.specification-item:last').after(rendered);
                });
            });
        }
        function onDelSpecification() {
            $('.specification-form').off('click.del', '.del-specification').on('click.del', '.del-specification', function(){
                $(this).parent().remove();
            })
        }
        function onDelImage() {
            $('.modal-body').off('click.delImage', '.del-image').on('click.delImage', '.del-image', function(){
                $(this).parent().remove();
            })
        }
        function onSubmit(id) {
            $('.add-submit').off('click').on('click', function(){
                var name = $.trim($('.form-product-name').val());
                var category = $('#category-selector').find('option:selected').attr('data-id');
                var brand = $('#brand-selector').find('option:selected').attr('data-id');
                if (name == '') {
                    alert('please input product name!');
                    return;
                }
                if (category == undefined) {
                    alert('get category failed!');
                    return;
                }
                if (brand == undefined) {
                    alert('get brand failed!');
                    return;
                }
                var shortDesc = $.trim($('#shortDesc').val());
                var longDesc = $.trim($('#longDesc').val());
                var userbook = $.trim($('#userbook').val());
                var driver = $.trim($('#driver').val());
                var specificationItem = $('.specification-item');
                var isFeatured = $('#feature').is(':checked');
                var specification = [];
                $.each(specificationItem, function(k, v){
                    var key = $.trim($(v).find('.specification-key').val());
                    var val = $.trim($(v).find('.specification-value').val());
                    var tmp = {};
                    tmp[key] = val;
                    if (key != '' && val !== '') {
                        specification.push(tmp);
                    }
                })
                var uploadEl = $('.upload-file-con');
                var j = 0;
                var type = (id == -1) ? 'add' : 'edit';
                var params = {
                    "id": id,
                    "name": name,
                    "categoryId": category,
                    "brandId": brand,
                    "userBook": userbook,
                    "driver": driver,
                    "shortDescription": shortDesc,
                    "longDescription": longDesc,
                    "specification": JSON.stringify(specification),
                    "type": type
                };
                $.each(uploadEl, function(k, v){
                    var imageUrl = $(v).attr('data-image');
                    if (imageUrl) {
                        params['image' + (j + 1)] = imageUrl;
                        j++;
                    }
                })

                var postParams = {};
                postParams = JSON.stringify(params);
                $.post(api.add, postParams, function(res){
                    window.location.reload();
                }, 'JSON')
            })
        }
        renderProduct();
        bindBehavior();
    })
});


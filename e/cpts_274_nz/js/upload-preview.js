(function( $, window, undefined ) {
  $.uploader = $.extend( {}, {
    addFile: function(id, i, file, type){
		var template = '<div class="upload-file-con" id="upload-file' + i + '">' +
		                   '<img src="" class="upload-image-preview" alt="upload image" />' +
		                   file.name + ' <span class="upload-file-size">(' + $.uploader.humanizeSize(file.size) + ')</span><br />Status: <span class="upload-file-status">Waiting to upload</span>'+
		                   '<div class="progress progress-striped active">'+
		                       '<div class="progress-bar" role="progressbar" style="width: 0%;">'+
		                           '<span class="sr-only">0% Complete</span>'+
		                       '</div>'+
		                   '</div>'+
		               '</div>';
		var i = $(id).attr('file-counter');
		if (!i){
			$(id).empty();
			i = 0;
		}
		i++;
		$(id).attr('file-counter', i);
        if (type == 'single') {
		    $(id).html(template);
        } else if (type == 'mult') {
		    $(id).prepend(template);
        }
	},
	
	updateFileStatus: function(i, status, message){
		$('#upload-file' + i).find('span.upload-file-status').html(message).addClass('upload-file-status-' + status);
	},
	
	updateFileProgress: function(i, percent){
		$('#upload-file' + i).find('div.progress-bar').width(percent);
		$('#upload-file' + i).find('span.sr-only').html(percent + ' Complete');
	},
	
	humanizeSize: function(size) {
      var i = Math.floor( Math.log(size) / Math.log(1024) );
      return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }

  }, $.uploader);
})(jQuery, this);


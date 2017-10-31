require('jquery-validation');
$('form').validate({
	highlight: function(element, errorClass) {
		$(element).fadeOut(function() {
			$(element).fadeIn();
		});
	},
	rules: {
		username: {
			required: true,
			maxlength: 10
		},
		userbackgorund: {
			required: false
		},
		usericon: {
			required: false
		}
	},
	messages: {
		username: {
			required: '昵称不能为空',
		},
		userbackgorund: {
			required: '背景图不能为空',
		},
		usericon: {
			required: '头像不能为空',
		}
	},
	submitHandler: function(form) {
		$.ajax({
			url: '/admin/article/updatemyinfo',
			method: 'post',
			data: {
				username: $('#username').val(),
				id:$('#id').val()
			},
			success: function(resp) {
				alert(resp.message);
				if(resp.success) {
					location.href = '/admin/index';
				}
			}
		})
	}

});
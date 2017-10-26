var ue = UE.getEditor('body');
require('jquery-validation');
//汉化
require('jquery-validation/dist/localization/messages_zh');
//以下为修改jQuery Validation插件兼容Bootstrap的方法
$.validator.setDefaults({
	ignore: "",
	highlight: function(element) {
		$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
	},
	success: function(element) {
		element.closest('.form-group').removeClass('has-error').addClass('has-success');
	},
	errorElement: "span",
	errorPlacement: function(error, element) {
		if(element.is(":radio") || element.is(":checkbox")) {
			error.appendTo(element.parent().parent().parent());
		} else {
			error.appendTo(element.parent());
		}
	},
	errorClass: "help-block",
	validClass: "help-block"

});
$('form').validate({
	highlight: function(element, errorClass) {
		$(element).fadeOut(function() {
			$(element).fadeIn();
		});
	},
	rules: {
		title: {
			required: true,
			maxlength: 16
		},
		body: {
			required: true
		}
	},
	messages: {
		title: {
			required: '标题不能为空',
		}
	},
	submitHandler: function(form) {
		$.ajax({
			url: '/admin/article/update',
			method: 'post',
			data: {
				title: $('#title').val(),
				body: ue.getContent(),
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
$(function() {
    var includes = $('[data-include]')
    $.each(includes, function() {
        var file = 'https://petziee-dev.web.app/' + $(this).data('include') + '.html'
        $(this).load(file)
    })
})
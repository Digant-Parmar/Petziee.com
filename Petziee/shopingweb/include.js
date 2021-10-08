$(function() {
    var includes = $('[data-include]')
    $.each(includes, function() {
        var file =
            // 'http://localhost:5005/' +
            'https://petziee-dev.web.app/' +
            $(this).data('include') + '.html'
        $(this).load(file)
    })
})
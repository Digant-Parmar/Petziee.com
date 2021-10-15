$(function() {
    var includes = $('[data-include]')
    $.each(includes, function() {
        if ($(this).data('include') === "navbarProduct") {
            var file = 'https://petzieee.web.app/Navbars/navbarProduct.html'
            $(this).load(file)
        } else if ($(this).data('include') === "navbarPayment") {
            var file = 'https://petzieee.web.app/Navbars/navbarPayment.html';
            $(this).load(file)
        } else if ($(this).data('include') === "navbar") {
            var file = 'https://petzieee.web.app/Navbars/navbar.html';
            $(this).load(file)
        } else if ($(this).data('include') === "footerProduct") {
            var file = 'https://petzieee.web.app/Footer/footerProduct.html';
            $(this).load(file)
        } else if ($(this).data('include') === "footer") {
            var file = 'https://petzieee.web.app/Footer/footer.html';
            $(this).load(file)
        }

    })
})
$ ->

  $('#logo').click (e) =>
    e.preventDefault()
    $('html, body').scrollTop 0
    $('.pages .page.active').removeClass 'active'
    $('.pages .page.frontpage').addClass 'active'

  $('*[data-target]').click (e) =>
    e.preventDefault()
    $('html, body').scrollTop 0
    $('.pages .page.active').removeClass 'active'
    $('.pages .page.' + $(e.currentTarget).data('target')).addClass 'active'

  $('.slideshow').each ->

    $(this).data 'current-slide', 0

    slideWidth = $(this).width()
    wrapperWidth = $('.slide', this).length * slideWidth

    $('.slide', this).width slideWidth + 'px'
    $('.slides', this).width wrapperWidth + 'px'

    goTo = (n) =>
      slides = $('.slide', this)
      return if n < 0 or n >= slides.length
      $('.slides', this).css 'transform', 'translateX(-' + n * slides.width() + 'px)'
      $(this).data 'current-slide', n
      $('.slide.active', this).removeClass 'active'
      $('.slide', this).eq(n).addClass 'active'
      $('.bullets a.active', this).removeClass 'active'
      $('.bullets a', this).eq(n).addClass 'active'

    $('.next', this).on 'click', (e) =>
      e.preventDefault()
      goTo $(this).data('current-slide') + 1

    $('.prev', this).on 'click', (e) =>
      e.preventDefault()
      goTo $(this).data('current-slide') - 1

    $('.bullets a', this).on 'click', (e) =>
      e.preventDefault()
      goTo $(e.currentTarget).index()

    resizeTimeout = null
    $(window).resize =>
      clearTimeout resizeTimeout
      resizeTimeout = setTimeout =>
        slideWidth = $(this).width()
        wrapperWidth = $('.slide', this).length * slideWidth
        $('.slide', this).width slideWidth + 'px'
        $('.slides', this).width wrapperWidth + 'px'
        goTo $(this).data 'current-slide'
      , 400
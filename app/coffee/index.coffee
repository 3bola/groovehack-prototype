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
    switch $(e.currentTarget).data('target')
      when 'set' then @Player.initPlayer Data.Sets[0]
      else @Player.destroyPlayer()

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
        if $(this).is(':visible')
          slideWidth = $(this).width()
        else
          slideWidth = $(window).width()
        wrapperWidth = $('.slide', this).length * slideWidth
        $('.slide', this).width slideWidth + 'px'
        $('.slides', this).width wrapperWidth + 'px'
        goTo $(this).data 'current-slide'
      , 400

  @Player =

    destroyPlayer: =>
      @player = null
      clearInterval @durationInt
      $('#video').html $('<div id="youtube-player"></div>')

    initPlayer: (@setData) =>

      $video    = $('#video')
      $controls = $('#timeline')
      $playlist = $('#playlist')

      # populate tracks
      tracks = document.createDocumentFragment()
      for track in @setData.tracks
        $(tracks).append templates.playlist.track.tmpl(track)
        track.active = false
      $playlist.html tracks


      @playing = (play) =>
        if play
          @isPlaying = true
          $controls.find('.play').addClass 'playing'
          @durationInt = setInterval =>
            @currentTime = @player.getCurrentTime()
            l = null
            for track in @setData.tracks
              l = track if track.startsAt <= @currentTime
            if !l.active
              track.active = false for track in @setData.tracks
              l.active = true
              $playlist.find('.track.current').removeClass 'current'
              $playlist.find('.track[data-start="' + l.startsAt + '"]').addClass 'current'
            $controls.find('.pos').css 'left', (@currentTime / @duration) * 100 + '%'
            s = Math.floor(@currentTime%60)
            s = '0' + s if s < 10
            $controls.find('.current-time').html Math.floor(@currentTime/60) + ':' + s
            console.log 'tracking', $playlist.find('.track[data-start="' + l.startsAt + '"]')
          , 500
        else
          @isPlaying = false
          $controls.find('.play').removeClass 'playing'
          clearInterval @durationInt

      @onPlayerReady = (e) =>
        @duration = @player.getDuration()
        fragment = document.createDocumentFragment()
        for track in @setData.tracks
          pos = track.startsAt / @duration
          bar = document.createElement('span')
          bar.className = 'track'
          bar.style.left = pos*100 + '%'
          fragment.appendChild bar
        $('#timeline .line .tracks').html fragment
        $('#timeline .total-time').html Math.floor(@duration/60) + ':' + Math.floor(@duration%60)
        $('#timeline .current-time').html '0:00';

      @onPlayerStateChange = (e) =>
        switch e.data
          when 1
            @playing true
          when 2
            @playing false

      YT.ready =>
        @player = new YT.Player 'youtube-player',
          height: '100%'
          width: '100%'
          videoId: setData.videoId
          playerVars: { rel: 0, theme: 'light', showinfo: 0, controls: 0, autohide: 1, modestbranding: 1, cc_load_policy: 0, iv_load_policy: 3 }
          events: { 'onReady': @onPlayerReady, 'onStateChange': @onPlayerStateChange }




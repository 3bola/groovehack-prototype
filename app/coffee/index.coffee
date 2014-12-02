String.prototype.width = (fontStyle) ->
  f = fontStyle || '12px arial'
  o = $('<div>' + this + '</div>')
      .css({ 'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f })
      .appendTo($('body'))
  w = o.width()
  o.remove()
  w

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

  $('.open-mobile-menu').click (e) =>
    e.preventDefault()
    $('#overlay').addClass 'show'
    $('body').addClass 'mobile-menu-open'

  $('#overlay').click (e) =>
    $('#overlay').removeClass 'show'
    $('body').removeClass 'mobile-menu-open'

  $('.slideshow').each ->

    $(this).data 'current-slide', 0

    slideWidth = $(this).width()
    wrapperWidth = $('.slide', this).length * slideWidth

    $('.slide', this).width slideWidth + 'px'
    $('.slides', this).width wrapperWidth + 'px'

    goTo = (n) =>
      slides = $('.slide', this)
      n = slides.length - 1 if n < 0
      n = 0 if n >= slides.length
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

  $('#timeline .play').on 'click', (e) =>
    return if !@Player.player
    if @Player.isPlaying
      @Player.player.pauseVideo()
    else
      @Player.player.playVideo()

  $('#timeline .bar').on 'click', (e) =>
    return if !@Player.player
    w = $('#timeline .line').width()
    pos = (e.pageX - e.currentTarget.offsetLeft) - 10
    pos = 0 if pos < 0
    pos = w if pos > w
    pos = pos / w
    s = Math.round(pos * @Player.duration)
    @Player.player.seekTo(s)

  $('#playlist').on 'click', '.track .info', (e) =>
    return if !@Player.player
    $('#playlist .track.open').removeClass 'open'
    @Player.player.seekTo $(e.currentTarget).parents('.track').data('start')
    console.log 'seekTo', $(e.currentTarget).parents('.track').data('start')

  $('#playlist').on 'click', '.track .download', (e) =>
    e.preventDefault();
    e.stopImmediatePropagation();
    $('#playlist .track.open').removeClass 'open'
    $(e.currentTarget).parents('.track').addClass 'open'

  @Player =

    destroyPlayer: ->
      @player = null
      clearInterval @durationInt
      $('#video').html $('<div id="youtube-player"></div>')

    initPlayer: (@setData) ->

      $video    = $('#video')
      $controls = $('#timeline')
      $playlist = $('#playlist')

      $controls.find('play').removeClass 'playing'

      # populate tracks
      tracks = document.createDocumentFragment()
      for track in @setData.tracks
        tw = String(track.title).width('20px "ProximaSemiBold", "Helvetica Neue", Helvetica, Arial, sans-serif')
        aw = String(track.artist).width('20px "ProximaSemiBold", "Helvetica Neue", Helvetica, Arial, sans-serif')
        track.titleScrolling = tw > 240
        track.artistScrolling = aw > 240
        t = templates.playlist.track.tmpl(track)
        $(tracks).append t
        track.active = false
      $playlist.html tracks


      @playing = (play) =>
        if play
          @isPlaying = true
          $controls.find('.play').addClass 'playing'
          $playlist.addClass 'playing'
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
          , 500
        else
          @isPlaying = false
          $controls.find('.play').removeClass 'playing'
          $playlist.removeClass 'playing'
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




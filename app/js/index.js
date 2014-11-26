$(function() {
  $('#logo').click((function(_this) {
    return function(e) {
      e.preventDefault();
      $('html, body').scrollTop(0);
      $('.pages .page.active').removeClass('active');
      return $('.pages .page.frontpage').addClass('active');
    };
  })(this));
  $('*[data-target]').click((function(_this) {
    return function(e) {
      e.preventDefault();
      $('html, body').scrollTop(0);
      $('.pages .page.active').removeClass('active');
      $('.pages .page.' + $(e.currentTarget).data('target')).addClass('active');
      switch ($(e.currentTarget).data('target')) {
        case 'set':
          return _this.Player.initPlayer(Data.Sets[0]);
        default:
          return _this.Player.destroyPlayer();
      }
    };
  })(this));
  $('.slideshow').each(function() {
    var goTo, resizeTimeout, slideWidth, wrapperWidth;
    $(this).data('current-slide', 0);
    slideWidth = $(this).width();
    wrapperWidth = $('.slide', this).length * slideWidth;
    $('.slide', this).width(slideWidth + 'px');
    $('.slides', this).width(wrapperWidth + 'px');
    goTo = (function(_this) {
      return function(n) {
        var slides;
        slides = $('.slide', _this);
        if (n < 0 || n >= slides.length) {
          return;
        }
        $('.slides', _this).css('transform', 'translateX(-' + n * slides.width() + 'px)');
        $(_this).data('current-slide', n);
        $('.slide.active', _this).removeClass('active');
        $('.slide', _this).eq(n).addClass('active');
        $('.bullets a.active', _this).removeClass('active');
        return $('.bullets a', _this).eq(n).addClass('active');
      };
    })(this);
    $('.next', this).on('click', (function(_this) {
      return function(e) {
        e.preventDefault();
        return goTo($(_this).data('current-slide') + 1);
      };
    })(this));
    $('.prev', this).on('click', (function(_this) {
      return function(e) {
        e.preventDefault();
        return goTo($(_this).data('current-slide') - 1);
      };
    })(this));
    $('.bullets a', this).on('click', (function(_this) {
      return function(e) {
        e.preventDefault();
        return goTo($(e.currentTarget).index());
      };
    })(this));
    resizeTimeout = null;
    return $(window).resize((function(_this) {
      return function() {
        clearTimeout(resizeTimeout);
        return resizeTimeout = setTimeout(function() {
          if ($(_this).is(':visible')) {
            slideWidth = $(_this).width();
          } else {
            slideWidth = $(window).width();
          }
          wrapperWidth = $('.slide', _this).length * slideWidth;
          $('.slide', _this).width(slideWidth + 'px');
          $('.slides', _this).width(wrapperWidth + 'px');
          return goTo($(_this).data('current-slide'));
        }, 400);
      };
    })(this));
  });
  $('#timeline .play').on('click', (function(_this) {
    return function(e) {
      if (!_this.Player.player) {
        return;
      }
      if (_this.Player.isPlaying) {
        return _this.Player.player.pauseVideo();
      } else {
        return _this.Player.player.playVideo();
      }
    };
  })(this));
  $('#timeline .bar').on('click', (function(_this) {
    return function(e) {
      var pos, s, w;
      if (!_this.Player.player) {
        return;
      }
      w = $('#timeline .line').width();
      pos = (e.pageX - e.currentTarget.offsetLeft) - 10;
      if (pos < 0) {
        pos = 0;
      }
      if (pos > w) {
        pos = w;
      }
      pos = pos / w;
      s = Math.round(pos * _this.Player.duration);
      return _this.Player.player.seekTo(s);
    };
  })(this));
  $('#playlist').on('click', '.track', (function(_this) {
    return function(e) {
      if (!_this.Player.player) {
        return;
      }
      return _this.Player.player.seekTo($(e.currentTarget).data('start'));
    };
  })(this));
  return this.Player = {
    destroyPlayer: function() {
      this.player = null;
      clearInterval(this.durationInt);
      return $('#video').html($('<div id="youtube-player"></div>'));
    },
    initPlayer: function(setData) {
      var $controls, $playlist, $video, track, tracks, _i, _len, _ref;
      this.setData = setData;
      $video = $('#video');
      $controls = $('#timeline');
      $playlist = $('#playlist');
      $controls.find('play').removeClass('playing');
      tracks = document.createDocumentFragment();
      _ref = this.setData.tracks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        track = _ref[_i];
        $(tracks).append(templates.playlist.track.tmpl(track));
        track.active = false;
      }
      $playlist.html(tracks);
      this.playing = (function(_this) {
        return function(play) {
          if (play) {
            _this.isPlaying = true;
            $controls.find('.play').addClass('playing');
            $playlist.addClass('playing');
            return _this.durationInt = setInterval(function() {
              var l, s, _j, _k, _len1, _len2, _ref1, _ref2;
              _this.currentTime = _this.player.getCurrentTime();
              l = null;
              _ref1 = _this.setData.tracks;
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                track = _ref1[_j];
                if (track.startsAt <= _this.currentTime) {
                  l = track;
                }
              }
              if (!l.active) {
                _ref2 = _this.setData.tracks;
                for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                  track = _ref2[_k];
                  track.active = false;
                }
                l.active = true;
                $playlist.find('.track.current').removeClass('current');
                $playlist.find('.track[data-start="' + l.startsAt + '"]').addClass('current');
              }
              $controls.find('.pos').css('left', (_this.currentTime / _this.duration) * 100 + '%');
              s = Math.floor(_this.currentTime % 60);
              if (s < 10) {
                s = '0' + s;
              }
              return $controls.find('.current-time').html(Math.floor(_this.currentTime / 60) + ':' + s);
            }, 500);
          } else {
            _this.isPlaying = false;
            $controls.find('.play').removeClass('playing');
            $playlist.removeClass('playing');
            return clearInterval(_this.durationInt);
          }
        };
      })(this);
      this.onPlayerReady = (function(_this) {
        return function(e) {
          var bar, fragment, pos, _j, _len1, _ref1;
          _this.duration = _this.player.getDuration();
          fragment = document.createDocumentFragment();
          _ref1 = _this.setData.tracks;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            track = _ref1[_j];
            pos = track.startsAt / _this.duration;
            bar = document.createElement('span');
            bar.className = 'track';
            bar.style.left = pos * 100 + '%';
            fragment.appendChild(bar);
          }
          $('#timeline .line .tracks').html(fragment);
          $('#timeline .total-time').html(Math.floor(_this.duration / 60) + ':' + Math.floor(_this.duration % 60));
          return $('#timeline .current-time').html('0:00');
        };
      })(this);
      this.onPlayerStateChange = (function(_this) {
        return function(e) {
          switch (e.data) {
            case 1:
              return _this.playing(true);
            case 2:
              return _this.playing(false);
          }
        };
      })(this);
      return YT.ready((function(_this) {
        return function() {
          return _this.player = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: setData.videoId,
            playerVars: {
              rel: 0,
              theme: 'light',
              showinfo: 0,
              controls: 0,
              autohide: 1,
              modestbranding: 1,
              cc_load_policy: 0,
              iv_load_policy: 3
            },
            events: {
              'onReady': _this.onPlayerReady,
              'onStateChange': _this.onPlayerStateChange
            }
          });
        };
      })(this));
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLENBQUUsU0FBQSxHQUFBO0FBRUEsRUFBQSxDQUFBLENBQUUsT0FBRixDQUFVLENBQUMsS0FBWCxDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO1dBQUEsU0FBQyxDQUFELEdBQUE7QUFDZixNQUFBLENBQUMsQ0FBQyxjQUFGLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxDQUFBLENBQUUsWUFBRixDQUFlLENBQUMsU0FBaEIsQ0FBMEIsQ0FBMUIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxDQUFBLENBQUUscUJBQUYsQ0FBd0IsQ0FBQyxXQUF6QixDQUFxQyxRQUFyQyxDQUZBLENBQUE7YUFHQSxDQUFBLENBQUUsd0JBQUYsQ0FBMkIsQ0FBQyxRQUE1QixDQUFxQyxRQUFyQyxFQUplO0lBQUEsRUFBQTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsQ0FBQSxDQUFBO0FBQUEsRUFNQSxDQUFBLENBQUUsZ0JBQUYsQ0FBbUIsQ0FBQyxLQUFwQixDQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO1dBQUEsU0FBQyxDQUFELEdBQUE7QUFDeEIsTUFBQSxDQUFDLENBQUMsY0FBRixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsQ0FBQSxDQUFFLFlBQUYsQ0FBZSxDQUFDLFNBQWhCLENBQTBCLENBQTFCLENBREEsQ0FBQTtBQUFBLE1BRUEsQ0FBQSxDQUFFLHFCQUFGLENBQXdCLENBQUMsV0FBekIsQ0FBcUMsUUFBckMsQ0FGQSxDQUFBO0FBQUEsTUFHQSxDQUFBLENBQUUsZUFBQSxHQUFrQixDQUFBLENBQUUsQ0FBQyxDQUFDLGFBQUosQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixRQUF4QixDQUFwQixDQUFzRCxDQUFDLFFBQXZELENBQWdFLFFBQWhFLENBSEEsQ0FBQTtBQUlBLGNBQU8sQ0FBQSxDQUFFLENBQUMsQ0FBQyxhQUFKLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsUUFBeEIsQ0FBUDtBQUFBLGFBQ08sS0FEUDtpQkFDa0IsS0FBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQUksQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUE3QixFQURsQjtBQUFBO2lCQUVPLEtBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixDQUFBLEVBRlA7QUFBQSxPQUx3QjtJQUFBLEVBQUE7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCLENBTkEsQ0FBQTtBQUFBLEVBZUEsQ0FBQSxDQUFFLFlBQUYsQ0FBZSxDQUFDLElBQWhCLENBQXFCLFNBQUEsR0FBQTtBQUVuQixRQUFBLDZDQUFBO0FBQUEsSUFBQSxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsSUFBUixDQUFhLGVBQWIsRUFBOEIsQ0FBOUIsQ0FBQSxDQUFBO0FBQUEsSUFFQSxVQUFBLEdBQWEsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLEtBQVIsQ0FBQSxDQUZiLENBQUE7QUFBQSxJQUdBLFlBQUEsR0FBZSxDQUFBLENBQUUsUUFBRixFQUFZLElBQVosQ0FBaUIsQ0FBQyxNQUFsQixHQUEyQixVQUgxQyxDQUFBO0FBQUEsSUFLQSxDQUFBLENBQUUsUUFBRixFQUFZLElBQVosQ0FBaUIsQ0FBQyxLQUFsQixDQUF3QixVQUFBLEdBQWEsSUFBckMsQ0FMQSxDQUFBO0FBQUEsSUFNQSxDQUFBLENBQUUsU0FBRixFQUFhLElBQWIsQ0FBa0IsQ0FBQyxLQUFuQixDQUF5QixZQUFBLEdBQWUsSUFBeEMsQ0FOQSxDQUFBO0FBQUEsSUFRQSxJQUFBLEdBQU8sQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ0wsWUFBQSxNQUFBO0FBQUEsUUFBQSxNQUFBLEdBQVMsQ0FBQSxDQUFFLFFBQUYsRUFBWSxLQUFaLENBQVQsQ0FBQTtBQUNBLFFBQUEsSUFBVSxDQUFBLEdBQUksQ0FBSixJQUFTLENBQUEsSUFBSyxNQUFNLENBQUMsTUFBL0I7QUFBQSxnQkFBQSxDQUFBO1NBREE7QUFBQSxRQUVBLENBQUEsQ0FBRSxTQUFGLEVBQWEsS0FBYixDQUFrQixDQUFDLEdBQW5CLENBQXVCLFdBQXZCLEVBQW9DLGNBQUEsR0FBaUIsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxLQUFQLENBQUEsQ0FBckIsR0FBc0MsS0FBMUUsQ0FGQSxDQUFBO0FBQUEsUUFHQSxDQUFBLENBQUUsS0FBRixDQUFPLENBQUMsSUFBUixDQUFhLGVBQWIsRUFBOEIsQ0FBOUIsQ0FIQSxDQUFBO0FBQUEsUUFJQSxDQUFBLENBQUUsZUFBRixFQUFtQixLQUFuQixDQUF3QixDQUFDLFdBQXpCLENBQXFDLFFBQXJDLENBSkEsQ0FBQTtBQUFBLFFBS0EsQ0FBQSxDQUFFLFFBQUYsRUFBWSxLQUFaLENBQWlCLENBQUMsRUFBbEIsQ0FBcUIsQ0FBckIsQ0FBdUIsQ0FBQyxRQUF4QixDQUFpQyxRQUFqQyxDQUxBLENBQUE7QUFBQSxRQU1BLENBQUEsQ0FBRSxtQkFBRixFQUF1QixLQUF2QixDQUE0QixDQUFDLFdBQTdCLENBQXlDLFFBQXpDLENBTkEsQ0FBQTtlQU9BLENBQUEsQ0FBRSxZQUFGLEVBQWdCLEtBQWhCLENBQXFCLENBQUMsRUFBdEIsQ0FBeUIsQ0FBekIsQ0FBMkIsQ0FBQyxRQUE1QixDQUFxQyxRQUFyQyxFQVJLO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FSUCxDQUFBO0FBQUEsSUFrQkEsQ0FBQSxDQUFFLE9BQUYsRUFBVyxJQUFYLENBQWdCLENBQUMsRUFBakIsQ0FBb0IsT0FBcEIsRUFBNkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQzNCLFFBQUEsQ0FBQyxDQUFDLGNBQUYsQ0FBQSxDQUFBLENBQUE7ZUFDQSxJQUFBLENBQUssQ0FBQSxDQUFFLEtBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBYSxlQUFiLENBQUEsR0FBZ0MsQ0FBckMsRUFGMkI7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QixDQWxCQSxDQUFBO0FBQUEsSUFzQkEsQ0FBQSxDQUFFLE9BQUYsRUFBVyxJQUFYLENBQWdCLENBQUMsRUFBakIsQ0FBb0IsT0FBcEIsRUFBNkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQzNCLFFBQUEsQ0FBQyxDQUFDLGNBQUYsQ0FBQSxDQUFBLENBQUE7ZUFDQSxJQUFBLENBQUssQ0FBQSxDQUFFLEtBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBYSxlQUFiLENBQUEsR0FBZ0MsQ0FBckMsRUFGMkI7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QixDQXRCQSxDQUFBO0FBQUEsSUEwQkEsQ0FBQSxDQUFFLFlBQUYsRUFBZ0IsSUFBaEIsQ0FBcUIsQ0FBQyxFQUF0QixDQUF5QixPQUF6QixFQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxDQUFELEdBQUE7QUFDaEMsUUFBQSxDQUFDLENBQUMsY0FBRixDQUFBLENBQUEsQ0FBQTtlQUNBLElBQUEsQ0FBSyxDQUFBLENBQUUsQ0FBQyxDQUFDLGFBQUosQ0FBa0IsQ0FBQyxLQUFuQixDQUFBLENBQUwsRUFGZ0M7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQTFCQSxDQUFBO0FBQUEsSUE4QkEsYUFBQSxHQUFnQixJQTlCaEIsQ0FBQTtXQStCQSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO0FBQ2YsUUFBQSxZQUFBLENBQWEsYUFBYixDQUFBLENBQUE7ZUFDQSxhQUFBLEdBQWdCLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDekIsVUFBQSxJQUFHLENBQUEsQ0FBRSxLQUFGLENBQU8sQ0FBQyxFQUFSLENBQVcsVUFBWCxDQUFIO0FBQ0UsWUFBQSxVQUFBLEdBQWEsQ0FBQSxDQUFFLEtBQUYsQ0FBTyxDQUFDLEtBQVIsQ0FBQSxDQUFiLENBREY7V0FBQSxNQUFBO0FBR0UsWUFBQSxVQUFBLEdBQWEsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLEtBQVYsQ0FBQSxDQUFiLENBSEY7V0FBQTtBQUFBLFVBSUEsWUFBQSxHQUFlLENBQUEsQ0FBRSxRQUFGLEVBQVksS0FBWixDQUFpQixDQUFDLE1BQWxCLEdBQTJCLFVBSjFDLENBQUE7QUFBQSxVQUtBLENBQUEsQ0FBRSxRQUFGLEVBQVksS0FBWixDQUFpQixDQUFDLEtBQWxCLENBQXdCLFVBQUEsR0FBYSxJQUFyQyxDQUxBLENBQUE7QUFBQSxVQU1BLENBQUEsQ0FBRSxTQUFGLEVBQWEsS0FBYixDQUFrQixDQUFDLEtBQW5CLENBQXlCLFlBQUEsR0FBZSxJQUF4QyxDQU5BLENBQUE7aUJBT0EsSUFBQSxDQUFLLENBQUEsQ0FBRSxLQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsZUFBYixDQUFMLEVBUnlCO1FBQUEsQ0FBWCxFQVNkLEdBVGMsRUFGRDtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCLEVBakNtQjtFQUFBLENBQXJCLENBZkEsQ0FBQTtBQUFBLEVBNkRBLENBQUEsQ0FBRSxpQkFBRixDQUFvQixDQUFDLEVBQXJCLENBQXdCLE9BQXhCLEVBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFDLENBQUQsR0FBQTtBQUMvQixNQUFBLElBQVUsQ0FBQSxLQUFFLENBQUEsTUFBTSxDQUFDLE1BQW5CO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFDQSxNQUFBLElBQUcsS0FBQyxDQUFBLE1BQU0sQ0FBQyxTQUFYO2VBQ0UsS0FBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBZixDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsS0FBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBZixDQUFBLEVBSEY7T0FGK0I7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxDQTdEQSxDQUFBO0FBQUEsRUFvRUEsQ0FBQSxDQUFFLGdCQUFGLENBQW1CLENBQUMsRUFBcEIsQ0FBdUIsT0FBdkIsRUFBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtXQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQzlCLFVBQUEsU0FBQTtBQUFBLE1BQUEsSUFBVSxDQUFBLEtBQUUsQ0FBQSxNQUFNLENBQUMsTUFBbkI7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsQ0FBQSxHQUFJLENBQUEsQ0FBRSxpQkFBRixDQUFvQixDQUFDLEtBQXJCLENBQUEsQ0FESixDQUFBO0FBQUEsTUFFQSxHQUFBLEdBQU0sQ0FBQyxDQUFDLENBQUMsS0FBRixHQUFVLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBM0IsQ0FBQSxHQUF5QyxFQUYvQyxDQUFBO0FBR0EsTUFBQSxJQUFXLEdBQUEsR0FBTSxDQUFqQjtBQUFBLFFBQUEsR0FBQSxHQUFNLENBQU4sQ0FBQTtPQUhBO0FBSUEsTUFBQSxJQUFXLEdBQUEsR0FBTSxDQUFqQjtBQUFBLFFBQUEsR0FBQSxHQUFNLENBQU4sQ0FBQTtPQUpBO0FBQUEsTUFLQSxHQUFBLEdBQU0sR0FBQSxHQUFNLENBTFosQ0FBQTtBQUFBLE1BTUEsQ0FBQSxHQUFJLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBQSxHQUFNLEtBQUMsQ0FBQSxNQUFNLENBQUMsUUFBekIsQ0FOSixDQUFBO2FBT0EsS0FBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBZixDQUFzQixDQUF0QixFQVI4QjtJQUFBLEVBQUE7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDLENBcEVBLENBQUE7QUFBQSxFQThFQSxDQUFBLENBQUUsV0FBRixDQUFjLENBQUMsRUFBZixDQUFrQixPQUFsQixFQUEyQixRQUEzQixFQUFxQyxDQUFBLFNBQUEsS0FBQSxHQUFBO1dBQUEsU0FBQyxDQUFELEdBQUE7QUFDbkMsTUFBQSxJQUFVLENBQUEsS0FBRSxDQUFBLE1BQU0sQ0FBQyxNQUFuQjtBQUFBLGNBQUEsQ0FBQTtPQUFBO2FBQ0EsS0FBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBZixDQUFzQixDQUFBLENBQUUsQ0FBQyxDQUFDLGFBQUosQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixPQUF4QixDQUF0QixFQUZtQztJQUFBLEVBQUE7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJDLENBOUVBLENBQUE7U0FrRkEsSUFBQyxDQUFBLE1BQUQsR0FFRTtBQUFBLElBQUEsYUFBQSxFQUFlLFNBQUEsR0FBQTtBQUNiLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFWLENBQUE7QUFBQSxNQUNBLGFBQUEsQ0FBYyxJQUFDLENBQUEsV0FBZixDQURBLENBQUE7YUFFQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsSUFBWixDQUFpQixDQUFBLENBQUUsaUNBQUYsQ0FBakIsRUFIYTtJQUFBLENBQWY7QUFBQSxJQUtBLFVBQUEsRUFBWSxTQUFFLE9BQUYsR0FBQTtBQUVWLFVBQUEsMkRBQUE7QUFBQSxNQUZXLElBQUMsQ0FBQSxVQUFBLE9BRVosQ0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFZLENBQUEsQ0FBRSxRQUFGLENBQVosQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLENBQUEsQ0FBRSxXQUFGLENBRFosQ0FBQTtBQUFBLE1BRUEsU0FBQSxHQUFZLENBQUEsQ0FBRSxXQUFGLENBRlosQ0FBQTtBQUFBLE1BSUEsU0FBUyxDQUFDLElBQVYsQ0FBZSxNQUFmLENBQXNCLENBQUMsV0FBdkIsQ0FBbUMsU0FBbkMsQ0FKQSxDQUFBO0FBQUEsTUFPQSxNQUFBLEdBQVMsUUFBUSxDQUFDLHNCQUFULENBQUEsQ0FQVCxDQUFBO0FBUUE7QUFBQSxXQUFBLDJDQUFBO3lCQUFBO0FBQ0UsUUFBQSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFpQixTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUF6QixDQUE4QixLQUE5QixDQUFqQixDQUFBLENBQUE7QUFBQSxRQUNBLEtBQUssQ0FBQyxNQUFOLEdBQWUsS0FEZixDQURGO0FBQUEsT0FSQTtBQUFBLE1BV0EsU0FBUyxDQUFDLElBQVYsQ0FBZSxNQUFmLENBWEEsQ0FBQTtBQUFBLE1BY0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDVCxVQUFBLElBQUcsSUFBSDtBQUNFLFlBQUEsS0FBQyxDQUFBLFNBQUQsR0FBYSxJQUFiLENBQUE7QUFBQSxZQUNBLFNBQVMsQ0FBQyxJQUFWLENBQWUsT0FBZixDQUF1QixDQUFDLFFBQXhCLENBQWlDLFNBQWpDLENBREEsQ0FBQTtBQUFBLFlBRUEsU0FBUyxDQUFDLFFBQVYsQ0FBbUIsU0FBbkIsQ0FGQSxDQUFBO21CQUdBLEtBQUMsQ0FBQSxXQUFELEdBQWUsV0FBQSxDQUFZLFNBQUEsR0FBQTtBQUN6QixrQkFBQSx3Q0FBQTtBQUFBLGNBQUEsS0FBQyxDQUFBLFdBQUQsR0FBZSxLQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBQSxDQUFmLENBQUE7QUFBQSxjQUNBLENBQUEsR0FBSSxJQURKLENBQUE7QUFFQTtBQUFBLG1CQUFBLDhDQUFBO2tDQUFBO0FBQ0UsZ0JBQUEsSUFBYSxLQUFLLENBQUMsUUFBTixJQUFrQixLQUFDLENBQUEsV0FBaEM7QUFBQSxrQkFBQSxDQUFBLEdBQUksS0FBSixDQUFBO2lCQURGO0FBQUEsZUFGQTtBQUlBLGNBQUEsSUFBRyxDQUFBLENBQUUsQ0FBQyxNQUFOO0FBQ0U7QUFBQSxxQkFBQSw4Q0FBQTtvQ0FBQTtBQUFBLGtCQUFBLEtBQUssQ0FBQyxNQUFOLEdBQWUsS0FBZixDQUFBO0FBQUEsaUJBQUE7QUFBQSxnQkFDQSxDQUFDLENBQUMsTUFBRixHQUFXLElBRFgsQ0FBQTtBQUFBLGdCQUVBLFNBQVMsQ0FBQyxJQUFWLENBQWUsZ0JBQWYsQ0FBZ0MsQ0FBQyxXQUFqQyxDQUE2QyxTQUE3QyxDQUZBLENBQUE7QUFBQSxnQkFHQSxTQUFTLENBQUMsSUFBVixDQUFlLHFCQUFBLEdBQXdCLENBQUMsQ0FBQyxRQUExQixHQUFxQyxJQUFwRCxDQUF5RCxDQUFDLFFBQTFELENBQW1FLFNBQW5FLENBSEEsQ0FERjtlQUpBO0FBQUEsY0FTQSxTQUFTLENBQUMsSUFBVixDQUFlLE1BQWYsQ0FBc0IsQ0FBQyxHQUF2QixDQUEyQixNQUEzQixFQUFtQyxDQUFDLEtBQUMsQ0FBQSxXQUFELEdBQWUsS0FBQyxDQUFBLFFBQWpCLENBQUEsR0FBNkIsR0FBN0IsR0FBbUMsR0FBdEUsQ0FUQSxDQUFBO0FBQUEsY0FVQSxDQUFBLEdBQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFDLENBQUEsV0FBRCxHQUFhLEVBQXhCLENBVkosQ0FBQTtBQVdBLGNBQUEsSUFBZSxDQUFBLEdBQUksRUFBbkI7QUFBQSxnQkFBQSxDQUFBLEdBQUksR0FBQSxHQUFNLENBQVYsQ0FBQTtlQVhBO3FCQVlBLFNBQVMsQ0FBQyxJQUFWLENBQWUsZUFBZixDQUErQixDQUFDLElBQWhDLENBQXFDLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBQyxDQUFBLFdBQUQsR0FBYSxFQUF4QixDQUFBLEdBQThCLEdBQTlCLEdBQW9DLENBQXpFLEVBYnlCO1lBQUEsQ0FBWixFQWNiLEdBZGEsRUFKakI7V0FBQSxNQUFBO0FBb0JFLFlBQUEsS0FBQyxDQUFBLFNBQUQsR0FBYSxLQUFiLENBQUE7QUFBQSxZQUNBLFNBQVMsQ0FBQyxJQUFWLENBQWUsT0FBZixDQUF1QixDQUFDLFdBQXhCLENBQW9DLFNBQXBDLENBREEsQ0FBQTtBQUFBLFlBRUEsU0FBUyxDQUFDLFdBQVYsQ0FBc0IsU0FBdEIsQ0FGQSxDQUFBO21CQUdBLGFBQUEsQ0FBYyxLQUFDLENBQUEsV0FBZixFQXZCRjtXQURTO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FkWCxDQUFBO0FBQUEsTUF3Q0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ2YsY0FBQSxvQ0FBQTtBQUFBLFVBQUEsS0FBQyxDQUFBLFFBQUQsR0FBWSxLQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBQSxDQUFaLENBQUE7QUFBQSxVQUNBLFFBQUEsR0FBVyxRQUFRLENBQUMsc0JBQVQsQ0FBQSxDQURYLENBQUE7QUFFQTtBQUFBLGVBQUEsOENBQUE7OEJBQUE7QUFDRSxZQUFBLEdBQUEsR0FBTSxLQUFLLENBQUMsUUFBTixHQUFpQixLQUFDLENBQUEsUUFBeEIsQ0FBQTtBQUFBLFlBQ0EsR0FBQSxHQUFNLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCLENBRE4sQ0FBQTtBQUFBLFlBRUEsR0FBRyxDQUFDLFNBQUosR0FBZ0IsT0FGaEIsQ0FBQTtBQUFBLFlBR0EsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFWLEdBQWlCLEdBQUEsR0FBSSxHQUFKLEdBQVUsR0FIM0IsQ0FBQTtBQUFBLFlBSUEsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FKQSxDQURGO0FBQUEsV0FGQTtBQUFBLFVBUUEsQ0FBQSxDQUFFLHlCQUFGLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsUUFBbEMsQ0FSQSxDQUFBO0FBQUEsVUFTQSxDQUFBLENBQUUsdUJBQUYsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQUMsQ0FBQSxRQUFELEdBQVUsRUFBckIsQ0FBQSxHQUEyQixHQUEzQixHQUFpQyxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQUMsQ0FBQSxRQUFELEdBQVUsRUFBckIsQ0FBakUsQ0FUQSxDQUFBO2lCQVVBLENBQUEsQ0FBRSx5QkFBRixDQUE0QixDQUFDLElBQTdCLENBQWtDLE1BQWxDLEVBWGU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXhDakIsQ0FBQTtBQUFBLE1BcURBLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7QUFDckIsa0JBQU8sQ0FBQyxDQUFDLElBQVQ7QUFBQSxpQkFDTyxDQURQO3FCQUVJLEtBQUMsQ0FBQSxPQUFELENBQVMsSUFBVCxFQUZKO0FBQUEsaUJBR08sQ0FIUDtxQkFJSSxLQUFDLENBQUEsT0FBRCxDQUFTLEtBQVQsRUFKSjtBQUFBLFdBRHFCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FyRHZCLENBQUE7YUE0REEsRUFBRSxDQUFDLEtBQUgsQ0FBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNQLEtBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsTUFBSCxDQUFVLGdCQUFWLEVBQ1o7QUFBQSxZQUFBLE1BQUEsRUFBUSxNQUFSO0FBQUEsWUFDQSxLQUFBLEVBQU8sTUFEUDtBQUFBLFlBRUEsT0FBQSxFQUFTLE9BQU8sQ0FBQyxPQUZqQjtBQUFBLFlBR0EsVUFBQSxFQUFZO0FBQUEsY0FBRSxHQUFBLEVBQUssQ0FBUDtBQUFBLGNBQVUsS0FBQSxFQUFPLE9BQWpCO0FBQUEsY0FBMEIsUUFBQSxFQUFVLENBQXBDO0FBQUEsY0FBdUMsUUFBQSxFQUFVLENBQWpEO0FBQUEsY0FBb0QsUUFBQSxFQUFVLENBQTlEO0FBQUEsY0FBaUUsY0FBQSxFQUFnQixDQUFqRjtBQUFBLGNBQW9GLGNBQUEsRUFBZ0IsQ0FBcEc7QUFBQSxjQUF1RyxjQUFBLEVBQWdCLENBQXZIO2FBSFo7QUFBQSxZQUlBLE1BQUEsRUFBUTtBQUFBLGNBQUUsU0FBQSxFQUFXLEtBQUMsQ0FBQSxhQUFkO0FBQUEsY0FBNkIsZUFBQSxFQUFpQixLQUFDLENBQUEsbUJBQS9DO2FBSlI7V0FEWSxFQURQO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVCxFQTlEVTtJQUFBLENBTFo7SUF0RkY7QUFBQSxDQUFGLENBQUEsQ0FBQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIiQgLT5cblxuICAkKCcjbG9nbycpLmNsaWNrIChlKSA9PlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICQoJ2h0bWwsIGJvZHknKS5zY3JvbGxUb3AgMFxuICAgICQoJy5wYWdlcyAucGFnZS5hY3RpdmUnKS5yZW1vdmVDbGFzcyAnYWN0aXZlJ1xuICAgICQoJy5wYWdlcyAucGFnZS5mcm9udHBhZ2UnKS5hZGRDbGFzcyAnYWN0aXZlJ1xuXG4gICQoJypbZGF0YS10YXJnZXRdJykuY2xpY2sgKGUpID0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgJCgnaHRtbCwgYm9keScpLnNjcm9sbFRvcCAwXG4gICAgJCgnLnBhZ2VzIC5wYWdlLmFjdGl2ZScpLnJlbW92ZUNsYXNzICdhY3RpdmUnXG4gICAgJCgnLnBhZ2VzIC5wYWdlLicgKyAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgndGFyZ2V0JykpLmFkZENsYXNzICdhY3RpdmUnXG4gICAgc3dpdGNoICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCd0YXJnZXQnKVxuICAgICAgd2hlbiAnc2V0JyB0aGVuIEBQbGF5ZXIuaW5pdFBsYXllciBEYXRhLlNldHNbMF1cbiAgICAgIGVsc2UgQFBsYXllci5kZXN0cm95UGxheWVyKClcblxuICAkKCcuc2xpZGVzaG93JykuZWFjaCAtPlxuXG4gICAgJCh0aGlzKS5kYXRhICdjdXJyZW50LXNsaWRlJywgMFxuXG4gICAgc2xpZGVXaWR0aCA9ICQodGhpcykud2lkdGgoKVxuICAgIHdyYXBwZXJXaWR0aCA9ICQoJy5zbGlkZScsIHRoaXMpLmxlbmd0aCAqIHNsaWRlV2lkdGhcblxuICAgICQoJy5zbGlkZScsIHRoaXMpLndpZHRoIHNsaWRlV2lkdGggKyAncHgnXG4gICAgJCgnLnNsaWRlcycsIHRoaXMpLndpZHRoIHdyYXBwZXJXaWR0aCArICdweCdcblxuICAgIGdvVG8gPSAobikgPT5cbiAgICAgIHNsaWRlcyA9ICQoJy5zbGlkZScsIHRoaXMpXG4gICAgICByZXR1cm4gaWYgbiA8IDAgb3IgbiA+PSBzbGlkZXMubGVuZ3RoXG4gICAgICAkKCcuc2xpZGVzJywgdGhpcykuY3NzICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlWCgtJyArIG4gKiBzbGlkZXMud2lkdGgoKSArICdweCknXG4gICAgICAkKHRoaXMpLmRhdGEgJ2N1cnJlbnQtc2xpZGUnLCBuXG4gICAgICAkKCcuc2xpZGUuYWN0aXZlJywgdGhpcykucmVtb3ZlQ2xhc3MgJ2FjdGl2ZSdcbiAgICAgICQoJy5zbGlkZScsIHRoaXMpLmVxKG4pLmFkZENsYXNzICdhY3RpdmUnXG4gICAgICAkKCcuYnVsbGV0cyBhLmFjdGl2ZScsIHRoaXMpLnJlbW92ZUNsYXNzICdhY3RpdmUnXG4gICAgICAkKCcuYnVsbGV0cyBhJywgdGhpcykuZXEobikuYWRkQ2xhc3MgJ2FjdGl2ZSdcblxuICAgICQoJy5uZXh0JywgdGhpcykub24gJ2NsaWNrJywgKGUpID0+XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGdvVG8gJCh0aGlzKS5kYXRhKCdjdXJyZW50LXNsaWRlJykgKyAxXG5cbiAgICAkKCcucHJldicsIHRoaXMpLm9uICdjbGljaycsIChlKSA9PlxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBnb1RvICQodGhpcykuZGF0YSgnY3VycmVudC1zbGlkZScpIC0gMVxuXG4gICAgJCgnLmJ1bGxldHMgYScsIHRoaXMpLm9uICdjbGljaycsIChlKSA9PlxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBnb1RvICQoZS5jdXJyZW50VGFyZ2V0KS5pbmRleCgpXG5cbiAgICByZXNpemVUaW1lb3V0ID0gbnVsbFxuICAgICQod2luZG93KS5yZXNpemUgPT5cbiAgICAgIGNsZWFyVGltZW91dCByZXNpemVUaW1lb3V0XG4gICAgICByZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dCA9PlxuICAgICAgICBpZiAkKHRoaXMpLmlzKCc6dmlzaWJsZScpXG4gICAgICAgICAgc2xpZGVXaWR0aCA9ICQodGhpcykud2lkdGgoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgc2xpZGVXaWR0aCA9ICQod2luZG93KS53aWR0aCgpXG4gICAgICAgIHdyYXBwZXJXaWR0aCA9ICQoJy5zbGlkZScsIHRoaXMpLmxlbmd0aCAqIHNsaWRlV2lkdGhcbiAgICAgICAgJCgnLnNsaWRlJywgdGhpcykud2lkdGggc2xpZGVXaWR0aCArICdweCdcbiAgICAgICAgJCgnLnNsaWRlcycsIHRoaXMpLndpZHRoIHdyYXBwZXJXaWR0aCArICdweCdcbiAgICAgICAgZ29UbyAkKHRoaXMpLmRhdGEgJ2N1cnJlbnQtc2xpZGUnXG4gICAgICAsIDQwMFxuXG4gICQoJyN0aW1lbGluZSAucGxheScpLm9uICdjbGljaycsIChlKSA9PlxuICAgIHJldHVybiBpZiAhQFBsYXllci5wbGF5ZXJcbiAgICBpZiBAUGxheWVyLmlzUGxheWluZ1xuICAgICAgQFBsYXllci5wbGF5ZXIucGF1c2VWaWRlbygpXG4gICAgZWxzZVxuICAgICAgQFBsYXllci5wbGF5ZXIucGxheVZpZGVvKClcblxuICAkKCcjdGltZWxpbmUgLmJhcicpLm9uICdjbGljaycsIChlKSA9PlxuICAgIHJldHVybiBpZiAhQFBsYXllci5wbGF5ZXJcbiAgICB3ID0gJCgnI3RpbWVsaW5lIC5saW5lJykud2lkdGgoKVxuICAgIHBvcyA9IChlLnBhZ2VYIC0gZS5jdXJyZW50VGFyZ2V0Lm9mZnNldExlZnQpIC0gMTBcbiAgICBwb3MgPSAwIGlmIHBvcyA8IDBcbiAgICBwb3MgPSB3IGlmIHBvcyA+IHdcbiAgICBwb3MgPSBwb3MgLyB3XG4gICAgcyA9IE1hdGgucm91bmQocG9zICogQFBsYXllci5kdXJhdGlvbilcbiAgICBAUGxheWVyLnBsYXllci5zZWVrVG8ocylcblxuICAkKCcjcGxheWxpc3QnKS5vbiAnY2xpY2snLCAnLnRyYWNrJywgKGUpID0+XG4gICAgcmV0dXJuIGlmICFAUGxheWVyLnBsYXllclxuICAgIEBQbGF5ZXIucGxheWVyLnNlZWtUbyAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnc3RhcnQnKVxuXG4gIEBQbGF5ZXIgPVxuXG4gICAgZGVzdHJveVBsYXllcjogLT5cbiAgICAgIEBwbGF5ZXIgPSBudWxsXG4gICAgICBjbGVhckludGVydmFsIEBkdXJhdGlvbkludFxuICAgICAgJCgnI3ZpZGVvJykuaHRtbCAkKCc8ZGl2IGlkPVwieW91dHViZS1wbGF5ZXJcIj48L2Rpdj4nKVxuXG4gICAgaW5pdFBsYXllcjogKEBzZXREYXRhKSAtPlxuXG4gICAgICAkdmlkZW8gICAgPSAkKCcjdmlkZW8nKVxuICAgICAgJGNvbnRyb2xzID0gJCgnI3RpbWVsaW5lJylcbiAgICAgICRwbGF5bGlzdCA9ICQoJyNwbGF5bGlzdCcpXG5cbiAgICAgICRjb250cm9scy5maW5kKCdwbGF5JykucmVtb3ZlQ2xhc3MgJ3BsYXlpbmcnXG5cbiAgICAgICMgcG9wdWxhdGUgdHJhY2tzXG4gICAgICB0cmFja3MgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgICAgIGZvciB0cmFjayBpbiBAc2V0RGF0YS50cmFja3NcbiAgICAgICAgJCh0cmFja3MpLmFwcGVuZCB0ZW1wbGF0ZXMucGxheWxpc3QudHJhY2sudG1wbCh0cmFjaylcbiAgICAgICAgdHJhY2suYWN0aXZlID0gZmFsc2VcbiAgICAgICRwbGF5bGlzdC5odG1sIHRyYWNrc1xuXG5cbiAgICAgIEBwbGF5aW5nID0gKHBsYXkpID0+XG4gICAgICAgIGlmIHBsYXlcbiAgICAgICAgICBAaXNQbGF5aW5nID0gdHJ1ZVxuICAgICAgICAgICRjb250cm9scy5maW5kKCcucGxheScpLmFkZENsYXNzICdwbGF5aW5nJ1xuICAgICAgICAgICRwbGF5bGlzdC5hZGRDbGFzcyAncGxheWluZydcbiAgICAgICAgICBAZHVyYXRpb25JbnQgPSBzZXRJbnRlcnZhbCA9PlxuICAgICAgICAgICAgQGN1cnJlbnRUaW1lID0gQHBsYXllci5nZXRDdXJyZW50VGltZSgpXG4gICAgICAgICAgICBsID0gbnVsbFxuICAgICAgICAgICAgZm9yIHRyYWNrIGluIEBzZXREYXRhLnRyYWNrc1xuICAgICAgICAgICAgICBsID0gdHJhY2sgaWYgdHJhY2suc3RhcnRzQXQgPD0gQGN1cnJlbnRUaW1lXG4gICAgICAgICAgICBpZiAhbC5hY3RpdmVcbiAgICAgICAgICAgICAgdHJhY2suYWN0aXZlID0gZmFsc2UgZm9yIHRyYWNrIGluIEBzZXREYXRhLnRyYWNrc1xuICAgICAgICAgICAgICBsLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgICAgICAgJHBsYXlsaXN0LmZpbmQoJy50cmFjay5jdXJyZW50JykucmVtb3ZlQ2xhc3MgJ2N1cnJlbnQnXG4gICAgICAgICAgICAgICRwbGF5bGlzdC5maW5kKCcudHJhY2tbZGF0YS1zdGFydD1cIicgKyBsLnN0YXJ0c0F0ICsgJ1wiXScpLmFkZENsYXNzICdjdXJyZW50J1xuICAgICAgICAgICAgJGNvbnRyb2xzLmZpbmQoJy5wb3MnKS5jc3MgJ2xlZnQnLCAoQGN1cnJlbnRUaW1lIC8gQGR1cmF0aW9uKSAqIDEwMCArICclJ1xuICAgICAgICAgICAgcyA9IE1hdGguZmxvb3IoQGN1cnJlbnRUaW1lJTYwKVxuICAgICAgICAgICAgcyA9ICcwJyArIHMgaWYgcyA8IDEwXG4gICAgICAgICAgICAkY29udHJvbHMuZmluZCgnLmN1cnJlbnQtdGltZScpLmh0bWwgTWF0aC5mbG9vcihAY3VycmVudFRpbWUvNjApICsgJzonICsgc1xuICAgICAgICAgICwgNTAwXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAaXNQbGF5aW5nID0gZmFsc2VcbiAgICAgICAgICAkY29udHJvbHMuZmluZCgnLnBsYXknKS5yZW1vdmVDbGFzcyAncGxheWluZydcbiAgICAgICAgICAkcGxheWxpc3QucmVtb3ZlQ2xhc3MgJ3BsYXlpbmcnXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCBAZHVyYXRpb25JbnRcblxuICAgICAgQG9uUGxheWVyUmVhZHkgPSAoZSkgPT5cbiAgICAgICAgQGR1cmF0aW9uID0gQHBsYXllci5nZXREdXJhdGlvbigpXG4gICAgICAgIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gICAgICAgIGZvciB0cmFjayBpbiBAc2V0RGF0YS50cmFja3NcbiAgICAgICAgICBwb3MgPSB0cmFjay5zdGFydHNBdCAvIEBkdXJhdGlvblxuICAgICAgICAgIGJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgICAgIGJhci5jbGFzc05hbWUgPSAndHJhY2snXG4gICAgICAgICAgYmFyLnN0eWxlLmxlZnQgPSBwb3MqMTAwICsgJyUnXG4gICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQgYmFyXG4gICAgICAgICQoJyN0aW1lbGluZSAubGluZSAudHJhY2tzJykuaHRtbCBmcmFnbWVudFxuICAgICAgICAkKCcjdGltZWxpbmUgLnRvdGFsLXRpbWUnKS5odG1sIE1hdGguZmxvb3IoQGR1cmF0aW9uLzYwKSArICc6JyArIE1hdGguZmxvb3IoQGR1cmF0aW9uJTYwKVxuICAgICAgICAkKCcjdGltZWxpbmUgLmN1cnJlbnQtdGltZScpLmh0bWwgJzA6MDAnO1xuXG4gICAgICBAb25QbGF5ZXJTdGF0ZUNoYW5nZSA9IChlKSA9PlxuICAgICAgICBzd2l0Y2ggZS5kYXRhXG4gICAgICAgICAgd2hlbiAxXG4gICAgICAgICAgICBAcGxheWluZyB0cnVlXG4gICAgICAgICAgd2hlbiAyXG4gICAgICAgICAgICBAcGxheWluZyBmYWxzZVxuXG4gICAgICBZVC5yZWFkeSA9PlxuICAgICAgICBAcGxheWVyID0gbmV3IFlULlBsYXllciAneW91dHViZS1wbGF5ZXInLFxuICAgICAgICAgIGhlaWdodDogJzEwMCUnXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgIHZpZGVvSWQ6IHNldERhdGEudmlkZW9JZFxuICAgICAgICAgIHBsYXllclZhcnM6IHsgcmVsOiAwLCB0aGVtZTogJ2xpZ2h0Jywgc2hvd2luZm86IDAsIGNvbnRyb2xzOiAwLCBhdXRvaGlkZTogMSwgbW9kZXN0YnJhbmRpbmc6IDEsIGNjX2xvYWRfcG9saWN5OiAwLCBpdl9sb2FkX3BvbGljeTogMyB9XG4gICAgICAgICAgZXZlbnRzOiB7ICdvblJlYWR5JzogQG9uUGxheWVyUmVhZHksICdvblN0YXRlQ2hhbmdlJzogQG9uUGxheWVyU3RhdGVDaGFuZ2UgfVxuXG5cblxuIl19
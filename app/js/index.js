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
      return $('.pages .page.' + $(e.currentTarget).data('target')).addClass('active');
    };
  })(this));
  return $('.slideshow').each(function() {
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
});

//# sourceMappingURL=data:application/json;base64,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QixZQUFBLEdBQWUsSUFBeEMsQ0FOQSxDQUFBO2lCQU9BLElBQUEsQ0FBSyxDQUFBLENBQUUsS0FBRixDQUFPLENBQUMsSUFBUixDQUFhLGVBQWIsQ0FBTCxFQVJ5QjtRQUFBLENBQVgsRUFTZCxHQVRjLEVBRkQ7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQixFQWpDbUI7RUFBQSxDQUFyQixFQWRBO0FBQUEsQ0FBRixDQUFBLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyIkIC0+XG5cbiAgJCgnI2xvZ28nKS5jbGljayAoZSkgPT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAkKCdodG1sLCBib2R5Jykuc2Nyb2xsVG9wIDBcbiAgICAkKCcucGFnZXMgLnBhZ2UuYWN0aXZlJykucmVtb3ZlQ2xhc3MgJ2FjdGl2ZSdcbiAgICAkKCcucGFnZXMgLnBhZ2UuZnJvbnRwYWdlJykuYWRkQ2xhc3MgJ2FjdGl2ZSdcblxuICAkKCcqW2RhdGEtdGFyZ2V0XScpLmNsaWNrIChlKSA9PlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICQoJ2h0bWwsIGJvZHknKS5zY3JvbGxUb3AgMFxuICAgICQoJy5wYWdlcyAucGFnZS5hY3RpdmUnKS5yZW1vdmVDbGFzcyAnYWN0aXZlJ1xuICAgICQoJy5wYWdlcyAucGFnZS4nICsgJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ3RhcmdldCcpKS5hZGRDbGFzcyAnYWN0aXZlJ1xuXG4gICQoJy5zbGlkZXNob3cnKS5lYWNoIC0+XG5cbiAgICAkKHRoaXMpLmRhdGEgJ2N1cnJlbnQtc2xpZGUnLCAwXG5cbiAgICBzbGlkZVdpZHRoID0gJCh0aGlzKS53aWR0aCgpXG4gICAgd3JhcHBlcldpZHRoID0gJCgnLnNsaWRlJywgdGhpcykubGVuZ3RoICogc2xpZGVXaWR0aFxuXG4gICAgJCgnLnNsaWRlJywgdGhpcykud2lkdGggc2xpZGVXaWR0aCArICdweCdcbiAgICAkKCcuc2xpZGVzJywgdGhpcykud2lkdGggd3JhcHBlcldpZHRoICsgJ3B4J1xuXG4gICAgZ29UbyA9IChuKSA9PlxuICAgICAgc2xpZGVzID0gJCgnLnNsaWRlJywgdGhpcylcbiAgICAgIHJldHVybiBpZiBuIDwgMCBvciBuID49IHNsaWRlcy5sZW5ndGhcbiAgICAgICQoJy5zbGlkZXMnLCB0aGlzKS5jc3MgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGVYKC0nICsgbiAqIHNsaWRlcy53aWR0aCgpICsgJ3B4KSdcbiAgICAgICQodGhpcykuZGF0YSAnY3VycmVudC1zbGlkZScsIG5cbiAgICAgICQoJy5zbGlkZS5hY3RpdmUnLCB0aGlzKS5yZW1vdmVDbGFzcyAnYWN0aXZlJ1xuICAgICAgJCgnLnNsaWRlJywgdGhpcykuZXEobikuYWRkQ2xhc3MgJ2FjdGl2ZSdcbiAgICAgICQoJy5idWxsZXRzIGEuYWN0aXZlJywgdGhpcykucmVtb3ZlQ2xhc3MgJ2FjdGl2ZSdcbiAgICAgICQoJy5idWxsZXRzIGEnLCB0aGlzKS5lcShuKS5hZGRDbGFzcyAnYWN0aXZlJ1xuXG4gICAgJCgnLm5leHQnLCB0aGlzKS5vbiAnY2xpY2snLCAoZSkgPT5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZ29UbyAkKHRoaXMpLmRhdGEoJ2N1cnJlbnQtc2xpZGUnKSArIDFcblxuICAgICQoJy5wcmV2JywgdGhpcykub24gJ2NsaWNrJywgKGUpID0+XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGdvVG8gJCh0aGlzKS5kYXRhKCdjdXJyZW50LXNsaWRlJykgLSAxXG5cbiAgICAkKCcuYnVsbGV0cyBhJywgdGhpcykub24gJ2NsaWNrJywgKGUpID0+XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGdvVG8gJChlLmN1cnJlbnRUYXJnZXQpLmluZGV4KClcblxuICAgIHJlc2l6ZVRpbWVvdXQgPSBudWxsXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSA9PlxuICAgICAgY2xlYXJUaW1lb3V0IHJlc2l6ZVRpbWVvdXRcbiAgICAgIHJlc2l6ZVRpbWVvdXQgPSBzZXRUaW1lb3V0ID0+XG4gICAgICAgIGlmICQodGhpcykuaXMoJzp2aXNpYmxlJylcbiAgICAgICAgICBzbGlkZVdpZHRoID0gJCh0aGlzKS53aWR0aCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzbGlkZVdpZHRoID0gJCh3aW5kb3cpLndpZHRoKClcbiAgICAgICAgd3JhcHBlcldpZHRoID0gJCgnLnNsaWRlJywgdGhpcykubGVuZ3RoICogc2xpZGVXaWR0aFxuICAgICAgICAkKCcuc2xpZGUnLCB0aGlzKS53aWR0aCBzbGlkZVdpZHRoICsgJ3B4J1xuICAgICAgICAkKCcuc2xpZGVzJywgdGhpcykud2lkdGggd3JhcHBlcldpZHRoICsgJ3B4J1xuICAgICAgICBnb1RvICQodGhpcykuZGF0YSAnY3VycmVudC1zbGlkZSdcbiAgICAgICwgNDAwIl19
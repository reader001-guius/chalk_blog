
$(document).ready(function() {
  // Article table of contents
  var $toc = $('[data-toc]');
  var $article = $('.article');
  var $headings = $('.article-content').find('h2, h3, h4');

  if ($toc.length && $headings.length) {
    var usedIds = {};
    var $list = $toc.find('ol');

    $headings.each(function() {
      var heading = this;
      var $heading = $(heading);
      var title = $.trim($heading.text());

      if (!title) {
        return;
      }

      var id = $heading.attr('id');
      if (!id) {
        id = title.toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
          .replace(/^-|-$/g, '');
      }

      if (!id) {
        id = 'section';
      }

      var baseId = id;
      var index = usedIds[baseId] || 0;
      usedIds[baseId] = index + 1;
      if (index) {
        id = baseId + '-' + index;
      }

      $heading.attr('id', id);

      $('<li>')
        .addClass('toc-level-' + heading.tagName.slice(1))
        .append($('<a>').attr('href', '#' + id).text(title))
        .appendTo($list);
    });

    $article.addClass('article-toc-enabled');

    var $tocLinks = $toc.find('a');
    var setActiveTocLink = function() {
      var activeId = $headings.first().attr('id');
      var scrollTop = $(window).scrollTop();

      $headings.each(function() {
        if ($(this).offset().top - 130 <= scrollTop) {
          activeId = $(this).attr('id');
        }
      });

      $tocLinks.removeClass('active');
      $tocLinks.filter(function() {
        return $(this).attr('href') === '#' + activeId;
      }).addClass('active');
    };

    setActiveTocLink();
    $(window).on('scroll resize', setActiveTocLink);
  }

  // ScrollAppear
  if (typeof $.fn.scrollAppear === 'function') {
    $('.scrollappear').scrollAppear();
  }

  // Zooming
  new Zooming(
    {customSize: '100%', scaleBase: 0.9, scaleExtra: 0}
  ).listen('.zooming');

  // Share buttons
  $('.article-share a').on('click', function() {
    window.open($(this).attr('href'), 'Share', 'width=200,height=200,noopener');
    return false;
  });
});

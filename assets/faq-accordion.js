// FAQ 게시판 아코디언
// 질문을 클릭하면 부드럽게 펼쳐지고, 다른 질문을 열면 기존에 열려있던
// 질문은 부드럽게 닫힙니다. (한 번에 하나만 열리는 방식)

document.addEventListener('DOMContentLoaded', function () {
  var lists = document.querySelectorAll('.faq-board__list');

  lists.forEach(function (list) {
    var rows = Array.prototype.slice.call(list.querySelectorAll('.faq-board__row'));

    rows.forEach(function (row) {
      var btn = row.querySelector('.faq-board__q');
      if (!btn) return;

      btn.addEventListener('click', function () {
        var wasOpen = row.classList.contains('is-open');

        rows.forEach(function (r) {
          r.classList.remove('is-open');
          var b = r.querySelector('.faq-board__q');
          var icon = r.querySelector('.faq-board__icon');
          if (b) b.setAttribute('aria-expanded', 'false');
          if (icon) icon.textContent = '+';
        });

        if (!wasOpen) {
          row.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          var icon = row.querySelector('.faq-board__icon');
          if (icon) icon.textContent = '−';
        }
      });
    });
  });
});

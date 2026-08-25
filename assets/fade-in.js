// 섹션별 스크롤 페이드인 효과
// .fade-in-section 클래스가 붙은 요소가 화면에 보이면 .is-visible을 추가해
// CSS 트랜지션(1초)으로 서서히 나타나게 합니다.

document.addEventListener('DOMContentLoaded', function () {
  var targets = document.querySelectorAll('.fade-in-section');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    // 구형 브라우저 대응: 관찰 없이 바로 표시
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // 한 번 나타난 뒤에는 다시 사라지지 않음
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  targets.forEach(function (el) { observer.observe(el); });
});

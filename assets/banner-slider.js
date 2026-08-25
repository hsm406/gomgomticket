// 히어로 아래 슬라이드 배너
// - 좌측(다음 슬라이드)으로 자동 이동
// - 대기시간 5초 + 넘어가는 시간 2초 (총 7초 주기)
// - 좌우 버튼으로 수동 이동 가능, 끝에서 자연스럽게 처음/끝으로 순환

document.addEventListener('DOMContentLoaded', function () {
  var slider = document.querySelector('.banner-slider');
  if (!slider) return;

  var track = slider.querySelector('.banner-slider__track');
  var realSlides = Array.prototype.slice.call(track.children);
  var count = realSlides.length;
  if (count < 2) return; // 슬라이드가 1개 이하면 자동/버튼 넘김 불필요

  var WAIT_MS = 5000;       // 대기시간 5초
  var TRANSITION_MS = 2000; // 넘어가는 시간 2초

  // 무한 순환을 위해 앞뒤로 복제 슬라이드 추가
  var firstClone = realSlides[0].cloneNode(true);
  var lastClone = realSlides[count - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, realSlides[0]);

  var index = 1; // 복제 슬라이드 때문에 실제 첫 슬라이드는 index 1
  var timer = null;

  function setTransform(withTransition) {
    track.classList.toggle('no-transition', !withTransition);
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
  }

  setTransform(false); // 초기 위치 세팅 (애니메이션 없이)

  function goTo(newIndex) {
    index = newIndex;
    setTransform(true);
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  // 끝에 도달하면 트랜지션 없이 반대쪽 실제 슬라이드로 순간 이동
  track.addEventListener('transitionend', function () {
    if (index === count + 1) {
      index = 1;
      setTransform(false);
    } else if (index === 0) {
      index = count;
      setTransform(false);
    }
  });

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(next, WAIT_MS + TRANSITION_MS);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  var prevBtn = slider.querySelector('.banner-slider__btn--prev');
  var nextBtn = slider.querySelector('.banner-slider__btn--next');

  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAutoplay(); });

  startAutoplay();
});

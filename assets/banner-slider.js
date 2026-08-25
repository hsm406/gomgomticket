// 히어로 아래 슬라이드 배너
// - 좌측(다음 슬라이드)으로 자동 이동
// - 대기시간 5초 + 넘어가는 시간 2초
// - 좌우 버튼으로 수동 이동 가능, 끝에서 자연스럽게 처음/끝으로 순환
//
// 이전 버전은 setInterval로 "매 7초마다 무조건 다음 슬라이드"를 실행했는데,
// 브라우저 렌더링 지연 등으로 타이밍이 어긋나면 전환(transitionend)이 끝나기
// 전에 다음 전환이 겹쳐 실행되면서 index가 범위를 벗어나 빈 화면이 나오는
// 문제가 있었음. 지금은 "이전 전환이 끝난 뒤" 다음 전환을 예약하는 방식으로
// 바꿔서 타이밍이 어긋날 일이 없도록 함 (+ 혹시 범위를 벗어나도 자동 보정).

document.addEventListener('DOMContentLoaded', function () {
  var slider = document.querySelector('.banner-slider');
  if (!slider) return;

  var track = slider.querySelector('.banner-slider__track');
  var realSlides = Array.prototype.slice.call(track.children);
  var count = realSlides.length;
  if (count < 2) return; // 슬라이드가 1개 이하면 자동/버튼 넘김 불필요

  var WAIT_MS = 5000;       // 대기시간 5초
  var TRANSITION_MS = 2000; // 넘어가는 시간 2초 (CSS transition 시간과 일치해야 함)

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

  function stopAutoplay() {
    if (timer) clearTimeout(timer);
    timer = null;
  }

  // 다음 자동 전환은 "지금" 예약하는 게 아니라, 현재 전환이 완전히 끝난
  // 뒤( transitionend 시점 )에만 예약한다. 이렇게 하면 전환 도중에 다음
  // 전환이 겹쳐 실행될 수가 없다.
  function scheduleNext() {
    stopAutoplay();
    timer = setTimeout(next, WAIT_MS);
  }

  // 끝에 도달하면 트랜지션 없이 반대쪽 실제 슬라이드로 순간 이동.
  // index가 정확히 count+1 / 0 이 아니라 그 이상으로 벗어난 경우까지
  // 대비해 >= / <= 로 체크(방어적 보정).
  track.addEventListener('transitionend', function (e) {
    if (e.target !== track || e.propertyName !== 'transform') return;

    if (index >= count + 1) {
      index = 1;
      setTransform(false);
    } else if (index <= 0) {
      index = count;
      setTransform(false);
    }

    scheduleNext();
  });

  var prevBtn = slider.querySelector('.banner-slider__btn--prev');
  var nextBtn = slider.querySelector('.banner-slider__btn--next');

  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); scheduleNext(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); scheduleNext(); });

  scheduleNext(); // 최초 자동 전환 예약 (WAIT_MS 뒤)
});

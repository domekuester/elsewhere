import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionSurface = document.querySelector('.hero, [data-reveal], [data-photo-reveal], .premise, .memory-mark');

if (!reduceMotion && motionSurface) {
  gsap.registerPlugin(ScrollTrigger);

  if (document.querySelector('.hero')) {
    gsap.from('.hero-title span', {
      yPercent: 102,
      duration: .82,
      stagger: .06,
      ease: 'expo.out',
      delay: .08,
    });

    gsap.from('.hero-media img', {
      scale: 1.025,
      duration: 1.25,
      ease: 'expo.out',
    });
  }

  document.querySelectorAll<HTMLElement>('[data-reveal], [data-photo-reveal]').forEach((element) => {
    const image = element.querySelector('img');
    if (!image) return;
    gsap.fromTo(element, { clipPath: 'inset(0 0 100% 0)' }, {
      clipPath: 'inset(0 0 0% 0)',
      duration: .72,
      ease: 'expo.out',
      scrollTrigger: { trigger: element, start: 'top 94%', once: true },
    });
    gsap.fromTo(image, { scale: 1.045 }, {
      scale: 1,
      duration: .95,
      ease: 'expo.out',
      scrollTrigger: { trigger: element, start: 'top 94%', once: true },
    });
  });

  if (document.querySelector('.premise')) {
    gsap.from('.premise > p', {
      y: 28,
      opacity: 0,
      duration: .72,
      stagger: .08,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.premise', start: 'top 86%', once: true },
    });
  }

  document.querySelectorAll<HTMLElement>('.memory-mark').forEach((mark) => {
    gsap.from(mark, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: .45,
      ease: 'power3.out',
      scrollTrigger: { trigger: mark, start: 'top 94%', once: true },
    });
  });
}

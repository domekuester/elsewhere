import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionSurface = document.querySelector('.hero, [data-reveal], [data-photo-reveal], .premise, .memory-mark');

if (!reduceMotion && motionSurface) {
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.88 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  if (document.querySelector('.hero')) {
    gsap.from('.hero-title span', {
      yPercent: 110,
      duration: 1.2,
      stagger: 0.09,
      ease: 'expo.out',
      delay: 0.2,
    });

    gsap.from('.hero-media img', {
      scale: 1.06,
      duration: 2,
      ease: 'expo.out',
    });
  }

  document.querySelectorAll<HTMLElement>('[data-reveal], [data-photo-reveal]').forEach((element) => {
    const image = element.querySelector('img');
    if (!image) return;
    gsap.fromTo(element, { clipPath: 'inset(0 0 100% 0)' }, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.15,
      ease: 'expo.out',
      scrollTrigger: { trigger: element, start: 'top 88%', once: true },
    });
    gsap.fromTo(image, { scale: 1.045 }, {
      scale: 1,
      duration: 1.5,
      ease: 'expo.out',
      scrollTrigger: { trigger: element, start: 'top 88%', once: true },
    });
  });

  if (document.querySelector('.premise')) {
    gsap.from('.premise > p', {
      y: 28,
      opacity: 0,
      duration: 1,
      stagger: 0.14,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.premise', start: 'top 78%', once: true },
    });
  }

  document.querySelectorAll<HTMLElement>('.memory-mark').forEach((mark) => {
    gsap.from(mark, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: mark, start: 'top 90%', once: true },
    });
  });

  if (document.querySelector('.hero')) {
    gsap.to('.hero-media img', {
      yPercent: 7,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}

export default {
  data() {
    return {};
  },
  mounted() {
    // trigger statistics counter on window scroll
    this.triggerStatisticsCounter();
  },
  methods: {
    // trigger statistics counter on window scroll
    triggerStatisticsCounter() {
      const statsSectionElement = this.$refs.statsSection;

      if (!statsSectionElement) { return; }

      const counterHandler = () => {
        const scrollPosition = window.scrollY;
        const statisticsEl = this.$refs.statsList;
        const counterEl = statisticsEl.querySelectorAll(".statsSC__statsList__item__count");

        // check for current scroll position to trigger counting up in statistic section
        if (scrollPosition >= statisticsEl.getBoundingClientRect().top + (statisticsEl.offsetHeight + 200)) {
          counterEl.forEach(el => this.statisticsCounter(el, 2000));

          // remove listener 
          window.removeEventListener("scroll", counterHandler);
        }
      };

      // add listener
      window.addEventListener("scroll", counterHandler);
    },

    // statistics counter
    statisticsCounter(el, dur) {
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(dur / 2 / frameDuration);
      const easeOutQuad = t => t * (2 - t);

      let frame = 0;
      const countTo = parseInt(el.getAttribute("data-count"), 10);

      const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentCount = Math.round(countTo * progress);

        if (parseInt(el.innerHTML, 10) !== currentCount) {
          el.innerHTML = String(currentCount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        if (frame === totalFrames) {
          clearInterval(counter);
        }
      }, frameDuration);
    },
  },
};

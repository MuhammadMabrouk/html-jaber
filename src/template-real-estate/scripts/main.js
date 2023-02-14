// main vue app
// ------------
import pagesMixins from "../../pages/pages.mixins";
import formsMixin from "./forms.mixin";
import mapsMixin from "./maps.mixin";
import headerMixin from "../components/header/header.mixin";
import navMenuMixin from "../components/header/nav-menu/nav-menu.mixin";
import heroMixin from "../components/hero/hero.mixin";
import statsMixin from "../components/stats/stats.mixin";
import comparePropsMixin from "../components/compare-props/compare-props.mixin";
import filterSidebarMixin from "../components/sidebar/filter-sidebar/filter-sidebar.mixin";

import VueClickAway from "vue3-click-away";

// dom-slider package
const { slideToggle, slideUp } = window.domSlider;

const app = Vue.createApp({
  mixins: [
    ...pagesMixins,
    formsMixin,
    mapsMixin,
    headerMixin,
    navMenuMixin,
    heroMixin,
    statsMixin,
    comparePropsMixin,
    filterSidebarMixin,
  ],
  data() {
    return {
      // flag to toggle focus style class
      isAnyFocus: false,

      // toast notifications array
      notifications: [],

      // manage loading spinner status
      ajaxLoading: [],

      // store splide slider instances (ids)
      splideSliders: {},

      // store leaflet map instances
      leafletMaps: {},

      // properties layout type
      propertiesLayout: "layout-grid",
      savedPropertiesLayout: null,
    };
  },
  mounted() {
    // preloader screen
    this.preloaderScreen();

    if (window.innerWidth >= 992) {
      // initialize circle cursor
      this.initCircleCursor();

      // initialize sticky sidebar plugin
      this.initStickySidebar();
    }

    // initialize glightbox plugin
    new GLightbox({ autoplayVideos: false });

    // actions after page load
    window.addEventListener("load", () => {
      // applying splide slider
      document.querySelectorAll(".splide").forEach(el => {
        if (el.id === "propDetailsMainSlider" || el.id === "propDetailsThumbSlider") { return; }
        this.splideSliders[el.id] = new Splide(el).mount();
      });

      // property details page gallery slider
      const propDetailsMainSlider = document.getElementById("propDetailsMainSlider");
      const propDetailsThumbSlider = document.getElementById("propDetailsThumbSlider");

      if (propDetailsMainSlider && propDetailsThumbSlider) {
        const mainSlider = new Splide(propDetailsMainSlider);
        const thumbSlider = new Splide(propDetailsThumbSlider);

        mainSlider.sync(thumbSlider);
        mainSlider.mount();
        thumbSlider.mount();
      }
    });

    // get properties layout
    this.getPropertiesLayout();

    // use saved properties layout
    this.changePropertiesLayout(this.savedPropertiesLayout);

    // compare properties page responsive
    this.comparePropsPageResponsive();
  },
  methods: {
    // preloader screen
    preloaderScreen() {
      let count = 0;
      const preloader = this.$refs.preloader;

      if (!preloader) { return; }

      const imgs = [...document.images];
      const imgsLength = imgs.length;
      const hidePreloader = () => {
        preloader.setAttribute("style", "--loading-percentage: 100%");
        preloader.classList.add("is-done");
      }
      const imgLoaded = () => {
        count++;

        this.loadingPercentage = ((100 / imgsLength) * count) << 0;
        preloader.setAttribute("style", `--loading-percentage: ${this.loadingPercentage}%`);

        if (count === imgsLength) { hidePreloader(); }
      }

      if (imgsLength) {

        // setup preloader indicator
        imgs.forEach(img => {
          const tImg = new Image();

          tImg.onload = imgLoaded;
          tImg.onerror = imgLoaded;
          tImg.src = img.src;
        });

      } else { hidePreloader(); }
    },

    // initialize circle cursor
    initCircleCursor() {
      const app = this.$refs.appRef;
      const outer = this.$refs.circleCursorOuter;
      const inner = this.$refs.circleCursorInner;

      // return if disabled
      if (!outer || !inner) { return; }

      app.addEventListener('mousemove', e => {
        // make the circles follow the cursor
        outer.setAttribute('style', `visibility: visible; top: ${e.clientY}px; left: ${e.clientX}px;`);
        inner.setAttribute('style', `visibility: visible; top: ${e.clientY}px; left: ${e.clientX}px;`);

        // add link hover style
        (e.target.closest('a') || e.target.closest('button') || e.target.closest('.linkhover')) ? inner.classList.add('circlecursor--linkhover') : inner.classList.remove('circlecursor--linkhover');
      });

      app.addEventListener('click', () => {
        // add pulse effect on click
        inner.classList.add('circlecursor--clickeffect');
        setTimeout(() => inner.classList.remove('circlecursor--clickeffect'), 200);
      });
    },

    // initialize sticky sidebar plugin
    initStickySidebar() {
      const stickySidebar = document.querySelector(".stickySidebar");

      if (!stickySidebar) { return; }

      const sidebar = new StickySidebar(stickySidebar, {
        topSpacing: 90,
        bottomSpacing: 24,
        containerSelector: ".hasStickySidebar",
        innerWrapperSelector: ".stickySidebar__inner"
      });
    },

    // go to prev slide in agents slider on homepage
    agentsSliderGoPrev() {
      this.splideSliders.agentsSlider.go('<');
    },

    // go to next slide in agents slider on homepage
    agentsSliderGoNext() {
      this.splideSliders.agentsSlider.go('>');
    },

    // go to prev slide in featuredProperty slider on homepage
    featuredPropertySliderGoPrev() {
      this.splideSliders.featuredPropertySlider.go('<');
    },

    // go to next slide in featuredProperty slider on homepage
    featuredPropertySliderGoNext() {
      this.splideSliders.featuredPropertySlider.go('>');
    },

    // get properties layout
    getPropertiesLayout() {
      // get saved properties layout from localStorage
      const storageSavedPropertiesLayout = localStorage.getItem("jaberSavedPropertiesLayout");

      // Check to see if there a saved layout
      if (storageSavedPropertiesLayout) {
        this.savedPropertiesLayout = storageSavedPropertiesLayout;
      } else {
        this.savedPropertiesLayout = this.propertiesLayout;
      }
    },

    // change properties layout
    changePropertiesLayout(layout) {
      this.propertiesLayout = layout;

      // save the new layout in the localStorage
      this.savedPropertiesLayout = layout;
      localStorage.setItem("jaberSavedPropertiesLayout", this.savedPropertiesLayout);
    },

    // compare properties page responsive
    comparePropsPageResponsive() {
      const comparePropsPage = this.$refs.comparePropertiesPage;
      const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

      if (!comparePropsPage || width >= 992) { return; }

      const cols = comparePropsPage.querySelector(".comparePropsSC__cols");
      const children = [...cols.children];
      const firstColCells = [...children.at(0).children];

      children.forEach((col, index) => {
        if (index === 0) { return; }
        else {
          [...col.children].forEach((cell, i) => {
            firstColCells[i].insertAdjacentHTML("beforeend", `<div>${cell.innerHTML}</div>`);
          });
        }
      });
    },

    // toggle accordion tabs
    toggleAccordion(e) {
      const el = e.target;
      const content = el.nextSibling;
      const parent = el.parentElement;
      const tabClasses = parent.classList;

      if (tabClasses.contains("active")) {
        tabClasses.remove("active");
      } else {
        tabClasses.add("active");
      }
      slideToggle({ element: content });
    },

    // show messages by toast notifications
    setNotify({id, className, msg, time}) {
      const notify = {
        id: id || `${Date.now()}${this.notifications.length}`,
        className,
        msg,
        time
      };

      if (id) {
        (!this.notifications.some(e => e.id === id)) && this.notifications.push(notify);

      } else { this.notifications.push(notify); }

      // remove this notification from the array after (n) seconds
      time && setTimeout(() => this.dismissNotify(notify.id), time);
    },

    // dismiss the notifications
    dismissNotify(id) {
      const index = this.notifications.findIndex(notify => notify.id === id);
      (index > -1) && this.notifications.splice(index, 1);
    },

    // add ajax loading spinner
    startLoading() {
      this.ajaxLoading.push(true);
    },

    // remove ajax loading spinner
    endLoading() {
      this.ajaxLoading.pop();
    },
  },
  computed: {
    // flag to toggle ajax loading spinner
    isAjaxLoading() {
      return this.ajaxLoading.some(state => state === true);
    },
  },
});

app.use(VueClickAway);
app.mount("#app");

// dom-slider package
const { slideToggle } = window.domSlider;

export default {
  data() {
    return {
      // flag to toggle side menu
      isSideMenuOpen: false,
    };
  },
  mounted() {
    // side menu tab trap
    this.sideMenuTabTrap();
  },
  methods: {
    // toggle side menu
    toggleSideMenu() {
      this.isSideMenuOpen = !this.isSideMenuOpen;
      this.isSideMenuOpen ? this.openSideMenu() : this.closeSideMenu();
    },

    // open side menu
    openSideMenu() {
      this.isSideMenuOpen = true;

      // set focus on side menu
      this.$refs.sideMenuWrapper.focus();
    },

    // close side menu
    closeSideMenu() {
      this.isSideMenuOpen = false;

      // set focus on side menu toggle button
      this.$refs.sideMenuToggleBtn.focus();
    },

    // toggle side menu sub-menu
    toggleSubMenu(el) {
      const elClasses = el.currentTarget.classList;

      elClasses.contains("hasDropdown__toggle--open")
        ? elClasses.remove("hasDropdown__toggle--open")
        : elClasses.add("hasDropdown__toggle--open");
      slideToggle({ element: el.currentTarget.nextSibling });
    },

    // side menu tab trap
    sideMenuTabTrap() {
      const sideMenuWrapper = this.$refs.sideMenuWrapper;
      const focusableElementsString =
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]';
      let firstTabStop;
      let lastTabStop;
      let isFirstTabStop;
      let isLastTabStop;

      document.addEventListener("keyup", e => {
        if (sideMenuWrapper.classList.contains("sideMenuWrapper--open")) {
          // get first & last focusable elements in the side menu for the tab trap
          const visibleFocusableEls = [
            ...sideMenuWrapper.querySelectorAll(focusableElementsString),
          ].filter(
            el =>
              window.getComputedStyle(el).getPropertyValue("visibility") !==
              "hidden"
          );
          firstTabStop = visibleFocusableEls[0];
          lastTabStop = visibleFocusableEls[visibleFocusableEls.length - 1];

          if (e.code === "Tab") {
            if (e.shiftKey) {
              /* shift + tab */ // if this is the first item, move to the last item
              isFirstTabStop && lastTabStop.focus();
            } /* tab */ else {
              // if this is the last item, go back to the first item
              isLastTabStop && firstTabStop.focus();
            }

            // close side menu on Escape button press
          } else if (e.code === "Escape") {
            this.closeSideMenu();
          }

          // get current active element
          const activeEl = document.activeElement;

          // check if last item or not
          isLastTabStop = activeEl === lastTabStop ? true : false;

          // check if first item or not
          isFirstTabStop = activeEl === firstTabStop ? true : false;
        }
      });
    },
  },
};

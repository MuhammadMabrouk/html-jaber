export default {
  data() {
    return {
      // app theme
      appTheme: "lightTheme",
      savedTheme: null,

      // header search form visibility flag
      isHeaderSearchFormOpen: false,

      // header user menu visibility flag
      isHeaderUserMenuOpen: false,

      // for toggling the header on scrolling down
      lastScrollPosition: 0,
      // for minimizing the header on scrolling down
      startMinimizingHeaderAt: 80,
      isHeaderExpanded: true,
      isHeaderMinimized: false,
    };
  },
  created() {
    // get a theme to use
    this.getAppTheme();

    // use this theme
    this.useTheme(this.savedTheme);
  },
  mounted() {
    // scrolling options
    this.scrollingOptions();
    document.addEventListener("scroll", () => this.scrollingOptions());
  },
  methods: {
    // get a theme to use
    getAppTheme() {
      // get the saved theme from the localStorage
      const storageSavedTheme = localStorage.getItem("jaberSavedTheme");

      // Check to see if there a saved theme
      if (storageSavedTheme) {
        this.savedTheme = storageSavedTheme;
      } else {
        // So, try to get the browser default theme or make your own default

        // Check to see if Media-Queries are supported
        if (window.matchMedia) {
          // Check if the dark-mode Media-Query matches
          if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            this.savedTheme = "darkTheme";
          } else {
            this.savedTheme = "lightTheme";
          }
        } else {
          // Default (when Media-Queries are not supported)
          this.savedTheme = this.appTheme;
        }
      }
    },

    // use the selected theme
    useTheme(theme) {
      // change the app theme
      const htmlTag = document.documentElement;
      htmlTag.setAttribute("data-theme", theme);

      // save the new theme in the localStorage
      this.savedTheme = theme;
      localStorage.setItem("jaberSavedTheme", this.savedTheme);

      // set leaflet maps tile
      Object.values(this.leafletMaps).forEach(m => this.leafletMapSetTile(m, this.savedTheme === 'lightTheme' ? 'sunny' : 'dark'));
    },

    // open header search form
    openHeaderSearchForm() {
      this.isHeaderSearchFormOpen = true;
      setTimeout(() => this.$refs.headerSearchInput.focus(), 300);
    },

    // close header search form
    closeHeaderSearchForm() {
      this.isHeaderSearchFormOpen = false;
    },

    // toggle header search form
    toggleHeaderSearchForm() {
      this.isHeaderSearchFormOpen
        ? this.closeHeaderSearchForm()
        : this.openHeaderSearchForm();
    },

    // open header user menu
    openHeaderUserMenu() {
      this.isHeaderUserMenuOpen = true;
    },

    // close header user menu
    closeHeaderUserMenu() {
      this.isHeaderUserMenuOpen = false;
    },

    // toggle header user menu
    toggleHeaderUserMenu() {
      this.isHeaderUserMenuOpen
        ? this.closeHeaderUserMenu()
        : this.openHeaderUserMenu();
    },

    // scrolling options
    scrollingOptions() {
      const scrollPosition = window.scrollY;

      // check for current scroll position to minimize the header
      this.isHeaderExpanded = scrollPosition >= this.startMinimizingHeaderAt ? false : true;
      this.isHeaderMinimized = scrollPosition > this.startMinimizingHeaderAt + 20 && scrollPosition > this.lastScrollPosition ? true : false;
      this.lastScrollPosition = scrollPosition;
    },
  },
};

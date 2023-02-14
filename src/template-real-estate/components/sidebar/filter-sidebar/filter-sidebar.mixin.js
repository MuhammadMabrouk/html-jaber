export default {
  data() {
    return {
      isPropertiesListFiltersOpen: false,
    };
  },
  mounted() {},
  methods: {
    // open properties list filters
    propertiesListOpenFilters() {
      this.isPropertiesListFiltersOpen = true;
    },

    // close properties list filters
    propertiesListCloseFilters() {
      this.isPropertiesListFiltersOpen = false;
    },
  },
};

export default {
  data() {
    return {
      // properties map markers clusters group
      propertiesMapClusters: [],

      // properties map markers count
      propertiesCount: 0,

      // properties map filter options
      propertiesMapFilters: {
        category: null,
        type: null,
        state: null,
        city: null,
        price: [],
      },
      isPropsMapFiltersOpen: false,
    };
  },
  mounted() {
    // initialize properties map
    this.propertiesMapInit();

    // initialize properties map filters values
    this.propertiesMapInitFilters();
  },
  methods: {
    // initialize properties map
    propertiesMapInit() {
      const propertiesMapElement = this.$refs.propertiesMap;

      if (!propertiesMapElement) { return; }

      // create map instance
      const coordinates = [29.961645790381894, 30.96221923828125];
      const mapOptions = {
        center: coordinates,
        zoom: 18,
        gestureHandling: true
      };
      this.leafletMaps.propertiesMap = L.map('propertiesMap', mapOptions);

      // properties map controls
      this.leafletMaps.propertiesMap.addControl(new L.Control.Fullscreen({ position: 'bottomleft' }));
      this.leafletMaps.propertiesMap.zoomControl.setPosition('bottomleft');

      // set map tile
      this.leafletMapSetTile(this.leafletMaps.propertiesMap, this.savedTheme === 'lightTheme' ? 'sunny' : 'dark');

      // get properties data
      this.getPropertiesData();
    },

    // get properties data
    getPropertiesData() {
      const priceControl = document.querySelector("#propsMapFilterForm webrouk-custom-range");
      const markerIcon = (cat, type) => {
        return L.icon({
          iconUrl: `assets/images/markers/${cat}-${type}-marker.png`,
          iconSize: [64, 64],
          iconAnchor: [32, 16]
        });
      };
      const markerPopup = (property) => {
        const prefix = priceControl._prefixChar;
        const suffix = priceControl._suffixChar;
        const numWithCommas = (val) => String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `
          <div class="popupContent">
            <a class="popupContent__imgBox" href="${property.url}">
              <img class="popupContent__imgBox__img" src="${property.imgUrl}">
              <span class="popupContent__imgBox__label ${property.category}">${property.category}</span>
              <i class="popupContent__imgBox__fa fa fa-search-plus" aria-hidden="true"></i>
            </a>
            <div class="popupContent__textBox">
              <h4 class="popupContent__textBox__title">
                <a class="popupContent__textBox__title__link anim-underline-fx" href="${property.url}">${property.title}</a>
              </h4>
              <strong class="popupContent__textBox__price">${prefix}${numWithCommas(property.price)}${suffix}</strong>
            </div>
          </div>
        `;
      };

      // get request
      fetch('assets/properties.geojson', { method: 'GET' })
        .then(res => res.json())
        .then(data => {
          this.propertiesMapClusters = L.markerClusterGroup({
            iconCreateFunction: function(cluster) {
              const html = '<div class="leaflet-cluster-icon"><span class="leaflet-cluster-count">' + cluster.getChildCount() + '</span></div>';
              return L.divIcon({ html });
            }
          });

          this.propertiesCount = 0;
          data.features.forEach(feature => {
            // apply map filters
            if (this.propertiesMapFilters.category !== "all" && this.propertiesMapFilters.category !== feature.properties.category) { return; }
            if (this.propertiesMapFilters.type && this.propertiesMapFilters.type !== feature.properties.type) { return; }
            if (this.propertiesMapFilters.state && this.propertiesMapFilters.state !== feature.properties.state) { return; }
            if (this.propertiesMapFilters.city && this.propertiesMapFilters.city !== feature.properties.city) { return; }
            if (
              this.propertiesMapFilters.price.length &&
              (+this.propertiesMapFilters.price[0] > +feature.properties.price || +this.propertiesMapFilters.price[1] < +feature.properties.price)
            ) { return; }

            this.propertiesCount++;

            const coordinates = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
            this.propertiesMapClusters.addLayer(L.marker(coordinates, {
              icon: markerIcon(feature.properties.category, feature.properties.type)
            }).bindPopup(markerPopup(feature.properties)));
          });
          this.leafletMaps.propertiesMap.addLayer(this.propertiesMapClusters);
          this.leafletMaps.propertiesMap.fitBounds(this.propertiesMapClusters.getBounds(), { padding: [40, 40] });
        })
        .catch(err => console.log(err));
    },

    // initialize properties map filters values
    propertiesMapInitFilters() {
      const propertiesMapElement = this.$refs.propertiesMap;

      if (!propertiesMapElement) { return; }

      const propsMapFilterForm = document.querySelector("#propsMapFilterForm");
      const category = propsMapFilterForm.querySelector("input[name='category']:checked").value;
      const price = propsMapFilterForm.querySelector("input[name='price']").value.split(",");
      let selects = [];

      propsMapFilterForm.querySelectorAll("select").forEach(el => selects.push(el.value));
      this.propertiesMapFilters = {
        category,
        type: selects[0],
        state: selects[1],
        city: selects[2],
        price,
      };
    },

    // filter properties map markers by category
    propsMapFilterMarkers() {
      // init filters
      this.propertiesMapInitFilters();

      // clear old layers
      this.propertiesMapClusters.clearLayers();

      // get properties filtered data
      this.getPropertiesData();
    },

    // reset properties map cities
    propsMapCitiesReset() {
      this.$refs.propsMapCitiesSelect.selectedIndex = 0;
      this.$refs.propsMapCitiesSelect.dispatchEvent(new Event("change"));
    },

    // open properties map filters
    propsMapOpenFilters() {
      this.isPropsMapFiltersOpen = true;
    },

    // close properties map filters
    propsMapCloseFilters() {
      this.isPropsMapFiltersOpen = false;
    },
  },
};

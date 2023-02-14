export default {
  data() {
    return {
      mapMarkerSVG: L.divIcon({
        html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 66">
          <path fill="hsl(var(--main-color-one))" d="M33,1C18.53,1,6.75,12.78,6.75,27.26c0,10.46,6.13,19.82,15.66,24.02l8.97,12.87C31.75,64.68,32.36,65,33,65 c0,0,0,0,0.01,0c0.64,0,1.25-0.32,1.62-0.85l8.96-12.87c9.53-4.2,15.66-13.56,15.66-24.02C59.25,12.78,47.48,1,33,1z M33,41.56 c-7.9,0-14.3-6.41-14.3-14.3c0-7.9,6.4-14.3,14.3-14.3s14.3,6.4,14.3,14.3C47.3,35.15,40.9,41.56,33,41.56z"/>
        </svg>
        `,
        iconSize: [64, 64],
        iconAnchor: [32, 64],
      }),
    };
  },
  mounted() {
    // initialize contact map
    this.contactMapInit();

    // initialize property location map
    this.propertyLocationMapInit();
  },
  methods: {
    // set tile for leaflet map
    leafletMapSetTile(map, skin) {
      const tileUrl = `https://{s}.tile.jawg.io/jawg-${skin}/{z}/{x}/{y}{r}.png?access-token={accessToken}`;
      const accessToken = 'GABDKGRaQpjQmgkOHHlWqjRyfDG0cMpVHfMUDTM1s4WyixucrLF3IZhqmAi4qzNj';
      const attribution = '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      const tiles = L.tileLayer(tileUrl, {
        maxZoom: 22,
        attribution,
        accessToken
      });

      tiles.addTo(map);
    },

    // initialize contact map
    contactMapInit() {
      const contactMapEl = document.getElementById("contactMap");

      if (!contactMapEl) { return; }

      // create map instance
      const coordinates = contactMapEl.getAttribute("data-coords").split(",");
      const mapOptions = {
        center: coordinates,
        zoom: 12,
        gestureHandling: true
      };
      this.leafletMaps.contactMap = L.map('contactMap', mapOptions);

      // map controls
      this.leafletMaps.contactMap.addControl(new L.Control.Fullscreen());

      // set map tile
      this.leafletMapSetTile(this.leafletMaps.contactMap, this.savedTheme === 'lightTheme' ? 'sunny' : 'dark');

      // set map marker
      L.marker(coordinates, { icon: this.mapMarkerSVG }).addTo(this.leafletMaps.contactMap);
    },

    // initialize property location map
    propertyLocationMapInit() {
      const propertyLocationMapEl = document.getElementById("propertyLocationMap");

      if (!propertyLocationMapEl) { return; }

      // create map instance
      const coordinates = propertyLocationMapEl.getAttribute("data-coords").split(",");
      const mapOptions = {
        center: coordinates,
        zoom: 12,
        gestureHandling: true
      };
      this.leafletMaps.propertyLocationMap = L.map('propertyLocationMap', mapOptions);

      // map controls
      this.leafletMaps.propertyLocationMap.addControl(new L.Control.Fullscreen());

      // set map tile
      this.leafletMapSetTile(this.leafletMaps.propertyLocationMap, this.savedTheme === 'lightTheme' ? 'sunny' : 'dark');

      // set map marker
      L.marker(coordinates, { icon: this.mapMarkerSVG }).addTo(this.leafletMaps.propertyLocationMap);
    },
  },
};

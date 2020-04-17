import * as locationService from '../../../services/location';
import {
  throws
} from 'assert';

let Gmap;
let Gmarker;
let Gcircle;

export default {

  data() {
    return {
      address: {},
      error: null,
      // Make it possible to conditionally render
      // elements based on if the geolocation API
      // is availabel or not.
      geolocationSupported: `geolocation` in navigator,
      loading: false,
      suggestions: false,
      coordinatesL: "",
      mapShow: false,
      city: "",
      state: "",
      country: "",
      neigbourhood: "",
      streetName: ""
      // countryOptions: ["America", "Nigeria", "London"]

    };
  },
  methods: {
    async fetchAddress() {
      try {
        // this.setLoadingState();
        // this.address = await locationService.currentAddress();
        // Reset the loading state after fetching the address.
        // this.loading = false;

        this.displayLocation();

      } catch (error) {
        this.setErrorState(error);
      }
    },
    setErrorState(error) {
      this.error = error;
      this.loading = false;
    },
    setLoadingState() {
      this.error = null;
      this.loading = true;
    },
    populate(id) {
      // reset form before filling
      this.restForm();
      this.suggestions = false;

      // filling form
      const populateAdd = this.address[id]
      this.streetName = populateAdd.formatted_address;

      populateAdd.address_components.map(component => {
        const types = component.types

        if (types.includes('locality')) {
          this.city = component.long_name
        }
        if (types.includes('administrative_area_level_1')) {
          this.state = component.long_name
        }
        if (types.includes('country')) {
          this.country = component.long_name
        }
        if (types.includes('neighborhood')) {
          this.neigbourhood = component.long_name
        }
      })
    },
    // show map method
    async showMap(latlng, lat, lng) {
      let mapOptions = {
        center: latlng,
        zoom: 17
      };
      let mapDom = document.getElementById("map");
      Gmap = new google.maps.Map(mapDom, mapOptions);

      // listen for when the map is been dragged
      Gmap.addListener('drag', function () {
        Gmarker.setPosition(this.getCenter()); // set marker position to map center
        Gcircle.setCenter(this.getCenter()); // set circle position to map center
      });

      // listen for when the map stop been dragged
      Gmap.addListener('dragend', function () {
        Gmarker.setPosition(this.getCenter()); // set marker position to map center
        Gcircle.setCenter(this.getCenter()); // set circle position to map center
      });

      // listen for idleness on map
      const self = this
      Gmap.addListener('idle', function () {
        Gmarker.setPosition(this.getCenter()); // set marker position to map center
        Gcircle.setCenter(this.getCenter()); // set circle position to map center
        if (Gmarker.getPosition().lat() !== lat || Gmarker.getPosition().lng() !== lng) {
          setTimeout(() => {
            let latitude = Gmarker.getPosition().lat()
            let longitude = Gmarker.getPosition().lng()
            let newCoord = {
              latitude,
              longitude
            }
            self.getLocation(newCoord)
          }, 800);
        }
      });
    },

    async getLocation(Newstuff) {
      this.address = await locationService.addressByCoordinates(Newstuff)
      this.suggestions = true;
    },
    createMarker(latlng) {
      let markerOptions = {
        position: latlng,
        map: Gmap,
        animation: google.maps.Animation.BOUNCE,
        clickable: true,
        draggable: false,
        icon: {
          url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIzOS4yMDUiIHZpZXdCb3g9IjAgMCAyNCAzOS4yMDUiPgogIDxnIGlkPSJHcm91cF8zOTEiIGRhdGEtbmFtZT0iR3JvdXAgMzkxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTkyIC00NzkuNzU3KSI+CiAgICA8ZyBpZD0ibWFwX2xvY2F0aW9uIiBkYXRhLW5hbWU9Im1hcCBsb2NhdGlvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTkyIDQ3OS43NTcpIj4KICAgICAgPHBhdGggaWQ9IlBhdGhfMjY1IiBkYXRhLW5hbWU9IlBhdGggMjY1IiBkPSJNNC45MDksMTQuMjY3YzAsNy41OCwxMS40NTUsMjQuMTc3LDExLjQ1NSwyNC4xNzdzMTEuNDU1LTE2LjYsMTEuNDU1LTI0LjE3N1MyMi42OS41NDUsMTYuMzY0LjU0NSw0LjkwOSw2LjY4OSw0LjkwOSwxNC4yNjdaTTE2LjM2NCw1Ljc3M2w3LjA5MSw2LjUzNEgyMS4yNzN2Ny44NDFIMTEuNDU1VjEyLjMwN0g5LjI3M1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00LjM2NCAwLjEwOCkiIGZpbGw9IiMzNjU3ZmYiLz4KICAgICAgPHBhdGggaWQ9IlBhdGhfMjY2IiBkYXRhLW5hbWU9IlBhdGggMjY2IiBkPSJNMTEuNDU1LDE5LjI4NGgzLjI3M1YxNC4wNTdIMTh2NS4yMjdoMy4yNzNWMTEuNDQzaDIuMTgyTDE2LjM2NCw0LjkwOSw5LjI3MywxMS40NDNoMi4xODJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNC4zNjQgMC45NzIpIiBmaWxsPSIjMzY1N2ZmIi8+CiAgICAgIDxwYXRoIGlkPSJQYXRoXzI2NyIgZGF0YS1uYW1lPSJQYXRoIDI2NyIgZD0iTTE0LjcyNywxMi41NDVIMTh2NS4yMjdIMTQuNzI3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQuMzY0IDIuNDgzKSIgZmlsbD0iI2JkZGJmZiIvPgogICAgICA8ZyBpZD0iR3JvdXBfMzg5IiBkYXRhLW5hbWU9Ikdyb3VwIDM4OSI+CiAgICAgICAgPHBhdGggaWQ9IlBhdGhfMjY4IiBkYXRhLW5hbWU9IlBhdGggMjY4IiBkPSJNMTYuMzY0LDM5LjIwNWEuNTE2LjUxNiwwLDAsMS0uNDIxLS4yMzdDMTUuNDcsMzguMjgzLDQuMzY0LDIyLjEsNC4zNjQsMTQuMzc1LDQuMzY0LDYuNDM2LDkuNzM2LDAsMTYuMzY0LDBzMTIsNi40MzYsMTIsMTQuMzc1YzAsNy43MjUtMTEuMTA3LDIzLjkwOC0xMS41NzksMjQuNTkzQS41MTYuNTE2LDAsMCwxLDE2LjM2NCwzOS4yMDVabTAtMzcuOWMtNi4wMjIuMDA4LTEwLjksNS44NTQtMTAuOTA5LDEzLjA2OCwwLDYuNDUxLDguODU3LDIwLjA2OSwxMC45MDksMjMuMTM4LDIuMDUzLTMuMDcsMTAuOTA5LTE2LjY4OSwxMC45MDktMjMuMTM4QzI3LjI2Niw3LjE2MSwyMi4zODYsMS4zMTUsMTYuMzY0LDEuMzA3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQuMzY0KSIgZmlsbD0iI2ZmZiIvPgogICAgICAgIDxwYXRoIGlkPSJQYXRoXzI2OSIgZGF0YS1uYW1lPSJQYXRoIDI2OSIgZD0iTTIzLjc4NywxMS4wMzQsMTYuNyw0LjVhLjQ3Ni40NzYsMCwwLDAtLjY2NSwwTDguOTQsMTEuMDM0YS43NDMuNzQzLDAsMCwwLS4xLjkxNi41Mi41MiwwLDAsMCwuNDMyLjI1NWgxLjYzNnY3LjE4OGEuNjA3LjYwNywwLDAsMCwuNTQ1LjY1M2g5LjgxOGEuNjA3LjYwNywwLDAsMCwuNTQ1LS42NTNWMTIuMmgxLjYzNkEuNjA3LjYwNywwLDAsMCwyNCwxMS41NTEuNzA2LjcwNiwwLDAsMCwyMy43ODcsMTEuMDM0Wm0tOC41MTUsNy43MDVWMTQuODE4aDIuMTgydjMuOTIxWm02LTcuODQxYS42MDcuNjA3LDAsMCwwLS41NDUuNjUzdjcuMTg4SDE4LjU0NVYxNC4xNjVBLjYwNy42MDcsMCwwLDAsMTgsMTMuNTExSDE0LjcyN2EuNjA3LjYwNywwLDAsMC0uNTQ1LjY1M3Y0LjU3NEgxMlYxMS41NTFhLjYwNy42MDcsMCwwLDAtLjU0NS0uNjUzaC0uNTc4bDUuNDg3LTUuMDU2TDIxLjg1MSwxMC45WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQuMzY0IDAuODY0KSIgZmlsbD0iI2ZmZiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K'
        }
      };
      Gmarker = new google.maps.Marker(markerOptions);
    },
    createCirle(latlng) {
      let circleOptions = {
        strokeColor: '#3657ff',
        strokeOpacity: 1,
        strokeWeight: 1,
        fillOpacity: 0,
        map: Gmap,
        center: latlng,
        radius: 100
      };
      Gcircle = new google.maps.Circle(circleOptions);
    },
    async displayLocation() {
      this.setLoadingState();
      this.coordinatesL = await locationService.currentCoordinates();
      const lat = this.coordinatesL.latitude;
      const lng = this.coordinatesL.longitude;
      const latlng = {
        lat,
        lng
      }
      this.loading = false;
      this.mapShow = true;
      this.showMap(latlng, lat, lng);
      this.createMarker(latlng);
      this.createCirle(latlng);
    },
    restForm() {
      this.country = "";
      this.streetName = "";
      this.state = "";
      this.neigbourhood = "";
      this.city = "";
    }
  },
  render() {
    return this.$scopedSlots.default({
      // Data
      address: this.address,
      error: this.error,
      geolocationSupported: this.geolocationSupported,
      loading: this.loading,
      streetName: this.streetName,
      city: this.city,
      state: this.state,
      country: this.country,
      suggestions: this.suggestions,
      neigbourhood: this.neigbourhood,
      coordinatesL: this.coordinatesL,
      mapShow: this.mapShow,

      // Methods
      fetchAddress: this.fetchAddress,
      populate: this.populate,
    });
  },


};

<template>
  <div v-if="level>=7">
    <form action @submit.prevent="handleSubmit">
      <div class="listing__wrap">
        <div class="listing__container">
          <div class="location">
            <div v-show="!mapShow">
              <h3 class="listing__title mb-2">Where’s your place located?</h3>
              <p
                class="form__input-info ml-0"
              >Members will only get your exact address once they’ve made payment</p>
            </div>

            <div v-show="mapShow">
              <h3 class="listing__title mb-2">Is the pin in the right place?</h3>
              <p
                class="form__input-info ml-0"
              >If needed, you can adjust the map so the pin is in the right location. Only confirmed guests will see this, so they know how to get to your place.</p>
              <div id="map" class="location__map mb-4"></div>
            </div>

            <button
              class="location__btn"
              v-if="geolocationSupported && !mapShow"
              type="button"
              @click="fetchAddress"
            >
              <svgicon icon="location" class="location__btn-icon"></svgicon>
              <span>{{ loading ? `Loading...` : `Pick location on map` }}</span>
            </button>
            <div
              v-if="error"
              class="error"
            >There was an error fetching your location, please try again.</div>

            <div v-show="suggestions">
              <h3
                class="form__label"
              >Click on the address that is yours or close to yours and edit the form to the correct address</h3>
              <ul class="location__suggestion-wrap">
                <li
                  v-for="(addresses, index) in address"
                  :key="index"
                  @click="populate(index)"
                  class="location__suggestion"
                >{{addresses.formatted_address}}</li>
              </ul>
            </div>

            <div class="location__form">
              <div class="form-group form__row">
                <label for="address" class="form__label">Address</label>
                <float-label class="form-group mb-2">
                  <div class="mb-2" v-if="submitted && $v.streetName.$error">
                    <div
                      class="error"
                      v-if="!$v.streetName.required"
                    >You haven't filled street details</div>
                  </div>
                  <input
                    type="text"
                    placeholder="Address"
                    v-model="streetName"
                    class="form__input"
                    ref="autocomplete"
                    name="address"
                  />
                </float-label>
              </div>

              <div class="form-group form__row">
                <label for="landmark" class="form__label">Landmark</label>
                <float-label class="form-group mb-2">
                  <input
                    type="text"
                    placeholder="Landmark"
                    v-model="neighbourhood"
                    class="form__input"
                    name="landmark"
                  />
                </float-label>

                <!-- <input v-model="neighbourhood" name="landmark" type="text" class="form__input" /> -->
              </div>

              <div class="form-group form__row">
                <label for="country" class="form__label">Country/Region</label>
                <div class="mb-2" v-if="submitted && $v.country.$error">
                  <div class="error" v-if="!$v.country.required">You haven't selected any country</div>
                </div>
                <div class="form__select">
                  <multiselect
                    v-model="country"
                    :options="countryOptions"
                    placeholder
                    @select="onCountrySelect"
                  ></multiselect>
                </div>
              </div>
              <div class="row mx-0">
                <div class="col-lg-6 col-md-6 col-sm-12 px-0 pr-md-3">
                  <div class="form-group form__row">
                    <label for="state" class="form__label">State</label>
                    <div class="mb-2" v-if="submitted && $v.state.$error">
                      <div class="error" v-if="!$v.state.required">You haven't selected any state</div>
                    </div>
                    <div class="form__select">
                      <multiselect
                        v-model="state"
                        :options="stateOptions"
                        placeholder
                        @select="onStateSelect"
                      ></multiselect>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 p-0">
                  <div class="form-group form__row">
                    <label for="city" class="form__label">City</label>

                    <float-label class="form-group mb-2">
                      <div class="mb-2" v-if="submitted && $v.city.$error">
                        <div class="error" v-if="!$v.city.required">You haven't selected any city</div>
                      </div>
                      <input
                        type="text"
                        placeholder="City"
                        v-model="city"
                        class="form__input"
                        name="city"
                      />
                    </float-label>
                    <!-- <div class="form__select">
                      <input v-model="city" name="city" type="text" class="form__input" />
                    </div>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="step">
        <div class="step__wrap">
          <div class="step__prev">
            <button
              type="button"
              class="alt__btn"
              v-show="level > 1"
              @click="decrementLevel"
            >Previous</button>
          </div>
          <button type="submit" class="step__next cta__btn">Next</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { required } from "vuelidate/lib/validators";
import routes from "../../routes";
import {
  getCountries,
  postLocation,
  getStates,
  getLocation,
  updateLocation,
  saveAndExit
} from "../../../services/listing";

import * as locationService from "../../../services/location";
import { throws } from "assert";

let Gmap;
let Gmarker;
let Gcircle;

export default {
  name: "location",
  components: {
    Multiselect
  },
  data() {
    return {
      countryOptions: [],
      stateOptions: [],
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
      neighbourhood: "",
      streetName: "",
      longitude: "",
      latitude: "",
      countryId: "",
      stateId: "",
      listingId: this.$route.params.id,
      locationStatus: null,
      countryData: null,
      stateData: null,
      submitted: false
    };
  },
  validations: {
    state: {
      required
    },
    country: {
      required
    },
    streetName: {
      required
    },
    city: {
      required
    }
  },
  methods: {
    handleSubmit(e) {
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.submit();
      // this.$forceUpdate();
    },
    async onCountrySelect(option) {
      let dataReturn = this.countryData.find(o => o.name == option);
      this.countryId = dataReturn.id;
      await this.getStates();
    },
    onStateSelect(option) {
      if (option == null) {
        return;
      } else {
        let dataReturned = this.stateData.find(x => x.name == option);
        this.stateId = dataReturned.id;
      }
    },
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
    },
    submit() {
      if (this.locationStatus == null) {
        this.postLocation();
      } else {
        this.updateLocation();
      }
    },
    getCountries() {
      getCountries().then(data => {
        this.countryData = data.data.data;
        var i;
        this.countryOptions = [];
        for (i = 0; i < data.data.data.length; i++) {
          this.countryOptions.push(data.data.data[i].name);
        }
      });
    },
    async getStates() {
      await getStates(this.countryId).then(data => {
        this.stateData = data.data.data;
        var i;
        this.stateOptions = [];
        for (i = 0; i < this.stateData.length; i++) {
          this.stateOptions.push(this.stateData[i].name);
        }
      });
    },
    async getLocationFromDB() {
      await getLocation(this.listingId)
        .then(data => {
          this.locationStatus = data.data.data.Location;
          let returnedData = data.data.data.Location;
          if (data.data.success) {
            this.city = returnedData.city;
            this.country = returnedData.country;
            this.countryId = returnedData.country_code;
            this.latitude = returnedData.latitude;
            this.longitude = returnedData.longitude;
            this.neighbourhood = returnedData.neighbourhood;
            this.state = returnedData.state;
            this.stateId = returnedData.state_code;
            this.streetName = returnedData.street_address;
            this.onCountrySelect(this.country);
          } else {
            return;
          }
        })
        .catch(function(err) {
          throw err;
        });
    },
    async saveAndExit() {
      let level = 1;
      let step = 2;
      await saveAndExit(this.listingId, level, step).then(data => {
        if (data.data.success) {
          this.$router.push("/breakdown/" + this.listingId);
        }
      });
    },
    async postLocation() {
      this.onStateSelect(this.state);
      await postLocation(
        this.listingId,
        this.streetName,
        this.neighbourhood,
        this.country,
        this.countryId,
        this.latitude,
        this.longitude,
        this.state,
        this.stateId,
        this.city
      )
        .then(data => {
          if (data.data.success) {
            this.saveAndExit();
          }
        })
        .catch(function(err) {
          throw err;
        });
    },
    async updateLocation() {
      this.onStateSelect(this.state);
      await updateLocation(
        this.listingId,
        this.streetName,
        this.neighbourhood,
        this.country,
        this.countryId,
        this.latitude,
        this.longitude,
        this.state,
        this.stateId,
        this.city
      )
        .then(data => {
          if (data.data.success) {
            this.saveAndExit();
          }
        })
        .catch(function(err) {
          throw err;
        });
    },
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
    async populate(id) {
      // reset form before filling
      this.restForm();
      this.suggestions = false;

      // filling form
      const populateAdd = this.address[id];
      this.streetName = populateAdd.formatted_address;
      this.longitude = populateAdd.geometry.location.lng;
      this.latitude = populateAdd.geometry.location.lng;

      populateAdd.address_components.map(component => {
        const types = component.types;

        if (types.includes("locality")) {
          this.city = component.long_name;
        }
        if (types.includes("country")) {
          this.country = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          this.state = component.long_name;
        }
        if (types.includes("neighborhood")) {
          this.neighbourhood = component.long_name;
        }
      });

      await this.onCountrySelect(this.country);
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
      Gmap.addListener("drag", function() {
        Gmarker.setPosition(this.getCenter()); // set marker position to map center
        Gcircle.setCenter(this.getCenter()); // set circle position to map center
      });

      // listen for when the map stop been dragged
      Gmap.addListener("dragend", function() {
        Gmarker.setPosition(this.getCenter()); // set marker position to map center
        Gcircle.setCenter(this.getCenter()); // set circle position to map center
      });

      // listen for idleness on map
      const self = this;
      Gmap.addListener("idle", function() {
        Gmarker.setPosition(this.getCenter()); // set marker position to map center
        Gcircle.setCenter(this.getCenter()); // set circle position to map center
        setTimeout(() => {
          let latitude = Gmarker.getPosition().lat();
          let longitude = Gmarker.getPosition().lng();
          let newCoord = {
            latitude,
            longitude
          };
          self.getLocation(newCoord);
        }, 800);
      });
    },

    async getLocation(Newstuff) {
      this.address = await locationService.addressByCoordinates(Newstuff);
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
          url:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIzOS4yMDUiIHZpZXdCb3g9IjAgMCAyNCAzOS4yMDUiPgogIDxnIGlkPSJHcm91cF8zOTEiIGRhdGEtbmFtZT0iR3JvdXAgMzkxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTkyIC00NzkuNzU3KSI+CiAgICA8ZyBpZD0ibWFwX2xvY2F0aW9uIiBkYXRhLW5hbWU9Im1hcCBsb2NhdGlvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTkyIDQ3OS43NTcpIj4KICAgICAgPHBhdGggaWQ9IlBhdGhfMjY1IiBkYXRhLW5hbWU9IlBhdGggMjY1IiBkPSJNNC45MDksMTQuMjY3YzAsNy41OCwxMS40NTUsMjQuMTc3LDExLjQ1NSwyNC4xNzdzMTEuNDU1LTE2LjYsMTEuNDU1LTI0LjE3N1MyMi42OS41NDUsMTYuMzY0LjU0NSw0LjkwOSw2LjY4OSw0LjkwOSwxNC4yNjdaTTE2LjM2NCw1Ljc3M2w3LjA5MSw2LjUzNEgyMS4yNzN2Ny44NDFIMTEuNDU1VjEyLjMwN0g5LjI3M1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00LjM2NCAwLjEwOCkiIGZpbGw9IiMzNjU3ZmYiLz4KICAgICAgPHBhdGggaWQ9IlBhdGhfMjY2IiBkYXRhLW5hbWU9IlBhdGggMjY2IiBkPSJNMTEuNDU1LDE5LjI4NGgzLjI3M1YxNC4wNTdIMTh2NS4yMjdoMy4yNzNWMTEuNDQzaDIuMTgyTDE2LjM2NCw0LjkwOSw5LjI3MywxMS40NDNoMi4xODJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNC4zNjQgMC45NzIpIiBmaWxsPSIjMzY1N2ZmIi8+CiAgICAgIDxwYXRoIGlkPSJQYXRoXzI2NyIgZGF0YS1uYW1lPSJQYXRoIDI2NyIgZD0iTTE0LjcyNywxMi41NDVIMTh2NS4yMjdIMTQuNzI3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQuMzY0IDIuNDgzKSIgZmlsbD0iI2JkZGJmZiIvPgogICAgICA8ZyBpZD0iR3JvdXBfMzg5IiBkYXRhLW5hbWU9Ikdyb3VwIDM4OSI+CiAgICAgICAgPHBhdGggaWQ9IlBhdGhfMjY4IiBkYXRhLW5hbWU9IlBhdGggMjY4IiBkPSJNMTYuMzY0LDM5LjIwNWEuNTE2LjUxNiwwLDAsMS0uNDIxLS4yMzdDMTUuNDcsMzguMjgzLDQuMzY0LDIyLjEsNC4zNjQsMTQuMzc1LDQuMzY0LDYuNDM2LDkuNzM2LDAsMTYuMzY0LDBzMTIsNi40MzYsMTIsMTQuMzc1YzAsNy43MjUtMTEuMTA3LDIzLjkwOC0xMS41NzksMjQuNTkzQS41MTYuNTE2LDAsMCwxLDE2LjM2NCwzOS4yMDVabTAtMzcuOWMtNi4wMjIuMDA4LTEwLjksNS44NTQtMTAuOTA5LDEzLjA2OCwwLDYuNDUxLDguODU3LDIwLjA2OSwxMC45MDksMjMuMTM4LDIuMDUzLTMuMDcsMTAuOTA5LTE2LjY4OSwxMC45MDktMjMuMTM4QzI3LjI2Niw3LjE2MSwyMi4zODYsMS4zMTUsMTYuMzY0LDEuMzA3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQuMzY0KSIgZmlsbD0iI2ZmZiIvPgogICAgICAgIDxwYXRoIGlkPSJQYXRoXzI2OSIgZGF0YS1uYW1lPSJQYXRoIDI2OSIgZD0iTTIzLjc4NywxMS4wMzQsMTYuNyw0LjVhLjQ3Ni40NzYsMCwwLDAtLjY2NSwwTDguOTQsMTEuMDM0YS43NDMuNzQzLDAsMCwwLS4xLjkxNi41Mi41MiwwLDAsMCwuNDMyLjI1NWgxLjYzNnY3LjE4OGEuNjA3LjYwNywwLDAsMCwuNTQ1LjY1M2g5LjgxOGEuNjA3LjYwNywwLDAsMCwuNTQ1LS42NTNWMTIuMmgxLjYzNkEuNjA3LjYwNywwLDAsMCwyNCwxMS41NTEuNzA2LjcwNiwwLDAsMCwyMy43ODcsMTEuMDM0Wm0tOC41MTUsNy43MDVWMTQuODE4aDIuMTgydjMuOTIxWm02LTcuODQxYS42MDcuNjA3LDAsMCwwLS41NDUuNjUzdjcuMTg4SDE4LjU0NVYxNC4xNjVBLjYwNy42MDcsMCwwLDAsMTgsMTMuNTExSDE0LjcyN2EuNjA3LjYwNywwLDAsMC0uNTQ1LjY1M3Y0LjU3NEgxMlYxMS41NTFhLjYwNy42MDcsMCwwLDAtLjU0NS0uNjUzaC0uNTc4bDUuNDg3LTUuMDU2TDIxLjg1MSwxMC45WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQuMzY0IDAuODY0KSIgZmlsbD0iI2ZmZiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
        }
      };
      Gmarker = new google.maps.Marker(markerOptions);
    },
    createCirle(latlng) {
      let circleOptions = {
        strokeColor: "#3657ff",
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
      };
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
      this.neighbourhood = "";
      this.city = "";
    }
  },
  computed: {
    level() {
      return this.$store.getters.level;
    },
    step() {
      return this.$store.getters.step;
    }
  },
  mounted() {
    this.getCountries();
    this.autocomplete = new google.maps.places.Autocomplete(
      this.$refs.autocomplete,
      { types: ["geocode"] }
    );
    this.autocomplete.addListener("place_changed", () => {
      let place = this.autocomplete.getPlace();
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
      this.streetName = place.formatted_address;
      place.address_components.map(component => {
        const types = component.types;

        if (types.includes("locality")) {
          this.city = component.long_name;
        }
        if (types.includes("country")) {
          this.country = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          this.state = component.long_name;
        }
        if (types.includes("neighborhood")) {
          this.neighbourhood = component.long_name;
        }
      });
      this.onCountrySelect(this.country);
    });
    this.getLocationFromDB();
  }
};
</script>



<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

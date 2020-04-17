<template>
  <div class="w-100">
    <div class="loader__wrap">
      <appLoading
        :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="fullPage"
        :color="loaderColor"
        :height="loaderHeight"
        :width="loaderWidth"
        :background-color="bgColor"
      ></appLoading>
    </div>
    <div class="page-container">
      <appPropType v-if="level == 1"></appPropType>
      <appBedroom v-if="level == 2"></appBedroom>
      <appFeatureAmenity v-if="level == 3"></appFeatureAmenity>
      <appPicture v-if="level == 4"></appPicture>
      <appDescription v-if="level == 5"></appDescription>
      <appSpaceName v-if="level == 6"></appSpaceName>
      <appLocation v-if="level == 7"></appLocation>
    </div>
  </div>
</template>

<script>
import propType from "./components/listing-components/propType";
import stepChange from "./components/listing-components/stepChange";
import bedroom from "./components/listing-components/bedroom";
import featureAmenity from "./components/listing-components/featureAmenity";
import picture from "./components/listing-components/picture";
import description from "./components/listing-components/description";
import spaceName from "./components/listing-components/spaceName";
import location from "./components/listing-components/location";
import { AllPropertyTypeReturned } from "../services/listing";
import Loading from "vue-loading-overlay";

export default {
  name: "listing",
  components: {
    appPropType: propType,
    appStepChange: stepChange,
    appBedroom: bedroom,
    appFeatureAmenity: featureAmenity,
    appPicture: picture,
    appDescription: description,
    appSpaceName: spaceName,
    appLocation: location,
    appLoading: Loading
  },
  data() {
    return {
      current_level: "",
      isLoading: false,
      fullPage: true,
      loaderColor: "#3657ff",
      loaderHeight: 50,
      loaderWidth: 50,
      bgColor: "#ffffff",
      listingId: this.$route.params.id
    };
  },
  methods: {
    async listing() {
      this.isLoading = true;
      await AllPropertyTypeReturned(this.listingId).then(
        data => {
          this.isLoading = false;
          this.current_level = data.data.level;
          this.$store.commit("setLevel", this.current_level);
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  },
  computed: {
    step() {
      return this.$store.state.step;
    },
    level() {
      return this.$store.state.level;
    }
  },
  beforeMount: function() {
    this.listing();
  }
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgba(5, 6, 9, 0.7);
  background: #f5f5f5;
  position: relative;
  height: 100vh;
}
</style>

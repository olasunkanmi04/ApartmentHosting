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
      <appPersonlInfo v-if="level == 1"></appPersonlInfo>
      <appCompanyDetails v-if="level == 2"></appCompanyDetails>
      <appNextOfKin v-if="level == 3"></appNextOfKin>
      <appIdentification v-if="level == 4"></appIdentification>
      <appPayment v-if="level == 5"></appPayment>
    </div>
  </div>
</template>

<script>
import personlInfo from "./components/stepThree/personalInfo";
import companyDetails from "./components/stepThree/companyDetails";
import nextOfKin from "./components/stepThree/nextOfKin";
import identification from "./components/stepThree/identification";
import payment from "./components/stepThree/payment";
import { AllPropertyTypeReturned } from "../services/listing";
import Loading from "vue-loading-overlay";

export default {
  name: "stepThree",
  components: {
    appPersonlInfo: personlInfo,
    appCompanyDetails: companyDetails,
    appNextOfKin: nextOfKin,
    appIdentification: identification,
    appPayment: payment,
    appLoading: Loading
  },
  data() {
    return {
      current_step: "",
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
    async listingThree() {
      this.isLoading = true;
      await AllPropertyTypeReturned(this.listingId).then(
        data => {
          this.isLoading = false;
          this.current_step = data.data.current_step;
          this.current_level = data.data.level;
          this.$store.commit("setStep", this.current_step);
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
    this.listingThree();
  }
};
</script>

<style>
#app {
  /* font-family: "Sailec", sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgba(5, 6, 9, 0.7);
  background: #f5f5f5;
  position: relative;
  height: 100vh;
}
</style>

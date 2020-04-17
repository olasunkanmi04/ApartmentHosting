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
      <appMemberRequirement v-if="level == 1"></appMemberRequirement>
      <appSubType v-if="level == 2"></appSubType>
      <appPriceMonthly v-if="level == 3 && rlsValue"></appPriceMonthly>
      <appRlsDiscount
        v-if="
          (level == 4 || level == 5) && rlsValue && (quarterly || biannually)
        "
      ></appRlsDiscount>
      <appPriceAgreement v-if="level == 6"></appPriceAgreement>
      <appUpdateCalendar v-if="level == 3 && dlsValue"></appUpdateCalendar>
      <appPriceDaily v-if="level == 4 && dlsValue"></appPriceDaily>
      <appDlsDiscount v-if="level == 5 && dlsValue"></appDlsDiscount>
    </div>
  </div>
</template>

<script>
import memberRequirement from "./components/stepTwo/memberRequirement";
import subType from "./components/stepTwo/subscriptionType";
import priceMonthly from "./components/stepTwo/pricingMonthly";
import rlsDiscount from "./components/stepTwo/rlsDiscount";
import priceAgreement from "./components/stepTwo/pricingAgreement";
import updateCalendar from "./components/stepTwo/updateCalendar";
import priceDaily from "./components/stepTwo/pricingDaily";
import dlsDiscount from "./components/stepTwo/dlsDiscount";
import { AllPropertyTypeReturned, getSelectedPlan } from "../services/listing";
import Loading from "vue-loading-overlay";

const SHARED = "shared";
const ENTIRE = "entire";
const MONTHLY = "monthly";
const DAILY = "daily";
const QUARTERLY = "quarterly";
const BIANNUALLY = "biannually";

export default {
  name: "listingTwo",
  components: {
    appMemberRequirement: memberRequirement,
    appSubType: subType,
    appPriceMonthly: priceMonthly,
    appRlsDiscount: rlsDiscount,
    appDlsDiscount: dlsDiscount,
    appPriceAgreement: priceAgreement,
    appUpdateCalendar: updateCalendar,
    appPriceDaily: priceDaily,
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
      listingId: this.$route.params.id,
      returnedPlans: null
    };
  },
  methods: {
    async listingTwo() {
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
    },
    rlsValue() {
      return this.$store.state.rlsValue;
    },
    dlsValue() {
      return this.$store.state.dlsValue;
    },
    quarterly() {
      return this.$store.state.quarterly;
    },
    biannually() {
      return this.$store.state.biannually;
    }
  },
  mounted() {
    this.$store.dispatch("getSelectedPlan");
  },
  beforeMount() {
    this.listingTwo();
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

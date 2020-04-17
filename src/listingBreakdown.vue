<template>
  <div class="page-container">
    <div class="loader__wrap">
      <loading
        :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="fullPage"
        :color="loaderColor"
        :height="loaderHeight"
        :width="loaderWidth"
        :background-color="bgColor"
      ></loading>
    </div>
    <appNavbar></appNavbar>

    <div class="status__wrap">
      <div class="row mx-0 status__wrap-row">
        <div class="col-lg-8 col-md-8 col-sm-12 pl-0">
          <div class="status__wrap-head">
            <h3 class="status__heading">
              Hi {{ userName }}! Let’s get started listing your space.
            </h3>
            <p class="status__heading-sub" v-show="step == 7"></p>
          </div>

          <div class="status__block pt-0">
            <h3 class="status__block-head">step 1</h3>
            <p class="status__block-title" v-show="step == 1">
              Start with the basics
            </p>
            <p class="status__block-summary">
              Bedroom, amenities, pictures, and more.
            </p>
            <span
              class="status__block-link"
              v-show="step > 1"
              @click="resetStepOne"
              >Change</span
            >
            <button
              class="cta__btn"
              type="button"
              v-show="step == 1"
              @click="stepOne"
            >
              Continue
            </button>
            <svgicon
              icon="completed"
              class="status__block-icon"
              v-show="step > 1"
            ></svgicon>
          </div>

          <div class="status__block">
            <div class="status__block-overlay" v-show="step < 2"></div>
            <h3 class="status__block-head">step 2</h3>
            <p class="status__block-title" v-show="step <= 2">
              Get ready for Guest
            </p>
            <p class="status__block-summary">
              Booking setting, calendar, price.
            </p>
            <span
              @click="resetStepTwp"
              class="status__block-link"
              v-show="step > 2"
              >Change</span
            >
            <button
              class="cta__btn"
              type="button"
              v-show="step == 2"
              @click="stepTwo"
            >
              Continue
            </button>
            <svgicon
              icon="completed"
              class="status__block-icon"
              v-show="step > 2"
            ></svgicon>
          </div>

          <div class="status__block">
            <div class="status__block-overlay" v-show="step < 3"></div>
            <h3 class="status__block-head">step 3</h3>
            <p class="status__block-title" v-show="step <= 3">
              We would like to know you
            </p>
            <p class="status__block-summary">
              KYC and payments (only completed at your fist listing)
            </p>
            <button
              class="cta__btn"
              type="button"
              v-show="step == 3"
              @click="stepThree"
            >
              Continue
            </button>
            <svgicon
              icon="completed"
              class="status__block-icon"
              v-show="step > 3"
            ></svgicon>
          </div>
        </div>

        <div class="col-lg-4 col-md-4 col-sm-12 status__graphic">
          <div class="status__graphic-wrap">
            <img
              v-if="step == 1"
              src="../src/assets/illustrations/bathroom.svg"
              alt
              class="img-fluid"
            />
            <img
              v-if="step == 2"
              src="../src/assets/illustrations/booking.svg"
              alt
              class="img-fluid"
            />
            <img
              v-if="step == 3"
              src="../src/assets/illustrations/profile.svg"
              alt
              class="img-fluid"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "./components/navbar-components/navbar";
import routes from "./routes";
import { createListing, AllPropertyTypeReturned } from "../services/listing";
import Loading from "vue-loading-overlay";

export default {
  name: "stepBreakdown",
  components: {
    appNavbar: Navbar,
    Loading
  },
  data() {
    return {
      userName: "",
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
    stepOne() {
      this.$store.state.level = 1;
      this.$router.push("/listing/" + this.$route.params.id);
    },
    stepTwo() {
      this.$store.state.level = 1;
      this.$router.push("/listing/second-step/" + this.$route.params.id);
    },
    stepThree() {
      this.$store.state.level = 1;
      this.$router.push("/listing/third-step/" + this.$route.params.id);
    },
    async listing() {
      this.isLoading = true;
      await createListing().then(
        data => {
          this.isLoading = false;
          this.current_step = data.data.current_step;
          this.current_level = data.data.level;
          this.$store.commit("setStep", this.current_step);
          this.$store.commit("setLevel", this.current_level);
        },
        error => {}
      );
    },
    async fetchAllData() {
      this.isLoading = true;
      await AllPropertyTypeReturned(this.listingId).then(data => {
        this.isLoading = false;
        const listingReturned = data.data;
        this.current_step = listingReturned.current_step;
        this.current_level = listingReturned.level;
        this.$store.commit("setStep", this.current_step);
        this.$store.commit("setLevel", this.current_level);
      });
    },
    resetStepOne() {
      routes.push({ name: "first-step", params: this.listingId });
      this.$store.state.step = 1;
    },
    resetStepTwp() {
      routes.push({ name: "second-step", params: this.listingId });
      this.$store.state.step = 2;
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
  created() {
    let user = JSON.parse(localStorage.getItem("user"));
    this.userName = user.user.first_name;
  },
  async beforeMount() {
    await this.fetchAllData();
    if (this.$store.state.level == null || this.$store.state.step == null) {
      this.listing();
    } else {
      return;
    }
  }
};
</script>

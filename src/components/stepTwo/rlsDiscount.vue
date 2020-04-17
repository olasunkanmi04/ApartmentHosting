<template>
  <div class="prop">
    <div class="loader__wrap">
      <loading
        :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="fullPage"
        :color="loaderColor"
        :height="loaderHeight"
        :width="loaderWidth"
        :background-color="bgColor"
        :opacity="opacity"
      ></loading>
    </div>
    <form action>
      <div class="listing__wrap">
        <div class="listing__container">
          <h3 class="listing__title mb-2">Something special for your Members</h3>
          <p
            class="form__input-info picture__subtitle"
          >Encourage longer bookings by offering discounts.</p>

          <div class="memRequire">
            <div class="row mx-0 form__row">
              <div class="col-lg-8 col-sm-12 px-0 mb-2">
                <div class="form__row" v-if="quarterly">
                  <label for class="form__label">Quarterly Discount (%)</label>
                  <div class="form__select">
                    <multiselect
                      v-model="quarterlyDiscount"
                      :searchable="false"
                      :options="discountOptions"
                    ></multiselect>
                  </div>
                </div>

                <div v-if="biannually">
                  <label for class="form__label">Biannually Discount (%)</label>
                  <div class="form__select">
                    <multiselect
                      v-model="biannuallyDiscount"
                      :searchable="false"
                      :options="discountOptions"
                    ></multiselect>
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
          <button type="button" class="step__next cta__btn" @click="submitData">Next</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import {
  rlsDiscount,
  saveAndExit,
  getSelectedPlan
} from "../../../services/listing";
import Loading from "vue-loading-overlay";

const STUDIO = "studio";
const SHARED = "shared";
const ENTIRE = "entire";
const MONTHLY = "monthly";
const DAILY = "daily";
const QUARTERLY = "quarterly";
const BIANNUALLY = "biannually";
const SPLEET = "SPLEET";
export default {
  name: "rlsDiscount",
  components: {
    Multiselect,
    Loading
  },

  data() {
    return {
      quarterlyDiscount: 0,
      discountOptions: [0, 5, 7.5, 10],
      biannuallyDiscount: 0,
      listingId: this.$route.params.id,

      isLoading: false,
      fullPage: true,
      loaderColor: "#3657ff",
      loaderHeight: 50,
      loaderWidth: 50,
      bgColor: "#fff",
      opacity: 0.5
    };
  },

  methods: {
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
    },
    saveAndExit() {
      this.isLoading = true;
      saveAndExit(
        this.listingId,
        this.$store.getters.level,
        this.$store.getters.step
      )
        .then(data => {
          this.isLoading = false;
          if (data.data.success) {
            return (this.$store.state.level = 6);
          }
        })
        .catch(err => {
          this.isLoading = false;
          return err;
        });
    },
    submitData() {
      this.isLoading = true;
      rlsDiscount(
        this.listingId,
        this.quarterlyDiscount,
        this.biannuallyDiscount
      )
        .then(data => {
          this.isLoading = false;
          if (data.data.success) {
            this.saveAndExit();
          }
        })
        .catch(err => {
          this.isLoading = false;

          return err;
        });
    },
    collectedData(gottenData) {
      this.quarterlyDiscount = gottenData.quarterly;
      this.biannuallyDiscount = gottenData.biannually;
    },
    getSelectedPlan() {
      this.isLoading = true;
      getSelectedPlan(this.listingId)
        .then(data => {
          this.isLoading = false;
          if (data.data.success) {
            let returnedData = data.data.data;
            if (returnedData.space_type == SHARED) {
              if (returnedData.Rooms[0].Apartment.Discount) {
                this.collectedData(returnedData.Rooms[0].Apartment.Discount);
              }
            } else if (
              returnedData.space_type == ENTIRE ||
              returnedData.space_type == STUDIO
            ) {
              if (this.collectedData(returnedData.Apartment.Discount)) {
                this.collectedData(returnedData.Apartment.Discount);
              }
            }
          }
        })
        .catch(err => {
          this.isLoading = false;
          throw err;
        });
    }
  },

  computed: {
    quarterly() {
      return this.$store.state.quarterly;
    },
    biannually() {
      return this.$store.state.biannually;
    },
    level() {
      return this.$store.state.level;
    }
  },
  mounted() {
    this.getSelectedPlan();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

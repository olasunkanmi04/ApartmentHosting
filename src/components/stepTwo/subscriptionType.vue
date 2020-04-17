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
    <form action @submit.prevent="handleSubmit">
      <div class="listing__wrap">
        <div class="listing__container">
          <h3 class="listing__title mb-2">What type of Subscription would you like Members to book?</h3>
          <p class="form__input-info picture__subtitle">
            If you choose
            <b>Daily</b>, members will book available days instantly, alternatively, members can stay in your space for a minimum of 1 month.
          </p>

          <div class="memRequire">
            <div class="form__demacator form__row">
              <div class="row mx-0 mb-2">
                <div class="col-lg-8 col-sm-12 px-0 mb-2">
                  <label for class="form__label">Have you rented out your place before?</label>
                  <div class="mb-2" v-if="submitted && $v.rentBefore.$error">
                    <div class="error" v-if="!$v.rentBefore.required">This field is required</div>
                  </div>
                  <div>
                    <input
                      id="rentBeforeNo"
                      class="styled-radio"
                      type="radio"
                      name="rentBefore"
                      :value="false"
                      v-model.lazy="rentBefore"
                    />
                    <label for="rentBeforeNo">No, I am new to this</label>
                  </div>
                </div>
              </div>
              <div class="row mx-0">
                <div class="col-lg-8 col-sm-12 px-0">
                  <div>
                    <input
                      id="rentBeforeYes"
                      class="styled-radio"
                      type="radio"
                      name="rentBefore"
                      :value="true"
                      v-model.lazy="rentBefore"
                    />
                    <label for="rentBeforeYes">Yes, I have</label>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mx-0">
              <div class="col-lg-12 px-0">
                <p class="form__section-title">What type of subscription are you interested in?</p>
                <div class="mb-2" v-if="submitted && $v.subType.$error">
                  <div class="error" v-if="!$v.subType.required">You must select either RLS or DLS</div>
                </div>
              </div>
            </div>

            <div
              class="row mx-0"
              v-for="(subscription, index) in subscriptions"
              :key="index"
              :class="{form__row : subscription.name == 'daily', 'mb-2' : subscription.name != 'daily'}"
            >
              <div class="col-lg-8 col-sm-12 px-0 mb-2">
                <div v-if="subscription.name == 'monthly'">
                  <label for class="form__label mb-1">Rolling Living Subscription (RLS)</label>
                  <p
                    class="form__input-info mb-2 ml-0"
                  >Members can book for Monthly, Quarterly, Bi-annually</p>
                </div>
                <div v-if="subscription.name == 'daily'">
                  <label for class="form__label mb-1">Daily Living Subscription (DLS)</label>
                  <p
                    class="form__input-info mb-2 ml-0"
                  >Members can book for as little as 1 day to 30 days</p>
                </div>

                <div>
                  <input
                    :id="subscription.name"
                    class="styled-radio"
                    type="radio"
                    name="subType"
                    :value="subscription"
                    v-model="subType"
                  />
                  <label :for="subscription.name">{{ subscription.name | capitalize }}</label>
                </div>
              </div>
            </div>

            <div class="row mx-0 mb-2" v-for="(altSub, id) in altSubs" :key="`A-${id}`">
              <div class="col-lg-8 col-sm-12 px-0 mb-2">
                <div>
                  <input
                    :id="altSub.name"
                    class="styled-checkbox"
                    type="checkbox"
                    :name="altSub.name"
                    :value="altSub"
                    v-model="selectedAltSub"
                    :disabled="!rlsValue"
                    :class="{disable:!rlsValue}"
                  />
                  <label
                    :for="altSub.name"
                    :class="{disable:!rlsValue}"
                  >{{ altSub.name | capitalize }}</label>
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
import { required, requiredIf } from "vuelidate/lib/validators";
import {
  getAllPlans,
  selectPlans,
  getSelectedPlan,
  saveAndExit
} from "../../../services/listing";
import Loading from "vue-loading-overlay";

const SHARED = "shared";
const ENTIRE = "entire";
const STUDIO = "studio";
const MONTHLY = "monthly";
const DAILY = "daily";
const QUARTERLY = "quarterly";
const BIANNUALLY = "biannually";
export default {
  name: "subType",
  components: {
    Loading
  },
  data() {
    return {
      rentBefore: null,
      submitted: false,
      subscriptions: [],
      altSubs: [],
      selectedAltSub: [],
      selectedSub: [],
      listingId: this.$route.params.id,
      returnedPlans: null,
      subType: null,

      isLoading: false,
      fullPage: true,
      loaderColor: "#3657ff",
      loaderHeight: 50,
      loaderWidth: 50,
      bgColor: "#fff",
      opacity: 0.5
    };
  },
  validations: {
    rentBefore: {
      required
    },
    subType: {
      required
    }
  },
  methods: {
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
    },
    MemRequireShow() {
      this.$modal.show("MemRequireModal");
    },
    handleSubmit(e) {
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      // this.incrementLevel();
      this.createPlans();
    },
    getPlans() {
      this.isLoading = true;
      getAllPlans()
        .then(data => {
          this.isLoading = false;
          if (data.data.success) {
            data.data.data.filter(plan => {
              if (plan.name == MONTHLY || plan.name == DAILY) {
                this.subscriptions.push(plan);
              } else if (plan.name == QUARTERLY || plan.name == BIANNUALLY) {
                this.altSubs.push(plan);
              }
            });
            this.getSelectedPlan();
          }
        })
        .catch(err => {
          return err;
        });
    },
    createPlans() {
      this.isLoading = true;
      if (
        Array.isArray(this.selectedAltSub) &&
        this.selectedAltSub.length > 0
      ) {
        this.selectedAltSub.filter(element => {
          if (this.selectedSub.includes(element.id)) {
            return;
          } else {
            this.selectedSub.push(element.id);
          }
        });
      }
      selectPlans(this.listingId, this.rentBefore, this.selectedSub)
        .then(data => {
          this.isLoading = false;
          if (data.data.success) {
            this.saveAndExit();
          }
        })
        .catch(err => {
          return err;
        });
    },
    saveAndExit() {
      this.isLoading = true;
      saveAndExit(
        this.listingId,
        this.$store.getters.level,
        this.$store.getters.step
      ).then(data => {
        this.isLoading = false;
        if (data.data.success) {
          this.incrementLevel();
        }
      });
    },
    async getSelectedPlan() {
      this.isLoading = true;
      let data = await getSelectedPlan(this.listingId);
      this.isLoading = false;
      if (data.data.success) {
        this.rentBefore = data.data.data.rented_out_before;
        if (data.data.data.space_type == SHARED) {
          this.returnedPlans = data.data.data.Rooms[0].Apartment.Plans;
        } else if (
          data.data.data.space_type == ENTIRE ||
          data.data.data.space_type == STUDIO
        ) {
          this.returnedPlans = data.data.data.Apartment.Plans;
        }
        if (this.returnedPlans != null) {
          this.returnedPlans.filter(plan => {
            if (plan.name == DAILY) {
              this.dlsValue = true;
              this.rlsValue = false;
              if (this.subscriptions != null) {
                let realDaily = this.subscriptions.find(o => o.id === plan.id);
                this.subType = realDaily;
              }
            }
            if (plan.name == MONTHLY) {
              this.rlsValue = true;
              this.dlsValue = false;
              if (this.selectedSub.includes(plan.id)) {
                return;
              } else {
                this.selectedSub.push(plan.id);
              }
              if (this.subscriptions != null) {
                let realMonthly = this.subscriptions.find(
                  x => x.id === plan.id
                );
                this.subType = realMonthly;
              }
            }
            if (plan.name == QUARTERLY || plan.name == BIANNUALLY) {
              if (this.selectedAltSub.includes(plan)) {
                return;
              } else {
                if (this.altSubs != null) {
                  let obj = this.altSubs.find(o => o.id === plan.id);
                  this.selectedAltSub.push(obj);
                }
              }
            }
            if (plan.name == QUARTERLY) {
              this.$store.commit("updateQuarterly", true);
            }
            if (plan.name == BIANNUALLY) {
              this.$store.commit("updateBiannually", true);
            }
          });
        }
      }
    }
  },
  computed: {
    level() {
      return this.$store.state.level;
    },
    rlsValue: {
      get() {
        return this.$store.state.rlsValue;
      },
      set(value) {
        this.$store.commit("updateRlsValue", value);
      }
    },
    dlsValue: {
      get() {
        return this.$store.state.dlsValue;
      },
      set(value) {
        this.$store.commit("updateDlsValue", value);
      }
    }
  },
  filters: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  watch: {
    subType(value) {
      if (this.subType != null) {
        if (value.name.includes(MONTHLY)) {
          this.$store.commit("updateDlsValue", false);
          this.$store.commit("updateRlsValue", true);
        } else if (value.name.includes(DAILY)) {
          this.$store.commit("updateDlsValue", true);
          this.$store.commit("updateRlsValue", false);
          this.selectedAltSub = [];
        }
        if (this.selectedSub.includes(value.id)) {
          return;
        } else {
          this.selectedSub = [];
          this.selectedSub.push(value.id);
        }
      }
    }
  },
  mounted() {
    this.getPlans();
  }
};
</script>
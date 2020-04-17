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
      <div class="bdrm__wrap price__wrap">
        <div class="listing__container">
          <h3 class="listing__title mb-3">Price your space</h3>
          <div class="memRequire">
            <!-- <div class="row mx-0 form__row">
              <div class="col-lg-12 px-0">
                <p
                  class="form__section-title mb-2"
                  v-if="entireSpace"
                >What is the price of the Entire Space</p>
                <p
                  class="form__section-title mb-2"
                  v-if="coSharedSpace"
                >What is the price of the Co-share Space</p>
                <p
                  class="form__input-info ml-0"
                >Rent covers the fixed price for the property and service charge</p>
              </div>
            </div>-->

            <!-- <div class="row mx-0 form__row">
            <div class="col-lg-5 col-md-6 col-sm-12 px-0 mb-2">
              <label for class="form__label">Currency</label>
              <div class="form__select">
                <multiselect v-model="currency" :searchable="false" :options="currencyOptions"></multiselect>
              </div>
            </div>
            </div>-->

            <div v-if="entireSpace" class="form__demacator mb-4">
              <div class="row mx-0">
                <div class="col-lg-8 col-sm-12 px-0">
                  <div class="form-group mb-2">
                    <label for class="form__label">Daily Living Subscription (DLS) - Daily</label>
                    <float-label>
                      <div class="mb-2" v-if="submitted && $v.pricing.$error">
                        <div class="error" v-if="!$v.pricing.required">Enter cost of your space</div>
                        <div
                          class="error"
                          v-if="!$v.pricing.minValue"
                        >Price must be atleast {{$v.pricing.$params.minValue.min}} and above.</div>
                      </div>
                      <input
                        name="daily"
                        type="number"
                        class="form__input"
                        v-model.number="pricing"
                        placeholder="Enter Price"
                      />
                    </float-label>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="coSharedSpace" class="form__demacator mb-4">
              <label for class="form__label mb-2">Do you want also list this Space as Entired?</label>
              <p
                class="form__input-info ml-0"
                style="margin-bottom:12px"
              >Members can book the Entire space as long as no room as been booked. Once a room has been booked it is no longer avaliable as Entire</p>
              <div class="d-flex">
                <div class="mr-4">
                  <input
                    class="styled-radio"
                    id="makeEntireYes"
                    type="radio"
                    name="makeEntire"
                    :value="true"
                    v-model.lazy="makeEntire"
                  />
                  <label for="makeEntireYes">Yes</label>
                </div>
                <div>
                  <input
                    class="styled-radio"
                    id="makeEntireNo"
                    type="radio"
                    name="makeEntire"
                    :value="false"
                    v-model.lazy="makeEntire"
                  />
                  <label for="makeEntireNo">No</label>
                </div>
              </div>

              <div v-if="makeEntire" class="mt-4">
                <div class="row mx-0">
                  <div class="col-lg-8 col-sm-12 px-0">
                    <float-label class="form-group">
                      <input
                        type="number"
                        name="makeEntire"
                        placeholder="Entire Price"
                        v-model.number="makeEntirePrice"
                        class="form__input"
                      />
                    </float-label>
                  </div>
                </div>
              </div>
            </div>

            <!-- cleaning -->
            <div class="form__demacator mb-4">
              <div class="row mx-0 mb-4">
                <div class="col-lg-12 px-0">
                  <label
                    for
                    class="form__label mb-2"
                  >Would you like SPLEET to manage cleaning services for your space?</label>
                  <p
                    class="form__input-info ml-0"
                  >We have highly recommended third party who offer exceptional cleaning</p>
                  <div class="mb-2" v-if="submitted && $v.manageCLeaning.$error">
                    <div
                      class="error"
                      v-if="!$v.manageCLeaning.required"
                    >You must choose who should manage cleaning</div>
                  </div>
                </div>
              </div>

              <div class="row mx-0">
                <div class="col-lg-12 px-0">
                  <div class="mb-2">
                    <input
                      class="styled-radio"
                      id="manageCLeaningYes"
                      type="radio"
                      name="manageCLeaning"
                      :value="true"
                      v-model.lazy="manageCLeaning"
                    />
                    <label for="manageCLeaningYes">Yes, SPLEET should manage my cleaning services</label>
                  </div>

                  <div>
                    <input
                      class="styled-radio"
                      id="manageCLeaningNo"
                      type="radio"
                      name="manageCLeaning"
                      :value="false"
                      v-model.lazy="manageCLeaning"
                    />
                    <label for="manageCLeaningNo">No, I will provide cleaning service</label>
                  </div>
                </div>
              </div>
            </div>

            <div v-show="homeOwnerCleans" class="form__demacator mb-4">
              <div class="row mx-0">
                <div class="col-lg-12 px-0">
                  <div class="form__row">
                    <label
                      for
                      class="form__label mb-2"
                    >How often do you want to offer Members Cleaning services?</label>
                    <p
                      class="form__input-info ml-0"
                      style="margin-bottom:12px"
                    >It is mandatory to offer cleaning at least once a week for the communal space and private spaces for RLS</p>
                    <div class="mb-2" v-if="submitted && $v.howOftenCleaning.$error">
                      <div
                        class="error"
                        v-if="!$v.howOftenCleaning.required"
                      >You haven't chosen how often you offer cleaning service to member</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row mx-0 form__row">
                <div class="col-lg-8 col-sm-12 px-0">
                  <div class="form__select">
                    <multiselect
                      v-model="howOftenCleaning"
                      :searchable="false"
                      :options="howOftenCleaningOptions"
                    ></multiselect>
                  </div>
                </div>
              </div>

              <div class="row mx-0">
                <div class="col-lg-12 px-0">
                  <div class="form__row">
                    <label
                      for
                      class="form__label mb-2"
                    >What is the total cost of cleaning for your space?</label>
                    <p
                      class="form__input-info ml-0"
                      style="margin-bottom:12px"
                    >Add the total Monthly or Daily price of Cleaning. This price is added to the Member’s booking cost which will reflect in the Member’s service charge.</p>
                    <div class="mb-2" v-if="submitted && $v.cleaningCost.$error">
                      <div
                        class="error"
                        v-if="!$v.cleaningCost.required"
                      >You haven't entered your cleaning cost</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row mx-0 form__row">
                <div class="col-lg-8 col-sm-12 px-0">
                  <float-label class="form-group">
                    <input
                      type="number"
                      name="cleaningCost"
                      placeholder="Cleaning Cost"
                      v-model.number="cleaningCost"
                      class="form__input"
                    />
                  </float-label>
                </div>
              </div>
            </div>

            <!-- Maintenance -->
            <div class="form__demacator mb-4">
              <div class="row mx-0 mb-4">
                <div class="col-lg-12 px-0">
                  <label
                    for
                    class="form__label mb-2"
                  >Would you like SPLEET to manage maintenance for your space?</label>
                  <p
                    class="form__input-info ml-0"
                  >We have highly recommended third party who offer exceptional maintenance</p>
                  <div class="mb-2" v-if="submitted && $v.manageMaintenance.$error">
                    <div
                      class="error"
                      v-if="!$v.manageMaintenance.required"
                    >You must choose who should manage your space</div>
                  </div>
                </div>
              </div>

              <div class="row mx-0">
                <div class="col-lg-12 px-0">
                  <div class="mb-2">
                    <input
                      class="styled-radio"
                      id="manageMaintenanceYes"
                      type="radio"
                      name="manageMaintenance"
                      :value="true"
                      v-model.lazy="manageMaintenance"
                    />
                    <label for="manageMaintenanceYes">Yes, SPLEET should manage my maintenance</label>
                  </div>

                  <div>
                    <input
                      class="styled-radio"
                      id="manageMaintenanceNo"
                      type="radio"
                      name="manageMaintenance"
                      :value="false"
                      v-model.lazy="manageMaintenance"
                    />
                    <label for="manageMaintenanceNo">No, I will provide the maintenance</label>
                  </div>
                </div>
              </div>
            </div>

            <div v-show="homeOwnerMaintenance" class="form__demacator mb-4">
              <div class="row mx-0">
                <div class="col-lg-12 px-0">
                  <div class="form__row">
                    <label
                      for
                      class="form__label mb-2"
                    >What is the total cost of maintenance for your space?</label>
                    <p
                      class="form__input-info ml-0"
                      style="margin-bottom:12px"
                    >Add the total Monthly or Daily price of Maintenace. This price is added to the Member’s booking cost which will reflect in the Member’s service charge.</p>
                    <div class="mb-2" v-if="submitted && $v.maintenanceCost.$error">
                      <div
                        class="error"
                        v-if="!$v.maintenanceCost.required"
                      >You must choose who should manage your space</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row mx-0 form__row">
                <div class="col-lg-8 col-sm-12 px-0">
                  <float-label class="form-group">
                    <input
                      type="number"
                      name="maintenanceCost"
                      placeholder="maintenance Cost"
                      v-model.number="maintenanceCost"
                      class="form__input"
                    />
                  </float-label>
                </div>
              </div>
            </div>

            <div class="row mx-0">
              <div class="col-lg-12 px-0">
                <div class="form__row">
                  <label
                    for
                    class="form__label mb-2"
                  >What is the total cost of Gas and Power Supply for your space?</label>
                  <p
                    class="form__input-info ml-0"
                    style="margin-bottom:12px"
                  >What is the total Monthly or Daily cost of power supply such as fuel or diesel for the generator and gas for the gas cooker</p>
                  <div class="mb-2" v-if="submitted && $v.gasCost.$error">
                    <div class="error" v-if="!$v.gasCost.required">Enter cost of power and gas</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mx-0 form__row">
              <div class="col-lg-8 col-sm-12 px-0">
                <float-label class="form-group">
                  <input
                    type="number"
                    name="gasCost"
                    class="form__input"
                    placeholder="Gas Cost"
                    v-model.number="gasCost"
                  />
                </float-label>
              </div>
            </div>
          </div>
        </div>

        <div class="bdrm__preview">
          <div class="bdrm__preview-individual" v-for="(room, index) in rooms" :key="index">
            <div class="bdrm__preview-detail">
              <div
                class="bdrm__preview-image"
                :style="{ backgroundImage: 'url(' + room.ImageTags[0].img_url + ')' }"
              ></div>
              <div class="bdrm__preview-info">
                <p class="bdrm__preview-name">{{ room.name }}</p>
                <p
                  class="bdrm__preview-masterbed"
                  v-if="room.is_master_bedroom"
                >{{ room.is_master_bedroom ? "MasterBed" : "" }}</p>
                <div
                  v-if="room.Apartment.Pricing && coSharedSpace"
                  class="bdrm__preview-cell bdrm__preview-edit"
                >
                  <p
                    class="bdrm__preview-title"
                  >{{ priceMethod(room.Apartment.Pricing.rental_subscription) }}</p>
                </div>
              </div>
            </div>
            <div
              v-if="room.Apartment.Pricing && coSharedSpace"
              class="bdrm__preview-cell bdrm__preview-delete ml-0"
            >
              <span
                class="bdrm__preview-title price__add"
                @click="priceModalShow(room.name)"
              >{{changePriceName(priceMethod(room.Apartment.Pricing.rental_subscription))}}</span>
            </div>
            <div v-if="room.Apartment.Pricing" class="price__modal price__daily-modal">
              <PriceModal :rooms="room" :name="room.name"></PriceModal>
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
import PriceModal from "./pricingModal";
import {
  entirePrice,
  getSelectedPlan,
  saveAndExit,
  updateShareDetails,
  createPricing
} from "../../../services/listing";

import {
  required,
  requiredUnless,
  requiredIf,
  minValue
} from "vuelidate/lib/validators";
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
  name: "priceDaily",
  components: {
    Multiselect,
    PriceModal,
    Loading
  },
  data() {
    return {
      rooms: null,
      // currency: "",
      // currencyOptions: ["Nigeria, Naira", "Ghana, Cedis"],
      pricing: 0,
      manageCLeaning: null,
      howOftenCleaning: null,
      howOftenCleaningOptions: [
        "Once per week",
        "Twice per week",
        "Thrice per week"
      ],
      cleaningCost: null,
      homeOwnerCleans: false,
      homeOwnerMaintenance: false,
      manageMaintenance: null,
      maintenanceCost: null,
      gasCost: null,
      listingId: this.$route.params.id,
      submitted: false,
      makeEntire: false,
      makeEntirePrice: null,
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
    pricing: {
      required: requiredIf("entireSpace"),
      minValue: minValue(1000)
    },
    manageCLeaning: {
      required
    },
    manageMaintenance: {
      required
    },
    gasCost: {
      required
    },
    cleaningCost: {
      required: requiredIf("homeOwnerCleans")
    },
    maintenanceCost: {
      required: requiredIf("homeOwnerMaintenance")
    },
    howOftenCleaning: {
      required: requiredIf("homeOwnerCleans")
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
      this.submitPricing();
    },
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
    },
    priceMethod(plan) {
      if (plan != null) {
        return plan;
      }
      return 0;
    },
    priceModalShow(index) {
      this.$modal.show(index);
    },
    changePriceName(value) {
      if (value < 1) {
        return "Add Price";
      } else {
        return "Change Price";
      }
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
    submitPricing() {
      this.isLoading = true;
      if (this.entireSpace) {
        entirePrice(
          this.apartmentId,
          this.pricing,
          this.manageCLeaning,
          this.howOftenCleaning,
          this.cleaningCost,
          this.manageMaintenance,
          this.maintenanceCost,
          this.gasCost
        )
          .then(data => {
            this.isLoading = false;
            if (data.data.success) {
              this.saveAndExit();
            }
          })
          .catch(err => {
            return err;
          });
      } else if (this.coSharedSpace) {
        updateShareDetails(
          this.listingId,
          this.manageCLeaning,
          this.howOftenCleaning,
          this.cleaningCost,
          this.manageMaintenance,
          this.maintenanceCost,
          this.gasCost
        )
          .then(data => {
            this.isLoading = false;
            if (data.data.success) {
              this.saveAndExit();
            }
          })
          .catch(err => {
            return err;
          });
      }
    },
    checkMaintenance(value) {
      if (value == SPLEET) {
        return true;
      } else if (value != null) {
        return false;
      }
    },
    collectedData(gottenData) {
      this.pricing = gottenData.rental_subscription;
      this.manageCLeaning = this.checkMaintenance(gottenData.cleaning_vendor);
      this.howOftenCleaning = gottenData.cleaning_frequency;
      this.cleaningCost = gottenData.cleaning_fee;
      this.manageMaintenance = this.checkMaintenance(
        gottenData.maintenance_vendor
      );
      this.maintenanceCost = gottenData.maintenance_fee;
      this.gasCost = gottenData.gas_and_power_supply_fee;
    },
    getSelectedPlan() {
      this.isLoading = true;
      getSelectedPlan(this.listingId)
        .then(data => {
          this.isLoading = false;
          if (data.data.success) {
            let returnedData = data.data.data;
            if (returnedData.space_type == SHARED) {
              this.rooms = returnedData.Rooms;
              if (returnedData.Rooms[0].Apartment.Pricing) {
                this.collectedData(returnedData.Rooms[0].Apartment.Pricing);
              }
            } else if (
              returnedData.space_type == ENTIRE ||
              returnedData.space_type == STUDIO
            ) {
              if (returnedData.Apartment.Pricing) {
                this.collectedData(returnedData.Apartment.Pricing);
              }
            }
          }
        })
        .catch(err => {
          throw err;
        });
    },
    createPricing() {
      this.isLoading = true;
      createPricing(this.listingId)
        .then(data => {
          this.isLoading = false;
          return data;
        })
        .catch(err => {
          return err;
        });
    }
  },
  computed: {
    level() {
      return this.$store.state.level;
    },
    entireSpace() {
      return this.$store.state.entireSpace;
    },
    coSharedSpace() {
      return this.$store.state.coSharedSpace;
    },
    quarterly() {
      return this.$store.state.quarterly;
    },
    biannually() {
      return this.$store.state.biannually;
    },
    apartmentId() {
      return this.$store.state.apartmentId;
    }
  },
  watch: {
    manageCLeaning() {
      if (this.manageCLeaning == false) {
        this.homeOwnerCleans = true;
      } else {
        this.homeOwnerCleans = false;
        // this.howOftenCleaning = "Once per week";
      }
    },

    manageMaintenance() {
      if (this.manageMaintenance == false) {
        this.homeOwnerMaintenance = true;
      } else {
        this.homeOwnerMaintenance = false;
      }
    }
  },
  mounted() {
    this.createPricing();
    this.getSelectedPlan();
    this.$store.dispatch("getSelectedPlan");
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

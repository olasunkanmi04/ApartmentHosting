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
          <h3 class="listing__title">Complete your next of Kin Details</h3>

          <div class="memRequire">
            <div class="row mx-0">
              <div class="col-lg-8 col-sm-12 px-0 form__row">
                <float-label class="form-group">
                  <div class="mb-2" v-if="submitted && $v.fname.$error">
                    <div class="error" v-if="!$v.fname.required">This field is required</div>
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    v-model="fname"
                    class="form__input"
                    name="fname"
                  />
                </float-label>
              </div>
              <!-- <div class="col-lg-6 col-md-6 col-sm-6 col-12 px-0 pl-sm-4 pr-sm-0 form__row">
                <label for class="form__label">Last Name</label>
                <div class="mb-2" v-if="submitted && $v.lname.$error">
                  <div class="error" v-if="!$v.lname.required">This field is required</div>
                </div>
                <input type="text" class="form__input" v-model="lname" />
              </div>-->
            </div>

            <div class="row mx-0">
              <div class="col-lg-8 col-sm-12 px-0 form__row">
                <float-label class="form-group">
                  <div class="mb-2" v-if="submitted && $v.email.$error">
                    <div class="error" v-if="!$v.email.required">This field is required</div>
                    <div class="error" v-if="!$v.email.email">Email is invalid</div>
                  </div>
                  <input
                    type="text"
                    placeholder="Email"
                    v-model="email"
                    class="form__input"
                    name="email"
                  />
                </float-label>
              </div>
              <div class="col-lg-8 col-sm-12 px-0 form__row">
                <float-label class="form-group">
                  <div class="mb-2" v-if="submitted && $v.phoneNumber.$error">
                    <div class="error" v-if="!$v.phoneNumber.required">This field is required</div>
                  </div>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    v-model="phoneNumber"
                    class="form__input"
                    name="phoneNumber"
                  />
                </float-label>
              </div>
            </div>

            <div class="row mx-0 form__section">
              <div class="col-lg-8 col-sm-12 px-0">
                <label for class="form__label">Relationship with next of kin</label>
                <div class="mb-2" v-if="submitted && $v.relationWithKin.$error">
                  <div class="error" v-if="!$v.relationWithKin.required">This field is required</div>
                </div>
                <div class="form__select">
                  <multiselect
                    v-model="relationWithKin"
                    :searchable="false"
                    :options="relationWithKinOptions"
                  ></multiselect>
                </div>
              </div>
            </div>

            <div class="row mx-0 form__row">
              <div class="col-lg-8 col-sm-12 px-0">
                <label for class="form__label mb-3">Next of Kin Address</label>
                <div
                  class="mb-2"
                  v-if="(submitted && $v.nextOfKinAddress.$error) || (submitted && !sameAddress)"
                >
                  <div class="error" v-if="!$v.nextOfKinAddress.required">This field is required</div>
                </div>
                <div class="mr-4 mb-3">
                  <input
                    id="sameAddress"
                    class="styled-checkbox"
                    type="checkbox"
                    name="sameAddress"
                    v-model.lazy="sameAddress"
                  />
                  <label for="sameAddress">Same address as mine</label>
                </div>
                <float-label class="form-group mb-2">
                  <input
                    type="text"
                    placeholder="Full address"
                    v-model="nextOfKinAddress"
                    :class="{disable : sameAddress}"
                    class="form__input"
                    name="nextOfKinAddress"
                    :disabled="sameAddress"
                  />
                </float-label>
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
import { required, email } from "vuelidate/lib/validators";
import Loading from "vue-loading-overlay";

import {
  nextOfKinDetail,
  getCountries,
  getStates,
  saveAndExit,
  getNextOfKin
} from "../../../services/listing";

export default {
  name: "nextOfKIn",
  components: {
    Multiselect,
    Loading
  },
  data() {
    return {
      relationWithKin: "",
      relationWithKinOptions: [
        "Spouse/partner",
        "Children",
        "Parents",
        "Siblings",
        "Grandchildren",
        "Grandparents",
        "Nieces/Nephews",
        "Aunts/Uncles",
        "Friend"
      ],
      email: "",
      fname: "",
      lname: "",
      phoneNumber: "",
      nextOfKinAddress: "",
      listingId: this.$route.params.id,
      userId: "",
      submitted: false,
      isLoading: false,
      fullPage: true,
      loaderColor: "#3657ff",
      loaderHeight: 50,
      loaderWidth: 50,
      bgColor: "#fff",
      opacity: 0.5,
      sameAddress: false
    };
  },
  validations: {
    fname: {
      required
    },
    lname: {
      required
    },
    email: {
      required,
      email
    },
    phoneNumber: {
      required
    },
    relationWithKin: {
      required
    },
    nextOfKinAddress: {
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
      this.submitData();
    },
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
      ).then(data => {
        this.isLoading = false;
        if (data.data.success) {
          this.incrementLevel();
        }
      });
    },
    submitData() {
      this.isLoading = true;
      nextOfKinDetail(
        this.userId,
        this.fname,
        this.lname,
        this.email,
        this.phoneNumber,
        this.relationWithKin,
        this.nextOfKinAddress
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
    },
    getData() {
      this.isLoading = true;
      let user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        this.userId = user.user.uuid;
      }
      getNextOfKin(this.userId)
        .then(data => {
          this.isLoading = false;
          if (data.data.success) {
            let returnData = data.data.data;
            this.fname = returnData.first_name;
            this.lname = returnData.last_name;
            this.email = returnData.email;
            this.phoneNumber = returnData.phone;
            this.relationWithKin = returnData.relationship_with_next_of_kin;
            this.nextOfKinAddress = returnData.full_address;
          }
        })
        .catch(err => {
          return err;
        });
    }
  },
  computed: {
    level() {
      return this.$store.state.level;
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

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
          <h3 class="listing__title mb-2">Your KYC profile and ID will never be shared with Members</h3>
          <p
            class="form__input-info picture__subtitle"
          >Completing your KYC (Know your Customer) profile and providing a government ID helps us check you’re really you. It also helps us to keep SPLEET secure, fight against fraud and more.</p>
          <a
            href="https://spleet.ng/terms#privacy"
            target="_blank"
            class="personal__privacy"
          >Check our privacy policy</a>

          <div class="memRequire">
            <div class="row mx-0 form__row">
              <div class="col-lg-12 px-0">
                <p class="form__section-title mb-1">Complete your Personal Information</p>
                <p
                  class="form__input-info ml-0"
                >Your first/last name, DOB, gender must match your ID</p>
              </div>
            </div>

            <div class="row mx-0">
              <div class="col-lg-8 col-sm-12 px-0 form__row">
                <float-label class="form-group mb-2">
                  <div class="mb-2" v-if="submitted && $v.fname.$error">
                    <div class="error" v-if="!$v.fname.required">This field is required</div>
                  </div>
                  <input
                    type="text"
                    placeholder="First Name"
                    v-model="fname"
                    class="form__input"
                    name="fname"
                  />
                </float-label>
              </div>
              <div class="col-lg-8 col-sm-12 px-0 form__row">
                <float-label class="form-group mb-2">
                  <div class="mb-2" v-if="submitted && $v.lname.$error">
                    <div class="error" v-if="!$v.lname.required">This field is required</div>
                  </div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    v-model="lname"
                    class="form__input"
                    name="lname"
                  />
                </float-label>
              </div>
            </div>

            <div class="row mx-0 form__row">
              <div class="col-lg-8 col-sm-12 px-0">
                <div class="position-relative">
                  <float-label class="form-group mb-2">
                    <input
                      :disabled="verifiedUser"
                      type="text"
                      placeholder="Email"
                      v-model="email"
                      class="form__input"
                    />
                    <svgicon icon="verified" class="personal__verified" v-if="verifiedUser"></svgicon>
                  </float-label>
                  <div class="mb-2" v-if="submitted && $v.email.$error">
                    <div class="error" v-if="!$v.email.required">This field is required</div>
                    <div class="error" v-if="!$v.email.email">Email is invalid</div>
                  </div>
                  <p class="form__input-info ml-0">Your email has been confirmed and not editable</p>
                </div>
              </div>
            </div>

            <div class="row mx-0 form__row">
              <div class="col-lg-8 col-sm-12 px-0">
                <div class="position-relative">
                  <float-label class="form-group mb-2">
                    <input
                      disabled
                      type="text"
                      placeholder="Phone Number"
                      v-model="phoneNumber"
                      class="form__input"
                      name="phoneNumber"
                    />
                    <svgicon icon="verified" class="personal__verified"></svgicon>
                  </float-label>
                </div>
              </div>
              <div class="col-lg-12 px-0">
                <p
                  class="form__input-info ml-0"
                >Your phone number has been confirmed and not editable, to change it, go to your profile and add a New number</p>
              </div>
            </div>

            <div class="row mx-0">
              <div class="col-lg-8 col-sm-12 px-0 form__row">
                <label for class="form__label mb-2">Gender</label>
                <div class="mb-2" v-if="submitted && $v.gender.$error">
                  <div class="error" v-if="!$v.gender.required">This field is required</div>
                </div>
                <div class="d-flex position-relative">
                  <div class="mr-4">
                    <input
                      id="female"
                      class="styled-radio"
                      type="radio"
                      name="gender"
                      value="female"
                      v-model.lazy="gender"
                    />
                    <label for="female">Female</label>
                  </div>

                  <div>
                    <input
                      id="male"
                      class="styled-radio"
                      type="radio"
                      name="gender"
                      value="male"
                      v-model.lazy="gender"
                    />
                    <label for="male">Male</label>
                  </div>
                </div>
              </div>
              <div class="col-lg-8 col-sm-12 px-0 form__row">
                <label for class="form__label">Date of Birth</label>
                <div class="mb-2" v-if="submitted && $v.dob.$error">
                  <div class="error" v-if="!$v.dob.required">This field is required</div>
                </div>
                <datepicker
                  input-class="form__input"
                  format="dd MMMM yyyy"
                  v-model="dob"
                  @selected="changeDateFormat"
                ></datepicker>
              </div>
            </div>

            <div class="row mx-0 form__section">
              <div class="col-lg-8 col-sm-12 px-0 form__row">
                <label for class="form__label mb-2">Relationship Status</label>
                <div class="form__select">
                  <multiselect
                    v-model="relationshipStatus"
                    :searchable="false"
                    :options="relationshipStatusOptions"
                  ></multiselect>
                </div>
              </div>
              <div class="col-lg-8 col-sm-12 px-0">
                <label for class="form__label mb-2">Number of Kids</label>
                <div class="form__select">
                  <multiselect v-model="noKids" :searchable="false" :options="noKidsOptions"></multiselect>
                </div>
              </div>
            </div>

            <div class="row mx-0">
              <div class="col-lg-12 px-0">
                <p class="form__section-title">Complete your Address</p>
              </div>
            </div>

            <div class="row mx-0 form__row">
              <div class="col-lg-8 col-sm-12 px-0">
                <float-label class="form-group mb-2">
                  <div class="mb-2" v-if="submitted && $v.personAddress.$error">
                    <div class="error" v-if="!$v.personAddress.required">This field is required</div>
                  </div>
                  <input
                    type="text"
                    placeholder="Full address"
                    v-model="personAddress"
                    class="form__input"
                    name="personAddress"
                  />
                </float-label>
              </div>
            </div>

            <div class="row mx-0 form__row">
              <div class="col-lg-8 col-md-12 px-0">
                <float-label class="form-group mb-2">
                  <input type="text" placeholder="Landmark" v-model="landmark" class="form__input" />
                </float-label>
              </div>
              <div class="col-lg-12 px-0">
                <p class="form__input-info ml-0 mb-0">Help us locate you faster</p>
              </div>
            </div>

            <div class="row mx-0 form__row">
              <div class="col-lg-8 col-sm-12 px-0">
                <label for class="form__label">Country/Region</label>
                <div class="mb-2" v-if="submitted && $v.country.$error">
                  <div class="error" v-if="!$v.country.required">This field is required</div>
                </div>
                <div class="form__select">
                  <multiselect
                    v-model="country"
                    :options="countryOptions"
                    @select="onCountrySelect"
                  ></multiselect>
                </div>
              </div>
            </div>

            <div class="row mx-0">
              <div class="col-lg-8 col-sm-12 px-0 form__row">
                <div class="d-flex position-relative">
                  <div class="personal__gender">
                    <label for class="form__label mb-2">State</label>
                    <div class="mb-2" v-if="submitted && $v.state.$error">
                      <div class="error" v-if="!$v.state.required">This field is required</div>
                    </div>
                    <div class="form__select">
                      <multiselect v-model="state" :options="stateOptions" @select="onStateSelect"></multiselect>
                    </div>
                  </div>

                  <div class="personal__gender ml-auto">
                    <label for class="form__label mb-2">City</label>
                    <div class="form__select">
                      <float-label class="form-group mb-2">
                        <div class="mb-2" v-if="submitted && $v.city.$error">
                          <div class="error" v-if="!$v.city.required">This field is required</div>
                        </div>
                        <input type="text" placeholder="City" v-model="city" class="form__input" />
                      </float-label>
                    </div>
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
import { required, email } from "vuelidate/lib/validators";
import {
  getPersonDetail,
  personDetail,
  saveAndExit,
  getCountries,
  getStates
} from "../../../services/listing";
import moment from "moment";
import Loading from "vue-loading-overlay";
import Datepicker from "vuejs-datepicker";

export default {
  name: "PersonalInfo",
  components: {
    Multiselect,
    Loading,
    Datepicker
  },
  data() {
    return {
      dob: "",
      fname: "",
      lname: "",
      email: "",
      phoneNumber: "",
      gender: "",
      relationshipStatus: "",
      relationshipStatusOptions: ["Single", "Married", "Divorced", "Widowed"],
      noKids: "",
      noKidsOptions: [1, 2, 3, "4+"],
      personAddress: "",
      landmark: "",
      country: "",
      countryOptions: [],
      countryId: "",
      state: "",
      stateOptions: [],
      stateData: "",
      stateId: "",
      city: "",
      userId: null,
      verifiedUser: "",
      listingId: this.$route.params.id,
      submitted: false,
      isLoading: false,
      fullPage: true,
      loaderColor: "#3657ff",
      loaderHeight: 50,
      loaderWidth: 50,
      bgColor: "#fff",
      opacity: 0.5,
      dobFormatChange: ""
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
    gender: {
      required
    },
    dob: {
      required
    },
    personAddress: {
      required
    },
    country: {
      required
    },
    state: {
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
      this.submitData();
    },
    changeDateFormat(value) {
      this.dobFormatChange = moment(value).format("YYYY-MM-DD");
    },
    returnedDobFormat(value) {
      this.dobFormatChange = moment(value).format("YYYY-MM-DD");
      return moment(value).format("DD MMMM YYYY");
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
    getCountries() {
      this.isLoading = true;
      getCountries().then(data => {
        this.isLoading = false;

        this.countryData = data.data.data;
        var i;
        this.countryOptions = [];
        for (i = 0; i < data.data.data.length; i++) {
          this.countryOptions.push(data.data.data[i].name);
        }
      });
    },
    async getStates() {
      this.isLoading = true;
      await getStates(this.countryId).then(data => {
        this.isLoading = false;
        this.stateData = data.data.data;
        var i;
        this.stateOptions = [];
        for (i = 0; i < this.stateData.length; i++) {
          this.stateOptions.push(this.stateData[i].name);
        }
      });
    },
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
    },
    getPersonInfo() {
      this.isLoading = true;
      let user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        this.userId = user.user.uuid;
      }
      getPersonDetail(this.userId)
        .then(data => {
          this.isLoading = false;
          if (data.data.success) {
            let returnData = data.data.data;
            this.fname = returnData.first_name;
            this.lname = returnData.last_name;
            this.email = returnData.email;
            this.phoneNumber = returnData.phone_number;
            this.gender = returnData.gender;
            this.dob = this.returnedDobFormat(returnData.dob);
            this.relationshipStatus = returnData.relationship_status;
            this.noKids = returnData.no_of_kids;
            this.personAddress = returnData.full_address;
            this.landmark = returnData.landmark;
            this.country = returnData.country;
            this.state = returnData.state;
            this.city = returnData.city;
            this.verifiedUser = returnData.is_verified;
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
    submitData() {
      this.isLoading = true;
      personDetail(
        this.userId,
        this.fname,
        this.lname,
        this.gender,
        this.dobFormatChange,
        this.relationshipStatus,
        this.noKids,
        this.personAddress,
        this.landmark,
        this.country,
        this.state,
        this.city
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
  computed: {
    level() {
      return this.$store.state.level;
    }
  },
  mounted() {
    this.getPersonInfo();
    this.getCountries();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

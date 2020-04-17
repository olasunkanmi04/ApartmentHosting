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
          <h3 class="listing__title mb-2">Company/Employer’s Details</h3>
          <p class="form__input-info picture__subtitle">Enter your company or employers details</p>

          <div class="memRequire">
            <div class="row mx-0">
              <div class="col-lg-8 col-sm-12 px-0 form__row">
                <label for class="form__label">Employment Status</label>
                <div class="mb-2" v-if="submitted && $v.employmentStatus.$error">
                  <div class="error" v-if="!$v.employmentStatus.required">This field is required</div>
                </div>
                <div class="form__select">
                  <multiselect
                    v-model="employmentStatus"
                    :searchable="false"
                    :options="employmentStatusOptions"
                  ></multiselect>
                </div>
              </div>
              <div class="col-lg-8 col-sm-12 px-0 form__row">
                <float-label class="form-group">
                  <div class="mb-2" v-if="submitted && $v.jobTitle.$error">
                    <div class="error" v-if="!$v.jobTitle.required">This field is required</div>
                  </div>
                  <input type="text" placeholder="Job Title" v-model="jobTitle" class="form__input" />
                </float-label>
              </div>
            </div>
            <div class="row mx-0">
              <div class="col-lg-8 col-sm-12 px-0 form__row">
                <label for class="form__label">Monthly Salary</label>
                <div class="mb-2" v-if="submitted && $v.salary.$error">
                  <div class="error" v-if="!$v.salary.required">This field is required</div>
                </div>
                <div class="form__select">
                  <multiselect v-model="salary" :searchable="false" :options="salaryOptions"></multiselect>
                </div>
              </div>
              <div class="col-lg-8 col-sm-12 px-0 form__section">
                <float-label class="form-group">
                  <div class="mb-2" v-if="submitted && $v.businessName.$error">
                    <div class="error" v-if="!$v.businessName.required">This field is required</div>
                  </div>
                  <input
                    type="text"
                    placeholder="What is the Company/Business name?"
                    v-model="businessName"
                    class="form__input"
                    name="businessName"
                  />
                </float-label>
              </div>
            </div>

            <div class="row mx-0">
              <div class="col-lg-12 px-0">
                <p class="form__section-title">Business Partner or Manager’s details</p>
              </div>
            </div>

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
              <div class="col-lg-8 col-sm-12 px-0 form__row">
                <float-label class="form-group">
                  <div class="mb-2" v-if="submitted && $v.phoneNumber.$error">
                    <div class="error" v-if="!$v.phoneNumber.required">This field is required</div>
                  </div>
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    v-model="phoneNumber"
                    class="form__input"
                    name="phoneNumber"
                  />
                </float-label>
              </div>
            </div>

            <div class="row mx-0 form__section">
              <div class="col-lg-8 col-sm-12 px-0">
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
            </div>

            <div class="row mx-0">
              <div class="col-lg-12 px-0">
                <p class="form__section-title">Complete Employer’s Address</p>
              </div>
            </div>

            <div class="row mx-0 form__row">
              <div class="col-lg-8 col-sm-12 px-0">
                <float-label class="form-group mb-2">
                  <div class="mb-2" v-if="submitted && $v.companyAddress.$error">
                    <div class="error" v-if="!$v.companyAddress.required">This field is required</div>
                  </div>
                  <input
                    type="text"
                    placeholder="Full address"
                    v-model="companyAddress"
                    class="form__input"
                    name="companyAddress"
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
  companyDetail,
  getCountries,
  getStates,
  getCompanyDetail,
  saveAndExit
} from "../../../services/listing";

export default {
  name: "companyDetails",
  components: {
    Multiselect,
    Loading
  },
  data() {
    return {
      employmentStatus: "",
      employmentStatusOptions: [
        "Business Owner",
        "Employed",
        "Unemployed",
        "Intern/NYSC Corper",
        "Student"
      ],
      jobTitle: "",
      salary: "",
      salaryOptions: [
        "Under 100,000",
        "200,000 - 300,000",
        "400,000 - 500,000",
        "600,000 - 700,000",
        "800,000 - 900,000",
        "Above 1,000,000"
      ],
      businessName: "",
      email: "",
      fname: "",
      phoneNumber: "",
      companyAddress: "",

      listingId: this.$route.params.id,
      userId: "",
      submitted: false,
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
    fname: {
      required
    },
    employmentStatus: {
      required
    },
    jobTitle: {
      required
    },
    salary: {
      required
    },
    businessName: {
      required
    },
    email: {
      required,
      email
    },
    phoneNumber: {
      required
    },
    companyAddress: {
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

    getCompany() {
      this.isLoading = true;
      let user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        this.userId = user.user.uuid;
      }
      getCompanyDetail(this.userId)
        .then(data => {
          this.isLoading = false;
          if (data.data.success) {
            let returnData = data.data.data;
            this.employmentStatus = returnData.emplopyment_status;
            this.jobTitle = returnData.job_title;
            this.salary = returnData.monthly_salary;
            this.businessName = returnData.company_or_business_name;
            this.fname = returnData.business_partner_or_manager_fullname;
            this.phoneNumber = returnData.business_partner_or_manager_phone;
            this.email = returnData.business_partner_or_manager_email;
            this.companyAddress = returnData.company_or_employee_full_address;
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
      companyDetail(
        this.userId,
        this.employmentStatus,
        this.jobTitle,
        this.salary,
        this.businessName,
        this.fname,
        this.phoneNumber,
        this.email,
        this.companyAddress
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
    this.getCompany();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

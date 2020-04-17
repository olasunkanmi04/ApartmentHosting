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
          <h3 class="listing__title mb-2">Enter your Payment Details</h3>
          <p
            class="form__input-info picture__subtitle"
          >Add your Bank details so SPLEET can pay you once a successful subscription has been created</p>
          <p
            class="error"
            v-if="(errorMessage && !verifyDetails) || (!verifyDetails && submitted)"
          >You need to verify your data</p>

          <div class="memRequire">
            <form action @submit.prevent="handleSubmit">
              <div class="row mx-0 form__row">
                <div class="col-lg-8 col-sm-12 px-0">
                  <label for class="form__label">Name of Bank</label>
                  <div class="mb-2" v-if="submitted && $v.bankName.$error">
                    <div class="error" v-if="!$v.bankName.required">This field is required</div>
                  </div>
                  <div class="form__select">
                    <multiselect
                      v-model="bankName"
                      :options="bankNameOptions"
                      track-by="Name"
                      label="Name"
                      @change="verifyDetails = false"
                    ></multiselect>
                  </div>
                </div>
              </div>
              <div class="row mx-0 form__row">
                <div class="col-lg-8 col-sm-12 px-0">
                  <label for class="form__label">Account Number</label>
                  <div class="mb-2" v-if="submitted && $v.accountNumber.$error">
                    <div class="error" v-if="!$v.accountNumber.required">This field is required</div>
                  </div>
                  <input
                    type="text"
                    class="form__input"
                    v-model="accountNumber"
                    @input="verifyDetails = false"
                    @change="getUserBankDetails"
                  />
                </div>
              </div>
              <div class="row mx-0 form__row">
                <div class="col-lg-8 col-sm-12 px-0">
                  <label for class="form__label">BVN</label>
                  <div class="mb-2" v-if="submitted && $v.bvn.$error">
                    <div class="error" v-if="!$v.bvn.required">This field is required</div>
                  </div>
                  <input
                    type="number"
                    class="form__input"
                    v-model.number="bvn"
                    @input="verifyDetails = false"
                  />
                </div>
              </div>

              <div class="row mx-0 form__section">
                <div class="col-lg-8 col-sm-12 px-0">
                  <label for class="form__label">Account Name</label>
                  <div class="mb-2" v-if="submitted && $v.accountName.$error">
                    <div class="error" v-if="!$v.accountName.required">This field is required</div>
                  </div>
                  <input
                    type="text"
                    class="form__input"
                    disabled
                    v-model="accountName"
                    @change="verifyDetails = false"
                  />
                </div>
              </div>
              <button type="submit" class="cta__btn">
                <span>{{ verifyDetails ? "Verified" : "Verify" }}</span>
                <svgicon v-if="verifyDetails" icon="verified" class="payment__verified"></svgicon>
              </button>
            </form>
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

          <button type="button" @click="submit" class="step__next cta__btn">Next</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import routes from "../../routes";
import { required } from "vuelidate/lib/validators";
import Loading from "vue-loading-overlay";

import {
  getBanks,
  getUserBankDetails,
  addPayment,
  saveAndExit,
  getPaymentDetails
} from "../../../services/listing";

export default {
  name: "payments",
  components: {
    Multiselect,
    Loading
  },
  data() {
    return {
      bankName: "",
      bankNameOptions: [],
      accountNumber: "",
      bvn: "",
      accountName: "",
      userId: "",
      listingId: this.$route.params.id,
      submitted: false,
      verifyDetails: false,
      errorMessage: null,
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
    bankName: {
      required
    },
    accountNumber: {
      required
    },
    bvn: {
      required
    },
    accountName: {
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
    incrementStep() {
      this.$store.dispatch("incrementAction", 1);
    },
    submit() {
      if (this.verifyDetails) {
        this.saveAndExit();
        this.$router.push("/breakdown/" + this.listingId);
      } else {
        this.errorMessage = true;
      }
    },
    saveAndExit() {
      this.isLoading = true;
      this.incrementStep();
      // console.log(this.$store.getters.step);
      let level = 1;
      saveAndExit(this.listingId, level, this.$store.getters.step).then(
        data => {
          this.isLoading = false;
          if (data.data.success) {
            console.log(data);
            // this.$store.getters.level = 1;
          }
        }
      );
    },
    getBanks() {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        this.userId = user.user.uuid;
      }
      getBanks()
        .then(data => {
          if (data.data.success) {
            this.bankNameOptions = data.data.data.data.Banks;
            this.returnData();
          }
        })
        .catch(err => {
          return err;
        });
    },
    getUserBankDetails() {
      this.isLoading = true;
      if (this.accountNumber && this.bankName) {
        getUserBankDetails(this.accountNumber, this.bankName.Code)
          .then(data => {
            this.isLoading = false;
            if (data.data.success) {
              this.accountName = data.data.data.account_name;
            }
          })
          .catch(err => {
            return err;
          });
      }
    },
    submitData() {
      this.isLoading = true;
      addPayment(
        this.userId,
        this.bankName.Name,
        this.bankName.Code,
        this.accountNumber,
        this.bvn,
        this.accountName
      )
        .then(data => {
          this.isLoading = false;
          if (data.data.success) {
            this.verifyDetails = true;
          } else {
            this.verifyDetails = false;
          }
        })
        .catch(err => {
          return err;
        });
    },
    returnData() {
      this.isLoading = true;
      getPaymentDetails(this.userId)
        .then(data => {
          this.isLoading = false;
          if (data.data.success) {
            let returnedCode = data.data.data.PaymentKyc.bank_code;
            this.bankName = this.bankNameOptions.find(
              x => x.Code === returnedCode
            );
            this.bvn = data.data.data.PaymentKyc.bvn;
            this.accountNumber = data.data.data.PaymentKyc.account_number;
            this.accountName = data.data.data.PaymentKyc.account_name;
            this.verifyDetails = true;
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
    this.getBanks();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

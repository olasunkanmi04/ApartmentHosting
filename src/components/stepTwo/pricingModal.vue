<template>
  <modal :name="name">
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
    <div class="modal__heading">
      <div slot="top-right">
        <button type="button" class="modal__close-btn" @click="hide">
          <svgicon icon="cancel" class="modal__close"></svgicon>
        </button>
      </div>
      <div class="modal__title-wrap">
        <h3 class="modal__title">What is the price for {{rooms.name}}?</h3>
      </div>
    </div>
    <div class="modal__wrap price__modal-wrap">
      <div class="d-flex form__row">
        <div
          class="price__bdrm-img"
          v-for="(image, index) in rooms.ImageTags"
          :key="index"
          :style="{backgroundImage: 'url('+image.img_url+')'}"
        ></div>
      </div>

      <div class="row mx-0">
        <div class="w-75 price__grp">
          <div v-if="rlsValue">
            <div
              class="form-group mb-2"
              v-for="(plan, index) in rooms.Apartment.Plans"
              :key="index"
            >
              <label
                for
                class="form__label"
                v-if="plan.name == 'monthly'"
              >Rolling Living Subscription (RLS) - Monthly</label>
              <label for class="form__label disable" v-if="plan.name == 'quarterly'">Quarterly</label>
              <label for class="form__label disable" v-if="plan.name == 'biannually'">Biannually</label>

              <input
                v-if="plan.name == 'monthly'"
                v-model.number="rooms.Apartment.Pricing.rental_subscription"
                :name="plan.name"
                type="number"
                class="form__input mb-2"
                @blur="pricingCal"
              />
              <input
                v-if="plan.name == 'quarterly'"
                disabled
                :name="plan.name"
                type="number"
                class="form__input disable mb-2"
                :value="quarterlyPrice"
              />
              <input
                v-if="plan.name == 'biannually'"
                disabled
                :name="plan.name"
                type="number"
                class="form__input disable"
                :value="biannuallyPrice"
              />
            </div>
          </div>

          <div v-if="dlsValue">
            <div
              class="form-group mb-2"
              v-for="(plan, index) in rooms.Apartment.Plans"
              :key="index"
            >
              <label for class="form__label">Daily Living Subscription (DLS) - Daily</label>
              <input
                v-model.number="rooms.Apartment.Pricing.rental_subscription"
                name="daily"
                type="number"
                class="form__input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal__footer">
      <button type="button" class="cta__btn" @click="submitPrice">Save</button>
    </div>
  </modal>
</template>

<script>
import { sharedPrice } from "../../../services/listing";
import Loading from "vue-loading-overlay";

export default {
  name: "PriceModal",
  props: {
    rooms: Object,
    name: String
  },
  components: {
    Loading
  },
  data() {
    return {
      quarterlyPrice: null,
      biannuallyPrice: null,

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
    hide() {
      this.$modal.hide(this.name);
    },
    beforeOpen(event) {
      this.item = event.params.item;
    },
    quarterlyCal() {
      this.quarterlyPrice =
        this.rooms.Apartment.Pricing.rental_subscription * 3;
    },
    biannuallyCal() {
      this.biannuallyPrice =
        this.rooms.Apartment.Pricing.rental_subscription * 6;
    },
    cumulatePrice() {
      this.quarterlyCal();
      this.biannuallyCal();
    },
    submitPrice() {
      this.isLoading = true;
      sharedPrice(
        this.rooms.Apartment.uuid,
        this.rooms.Apartment.Pricing.rental_subscription
      ).then(data => {
        this.isLoading = false;
        if (data.data.success) {
          this.hide();
        }
      });
    }
  },
  computed: {
    pricingCal() {
      return this.cumulatePrice();
    },
    quarterly() {
      return this.$store.state.quarterly;
    },
    biannually() {
      return this.$store.state.biannually;
    },
    rlsValue() {
      return this.$store.state.rlsValue;
    },
    dlsValue() {
      return this.$store.state.dlsValue;
    }
  }
};
</script>
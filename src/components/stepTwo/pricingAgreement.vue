<template>
  <div>
    <div class="listing__wrap mb-0">
      <div class="listing__container">
        <h3 class="listing__title mb-2">SPLEET’s Pricing Agreement</h3>
        <div class="memRequire">
          <p
            class="priceAgree__info"
          >We have two different service fee structures for booking a place to stay which is added to either the Rolling Living Subscription (RLS) or the Daily Living Subscription (DLS)</p>

          <h3 class="priceAgree__title">RLS</h3>
          <p
            class="priceAgree__info"
          >This is a markup fee 29% per listing, this fee is calculated from the subscription subtotal (monthly, quarterly and bi-annually, if applicable, but excluding SPLEET’s taxes) and is automatically deducted from the host payout.</p>

          <h3 class="priceAgree__title">DLS</h3>
          <p
            class="priceAgree__info"
          >This is a markup fee 11% per listing, this fee is calculated from the daily subscription subtotal (but excluding SPLEET’s taxes) and is automatically deducted from the host payout.</p>

          <h3 class="priceAgree__title">One-off booking fee</h3>
          <p
            class="priceAgree__info"
          >To help operate the SPLEET’s platform, including services like customer success and credit card processing, we charge a one-off fixed booking fee that the Member pay when their subscription is made.</p>

          <h3 class="priceAgree__title">Security Deposit</h3>
          <p
            class="priceAgree__info"
          >This is a percentage of 40% of the RLS (not applicable to DLS) that is collected from Members when they book for space. The Members security deposit covers (but not exclusive) the cost of damages that may occur and the penalty for late renewal of subscription without prior cancellation notice</p>

          <p
            class="priceAgree__info"
          >By clicking accept, you, therefore, agree to SPLEET’s Terms of Service, Payment Terms of Service, Privacy Policy, Nondiscrimination Policy.</p>

          <div class="d-flex">
            <button type="button" class="cta__btn mr-4" @click="saveAndExit">Accept</button>
            <button type="button" class="declineBtn" @click="priceAgreementModalShow">Decline</button>
          </div>

          <div class="priceAgree__modal">
            <priceAgreementModal></priceAgreementModal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import priceAgreementModal from "./pricingAgreementModal";
import routes from "../../routes";
import { saveAndExit } from "../../../services/listing";

export default {
  name: "priceAgreement",
  components: {
    priceAgreementModal
  },
  data() {
    return {
      listingId: this.$route.params.id
    };
  },
  methods: {
    priceAgreementModalShow() {
      this.$modal.show("priceAgreementModal");
    },
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    saveAndExit() {
      let level = 1;
      let step = 3;
      saveAndExit(this.listingId, level, step).then(data => {
        if (data.data.success) {
          this.$router.push("/breakdown/" + this.listingId);
        }
      });
    }
  },
  computed: {
    level() {
      return this.$store.state.level;
    },
    step() {
      return this.$store.state.step;
    }
  }
};
</script>
<template>
  <modal name="priceAgreementModal">
    <div class="modal__wrap price__modal-wrap">
      <p class="priceAgree__modal-text">Disagree with Terms and Logout?</p>
      <p
        class="priceAgree__modal-info"
      >You will not be able to publish and monetize your space on SPLEET without agreeing to the Terms.</p>
    </div>

    <div class="modal__footer">
      <button type="button" class="declineBtn mr-4" @click="logOut">Disagree and Logout</button>
      <button type="button" class="cta__btn" @click="hide">Cancel</button>
    </div>
  </modal>
</template>

<script>
export default {
  name: "priceAgreementModal",
  data() {
    return {};
  },
  methods: {
    hide() {
      this.$modal.hide("priceAgreementModal");
    },
    beforeOpen(event) {
      this.item = event.params.item;
    },
    logOut() {
      localStorage.removeItem("user");
      this.$router.push("/");
    }
  }
};
</script>
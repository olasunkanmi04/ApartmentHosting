<template>
  <modal name="MemRequireModal">
    <div class="modal__heading">
      <div slot="top-right">
        <button type="button" class="modal__close-btn" @click="hide">
          <svgicon icon="cancel" class="modal__close"></svgicon>
        </button>
      </div>
      <div class="modal__title-wrap">
        <h3 class="modal__title">SPLEET’s Member’s requirement</h3>
      </div>
    </div>
    <div class="modal__wrap">
      <div class="modal__body picture__tip-wrap">
        <h3 class="memRequire__spleet-modal-title">All SPLEET guests must provide:</h3>
        <div class="picture__tip mb-3">
          <div class>
            <svgicon icon="tick" class="memRequire__spleet-modal-icon"></svgicon>
          </div>
          <div class="memRequire__spleet-modal-info">
            <p class="memRequire__spleet-modal-info-title">Basic Information</p>
            <p class="memRequire__spleet-modal-info-sub">Email address, Confirmed phone number</p>
          </div>
        </div>

        <div class="picture__tip mb-3">
          <div class>
            <svgicon icon="tick" class="memRequire__spleet-modal-icon"></svgicon>
          </div>
          <div class="memRequire__spleet-modal-info">
            <p class="memRequire__spleet-modal-info-title">Know Your Customers (KYC)</p>
            <p
              class="memRequire__spleet-modal-info-sub"
            >Name, DOB, Gender, Occupation and Employer’s information, Current Address, Next of Kin Information, Photo ID, Proof of ID</p>
          </div>
        </div>

        <div class="picture__tip mb-3">
          <div class>
            <svgicon icon="tick" class="memRequire__spleet-modal-icon"></svgicon>
          </div>
          <div class="memRequire__spleet-modal-info">
            <p class="memRequire__spleet-modal-info-title">Payment information</p>
          </div>
        </div>

        <h3 class="memRequire__spleet-modal-title">Before booking your home, each Member must:</h3>

        <div class="picture__tip mb-3">
          <div class>
            <svgicon icon="tick" class="memRequire__spleet-modal-icon"></svgicon>
          </div>
          <div class="memRequire__spleet-modal-info">
            <p class="memRequire__spleet-modal-info-title">Agree to your House Rules</p>
          </div>
        </div>

        <div class="picture__tip mb-3">
          <div class>
            <svgicon icon="tick" class="memRequire__spleet-modal-icon"></svgicon>
          </div>
          <div class="memRequire__spleet-modal-info">
            <p class="memRequire__spleet-modal-info-title">Let you know how many guests are coming</p>
          </div>
        </div>

        <div class="picture__tip mb-3">
          <div class>
            <svgicon icon="tick" class="memRequire__spleet-modal-icon"></svgicon>
          </div>
          <div class="memRequire__spleet-modal-info">
            <p
              class="memRequire__spleet-modal-info-title"
            >Confirm their check-in time if they’re arriving within 2 days</p>
          </div>
        </div>
      </div>
    </div>
    <div class="modal__footer">
      <button type="button" class="cta__btn" @click="hide">Okay</button>
    </div>
  </modal>
</template>

<script>
export default {
  name: "MemRequireModal",
  data() {
    return {};
  },
  methods: {
    hide() {
      this.$modal.hide("MemRequireModal");
    },
    beforeOpen(event) {
      this.item = event.params.item;
    }
  }
};
</script>
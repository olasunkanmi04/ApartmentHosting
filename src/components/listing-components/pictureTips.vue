<template>
  <modal name="PictureModal">
    <div class="modal__heading">
      <div slot="top-right">
        <button type="button" class="modal__close-btn" @click="hide">
          <svgicon icon="cancel" class="modal__close"></svgicon>
        </button>
      </div>
      <div class="modal__title-wrap">
        <h3 class="modal__title">Tips to get great photos of your space</h3>
      </div>
    </div>
    <div class="modal__wrap">
      <div class="modal__body picture__tip-wrap">
        <div class="picture__tip">
          <div class="picture__tip-icon-wrap">
            <svgicon icon="camera" class="picture__tip-icon"></svgicon>
          </div>
          <p
            class="picture__tip-info"
          >Take photos in landscape mode to capture as much of your space as possible. Shoot from corners to add perspective.</p>
        </div>
        <div class="picture__tip">
          <div class="picture__tip-icon-wrap">
            <svgicon icon="light" class="picture__tip-icon"></svgicon>
          </div>
          <p
            class="picture__tip-info"
          >Spaces look best in natural light. If it’s nighttime, turn on your lights. Avoid using flash.</p>
        </div>
        <div class="picture__tip">
          <div class="picture__tip-icon-wrap">
            <svgicon icon="bed" class="picture__tip-icon"></svgicon>
          </div>
          <p
            class="picture__tip-info"
          >Include all spaces your members will access, like bedrooms, bathrooms, the kitchen, and living room.</p>
        </div>
        <p
          class="picture__tip-summary"
        >Once you publish your listing, you’ll also be able to request professional photography.</p>
      </div>
    </div>
    <div class="modal__footer">
      <button class="cta__btn" type="button" @click="hide">Done</button>
    </div>
  </modal>
</template>

<script>
export default {
  name: "PictureModal",
  data() {
    return {};
  },
  methods: {
    hide() {
      this.$modal.hide("PictureModal");
    },
    beforeOpen(event) {
      this.item = event.params.item;
    }
  }
};
</script>
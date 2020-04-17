<template>
  <modal :name="name">
    <div class="modal__heading">
      <div slot="top-right">
        <button type="button" class="modal__close-btn" @click="hide">
          <svgicon icon="cancel" class="modal__close"></svgicon>
        </button>
      </div>
      <div class="modal__title-wrap">
        <h3 class="modal__title">{{modalTitle}}</h3>
        <p class="modal__title-sub">{{modalSubtitle}}</p>
      </div>
    </div>
    <div class="modal__wrap">
      <div class="modal__body">
        <div class="row mx-0 form__row">
          <div
            class="col-lg-4 col-md-4 col-sm-6 col-12 modal__amenity"
            v-for="(amenity,id) in amenities"
            :key="id"
          >
            <label class="form__check-wrap">
              <label class="form__check-container position-absolute">
                <input
                  type="checkbox"
                  :name="amenity.id"
                  class="form__check"
                  :value="amenity"
                  v-model.lazy="selectedAmenities"
                />
                <span class="form__check-label">{{amenity.name}}</span>
                <span class="form__check-checkmark"></span>
              </label>
              <span class="modal__icon-wrap">
                <img :src="amenity.icon_url" class="modal__icon" alt />
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="modal__footer">
      <button class="cta__btn" type="button" @click.prevent="addAmenities">Apply</button>
    </div>
  </modal>
</template>

<script>
export default {
  name: "amenitiesModal",
  props: {
    modalTitle: String,
    modalSubtitle: String,
    numBedroom: Number,
    amenities: Array,
    name: String,
    bedroomAmenities: Array
  },
  data() {
    return {};
  },
  methods: {
    hide() {
      this.$modal.hide(this.name);
    },
    beforeOpen(event) {
      this.item = event.params.item;
    },
    addAmenities() {
      this.hide();
    }
  },
  computed: {
    selectedAmenities: {
      get: function() {
        return this.bedroomAmenities;
      },
      set: function(newValue) {
        this.$emit("updateBedAmenities", newValue);
      }
    }
  }
};
</script>
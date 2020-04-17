<template>
  <modal name="declineReason">
    <div class="modal__wrap">
      <p class="declineModal__title mb-5">Reasons for declining</p>

      <div class="row mx-0">
        <div class="col-lg-12 px-0 mb-3" v-for="(reason, index) in reasons" :key="index">
          <label class="form__check-container">
            <input
              type="checkbox"
              :name="reason.name"
              class="form__check"
              :value="reason.value"
              v-model="declineReasons"
            />
            <span class="form__check-label">{{reason.value}}</span>
            <span class="form__check-checkmark"></span>
          </label>
        </div>
      </div>
    </div>

    <div class="modal__footer">
      <button type="button" class="cta__btn mr-4" @click="hide">Submit</button>
      <button type="button" class="declineBtn" @click="hide">Cancel</button>
    </div>
  </modal>
</template>

<script>
export default {
  name: "declineReason",
  props: {
    name: String
  },
  data() {
    return {
      declineReasons: [],
      reasons: [
        {
          name: "spaceUnavailable",
          value: "Selected space unavailable"
        },
        {
          name: "dateUnavailable",
          value: "Selected date unavailable"
        }
      ]
    };
  },
  methods: {
    hide() {
      this.$modal.hide("declineReason");
      this.hideMain();
    },
    hideMain() {
      this.$modal.hide(this.name);
    },
    beforeOpen(event) {
      this.item = event.params.item;
    }
  }
};
</script>
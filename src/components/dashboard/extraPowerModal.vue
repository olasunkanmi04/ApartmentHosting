<template>
  <modal name="extraCharge">
    <div class="modal__heading">
      <div slot="top-right">
        <button type="button" class="modal__close-btn" @click="hide">
          <svgicon icon="cancel" class="modal__close"></svgicon>
        </button>
      </div>
      <div class="modal__title-wrap">
        <h3 class="modal__title">
          Add Extra Charge for
          <span class="modal__name">{{name}}</span>
        </h3>
        <p class="modal__title-sub">Select property floor plan</p>
      </div>
    </div>
    <div class="modal__wrap">
      <div class="modal__body">
        <div class="form-group form__row">
          <label for class="form__label">Select Category</label>
          <div class="form__select">
            <multiselect v-model="categorySelected" :options="categories" :searchable="true"></multiselect>
          </div>
        </div>
        <div class="form-group form__row">
          <label for class="form__label">Enter Amount</label>
          <div class="row mx-0">
            <div class="col-lg-3 pl-0 pr-1">
              <div class="form__select">
                <multiselect
                  v-model="currency"
                  :options="currencyOptions"
                  :searchable="true"
                  placeholder="Currency"
                ></multiselect>
              </div>
            </div>
            <div class="col-lg-9 pl-0 pr-0">
              <div class="form-group">
                <input type="text" class="form__input" placeholder="0.00" />
              </div>
            </div>
          </div>
        </div>
        <div class="form-group form__row">
          <label for class="form__label">Add Evidence</label>
          <b-form-file
            multiple
            v-model="evidence"
            :state="Boolean(evidence)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
          ></b-form-file>
          <div
            class="extraPower__upload"
            v-for="(evidences, index) in evidence"
            :key="index"
          >{{ evidences ? evidences.name: '' }}</div>
          <!-- <div
            class="mt-3"
            v-for="evidences in evidence "
          >Selected file: {{ evidences ? evidences.name: '' }}</div>-->
        </div>
        <div class="form-group form__row">
          <label for class="form__label">Add Comment</label>
          <textarea name class="form__textarea mt-0"></textarea>
        </div>
      </div>
    </div>
    <div class="modal__footer">
      <button class="declineBtn" type="button" @click="hide">Cancel</button>
      <button class="cta__btn" type="button" @click="showToastr">Apply</button>
    </div>
  </modal>
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
  name: "extraCharge",
  components: {
    Multiselect
  },
  data() {
    return {
      name: "Felicia Adeleke",
      categories: [
        "Excess Power",
        "Fumigation",
        "Key Duplication",
        "Door Repair",
        "Maintenance",
        "Room Upgrade",
        "Excess Security Deposit"
      ],
      categorySelected: null,
      currencyOptions: ["NGN", "GhN"],
      currency: null,
      evidence: []
    };
  },
  methods: {
    hide() {
      this.$modal.hide("extraCharge");
    },
    beforeOpen(event) {
      this.item = event.params.item;
    },
    showToastr() {
      this.$toastr(
        "success",
        "The extra charge has been sent to the Member",
        "Awesome!"
      );
      this.hide();
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

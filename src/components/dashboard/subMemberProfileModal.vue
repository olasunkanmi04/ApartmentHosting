<template>
  <modal :name="name">
    <div class="modal__wrap">
      <div class="modal__confirmation">
        <v-dialog />
      </div>
      <div class="modal__body">
        <div class="modal__Subprofile-wrap">
          <button type="button" class="modal__close-btn" @click="hide">
            <svgicon icon="cancel" class="modal__close"></svgicon>
          </button>
          <div class="modal__profile-wrapper">
            <div class="modal__profile-img-wrap">
              <img src="../../assets/images/dotun.jpg" alt class="img-fluid" />
            </div>
            <div class="modal__profile-detail">
              <p class="modal__profile-name">{{subscriptions.name}}</p>
              <p class="modal__profile-role">{{subscriptions.role}}</p>
              <p class="modal__profile-role">{{subscriptions.phone}}</p>
              <p class="modal__profile-location">{{subscriptions.location}}</p>
            </div>
          </div>
        </div>
        <div class="modal__property">
          <div class="modal__property-info">
            <span class="modal__property-title">Property Name</span>
            <span class="modal__property-name">{{subscriptions.spaceName}}</span>
          </div>
          <div class="modal__property-info">
            <span class="modal__property-title">Location</span>
            <span class="modal__property-name">{{subscriptions.location}}</span>
          </div>
          <div class="modal__property-info">
            <span class="modal__property-title">Property Type</span>
            <span class="modal__property-name">{{subscriptions.propertyType}}</span>
          </div>
          <div
            class="modal__property-info"
            v-if="subscriptions.propertyType && subscriptions.propertyType == 'shared'"
          >
            <span class="modal__property-title">Bedroom Name</span>
            <span class="modal__property-name">{{subscriptions.bedroomName}}</span>
          </div>
          <div class="modal__property-info">
            <span class="modal__property-title">Duration</span>
            <span class="modal__property-name">{{subscriptions.duration}}</span>
          </div>
          <div class="modal__property-info">
            <span class="modal__property-title">Cost of Subscription</span>
            <span class="modal__property-name font-weight-bold">{{subscriptions.cost}}</span>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import declineModal from "./declineReasonModal";
export default {
  name: "subMemberProfileModal",
  components: {
    declineModal
  },
  props: {
    name: String,
    subscriptions: Object
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
    showToastr() {
      this.$toastr(
        "success",
        "An acceptance email has been sent to the Member",
        "Awesome!"
      );
    },
    deleteModalShow(name) {
      this.$modal.show("dialog", {
        title: "Warning!!!",
        text: `Are you sure you sure you want to accept ${name} booking?`,
        buttons: [
          {
            title: "Yes",
            handler: () => {
              this.showToastr();
              this.hide(this.name);
              this.$modal.hide("dialog");
            },
            class: "cta__btn vue-dialog_btn"
          },
          {
            title: "No",
            class: "alt__btn vue-dialog_btn"
          }
        ]
      });
    },
    declinetModalShow() {
      this.$modal.show("declineReason");
    }
  }
};
</script>
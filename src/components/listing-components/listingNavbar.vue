<template>
  <div class="lstng__navb-wrap">
    <nav class="lstng__navb">
      <div class="lstng__navb-container">
        <router-link to="/" class="lstng__navb-logo">
          <img src="../../assets/images/logo.png" alt="Spleet Logo" class="img-fluid" />
        </router-link>

        <div class="lstng__navb-profile">
          <div class="lstng__navb-img">
            <img src="../../assets/images/boy.svg" alt class="img-fluid" />
          </div>
          <p class="lstng__navb-name">{{ userName | capitalize }}</p>
        </div>
      </div>
    </nav>
    <div class="lstng__step">
      <div class="lstng__step-container">
        <div class="lstng__step-wrap">
          <p class="lstng__step-individual" :class="{ active: stepOne }">
            <span>1.</span> Start with the basics
          </p>
          <p class="lstng__step-individual" :class="{ active: stepTwo }">
            <span>2.</span> Get ready for Guest
          </p>
          <p class="lstng__step-individual" :class="{ active: stepThree }">
            <span>3.</span> Knowing you
          </p>
        </div>
        <button class="scdrybtn lstng__step-btn" type="button" @click="saveAndExit">Save & Exit</button>
      </div>
    </div>
    <button class="scdrybtn lstng__step-btn-resp" type="button" @click="saveAndExit">Save & Exit</button>
  </div>
</template>

<script>
import { saveAndExit } from "../../../services/listing";
export default {
  name: "listingNavbar",
  data() {
    return {
      listingId: this.$route.params.id,
      userName: null,
      stepTwo: false,
      stepOne: false,
      stepThree: false
    };
  },
  methods: {
    async saveAndExit() {
      await saveAndExit(
        this.listingId,
        this.$store.getters.level,
        this.$store.getters.step
      ).then(data => {
        if (data.data.success) {
          this.$router.push("/breakdown/" + this.listingId);
        }
      });
    },
    checkRoute() {
      if (this.$route.name == "first-step") {
        this.stepOne = true;
        this.stepTwo = false;
        this.stepThree = false;
      } else if (this.$route.name == "second-step") {
        this.stepOne = false;
        this.stepTwo = true;
        this.stepThree = false;
      } else if (this.$route.name == "third-step") {
        this.stepOne = false;
        this.stepTwo = false;
        this.stepThree = true;
      }
    }
  },
  filters: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  computed: {
    step() {
      return this.$store.getters.step;
    },
    level() {
      return this.$store.getters.level;
    }
  },
  created() {
    let user = JSON.parse(localStorage.getItem("user"));
    this.userName = user.user.first_name;
  },
  mounted() {
    this.checkRoute();
  }
};
</script>

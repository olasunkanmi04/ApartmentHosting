<template>
  <div>
    <!-- responsive view -->
    <!-- <div class="resProgress">
      <p class="resProgress__title" v-show="level == 1">
        <span class="progressFlow__indvdul-icon" v-show="!done">1</span>
        <span>Property Type</span>
      </p>
      <p class="resProgress__title" v-show="level == 2">
        <span class="progressFlow__indvdul-icon" v-show="!done">2</span>
        <span>Bedroom & Bathroom</span>
      </p>
      <p class="resProgress__title" v-show="level == 3">
        <span class="progressFlow__indvdul-icon" v-show="!done">3</span>
        <span>Features & Amenities</span>
      </p>
      <p class="resProgress__title" v-show="level >= 4 && level <= 6">
        <span class="progressFlow__indvdul-icon" v-show="!done">4</span>
        <span>Pictures & Description</span>
      </p>
      <p class="resProgress__title" v-show="level >= 7">
        <span class="progressFlow__indvdul-icon" v-show="!done">5</span>
        <span>Location</span>
      </p>
    </div>-->

    <!-- <ul class="progressFlow">
      <li
        class="progressFlow__indvdul"
        :class="{ done: level > 1, active: level >= 1 }"
      >
        <span class="progressFlow__indvdul-icon progess__numbering">1</span>
        <span class="progressFlow__indvdul-icon progess__icon">
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
        </span>
        <span>Property Type</span>
      </li>
      <li
        class="progressFlow__indvdul"
        :class="{ done: level > 2, active: level >= 2 }"
      >
        <span class="progressFlow__indvdul-icon progess__numbering">2</span>
        <span class="progressFlow__indvdul-icon progess__icon">
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
        </span>
        <span>Bedroom & Bathroom</span>
      </li>
      <li
        class="progressFlow__indvdul"
        :class="{ done: level > 3, active: level >= 3 }"
      >
        <span class="progressFlow__indvdul-icon progess__numbering">3</span>
        <span class="progressFlow__indvdul-icon progess__icon">
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
        </span>
        <span>Features & Amenities</span>
      </li>
      <li
        class="progressFlow__indvdul"
        :class="{ done: level > 6, active: level >= 4 && level <= 6 }"
      >
        <span class="progressFlow__indvdul-icon progess__numbering">4</span>
        <span class="progressFlow__indvdul-icon progess__icon">
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
        </span>
        <span>Pictures & Description</span>
      </li>
      <li
        class="progressFlow__indvdul"
        :class="{ done: level > 7, active: level >= 7 }"
      >
        <span class="progressFlow__indvdul-icon progess__numbering">5</span>
        <span class="progressFlow__indvdul-icon progess__icon">
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
        </span>
        <span>Location</span>
      </li>
    </ul>-->

    <div class="progressFlow">
      <!-- step one progress flow -->
      <div class="progressFlow__stepOne" v-if="stepOne">
        <p class="progressFlow__individual" :class="{ done: level > 1, active: level >= 1 }">
          <span class="progressFlow__numbering">1</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
          <span class="progressFlow__detail">Property Type</span>
        </p>
        <p class="progressFlow__individual" :class="{ done: level > 2, active: level >= 2 }">
          <span class="progressFlow__numbering">2</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
          <span class="progressFlow__detail">Bedroom & Bathroom</span>
        </p>
        <p class="progressFlow__individual" :class="{ done: level > 3, active: level >= 3 }">
          <span class="progressFlow__numbering">3</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>

          <span class="progressFlow__detail">Features & Amenities</span>
        </p>
        <p
          class="progressFlow__individual"
          :class="{ done: level > 6, active: level >= 4 && level <= 6 }"
        >
          <span class="progressFlow__numbering">4</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
          <span class="progressFlow__detail">Pictures & Description</span>
        </p>
        <p class="progressFlow__individual" :class="{ done: level > 7, active: level >= 7 }">
          <span class="progressFlow__numbering">5</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
          <span class="progressFlow__detail">Location</span>
        </p>
      </div>

      <!-- step two progress flow -->
      <div class="progressFlow__stepOne" v-if="stepTwo">
        <p class="progressFlow__individual" :class="{ done: level > 1, active: level >= 1 }">
          <span class="progressFlow__numbering">1</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
          <span class="progressFlow__detail">Members Requirement</span>
        </p>
        <p
          class="progressFlow__individual"
          :class="{ done: level>3, active: level >= 2 }"
          v-show="dlsValue"
        >
          <span class="progressFlow__numbering">2</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
          <span class="progressFlow__detail">Subscription Type</span>
        </p>
        <p
          class="progressFlow__individual"
          :class="{ done: level>2, active: level >= 2 }"
          v-show="rlsValue || !dlsValue"
        >
          <span class="progressFlow__numbering">2</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>

          <span class="progressFlow__detail">Subscription Type</span>
        </p>
        <p
          class="progressFlow__individual"
          :class="{ done: level>6 , active: level >= 3 }"
          v-if="rlsValue"
        >
          <span class="progressFlow__numbering">3</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
          <span class="progressFlow__detail">Price your Space</span>
        </p>
        <p
          class="progressFlow__individual"
          :class="{ done: level>6 , active: level >= 4 }"
          v-if="dlsValue"
        >
          <span class="progressFlow__numbering">3</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
          <span class="progressFlow__detail">Price your Space</span>
        </p>
      </div>

      <!-- step three progress flow -->
      <div class="progressFlow__stepOne" v-if="stepThree">
        <p class="progressFlow__individual" :class="{ done: level > 1, active: level >= 1 }">
          <span class="progressFlow__numbering">1</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
          <span class="progressFlow__detail">Personal Information</span>
        </p>
        <p class="progressFlow__individual" :class="{ done: level > 2, active: level >= 2 }">
          <span class="progressFlow__numbering">2</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
          <span class="progressFlow__detail">Company/Employer</span>
        </p>
        <p class="progressFlow__individual" :class="{ done: level > 3, active: level >= 3 }">
          <span class="progressFlow__numbering">3</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>

          <span class="progressFlow__detail">Next of Kin</span>
        </p>
        <p class="progressFlow__individual" :class="{ done: level>4, active: level >= 4}">
          <span class="progressFlow__numbering">4</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
          <span class="progressFlow__detail">Identification/Photo ID</span>
        </p>
        <p class="progressFlow__individual" :class="{done: level>5, active: level >= 5}">
          <span class="progressFlow__numbering">5</span>
          <svgicon icon="verified" class="progressFlow__icon"></svgicon>
          <span class="progressFlow__detail">Payments</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "listingProgress",
  data() {
    return {
      done: true,
      stepTwo: false,
      stepOne: false,
      stepThree: false
    };
  },
  methods: {
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
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
  computed: {
    level() {
      return this.$store.getters.level;
    },
    step() {
      return this.$store.getters.step;
    },
    rlsValue() {
      return this.$store.state.rlsValue;
    },
    dlsValue() {
      return this.$store.state.dlsValue;
    }
  },
  mounted() {
    this.checkRoute();
  }
};
</script>

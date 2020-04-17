<template>
  <div class="step">
    <div class="step__wrap">
      <div class="step__prev">
        <a href="#" v-show="level > 1" @click="decrementLevel">
          <svgicon icon="down-arrow" class="step__prev-icon"></svgicon>
          <span>Back</span>
        </a>
      </div>
      <button @click="incrementLevel" class="step__next cta__btn">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "stepChange",
  data() {
    return {};
  },
  methods: {
    incrementLevel() {
      this.$store.dispatch("inrementAction", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
    }
  },
  computed: {
    level() {
      return this.$store.getters.level;
    }
  }
};
</script>

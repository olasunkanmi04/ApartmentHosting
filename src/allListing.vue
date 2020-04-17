<template>
  <div>
    <appListing></appListing>
    <appListingProgress></appListingProgress>
    <router-view></router-view>
  </div>
</template>

<script>
import listingFrame from "./components/listing-components/listingNavbar";
import listingProgress from "./components/listing-components/listingProgress";

export default {
  name: "AllListing",
  components: {
    appListing: listingFrame,
    appListingProgress: listingProgress
  },
  data() {
    return {
      listingId: this.$route.params.id
    };
  },
  methods: {},
  computed: {
    step() {
      return this.$store.state.step;
    },
    level() {
      return this.$store.state.level;
    }
  }
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgba(5, 6, 9, 0.7);
  background: #f5f5f5;
  position: relative;
  height: 100vh;
}
</style>

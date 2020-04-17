<template>
  <div v-if="level == 3">
    <form action>
      <div class="listing__wrap">
        <div class="listing__container">
          <h3 class="listing__title">{{ spaceType }}</h3>
          <p v-show="allAmenities < 1 && !notFilled" class="error">You haven't selected any amenity</p>

          <div id="bed-wrap">
            <Amenity
              v-for="(amenity, id) in featureName"
              :key="id"
              :title="featureName[id]"
              :allAmenities="allAmenities"
            ></Amenity>
          </div>
        </div>
      </div>

      <div class="step">
        <div class="step__wrap">
          <div class="step__prev">
            <button
              type="button"
              class="alt__btn"
              v-show="level > 1"
              @click="decrementLevel"
            >Previous</button>
          </div>
          <button type="button" class="step__next cta__btn" @click="nextLevel">Next</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Amenity from "./amenityType";
import {
  getAmenities,
  submitAmenities,
  returnAmenities,
  AllPropertyTypeReturned,
  saveAndExit
} from "../../../services/listing";

export default {
  name: "featureAmenity",
  components: {
    Amenity
  },
  data() {
    return {
      featureName: null,
      allAmenities: [],
      listingId: this.$route.params.id,
      notFilled: true
    };
  },
  methods: {
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
    },
    async getAmenities() {
      await getAmenities().then(data => {
        const returnedAmenities = data.data.data;
        this.featureName = returnedAmenities;
      });
    },
    async submitAmenities() {
      await submitAmenities(this.listingId, this.allAmenities).then(data => {
        if (data.data.success) {
          this.saveAndExit();
        }
      });
    },
    nextLevel() {
      if (this.allAmenities.length > 0) {
        this.notFilled = true;
        this.submitAmenities();
      } else {
        this.notFilled = false;
      }
    },
    async returnAmenities() {
      await returnAmenities(this.listingId).then(data => {
        if (data.data.success) {
          const returnedAmenities = data.data.data.Amenities;
          if (data.data.data.space_type == "shared") {
            this.$store.commit("updateSpaceType", "Co-sharing Space");
          } else if (data.data.data.space_type == "studio") {
            this.$store.commit(
              "updateSpaceType",
              "Studio or Self Contained Space"
            );
          } else if (data.data.data.space_type == "entire") {
            this.$store.commit("updateSpaceType", "Entire Unit");
          }
          var i = 0;
          if (
            Array.isArray(returnedAmenities) &&
            returnedAmenities.length > 0
          ) {
            for (i = 0; i < returnedAmenities.length; i++) {
              if (
                Array.isArray(this.allAmenities) &&
                this.allAmenities.length > 0
              ) {
                if (
                  this.allAmenities.includes(returnedAmenities[i].id) === false
                ) {
                  this.allAmenities.push(returnedAmenities[i].id);
                }
              } else {
                this.allAmenities.push(returnedAmenities[i].id);
              }
            }
          }
        }
      });
    },
    async fetchAllData() {
      await AllPropertyTypeReturned(this.listingId).then(data => {
        const listingReturned = data.data;
        this.$store.commit("setSelectedSpaceType", listingReturned.space_type);
      });
    },
    saveAndExit() {
      saveAndExit(
        this.listingId,
        this.$store.getters.level,
        this.$store.getters.step
      ).then(data => {
        if (data.data.success) {
          this.incrementLevel();
        }
      });
    }
  },
  computed: {
    level() {
      return this.$store.getters.level;
    },
    spaceType() {
      return this.$store.state.selectedSpaceType;
    }
  },
  mounted() {
    this.getAmenities();
    this.fetchAllData();
    this.returnAmenities();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

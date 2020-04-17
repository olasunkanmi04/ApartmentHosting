<template>
  <div class="amenity">
    <div class="amenity__wrap">
      <label for class="form__section-title">{{title.description}}</label>
      <span class="form__add" @click="amenityShow">+Add</span>
    </div>

    <Modal
      :name="newName"
      @updateBedAmenities="updateBedroom"
      :bedroomAmenities="bedroomAmenities"
      :amenities="title.Amenities"
      :modalTitle="modalTitle"
      :modalSubtitle="modalSubtitle"
    />
    <div class="bdrm__furnish-wrap">
      <div class="bdrm__furnish-indvdul" v-for="(bedroomAmenity, id) in bedroomAmenities" :key="id">
        <span>{{ bedroomAmenity.name }}</span>
        <svgicon
          icon="cancel"
          class="bdrm__furnish-indvdul-icon"
          @click="deleteAmenityOn(bedroomAmenity.id)"
        ></svgicon>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import Modal from "./modal";
import { returnAmenities } from "../../../services/listing";

export default {
  name: "amenityType",
  components: {
    Multiselect,
    Modal
  },
  props: {
    title: Object,
    allAmenities: Array
  },
  data() {
    return {
      numAmenity: this.$vnode.key,
      bedroomAmenities: [],
      modalTitle: this.title.description,
      modalSubtitle: "",
      name: "Amenity",
      checkPass: null,
      listingId: this.$route.params.id
    };
  },
  methods: {
    bedroomCountIncrement() {
      this.$store.dispatch("bedroomIncrementAction", 1);
    },
    bedroomCountDecrement() {
      this.$store.dispatch("bedroomDecrementAction", 1);
    },
    amenityShow() {
      this.$modal.show(this.newName);
    },
    updateBedroom(value) {
      this.bedroomAmenities = value;
      var i = 0;
      for (i = 0; i < this.bedroomAmenities.length; i++) {
        if (this.allAmenities.includes(this.bedroomAmenities[i].id) === false) {
          this.allAmenities.push(this.bedroomAmenities[i].id);
        }
      }
    },
    deleteAmenityOn(id) {
      // console.log(this.bedroomAmenities);
      var indexAllAmenities = this.allAmenities.indexOf(id);
      // this.bedroomAmenities.splice(id, 1);
      this.allAmenities.splice(indexAllAmenities, 1);

      for (var i = 0; i < this.bedroomAmenities.length; i++) {
        if (this.bedroomAmenities[i].id == id) {
          var indexBedroomAmenities = this.bedroomAmenities.indexOf(
            this.bedroomAmenities[i]
          );
          this.bedroomAmenities.splice(indexBedroomAmenities, 1);
        }
      }
    },
    hide() {
      this.$modal.hide(this.name);
    },
    async returnAmenities() {
      await returnAmenities(this.listingId).then(data => {
        if (data.data.success) {
          const returnedAmenities = data.data.data.Amenities;
          var i = 0;
          if (
            Array.isArray(returnedAmenities) &&
            returnedAmenities.length > 0
          ) {
            for (i = 0; i < returnedAmenities.length; i++) {
              if (this.title.id == returnedAmenities[i].AmenityCategoryId) {
                this.bedroomAmenities.push(returnedAmenities[i]);
              }
            }
          }
        }
      });
    }
  },
  computed: {
    bedroomCount() {
      return this.$store.getters.bedroomCount;
    },
    newName() {
      return this.name + this.numAmenity;
    }
  },
  mounted() {
    this.returnAmenities();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
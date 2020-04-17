<template>
  <div v-if="level==6">
    <form action @submit.prevent="handleSubmit">
      <div class="listing__wrap">
        <div class="listing__container">
          <div class="description">
            <form action>
              <div class="form-group description__wrap">
                <h3 class="listing__title mb-2">Name your place</h3>
                <label
                  for="spaceName"
                  class="form__input-info"
                >Attract guests with a listing title that highlights what makes your place special.</label>
                <div class="mb-2" v-if="submitted && $v.spaceName.$error">
                  <div
                    class="error"
                    v-if="!$v.spaceName.required"
                  >You haven't entered a name for your space</div>
                </div>
                <textarea
                  maxlength="200"
                  name="spaceName"
                  class="description__textarea-name form__textarea"
                  v-on:keyup="countdown"
                  v-model="spaceName"
                ></textarea>
                <small class="form__textarea-count">{{spaceNameCount}}</small>
              </div>
            </form>
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
          <button type="submit" class="step__next cta__btn">Next</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import {
  addListingName,
  getListingName,
  saveAndExit
} from "../../../services/listing";
import { required } from "vuelidate/lib/validators";

export default {
  name: "spaceName",
  data() {
    return {
      maxCount: 200,
      spaceNameCount: 200,
      spaceName: "",
      listingId: this.$route.params.id,
      submitted: false
    };
  },
  validations: {
    spaceName: {
      required
    }
  },
  methods: {
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
    },
    handleSubmit(e) {
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.postName();
    },
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
    },
    countdown() {
      this.spaceNameCount = this.maxCount - this.spaceName.length;
    },
    async postName() {
      await addListingName(this.listingId, this.spaceName)
        .then(data => {
          if (data.data.success) {
            this.saveAndExit();
          } else {
            alert(data.data.error);
          }
        })
        .catch(function(err) {
          throw err;
        });
    },
    async returnName() {
      await getListingName(this.listingId)
        .then(data => {
          if (data.data.success) {
            this.spaceName = data.data.data.name;
          } else {
            alert(data.error);
          }
        })
        .catch(function(err) {
          throw err;
        });
    }
  },
  computed: {
    level() {
      return this.$store.getters.level;
    }
  },
  mounted() {
    this.returnName();
  }
};
</script>
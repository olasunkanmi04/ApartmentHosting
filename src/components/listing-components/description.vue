<template>
  <div v-if="level==5">
    <form action @submit.prevent="handleSubmit">
      <div class="listing__wrap">
        <div class="listing__container">
          <div class="description">
            <form action>
              <div class="form-group description__wrap">
                <h3 class="listing__title mb-2">Describe your property to Members</h3>
                <label
                  for="description"
                  class="form__input-info"
                >Write a quick summary of your place. You can highlight what’s special about your space, the neighbourhood, and how you’ll interact with guests.</label>
                <div class="mb-2" v-if="submitted && $v.description.$error">
                  <div class="error" v-if="!$v.description.required">This field is compulsory</div>
                </div>
                <textarea
                  maxlength="500"
                  name="description"
                  class="description__textarea form__textarea"
                  v-on:keyup.prevent="descriptionCountdown"
                  v-model="description"
                  placeholder="Describe the decor, light, what’s nearby etc."
                ></textarea>
                <small
                  class="form__textarea-count"
                  :class="{'text-danger': hasError }"
                >{{descriptionCount}}</small>
              </div>

              <h3 class="listing__title mb-2">Want to add more info? (optional)</h3>
              <label
                for
                class="form__input-info"
              >Use the additional fields below to share more details.</label>

              <div class="form-group mt-5">
                <label for class="form__section-title mb-1">Your space</label>
                <p
                  class="form__input-info"
                >Add other details that can help set Members’ expectations for their stay.</p>
                <textarea
                  name
                  class="form__textarea description__textarea-other"
                  v-model="yourSpace"
                  v-on:keyup.prevent="yourSpaceCountdown"
                  maxlength="250"
                ></textarea>
                <small
                  class="form__textarea-count"
                  :class="{'text-danger': hasError }"
                >{{yourSpaceCount}}</small>
              </div>

              <div class="form-group mt-5">
                <label for class="form__section-title mb-1">Your availability</label>
                <p
                  class="form__input-info"
                >Let Members know how available you’ll be during their stay. For your safety, don’t share your phone number or email until you have a confirmed reservation.</p>
                <textarea
                  v-model="availability"
                  v-on:keyup.prevent="availabilityCountdown"
                  maxlength="250"
                  name
                  class="form__textarea description__textarea-other"
                ></textarea>
                <small
                  class="form__textarea-count"
                  :class="{'text-danger': hasError }"
                >{{availabilityCount}}</small>
              </div>

              <div class="form-group mt-5">
                <label for class="form__section-title mb-1">Your neighbourhood</label>
                <p
                  class="form__input-info"
                >Share what makes your neighbourhood special, like a favourite coffee shop, park, or a unique landmark.</p>
                <textarea
                  v-model="neighbourhood"
                  v-on:keyup.prevent="neighbourhoodCountdown"
                  maxlength="250"
                  name
                  class="form__textarea description__textarea-other"
                ></textarea>
                <small
                  class="form__textarea-count"
                  :class="{'text-danger': hasError }"
                >{{neighbourhoodCount}}</small>
              </div>

              <div class="form-group mt-5">
                <label for class="form__section-title mb-1">Getting around</label>
                <p
                  class="form__input-info"
                >Add info about getting around your city or neighbourhood, like nearby public transportation, driving tips, or good walking routes.</p>
                <textarea
                  v-model="getAround"
                  v-on:keyup.prevent="getAroundCountdown"
                  maxlength="250"
                  name
                  class="form__textarea description__textarea-other"
                ></textarea>
                <small
                  class="form__textarea-count"
                  :class="{'text-danger': hasError }"
                >{{getAroundCount}}</small>
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
import { required } from "vuelidate/lib/validators";
import {
  addDescription,
  getDescription,
  saveAndExit
} from "../../../services/listing";

export default {
  name: "description",
  data() {
    return {
      maxCount: 500,
      descriptionCount: 500,
      description: "",

      hasError: false,

      maxCountOther: 250,
      yourSpace: "",
      yourSpaceCount: 250,

      availability: "",
      availabilityCount: 250,

      neighbourhood: "",
      neighbourhoodCount: 250,

      getAround: "",
      getAroundCount: 250,
      submitted: false,
      listingId: this.$route.params.id
    };
  },
  validations: {
    description: {
      required
    }
  },
  methods: {
    handleSubmit(e) {
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.postDescription();
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
    },
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
    },
    descriptionCountdown() {
      if (this.description.length) {
        this.descriptionCount = this.maxCount - this.description.length;
        this.hasError = this.descriptionCount < 0;
      }
    },
    yourSpaceCountdown() {
      if (this.yourSpace.length) {
        this.yourSpaceCount = this.maxCountOther - this.yourSpace.length;
      }
    },
    availabilityCountdown() {
      if (this.availability.length) {
        this.availabilityCount = this.maxCountOther - this.availability.length;
      }
    },
    neighbourhoodCountdown() {
      if (this.neighbourhood.length) {
        this.neighbourhoodCount =
          this.maxCountOther - this.neighbourhood.length;
      }
    },
    getAroundCountdown() {
      if (this.getAround.length) {
        this.getAroundCount = this.maxCountOther - this.getAround.length;
      }
    },
    async postDescription() {
      await addDescription(
        this.listingId,
        this.description,
        this.yourSpace,
        this.availability,
        this.neighbourhood,
        this.getAround
      )
        .then(data => {
          if (data.data.success) {
            this.saveAndExit();
            return data;
          } else {
            alert(data.data.error);
          }
        })
        .catch(function(err) {
          throw err;
        });
    },

    async getDescription() {
      await getDescription(this.listingId).then(data => {
        const returnDescription = data.data.data;
        this.description = returnDescription.description;
        this.yourSpace = returnDescription.more_info;
        this.availability = returnDescription.availability;
        this.neighbourhood = returnDescription.neighbourhood;
        this.getAround = returnDescription.getting_around;
      });
    }
  },
  computed: {
    level() {
      return this.$store.getters.level;
    },
    step() {
      return this.$store.getters.step;
    }
  },
  mounted() {
    this.getDescription();
  }
};
</script>
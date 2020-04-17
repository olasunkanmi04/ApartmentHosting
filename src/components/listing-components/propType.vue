<template>
  <div class="prop">
    <form action @submit.prevent="handleSubmit">
      <div class="listing__wrap">
        <div class="listing__container">
          <h3 class="listing__title">What spaces are you listing</h3>

          <div class="row mx-0 form__row">
            <div class="col-lg-8 col-sm-12 px-0">
              <div class="form-group">
                <label for class="form__label">First, lets narrow things down</label>
                <div class="mb-2" v-if="submitted && $v.narrowValue.$error">
                  <div class="error" v-if="!$v.narrowValue.required">This field is required</div>
                </div>
                <div class="form__select">
                  <multiselect
                    v-model="narrowValue"
                    :options="narrowOptions"
                    @select="onNarrowSelect"
                    track-by="name"
                    label="name"
                    :searchable="false"
                  ></multiselect>
                </div>
              </div>
            </div>
          </div>

          <div class="row mx-0 form__section">
            <div class="col-lg-12 px-0">
              <div class="form-group">
                <label for class="form__label">Now choose a property type</label>
                <div class="mb-2" v-if="submitted && $v.propTypeValue.$error">
                  <div
                    class="error"
                    v-if="!$v.propTypeValue.required"
                  >You haven't selected a property type</div>
                </div>
                <div class="row mx-0">
                  <div class="col-lg-8 col-sm-12 px-0 mb-2">
                    <div class="form__select">
                      <multiselect
                        v-model="propTypeValue"
                        :options="propTypeOptions"
                        @select="onPropTypeSelect"
                        track-by="name"
                        label="name"
                        :searchable="false"
                      ></multiselect>
                    </div>
                  </div>
                </div>
                <div class="row mx-0">
                  <div class="col-sm-8 px-0">
                    <p class="form__input-info">{{ propTypeInfo }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Co-shared Space, Studio Space or Entire Unit? -->
          <div class="row mx-0">
            <div class="col-lg-12 px-0">
              <p class="form__section-title">Co-shared Space, Studio Space or Entire Unit?</p>
            </div>
          </div>

          <div class="mb-2" v-if="submitted && $v.spaceType.$error">
            <div class="error" v-if="!$v.spaceType.required">You haven't selected a space type</div>
          </div>

          <div class="row mx-0 form__row">
            <div class="col-lg-8 col-sm-12 px-0 mb-2">
              <div>
                <input
                  class="styled-radio"
                  id="co-shared"
                  type="radio"
                  name="spaceType"
                  value="shared"
                  v-model.lazy="spaceType"
                />
                <label for="co-shared">Co-sharing space</label>
              </div>
            </div>
            <p class="form__input-info form__check-info">
              Members sleep in their private bedroom with ensuite or adjoining
              bathroom and toilet, with common area and kitchen that could be
              shared with others.
            </p>
          </div>

          <div class="row mx-0 form__row">
            <div class="col-lg-8 col-sm-12 px-0 mb-2">
              <div>
                <input
                  class="styled-radio"
                  id="studio"
                  type="radio"
                  name="spaceType"
                  value="studio"
                  v-model.lazy="spaceType"
                />
                <label for="studio">Studio or Self Contained Space</label>
              </div>
            </div>
            <p class="form__input-info form__check-info">
              Member has sole access to a private room, bathroom, toilet and
              kitchen/kitchenette.
            </p>
            <!-- <div class="col-lg-7 col-md-6 col-sm-12 px-0 px-sm-4">
            <p
              class="form__input-info"
            >Member has sole access to a private room, bathroom, toilet and kitchen/kitchenette.</p>
            </div>-->
          </div>

          <div class="row mx-0 form__row">
            <div class="col-lg-8 col-sm-12 px-0 mb-2">
              <div>
                <input
                  class="styled-radio"
                  id="entire"
                  type="radio"
                  name="spaceType"
                  value="entire"
                  v-model.lazy="spaceType"
                />
                <label for="entire">Entire Unit</label>
              </div>
            </div>
            <p class="form__input-info form__check-info">
              Members have the whole unit to themselves. This usually includes a
              bedroom, a bathroom, a living room and a kitchen.
            </p>
            <!-- <div class="col-lg-7 col-md-6 col-sm-12 px-0 px-sm-4">
            <p
              class="form__input-info"
            >Members have the whole unit to themselves. This usually includes a bedroom, a bathroom, a living room and a kitchen.</p>
            </div>-->
          </div>

          <!-- Are you a live-in Landlord -->
          <div class="row mx-0">
            <div class="col-lg-12 px-0">
              <p class="form__section-title">Are you a live-in Landlord</p>
            </div>
          </div>

          <div class="mb-2" v-if="submitted && $v.liveInLL.$error">
            <div class="error" v-if="!$v.liveInLL.required">Are you a live-in Landlord</div>
          </div>
          <div class="row mx-0">
            <div class="col-lg-12 px-0 mb-3">
              <div>
                <input
                  class="styled-radio"
                  id="live-inLLNo"
                  type="radio"
                  name="live-inLL"
                  :value="false"
                  v-model="liveInLL"
                />
                <label for="live-inLLNo">No, it’s primarily set up for Members</label>
              </div>
            </div>
          </div>
          <div class="row mx-0 form__row">
            <div class="col-lg-12 px-0">
              <div>
                <input
                  class="styled-radio"
                  id="live-inLLYes"
                  type="radio"
                  name="live-inLL"
                  :value="true"
                  v-model="liveInLL"
                />
                <label for="live-inLLYes">Yes, I keep my personal belongings here or Live-in</label>
              </div>
            </div>
          </div>

          <!-- Are you listing on SPLEET as part of a company? -->
          <div class="row mx-0">
            <div class="col-lg-12 px-0">
              <p class="form__section-title">Are you listing on SPLEET as part of a company?</p>
            </div>
            <!-- <div class="col-lg-7 col-md-6 col-sm-12 px-0 px-sm-4 mb-2">
            <p
              class="form__input-info"
            >This helps you get the right features for how you host—it won’t show up to members or impact how you show up in search.</p>
            </div>-->
          </div>
          <div class="mb-2" v-if="submitted && $v.aCompany.$error">
            <div class="error" v-if="!$v.aCompany.required">Select if you're listing as a company</div>
          </div>
          <div class="row mx-0">
            <div class="col-lg-8 col-sm-12 px-0 mb-3">
              <div>
                <input
                  class="styled-radio"
                  id="aCompanyNo"
                  type="radio"
                  name="aCompany"
                  :value="false"
                  v-model="aCompany"
                />
                <label for="aCompanyNo">No, I’m not</label>
              </div>
            </div>
          </div>
          <div class="row mx-0">
            <div class="col-lg-8 col-sm-12 px-0 mb-2">
              <div>
                <input
                  class="styled-radio"
                  id="aCompanyYes"
                  type="radio"
                  name="aCompany"
                  :value="true"
                  v-model="aCompany"
                />
                <label for="aCompanyYes">Yes, I am</label>
              </div>
            </div>
          </div>
          <div class="row mx-0">
            <div class="col-lg-12 px-0">
              <p class="form__input-info">
                This helps you get the right features for how you host—it won’t
                show up to members or impact how you show up in search.
              </p>
            </div>
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
import Multiselect from "vue-multiselect";
import { required } from "vuelidate/lib/validators";
import {
  propertyTypeData,
  propertyType,
  AllPropertyTypeReturned,
  saveAndExit
} from "../../../services/listing";

export default {
  name: "propType",
  components: {
    Multiselect
  },
  data() {
    return {
      narrowValue: null,
      narrowOptions: [],
      propTypeValue: null,
      propTypeOptions: [],
      propTypeInfo: "",
      liveInLL: "",
      aCompany: "",
      submitted: false,
      narrowValueId: "",
      propTypeValueId: "",
      listingId: this.$route.params.id
    };
  },
  validations: {
    spaceType: {
      required
    },
    narrowValue: {
      required
    },
    propTypeValue: {
      required
    },
    liveInLL: {
      required
    },
    aCompany: {
      required
    }
  },
  methods: {
    onNarrowSelect(option) {
      this.narrowValueId = option.id;
      this.propTypeOptions = option.PropertyListingCategories;
    },
    onPropTypeSelect(option) {
      this.propTypeValueId = option.id;
      this.propTypeInfo = option.description;
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
    handleSubmit(e) {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.submitData();
      // this.$forceUpdate();
    },
    async fetchData() {
      await propertyTypeData().then(data => {
        this.narrowOptions = data.data;
      });
    },
    async fetchAllData() {
      await AllPropertyTypeReturned(this.listingId).then(data => {
        const listingReturned = data.data;
        this.liveInLL = listingReturned.live_in_landlord;
        this.aCompany = listingReturned.is_organization;
        this.spaceType = listingReturned.space_type;
        this.$store.commit("setSelectedSpaceType", listingReturned.space_type);
        if (listingReturned.PropertyListingCategory) {
          this.narrowValue =
            listingReturned.PropertyListingCategory.PropertyListingType;
          this.propTypeValue = listingReturned.PropertyListingCategory;
          this.propTypeValueId = listingReturned.property_listing_category_id;
          this.propTypeInfo =
            listingReturned.PropertyListingCategory.description;
        }
      });
    },
    async submitData() {
      await propertyType(
        this.listingId,
        this.propTypeValueId,
        this.spaceType,
        this.liveInLL,
        this.aCompany
      ).then(
        data => {
          if (data.success) {
            this.saveAndExit();
          } else {
            alert(data.message);
          }
        },
        error => {}
      );
    }
  },
  computed: {
    level() {
      return this.$store.getters.level;
    },
    step() {
      return this.$store.getters.step;
    },
    onlyOneBed() {
      return this.$store.state.onlyOneBed;
    },
    spaceType: {
      get() {
        return this.$store.state.selectedSpaceType;
      },
      set(value) {
        this.$store.commit("updateSpaceType", value);
      }
    },
    entireSpace() {
      return this.$store.state.entireSpace;
    },
    coSharedSpace() {
      return this.$store.state.coSharedSpace;
    }
  },
  watch: {
    spaceType: function(value) {
      if (value) {
        if (value.includes("studio")) {
          this.$store.state.onlyOneBed = true;
          this.$store.state.entireSpace = true;
          this.$store.state.coSharedSpace = false;
        } else if (value.includes("entire")) {
          this.$store.state.onlyOneBed = false;
          this.$store.state.entireSpace = true;
          this.$store.state.coSharedSpace = false;
        } else if (value.includes("shared")) {
          this.$store.state.entireSpace = false;
          this.$store.state.coSharedSpace = true;
          this.$store.state.onlyOneBed = false;
        } else {
          return;
        }
      }
    }
  },
  mounted() {
    this.fetchData();
    this.fetchAllData();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<template>
  <div class="prop">
    <div class="loader__wrap">
      <loading
        :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="fullPage"
        :color="loaderColor"
        :height="loaderHeight"
        :width="loaderWidth"
        :background-color="bgColor"
      ></loading>
    </div>
    <form action>
      <div class="listing__wrap">
        <div class="listing__container">
          <div class="memRequire">
            <div class="row mx-0 form__row">
              <div class="col-lg-8 col-md-8 col-sm-8 col-8 pl-0">
                <div class="form-group">
                  <p class="memRequire__spleet mb-0">SPLEET’s Member’s requirement</p>
                  <p
                    class="form__input-info picture__subtitle"
                  >SPLEET has requirements that all Members must meet before they book.</p>
                </div>
              </div>

              <div class="col-lg-4 col-md-4 col-sm-4 col-4 px-0">
                <p class="memRequire__spleet-modal" @click="MemRequireShow">Review</p>
              </div>
            </div>

            <h3 class="memRequire__spleet">Set house rules for your Members</h3>
            <p
              class="form__input-info picture__subtitle"
            >Member must agree to your house rules before they book</p>

            <div class="memRequire__host">
              <div class="row mx-0 memRequire__row" v-for="(memRule, id) in memRules" :key="id">
                <div class="col-lg-8 col-md-8 col-sm-8 col-8 pl-0">
                  <div class="form-group d-flex" style="align-items: center;">
                    <p class="memRequire__label">{{memRule.name}}</p>
                    <span
                      class="memRequire__tooltip-wrap"
                      v-tooltip="{
                            content: memRule.description,
                            placement: 'right-center',
                            classes: ['info'],
                            targetClasses: ['it-has-a-tooltip'],
                            offset: 5,
                            delay: {
                              show: 500,
                              hide: 300,
                            },
                        }"
                    >
                      <svgicon class="memRequire__tooltip" icon="information"></svgicon>
                    </span>
                  </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 col-4 px-0">
                  <div class="d-flex">
                    <label class="memRequire__form-check-container">
                      <input
                        :checked="returnRules(memRule.id, false)"
                        @click="setValue(memRule.id, false)"
                        type="radio"
                        :name="memRule.name"
                        class="memRequire__form-check"
                        :value="[{id:memRule.id, status:false}]"
                      />
                      <span class="memRequire__form-check-label"></span>
                      <svgicon class="memRequire__form-check-checkmark" icon="uncheck"></svgicon>
                    </label>
                    <label class="memRequire__form-check-container">
                      <input
                        :checked="returnRules(memRule.id, true)"
                        @click="setValue(memRule.id, true)"
                        type="radio"
                        :name="memRule.name"
                        class="memRequire__form-check"
                        :value="[{id: memRule.id, status:true}]"
                      />
                      <span class="memRequire__form-check-label"></span>
                      <svgicon class="memRequire__form-check-checkmark" icon="completed"></svgicon>
                    </label>
                  </div>
                </div>
              </div>
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
          <button type="button" class="step__next cta__btn" @click="postSelectedRules">Next</button>
        </div>
      </div>

      <div class="picture__modal">
        <MemRequireModal></MemRequireModal>
      </div>
    </form>
  </div>
</template>

<script>
import MemRequireModal from "./memRequireModal";
import {
  getMembersRules,
  selectedRules,
  getSelectedRules,
  saveAndExit
} from "../../../services/listing";
import Vue from "vue";
import VTooltip from "v-tooltip";
Vue.use(VTooltip);
import Loading from "vue-loading-overlay";

export default {
  name: "memberRequirement",
  components: {
    MemRequireModal,
    Loading
  },
  data() {
    return {
      memRules: null,
      selectedRules: [],
      listingId: this.$route.params.id,
      returnedSelectedRules: null,

      isLoading: false,
      fullPage: true,
      loaderColor: "#3657ff",
      loaderHeight: 50,
      loaderWidth: 50,
      bgColor: "#ffffff"
    };
  },
  methods: {
    setValue(id, value) {
      var self = this;
      this.selectedRules.forEach(function(val, index) {
        if (val["id"] == id) {
          self.selectedRules.splice(index, 1);
          return false;
        }
      });

      this.selectedRules.push({
        id: id,
        status: value
      });
    },
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
    },
    MemRequireShow() {
      this.$modal.show("MemRequireModal");
    },
    getRules() {
      this.isLoading = true;
      getMembersRules()
        .then(data => {
          this.isLoading = false;
          if (data.data.success) {
            this.memRules = data.data.data;
          }
        })
        .catch(function(err) {
          throw err;
        });
    },
    saveAndExit() {
      this.isLoading = true;
      saveAndExit(
        this.listingId,
        this.$store.getters.level,
        this.$store.getters.step
      ).then(data => {
        this.isLoading = false;
        if (data.data.success) {
          this.incrementLevel();
        }
      });
    },
    postSelectedRules() {
      this.isLoading = true;
      selectedRules(this.listingId, this.selectedRules)
        .then(data => {
          this.isLoading = false;
          if (data.data.success) {
            this.saveAndExit();
          }
        })
        .catch(err => {
          return err;
        });
    },
    getSelectedRules() {
      this.isLoading = true;
      getSelectedRules(this.listingId)
        .then(data => {
          this.isLoading = false;
          this.returnedSelectedRules = data.data.data.Rules;
          var i;
          for (i = 0; i <= this.returnedSelectedRules.length; i++) {
            this.selectedRules.push({
              id: this.returnedSelectedRules[i].id,
              status: this.returnedSelectedRules[i].PropertyListingRule.status
            });
          }
        })
        .catch(err => {
          return err;
        });
    },
    returnRules(memId, status) {
      if (this.returnedSelectedRules != null) {
        const lo = this.returnedSelectedRules.filter(
          rule => rule.id == memId && status == rule.PropertyListingRule.status
        );
        if (lo.length) {
          return true;
        }
        return false;
      }
    }
  },
  computed: {
    level() {
      return this.$store.state.level;
    }
  },
  mounted() {
    this.getRules();
    this.getSelectedRules();
  }
};
</script>

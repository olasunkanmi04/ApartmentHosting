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
        :opacity="opacity"
      ></loading>
    </div>
    <form action @submit.prevent="handleSubmit">
      <div class="listing__wrap">
        <div class="listing__container">
          <h3 class="listing__title mb-2">Update your calendar</h3>
          <p
            class="form__input-info picture__subtitle"
          >Cancelling disrupts Members’ plans. If you cancel because your calendar is inaccurate, you’ll be charged a penalty fee and the dates won’t be available for anyone else to book</p>

          <div class="memRequire">
            <div
              class="error mb-2"
              v-if="submitted && !keepCalendarUpdated"
            >You must agree to keep your calendar up to date</div>
            <div class="row mx-0 form__row">
              <div class="col-lg-8 col-sm-12 px-0 mb-2">
                <div>
                  <input
                    id="keepCalendarUpdated"
                    class="styled-checkbox"
                    type="checkbox"
                    name="keepCalendarUpdated"
                    v-model.lazy="keepCalendarUpdated"
                  />
                  <label for="keepCalendarUpdated">Got it! I’ll keep my calendar up to date</label>
                </div>
              </div>
            </div>

            <div class="row mx-0 form__demacator form__row">
              <div class="col-lg-8 col-sm-12 px-0 mb-2">
                <label for class="form__label">How long can Members stay?</label>
                <div class="d-flex mb-3">
                  <float-label class="form-group">
                    <input
                      type="number"
                      name="minNight"
                      placeholder="Min. Night(s)"
                      v-model="minNight"
                      class="form__input"
                    />
                  </float-label>
                  <button
                    type="button"
                    :disabled="minNight<=1"
                    class="calendar__btn"
                    :class="{disableBtn : minNight<=1}"
                    @click="decreaseMinNight"
                  >-</button>
                  <button type="button" class="calendar__btn" @click="increaseMinNight">+</button>
                </div>

                <div class="d-flex">
                  <float-label class="form-group">
                    <input
                      type="number"
                      name="maxNight"
                      placeholder="Max. Night(s)"
                      v-model="maxNight"
                      class="form__input"
                    />
                  </float-label>
                  <button
                    type="button"
                    class="calendar__btn"
                    @click="decreaseMaxNight"
                    :class="{disableBtn : maxNight<=1 || maxNight <= minNight}"
                    :disabled="maxNight<=1 || maxNight <= minNight"
                  >-</button>
                  <button type="button" class="calendar__btn" @click="increaseMaxNight">+</button>
                </div>
              </div>

              <div class="col-lg-12 px-0">
                <div class="d-flex">
                  <p class="tip">Tip:</p>
                  <p
                    class="tip__info"
                  >Shorter trips can create more bookings, but you might have to turn over your space more often</p>
                </div>
              </div>
            </div>

            <div class="row mx-0 form__demacator form__row">
              <div class="col-lg-8 col-sm-12 px-0 mb-2">
                <label for class="form__label">How far in advance can Members book?</label>
                <div class="mb-2" v-if="submitted && $v.advanceBook.$error">
                  <div
                    class="error"
                    v-if="!$v.advanceBook.required"
                  >Let members know how far in advance they can book</div>
                </div>
                <div class="form__select">
                  <multiselect
                    v-model="advanceBook"
                    :searchable="false"
                    :options="advanceBookOptions"
                  ></multiselect>
                </div>
                <div class="d-flex flex-wrap mt-4">
                  <div
                    class="advn__graph-wrap mr-4 mb-3"
                    v-for="(advanceDatas, index) in advanceData"
                    :key="index"
                  >
                    <span class="advn__graph-hang"></span>
                    <span class="advn__graph-hang second-hang"></span>
                    <div class="advn__graph">
                      <div class="advn__graph-top"></div>
                      <div class="advn__graph-text-wrap">
                        <p class="advn__graph-text">{{advanceDatas}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-12 px-0">
                <div class="d-flex">
                  <p class="tip">Tip:</p>
                  <p
                    class="tip__info"
                  >Most hosts can keep their calendars updated up to 6 months out.</p>
                </div>
              </div>
            </div>

            <div class="row mx-0 form__demacator form__row">
              <div class="col-lg-8 col-sm-12 px-0 mb-2">
                <label for class="form__label">How much notice do you need before Members arrive?</label>
                <div class="mb-2" v-if="submitted && $v.arrivalNotice.$error">
                  <div class="error" v-if="!$v.arrivalNotice.required">Give members arrival notice</div>
                </div>
                <div class="form__select">
                  <multiselect
                    v-model="arrivalNotice"
                    :searchable="false"
                    :options="arrivalNoticeOptions"
                  ></multiselect>
                </div>
              </div>

              <div class="col-lg-12 px-0">
                <div class="d-flex">
                  <p class="tip">Tip:</p>
                  <p
                    class="tip__info"
                  >At least 1 day’s notice can help you plan for a Member’s arrival, but same-day might help you not to miss out on last-minute trips.</p>
                </div>
              </div>
            </div>

            <div class="row mx-0">
              <div class="col-lg-8 col-sm-12 px-0">
                <label for class="form__label">What is your preferred check-in time?</label>
                <div class="mb-2" v-if="submitted && $v.checkinFrom.$error || $v.checkinTo.$error">
                  <div
                    class="error"
                    v-if="!$v.checkinFrom.required || !$v.checkinTo.required"
                  >You have to set checkin time and checkout time</div>
                </div>
                <div class="d-flex">
                  <div class="mr-auto checkin__wrap">
                    <label for class="form__label">From</label>
                    <div class="form__select">
                      <multiselect
                        v-model="checkinFrom"
                        :searchable="false"
                        :options="checkinOptions"
                      ></multiselect>
                    </div>
                  </div>

                  <div class="checkin__wrap">
                    <label for class="form__label">To</label>
                    <div class="form__select">
                      <multiselect
                        v-model="checkinTo"
                        :searchable="false"
                        :options="checkinOptions"
                      ></multiselect>
                    </div>
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
          <button type="submit" class="step__next cta__btn">Next</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import moment from "moment";
import { required } from "vuelidate/lib/validators";

import {
  updateCalendar,
  returnUpdateCalendar,
  saveAndExit
} from "../../../services/listing";
import Loading from "vue-loading-overlay";

const SHARED = "shared";
const ENTIRE = "entire";
const STUDIO = "studio";
const MONTHLY = "monthly";
const DAILY = "daily";
const QUARTERLY = "quarterly";
const BIANNUALLY = "biannually";
export default {
  name: "updateCalendar",
  components: {
    Multiselect,
    Loading
  },
  data() {
    return {
      submitted: false,
      keepCalendarUpdated: "",
      minNight: "",
      maxNight: "",
      advanceBook: "",
      advanceBookOptions: [
        "Anytime",
        "3 months",
        "6 months",
        "9 months",
        "1 year"
      ],
      advanceData: [],
      arrivalNotice: "",
      arrivalNoticeOptions: ["Same day", "1 day", "2 days", "3 days", "7 days"],
      checkinTo: "",
      checkinFrom: "",
      checkinOptions: [
        "Flexible",
        "7AM",
        "8AM",
        "9AM",
        "10AM",
        "11AM",
        "12PM(noon)",
        "1PM",
        "2PM",
        "3PM",
        "4PM",
        "5PM",
        "6PM",
        "7PM",
        "8PM",
        "9PM",
        "10PM",
        "11PM",
        "12AM(midnight)"
      ],
      listingId: this.$route.params.id,
      returnUpdated: null,
      isLoading: false,
      fullPage: true,
      loaderColor: "#3657ff",
      loaderHeight: 50,
      loaderWidth: 50,
      bgColor: "#fff",
      opacity: 0.5
    };
  },
  validations: {
    advanceBook: {
      required
    },
    arrivalNotice: {
      required
    },
    checkinTo: {
      required
    },
    checkinFrom: {
      required
    }
  },
  methods: {
    handleSubmit(e) {
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid || !this.keepCalendarUpdated) {
        return;
      }
      this.updateCalendar();
    },
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
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
    increaseMinNight() {
      this.minNight++;
    },
    decreaseMinNight() {
      this.minNight--;
    },
    increaseMaxNight() {
      this.maxNight++;
    },
    decreaseMaxNight() {
      this.maxNight--;
    },
    updateCalendar() {
      this.isLoading = true;
      updateCalendar(
        this.listingId,
        this.keepCalendarUpdated,
        this.minNight,
        this.maxNight,
        this.advanceBook,
        this.arrivalNotice,
        this.checkinFrom,
        this.checkinTo
      ).then(data => {
        this.isLoading = false;
        if (data.data.success) {
          this.saveAndExit();
        }
      });
    },
    collectedData(gottenData) {
      this.keepCalendarUpdated = gottenData.calendar_up_to_date;
      this.minNight = Number(gottenData.minimum_night);
      this.maxNight = Number(gottenData.maximum_night);
      this.advanceBook = gottenData.book_in_advance;
      this.arrivalNotice = gottenData.notice_period;
      this.checkinFrom = gottenData.preferred_check_in_time_from;
      this.checkinTo = gottenData.preferred_check_in_time_to;
    },
    returnData() {
      this.isLoading = true;
      returnUpdateCalendar(this.listingId).then(data => {
        this.isLoading = false;
        if (data.data.data.space_type == SHARED) {
          if (data.data.data.Rooms[0].Apartment.CalendarSetting) {
            this.returnUpdated =
              data.data.data.Rooms[0].Apartment.CalendarSetting;
            this.collectedData(this.returnUpdated);
          }
        } else if (
          data.data.data.space_type == ENTIRE ||
          data.data.data.space_type == STUDIO
        ) {
          if (data.data.data.Apartment.CalendarSetting) {
            this.returnUpdated = data.data.data.Apartment.CalendarSetting;
            this.collectedData(this.returnUpdated);
          }
        }
      });
    }
  },
  computed: {
    level() {
      return this.$store.state.level;
    }
  },
  watch: {
    advanceBook(value) {
      const currentDate = new Date();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      if (value.includes("Anytime")) {
        this.advanceData = [];
        this.advanceData.push(
          currentDate.getFullYear() + 1,
          currentDate.getFullYear() + 2,
          currentDate.getFullYear() + 3
        );
      } else if (value.includes("3 months")) {
        this.advanceData = [];
        this.advanceData.push(
          monthNames[
            moment()
              .add(1, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(2, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(3, "M")
              .month()
          ]
        );
      } else if (value.includes("6 months")) {
        this.advanceData = [];
        this.advanceData.push(
          monthNames[
            moment()
              .add(1, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(2, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(3, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(4, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(5, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(6, "M")
              .month()
          ]
        );
      } else if (value.includes("9 months")) {
        this.advanceData = [];
        this.advanceData.push(
          monthNames[
            moment()
              .add(1, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(2, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(3, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(4, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(5, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(6, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(7, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(8, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(9, "M")
              .month()
          ]
        );
      } else if (value.includes("1 year")) {
        this.advanceData = [];
        this.advanceData.push(
          monthNames[
            moment()
              .add(1, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(2, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(3, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(4, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(5, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(6, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(7, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(8, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(9, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(10, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(11, "M")
              .month()
          ],
          monthNames[
            moment()
              .add(12, "M")
              .month()
          ]
        );
      }
    },
    minNight() {
      if (this.minNight > this.maxNight) {
        this.maxNight = this.minNight;
      }
    }
  },
  mounted() {
    this.returnData();
    this.$store.dispatch("getSelectedPlan");
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

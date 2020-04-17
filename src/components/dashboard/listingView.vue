<template>
  <section>
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
    <div class="bdrm__delete">
      <v-dialog />
    </div>
    <section v-if="numberOfLisitng == null" style="height:50vh;width:100%;">
      <p class="fetch__listing">Fetching listings...</p>
    </section>
    <section v-if="numberOfLisitng == 0">
      <h2 class="dashboard__heading">Listings</h2>
      <div class="listing__heading-wrap">
        <p class="listing__heading">
          It looks like you haven’t published any listings yet.
        </p>
        <p class="listing__heading-sub">
          With only three(3) steps you can publish your listings.
        </p>
      </div>
      <div class="listing__illustration">
        <img
          src="../../../svg-icons/building-listing.svg"
          alt="add listing"
          class="img-fluid"
        />
      </div>

      <div class="row">
        <div class="col-lg-4 col-md-6 col-sm-12 col-12">
          <div class="listing__step-card">
            <p class="listing__step-heading">Step 1</p>
            <p class="listing__step-info">
              Add property, bathrooms & bedroom details.
            </p>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-12 col-12">
          <div class="listing__step-card">
            <p class="listing__step-heading">Step 2</p>
            <p class="listing__step-info">
              Add house rules, type of subscription, pricing for your space.
            </p>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-12 col-12">
          <div class="listing__step-card">
            <p class="listing__step-heading">Step 3</p>
            <p class="listing__step-info">
              Complete your profile registration and payment. Once the listing
              is approved, It will be published.
            </p>
          </div>
        </div>
      </div>

      <div class="listing__button-wrap">
        <button class="cta__btn listing__button" @click="listing">
          <svgicon icon="plus" class="listing__button-icon"></svgicon>
          <span>Add a Listing</span>
        </button>
      </div>
    </section>
    <section v-if="numberOfLisitng > 0">
      <div class="row mx-0 mb-5">
        <div class="col-lg-6 col-md-6 col-sm-6 col-12 p-0">
          <h2 class="dashboard__heading mr-auto">{{ rows.length }} Listings</h2>
        </div>

        <div class="col-lg-6 col-md-6 col-sm-6 col-12 p-0">
          <div class="ml-auto dashboard__listing-heading-wrapper">
            <button class="cta__btn" @click="listing">Add a Listing</button>
          </div>
        </div>
      </div>

      <div class="row mx-0 dashboard__listing-filter">
        <div
          class="col-lg-4 col-md-6 col-sm-12 col-12 pl-0 pr-0 pr-md-3 mb-3 mb-md-0"
        >
          <div class="form__filter-wrap">
            <div class="form__filter-select">
              <multiselect
                v-model="searchKey"
                :searchable="false"
                :options="searchOption"
                placeholder="Filter by"
              ></multiselect>
            </div>
            <input
              type="text"
              v-model="searchQuery"
              class="form__filter"
              placeholder="Search"
            />
          </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-12 col-12 pl-0">
          <div class="form__filter-select form__filter-sort">
            <multiselect
              @input="sortBy"
              v-model="sortKey"
              :searchable="false"
              :options="sortOption"
              placeholder="Sort by"
            ></multiselect>
          </div>
        </div>
      </div>

      <div class="dashboard__listing-wrapper">
        <div class="dashboard__listing-table-wrapper">
          <div class="dashboard__listing-table-wrap table__head">
            <div class="dashboard__listing-table-head">
              <div
                class="dashboard__listing-table-cell dashboard__listing-list"
              >
                <p
                  class="dashboard__listing-table-text text-center"
                  style="margin-left:38px"
                >
                  Name
                </p>
              </div>
              <div
                class="dashboard__listing-table-cell dashboard__listing-type"
              >
                <p class="dashboard__listing-table-text">Property type</p>
              </div>
              <div
                class="dashboard__listing-table-cell dashboard__listing-bedrooms"
              >
                <p class="dashboard__listing-table-text">Bedroom(s)</p>
              </div>
              <div
                class="dashboard__listing-table-cell dashboard__listing-location"
              >
                <p class="dashboard__listing-table-text">Location</p>
              </div>
              <div
                class="dashboard__listing-table-cell dashboard__listing-status"
              >
                <p class="dashboard__listing-table-text">Status</p>
              </div>
              <div class="dashboard__listing-table-cell">
                <p class="dashboard__listing-table-text">Action</p>
              </div>
              <div
                class="dashboard__listing-table-cell dashboard__listing-modified"
              >
                <p class="dashboard__listing-table-text text-right">
                  Last Modified
                </p>
              </div>
            </div>
          </div>

          <div class="dashboard__listing-table-wrap">
            <div
              class="dashboard__listing-table-body"
              v-for="(searchableRow, index) in searchTable(searchableRows)"
              :key="index"
            >
              <div
                class="dashboard__listing-table-cell dashboard__listing-list"
              >
                <div class="dashboard__listing-table-imgName">
                  <div class="dashboard__listing-table-img">
                    <div v-if="searchableRow.ImageTags.length > 0">
                      <img
                        :src="searchableRow.ImageTags[0].img_url"
                        class="img-fluid"
                      />
                    </div>
                    <div v-else>
                      <img
                        src="../../assets/images/property.jpg"
                        class="img-fluid"
                      />
                    </div>
                  </div>

                  <div class="dashboard__listing-table-name">
                    <p class="dashboard__listing-table-text">
                      {{
                        searchableRow.name
                          ? searchableRow.name
                          : "Not available"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                class="dashboard__listing-table-cell dashboard__listing-type"
              >
                <p class="dashboard__listing-table-text">
                  {{
                    searchableRow.space_type
                      ? searchableRow.space_type
                      : "Not available" | capitalize
                  }}
                </p>
              </div>
              <div
                class="dashboard__listing-table-cell dashboard__listing-bedrooms"
              >
                <p class="dashboard__listing-table-text">
                  {{ searchableRow.Rooms.length }}
                </p>
              </div>
              <div
                class="dashboard__listing-table-cell dashboard__listing-location"
              >
                <p
                  class="dashboard__listing-table-text"
                  v-if="searchableRow.Location"
                >
                  {{
                    searchableRow.Location.neighbourhood
                      ? searchableRow.Location.neighbourhood
                      : searchableRow.Location.city
                  }}
                </p>
              </div>
              <div
                class="dashboard__listing-table-cell dashboard__listing-status"
              >
                <p
                  class="dashboard__listing-table-text"
                  :class="{
                    pending: searchableRow.approval_status == 'pending',
                    approved: searchableRow.approval_status == 'approved',
                    error: searchableRow.approval_status == 'canceled'
                  }"
                >
                  {{
                    searchableRow.approval_status == "pending"
                      ? "In progress"
                      : searchableRow.approval_status | capitalize
                  }}
                </p>
              </div>
              <div
                class="dashboard__listing-table-cell dashboard__listing-action"
              >
                <dropdown :class-name="'dropdownTest'">
                  <template slot="btn">Actions</template>
                  <template slot="body">
                    <ul>
                      <li class="dropdownTest__list">
                        <span>Publish</span>
                      </li>
                      <li
                        class="dropdownTest__list"
                        @click="listingAction(searchableRow.uuid)"
                      >
                        <span>Unpublish and edit</span>
                      </li>
                      <li
                        class="dropdownTest__list"
                        @click="
                          deleteModalShow(
                            searchableRow.name,
                            searchableRow.uuid
                          )
                        "
                      >
                        <span>Delete</span>
                      </li>
                      <ul v-if="searchableRow.Rooms[0].Apartment">
                        <li
                          v-if="
                            searchableRow.space_type == 'shared' &&
                              searchableRow.Rooms[0].Apartment.Plans[0]
                          "
                          class="dropdownTest__list"
                        >
                          <span
                            v-if="
                              searchableRow.Rooms[0].Apartment.Plans[0].name ==
                                'daily'
                            "
                            >Calendar</span
                          >
                        </li>
                        <li
                          v-else-if="
                            (searchableRow.space_type == 'entire' ||
                              searchableRow.space_type == 'studio') &&
                              searchableRow.Apartment.Plans[0]
                          "
                          class="dropdownTest__list"
                        >
                          <span
                            v-if="
                              searchableRow.Apartment.Plans[0].name == 'daily'
                            "
                            >Calendar</span
                          >
                        </li>
                      </ul>
                    </ul>
                  </template>
                </dropdown>
              </div>
              <div
                class="dashboard__listing-table-cell dashboard__listing-modified"
              >
                <p class="dashboard__listing-table-text text-right">
                  {{ searchableRow.updatedAt | formatDate }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard__listing-responsive">
          <div
            class="dashboard__listing-responsive-individual"
            v-for="(searchableRow, index) in searchTable(searchableRows)"
            :key="index"
          >
            <div class="dashboard__listing-responsive-img">
              <div v-if="searchableRow.ImageTags.length > 0">
                <img
                  :src="searchableRow.ImageTags[0].img_url"
                  class="img-fluid"
                />
              </div>
              <div v-else>
                <img src="../../assets/images/property.jpg" class="img-fluid" />
              </div>
            </div>
            <div class="dashboard__listing-responsive-detail">
              <p class="dashboard__listing-responsive-name">
                {{ searchableRow.name ? searchableRow.name : "Not available" }}
              </p>
              <p class="dashboard__listing-responsive-type">
                {{
                  searchableRow.space_type
                    ? searchableRow.space_type
                    : "Not available" | capitalize
                }}
              </p>
              <p
                class="dashboard__listing-responsive-location"
                v-if="searchableRow.Location"
              >
                {{
                  searchableRow.Location.neighbourhood
                    ? searchableRow.Location.neighbourhood
                    : searchableRow.Location.city
                }}
              </p>
            </div>
            <div class="dashboard__listing-responsive-actions">
              <div class="dashboard__listing-responsive-actions-icon">
                <img
                  v-if="searchableRow.approval_status == 'pending'"
                  src="../../assets/icons/pending.svg"
                  alt
                  class="img-fluid"
                />
                <img
                  v-if="searchableRow.approval_status == 'approved'"
                  src="../../assets/icons/approved.svg"
                  alt
                  class="img-fluid"
                />
                <img
                  v-if="searchableRow.approval_status == 'canceled'"
                  src="../../assets/icons/decline.svg"
                  alt
                  class="img-fluid"
                />
              </div>
              <div class="dashboard__listing-responsive-actions-dpd">
                <dropdown :class-name="'dropdownTest'" align="left">
                  <template slot="btn">Actions</template>
                  <template slot="body">
                    <ul>
                      <li class="dropdownTest__list">
                        <span>Publish</span>
                      </li>
                      <li
                        class="dropdownTest__list"
                        @click="listingAction(searchableRow.uuid)"
                      >
                        <span>Unpublish and edit</span>
                      </li>
                      <li
                        class="dropdownTest__list"
                        @click="
                          deleteModalShow(
                            searchableRow.name,
                            searchableRow.uuid
                          )
                        "
                      >
                        <span>Delete</span>
                      </li>
                      <li class="dropdownTest__list">
                        <span>Calendar</span>
                      </li>
                    </ul>
                  </template>
                </dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import {
  createListing,
  getAllListings,
  deleteListing
} from "../../../services/listing";
import Loading from "vue-loading-overlay";
import moment from "moment";
import Multiselect from "vue-multiselect";
import Dropdown from "bp-vuejs-dropdown";

export default {
  name: "dashboardListing",
  components: {
    Loading,
    Multiselect,
    Dropdown
  },
  data() {
    return {
      isLoading: false,
      fullPage: true,
      loaderColor: "#3657ff",
      loaderHeight: 50,
      loaderWidth: 50,
      bgColor: "#ffffff",
      current_step: "",
      current_level: "",
      userId: null,
      rows: null,
      numberOfLisitng: null,
      searchableRows: null,
      searchQuery: "",
      searchKey: "",
      sortKey: "",
      searchOption: ["All", "Location", "Name"],
      sortOption: ["Oldest to Latest", "Latest to Oldest"]
    };
  },
  methods: {
    async listing() {
      this.isLoading = true;
      let user = localStorage.getItem("user");
      if (user) {
        await createListing().then(
          data => {
            this.isLoading = false;
            this.current_step = data.data.current_step;
            this.current_level = data.data.level;
            this.$store.commit("setStep", this.current_step);
            this.$store.commit("setLevel", this.current_level);
            if (data.success) {
              this.$router.push("/breakdown/" + data.data.uuid);
            } else {
              alert(data.message);
            }
          },
          error => {
            this.isLoading = false;
          }
        );
      } else {
        this.$router.push("/register");
      }
    },

    deleteModalShow(name, id) {
      this.$modal.show("dialog", {
        title: "Warning!!!",
        text: "Are you sure you want to delete this listing?",
        buttons: [
          {
            title: "Yes",
            handler: () => {
              this.deleteListing(id);
              this.$modal.hide("dialog");
            },
            class: "cta__btn vue-dialog_btn"
          },
          {
            title: "No",
            class: "alt__btn vue-dialog_btn"
          }
        ]
      });
    },
    deleteListing(listingId) {
      deleteListing(listingId).then(data => {
        if (data.data.success) {
          this.getLisitngs();
        }
        console.log(data);
      });
    },
    getLisitngs() {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        this.userId = user.user.uuid;
      }
      this.isLoading = true;
      getAllListings(this.userId)
        .then(data => {
          if (data.data.success) {
            this.isLoading = false;
            let returnedRows = data.data.data.rows;
            returnedRows.sort(
              (d1, d2) =>
                new Date(d2.updatedAt).getTime() -
                new Date(d1.updatedAt).getTime()
            );
            this.rows = returnedRows.filter(type => type.space_type != null);
            this.searchableRows = this.rows;

            if (this.rows.length == 0) {
              this.numberOfLisitng = this.rows.length;
            } else {
              this.numberOfLisitng = this.rows.length;
            }
          }
        })
        .catch(err => {
          this.isLoading = false;
          return err;
        });
    },
    sortBy() {
      if (this.sortKey == "Latest to Oldest") {
        this.searchableRows.sort(
          (d1, d2) =>
            new Date(d2.updatedAt).getTime() - new Date(d1.updatedAt).getTime()
        );
      } else if (this.sortKey == "Oldest to Latest") {
        this.searchableRows.sort(
          (d1, d2) =>
            new Date(d1.updatedAt).getTime() - new Date(d2.updatedAt).getTime()
        );
      }
    },
    searchTable(searchableRows) {
      return searchableRows.filter(preset => {
        let returnedSearch = new RegExp("(" + this.searchQuery + ")", "i");
        if (this.searchKey == "" || this.searchKey == "All") {
          return preset;
        } else if (this.searchKey == "Name") {
          if (preset.name == null) {
            return;
          } else {
            return preset.name.match(returnedSearch);
          }
        } else if (this.searchKey == "Location") {
          if (preset.Location == null) {
            return preset;
          } else {
            if (preset.Location.neighbourhood == null) {
              return;
            } else {
              return preset.Location.neighbourhood.match(returnedSearch);
            }
          }
        }
      });
    },
    listingAction(listingId) {
      this.$router.push("/breakdown/" + listingId);
    }
  },
  filters: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    formatDate(value) {
      if (!value) return "";
      if (value) {
        return moment(value).fromNow();
      }
    }
  },
  computed: {
    login() {
      return this.$store.state.login;
    }
  },
  created: function() {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      return (this.$store.state.login = true);
    } else {
      return (this.$store.state.login = false);
    }
  },
  mounted() {
    this.getLisitngs();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

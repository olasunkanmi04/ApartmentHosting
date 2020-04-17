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

    <!-- <section v-if="numberOfLisitng == null" style="height:50vh;width:100%;">
      <p class="fetch__listing">Fetching booking...</p>
    </section>
    <section v-if="numberOfLisitng == 0">
      <h2 class="dashboard__heading">Member Bookings</h2>
      <div class="listing__heading-wrap">
        <p class="listing__heading">It looks like you haven’t published any listings yet.</p>
        <p class="listing__heading-sub">With only three(3) steps you can publish your listings.</p>
      </div>
      <div class="listing__illustration">
        <img src="../../../svg-icons/building-listing.svg" alt="add listing" class="img-fluid" />
      </div>

      <div class="row">
        <div class="col-lg-4 col-md-6 col-sm-12 col-12">
          <div class="listing__step-card">
            <p class="listing__step-heading">Step 1</p>
            <p class="listing__step-info">
              Add property, bathrooms
              & bedroom details.
            </p>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-12 col-12">
          <div class="listing__step-card">
            <p class="listing__step-heading">Step 2</p>
            <p class="listing__step-info">
              Add house rules, type of
              subscription, pricing for your
              space.
            </p>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-12 col-12">
          <div class="listing__step-card">
            <p class="listing__step-heading">Step 3</p>
            <p class="listing__step-info">
              Complete your profile registration
              and payment. Once the listing is
              approved, It will be published.
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
    </section>-->
    <section>
      <div class="row mx-0 mb-5">
        <div class="col-lg-6 col-md-6 col-sm-6 col-12 p-0">
          <button
            class="declineBtn"
            @click="showProfile(subscription.name)"
          >View {{subscription.name}} Profile</button>
        </div>

        <div class="col-lg-6 col-md-6 col-sm-6 col-12 p-0">
          <div class="ml-auto dashboard__listing-heading-wrapper">
            <button class="cta__btn" @click="showExtraPower">Add Extra Charges</button>
          </div>
        </div>
      </div>
      <div class="bookingList__modal">
        <showProfileModal :name="subscription.name" :subscriptions="subscription"></showProfileModal>
      </div>

      <div class="extraPower__wrap">
        <extraPower></extraPower>
      </div>

      <div class="row mx-0 dashboard__listing-filter">
        <div class="col-lg-5 pl-0">
          <h2 class="dashboard__heading mr-auto mb-0">Members Transaction History</h2>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12 col-12 pl-0 pr-0 pr-md-3 mb-3 mb-md-0">
          <div class="form__filter-wrap">
            <div class="form__filter-select">
              <multiselect
                v-model="searchKey"
                :searchable="false"
                :options="searchOption"
                placeholder="Filter by"
              ></multiselect>
            </div>
            <input type="text" v-model="searchQuery" class="form__filter" placeholder="Search" />
          </div>
        </div>

        <div class="col-lg-3 col-md-6 col-sm-12 col-12 pl-0">
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
        <div class="bookingList__table-wrapper">
          <div class="dashboard__listing-table-wrap table__head">
            <div class="dashboard__listing-table-head">
              <div class="dashboard__listing-table-cell subMem__invoiceCreate">
                <p class="dashboard__listing-table-text text-center">Invoice created</p>
              </div>
              <div class="dashboard__listing-table-cell subMem__category">
                <p class="dashboard__listing-table-text text-center">Category</p>
              </div>
              <div class="dashboard__listing-table-cell subMem__spaceName">
                <p class="dashboard__listing-table-text text-center">Space Name</p>
              </div>
              <div class="dashboard__listing-table-cell subMem__invoiceDue">
                <p class="dashboard__listing-table-text text-center">Invoice Due</p>
              </div>
              <div class="dashboard__listing-table-cell subMem__days">
                <p class="dashboard__listing-table-text text-center">No of Depleted Days</p>
              </div>
              <div class="dashboard__listing-table-cell subMem__amount">
                <p class="dashboard__listing-table-text text-center">Amount</p>
              </div>
              <div class="dashboard__listing-table-cell subMem__status">
                <p class="dashboard__listing-table-text text-center">Status</p>
              </div>
            </div>
          </div>

          <div class="dashboard__listing-table-wrap">
            <div
              class="dashboard__listing-table-body"
              v-for="(searchableRow, index) in searchableRows"
              :key="index"
            >
              <div class="dashboard__listing-table-cell subMem__invoiceCreate">
                <p
                  class="dashboard__listing-table-text text-center"
                >{{searchableRow.invoiceCreated}}</p>
              </div>
              <div class="dashboard__listing-table-cell subMem__category">
                <p
                  class="dashboard__listing-table-text text-center"
                >{{searchableRow.category | capitalize}}</p>
              </div>
              <div class="dashboard__listing-table-cell subMem__spaceName">
                <p
                  class="dashboard__listing-table-text text-center"
                >{{searchableRow.spaceName | capitalize}}</p>
              </div>
              <div class="dashboard__listing-table-cell subMem__invoiceDue">
                <p class="dashboard__listing-table-text text-center">{{searchableRow.invoiceDue}}</p>
              </div>
              <div class="dashboard__listing-table-cell subMem__days">
                <p class="dashboard__listing-table-text text-center">{{searchableRow.deplictedDays}}</p>
              </div>
              <div class="dashboard__listing-table-cell subMem__amount">
                <p class="dashboard__listing-table-text text-center">{{searchableRow.amount}}</p>
              </div>
              <div class="dashboard__listing-table-cell subMem__status">
                <p
                  class="dashboard__listing-table-text text-center"
                >{{searchableRow.status | capitalize}}</p>
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
import showProfileModal from "./subMemberProfileModal";
import extraPower from "./extraPowerModal";

export default {
  name: "memberSubDetails",
  components: {
    Loading,
    Multiselect,
    Dropdown,
    showProfileModal,
    extraPower
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
      subscription: {
        name: "Felicia Adeleke",
        role: "Customer Success Lead",
        phone: "07031396550",
        location: "Ajah",
        spaceName: "Cardogan",
        planType: "Monthly",
        amount: "200,000",
        status: "Pending",
        status: "Pending",
        bookingDate: "12-Dec-2019",
        propertyType: "Entire",
        duration: "Jan. - Feb.",
        cost: 145000
      },
      searchableRows: [
        {
          invoiceCreated: "12-Dec-2019",
          invoiceDue: "11-Jan-2020",
          category: "Subscription",
          spaceName: "Cardogan",
          amount: 145000,
          status: "Paid",
          deplictedDays: 1
        },
        {
          invoiceCreated: "12-Apr-2019",
          invoiceDue: "11-Sep-2020",
          category: "Room upgrade",
          spaceName: "Aster 17",
          amount: 278000,
          status: "Due",
          deplictedDays: 0
        }
      ],
      searchQuery: "",
      searchKey: "",
      sortKey: "",
      searchOption: ["All", "Location", "Name"],
      sortOption: ["Oldest to Latest", "Latest to Oldest"]
    };
  },
  methods: {
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
    },
    showProfile(name) {
      this.$modal.show(name);
    },
    showExtraPower() {
      this.$modal.show("extraCharge");
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
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

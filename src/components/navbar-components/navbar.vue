<template>
  <div>
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
    <div class="space__navbar">
      <b-navbar class="navbar__header" id="header-navbar" toggleable="lg">
        <b-navbar-brand>
          <router-link to="/">
            <div class="navbar__logo-wrapper">
              <img src="../../assets/images/logo.png" alt="spleet Logo" class="img-fluid" />
            </div>
          </router-link>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <!-- <b-nav-item
            class="nav-item navbar__item active nav-link navbar__link"
            @click="listing"
            >Listing</b-nav-item>-->
            <b-nav-item
              v-show="!login"
              class="nav-item navbar__item nav-link navbar__link login"
              to="/register"
            >Login</b-nav-item>
            <b-nav-item
              v-show="login"
              class="nav-item navbar__item nav-link navbar__link login"
              @click="logOut"
            >Logout</b-nav-item>
            <button v-show="!login" class="navbar__getstarted-button">
              <router-link class="cta__btn" to="/register/signup">Get Started</router-link>
            </button>
            <button v-show="login" class="navbar__getstarted-button">
              <router-link class="cta__btn" to="/dashboard">Dashboard</router-link>
            </button>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </div>
</template>
<script>
import { createListing } from "../../../services/listing";
import Loading from "vue-loading-overlay";

export default {
  name: "navbar",
  components: {
    Loading
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
      current_level: ""
    };
  },
  methods: {
    logOut() {
      localStorage.removeItem("user");
      this.$router.push("/register");
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
  }
};
</script>
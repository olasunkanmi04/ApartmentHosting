<template>
  <div class="signup">
    <div class="register__logo">
      <router-link to="/">
        <img src="../../assets/images/logo.png" alt class="img-fluid" />
      </router-link>
    </div>
    <h3 class="register__title">Verify your Email Address</h3>
    <p v-show="!verifiedStatus" class="signup__verify">
      Before proceeding, please check your email for a verification link.
      If you did not receive the email, Click
      <a
        href="#"
      >here</a>
      to request another
      <button @click="logOut">log out</button>
    </p>

    <div v-show="verifiedStatus">
      <p class="signup__verify">
        Congratulations {{userName}}.
        Welcome to SPLEET community
      </p>
      <router-link to="/dashboard" tag="button" class="cta__btn">Go to Dashboard</router-link>
      <a href @click="logOut">log out</a>
    </div>
  </div>
</template>

<script>
import routes from "../../routes";

export default {
  name: "verify",
  data() {
    return {
      userName: ""
    };
  },
  methods: {
    logOut() {
      localStorage.removeItem("user");
      this.$router.push("/");
    }
  },
  computed: {
    verifiedStatus() {
      return this.$store.state.verifiedStatus;
    }
  },
  created: function() {
    let user = JSON.parse(localStorage.getItem("user"));
    this.userName = user.user.fname;
    if (user.user.is_verified) {
      return (this.$store.state.verifiedStatus = true);
    } else {
      return (this.$store.state.verifiedStatus = false);
    }
  }
};
</script>
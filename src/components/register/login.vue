<template>
  <div class="signup">
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

    <div class="register__logo">
      <router-link to="/">
        <img src="../../assets/images/logo.png" alt class="img-fluid" />
      </router-link>
    </div>
    <h3 class="register__title">Login to your account</h3>
    <form action class="signup__form" @submit.prevent="handleSubmit">
      <div class="signup__alt">
        <a href="#" class="signup__google">
          <div class="signup__icon">
            <img src="../../../svg-icons/google.svg" alt="google logo" class="img-fluid" />
          </div>
          <div class="signup__text-wrap">
            <span class="signup__google-text">Login with Google</span>
          </div>
        </a>
        <a href="https://spleet.gq/api/v1/auth/facebook/" class="signup__fb">
          <div class="signup__icon">
            <svgicon icon="facebook" class="signup__icon-fb"></svgicon>
          </div>
          <div class="signup__text-wrap">
            <span class="signup__fb-text">Login with Facebook</span>
          </div>
        </a>
      </div>

      <div v-show="!userCheck" class="error mb-2">{{ loginFail }}</div>

      <float-label class="form-group">
        <input
          type="email"
          name="email"
          placeholder="Email"
          v-model="user.email"
          class="form__input"
        />
        <div class="mt-2" v-if="submitted && $v.user.email.$error">
          <div class="error" v-if="!$v.user.email.required">Email is required</div>
          <div class="error" v-if="!$v.user.email.email">Email is invalid</div>
        </div>
      </float-label>

      <float-label class="mb-3">
        <div class="position-relative">
          <input
            :type="passwordType"
            name="password"
            placeholder="Password"
            v-model="user.pword"
            class="form__input mb-0"
          />

          <div class="signup__show-pword" @click="switchVisibility">
            <svgicon :icon="showPwordIcon"></svgicon>
          </div>
        </div>

        <div class="mt-2" v-if="submitted && $v.user.pword.$error">
          <div class="error" v-if="!$v.user.pword.required">Password is required</div>
          <div class="error" v-if="!$v.user.pword.minLength">
            Password must be at least
            {{ $v.user.pword.$params.minLength.min }} characters.
          </div>
        </div>
      </float-label>

      <router-link to="/register/forgetPword" class="login__fgtP">Forgot password?</router-link>

      <button type="submit" class="cta__btn">Login</button>
      <p class="signup__login">
        Don’t have a Spleet account?
        <strong>
          <router-link to="/register/signup" class="signup__login-link">Sign up</router-link>
        </strong>
      </p>
    </form>
  </div>
</template>

<script>
import { required, minLength, email } from "vuelidate/lib/validators";
import { login } from "../../../services/user";
import routes from "../../routes";
import Loading from "vue-loading-overlay";

export default {
  name: "login",
  components: {
    Loading
  },
  data() {
    return {
      user: {
        email: "alabiolasunkanmi@outlook.com",
        pword: "123456"
      },
      rememberPw: false,
      passwordType: "password",
      showPwordIcon: "view",
      submitted: false,
      loginFail: "",
      userCheck: "",
      isLoading: false,
      fullPage: true,
      loaderColor: "#3657ff",
      loaderHeight: 50,
      loaderWidth: 50,
      bgColor: "#ffffff"
    };
  },
  validations: {
    user: {
      email: {
        required,
        email
      },
      pword: {
        required,
        minLength: minLength(6)
      }
    }
  },
  methods: {
    switchVisibility() {
      this.passwordType =
        this.passwordType === "password" ? "text" : "password";
      this.showPwordIcon = this.showPwordIcon === "view" ? "hide" : "view";
    },
    async loginCheck() {
      this.isLoading = true;
      await login(this.user.email, this.user.pword).then(
        user => {
          this.isLoading = false;
          // commit("loginSuccess", userInfo);
          localStorage.setItem("user", JSON.stringify(user));
          this.$router.go("/");
          if (user) {
            this.userCheck = true;
          } else {
            this.userCheck = false;
            this.isLoading = false;
          }
        },
        error => {
          // commit("loginFailure", error);
          // dispatch("alert/error", error, { root: true });
          this.loginFail = error.error;
          this.isLoading = false;
        }
      );
    },

    handleSubmit(e) {
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.loginCheck();
    }
  }
};
</script>

<style>
.loading-parent {
  position: relative;
}
.loading-slot {
  z-index: 999;
}
</style>

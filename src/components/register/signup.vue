<template>
  <div class="signup">
    <div class="register__logo">
      <router-link to="/">
        <img src="../../assets/images/logo.png" alt class="img-fluid" />
      </router-link>
    </div>
    <div v-show="signup">
      <h3 class="register__title">Create your account</h3>
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

        <div class="signup__name">
          <float-label class="form-group signup__fname">
            <input
              type="text"
              name="first name"
              placeholder="First Name"
              class="form__input"
              v-model="user.fname"
            />
            <div class="mt-2" v-if="submitted && $v.user.fname.$error">
              <div class="error" v-if="!$v.user.fname.required">First name is required</div>
              <div class="error" v-if="!$v.user.fname.minLength">
                First name must have at least
                {{ $v.user.fname.$params.minLength.min }} letters.
              </div>
            </div>
          </float-label>

          <float-label class="form-group signup__lname">
            <input
              type="text"
              name="last name"
              placeholder="Last Name"
              v-model="user.lname"
              class="form__input"
            />
            <div class="mt-2" v-if="submitted && $v.user.lname.$error">
              <div class="error" v-if="!$v.user.lname.required">Last name is required</div>
              <div class="error" v-if="!$v.user.lname.minLength">
                Last name must have at least
                {{ $v.user.lname.$params.minLength.min }} letters.
              </div>
            </div>
          </float-label>
        </div>

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

        <float-label class="form-group">
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

        <div class="signup__terms">
          <div>
            <input
              class="styled-checkbox"
              id="terms"
              type="checkbox"
              name="terms"
              v-model.lazy="user.acceptTerms"
            />
            <label for="terms">
              I agree to
              <a href="#" class="signup__terms-link">terms of service</a> and
              <a href="#" class="signup__terms-link">privacy policy</a>
            </label>
            <div class="mt-2" v-if="submitted && $v.user.acceptTerms.$error">
              <div class="error" v-if="!$v.user.acceptTerms.required">
                You cannot use Spleet website without accepting the updated
                Terms of Service
              </div>
            </div>
          </div>

          <!-- <label class="form__check-container">
            <input
              type="checkbox"
              name="terms"
              class="form__check"
              v-model="user.acceptTerms"
            />
            <span class="form__check-label">
              I agree to
              <a href="#">terms of service</a> and
              <a href="#">privacy policy</a>
            </span>
            <span class="form__check-checkmark"></span>
            <div class="mt-2" v-if="submitted && $v.user.acceptTerms.$error">
              <div class="error" v-if="!$v.user.acceptTerms.required">
                You cannot use Spleet website without accepting the updated
                Terms of Service
              </div>
            </div>
          </label>-->
        </div>

        <button type="submit" class="cta__btn">Get Started</button>
        <p class="signup__login">
          Already have a Spleet account?
          <strong>
            <router-link to="/register" class="signup__login-link">Login</router-link>
          </strong>
        </p>
      </form>
    </div>

    <div v-show="!signup">
      <h3 class="register__title mb-3">Verify your Email Address</h3>
      <p class="signup__verify text-center">An email has been sent to your inbox for verification.</p>
    </div>
  </div>
</template>

<script>
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
import { signup } from "../../../services/user";
import routes from "../../routes";

export default {
  name: "signup",
  data() {
    return {
      signup: true,
      user: {
        email: "",
        fname: "",
        lname: "",
        pword: "",
        acceptTerms: false
      },
      passwordType: "password",
      showPwordIcon: "view",
      submitted: false
    };
  },
  validations: {
    user: {
      email: {
        required,
        email
      },
      fname: {
        required,
        minLength: minLength(2)
      },
      lname: {
        required,
        minLength: minLength(2)
      },
      pword: {
        required,
        minLength: minLength(6)
      },
      acceptTerms: {
        sameAs: sameAs(() => true)
      }
    }
  },
  methods: {
    switchVisibility() {
      this.passwordType =
        this.passwordType === "password" ? "text" : "password";
      this.showPwordIcon = this.showPwordIcon === "view" ? "hide" : "view";
    },
    async register() {
      await signup(
        this.user.email,
        this.user.fname,
        this.user.lname,
        this.user.pword
      ).then(
        user => {
          // commit("loginSuccess", userInfo);
          localStorage.setItem("user", JSON.stringify(user));
          this.$router.push("/register");
          if (user) {
            this.userCheck = true;
          } else {
            this.userCheck = false;
          }
        },
        error => {
          // commit("loginFailure", error);
          // dispatch("alert/error", error, { root: true });
          this.loginFail = error.error;
        }
      );
    },
    submitSuccess() {
      this.signup = false;
      // alert("SUCCESS!! :-)\n\n" + JSON.stringify(this.user));
      this.register();
    },
    handleSubmit(e) {
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.submitSuccess();
    }
  }
};
</script>

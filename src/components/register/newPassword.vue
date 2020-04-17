<template>
  <div class="signup">
    <div class="register__logo">
      <router-link to="/">
        <img src="../../assets/images/logo.png" alt class="img-fluid" />
      </router-link>
    </div>
    <h3 class="register__title">Reset password</h3>
    <form action class="signup__form" @submit.prevent="handleSubmit">
      <float-label class="form-group">
        <input
          :type="passwordType"
          name="password"
          placeholder="Password"
          v-model="user.pword"
          class="form__input mb-0"
        />

        <div class="mt-2" v-if="submitted && $v.user.pword.$error">
          <div class="error" v-if="!$v.user.pword.required">Password is required</div>
          <div
            class="error"
            v-if="!$v.user.pword.minLength"
          >Password must be at least {{$v.user.pword.$params.minLength.min}} characters.</div>
        </div>
      </float-label>

      <float-label class="mb-3">
        <input
          :type="passwordType"
          name="password"
          placeholder="Confirm Password"
          v-model="user.confirmPword"
          class="form__input mb-0"
        />
        <div class="mt-2" v-if="submitted && $v.user.confirmPword.$error">
          <div class="error" v-if="!$v.user.confirmPword.required">Confirm Password is required</div>
          <div class="error" v-else-if="!$v.user.confirmPword.sameAsPassword">Passwords must match</div>
        </div>
      </float-label>

      <div class="signup__show-newPword" @click="switchVisibility">
        <svgicon class="signup__show-newPword-icon" :icon="showPwordIcon"></svgicon>
        <span>{{showPword}}</span>
      </div>

      <button type="submit" class="cta__btn">Submit</button>
    </form>
  </div>
</template>

<script>
import { required, minLength, sameAs } from "vuelidate/lib/validators";

export default {
  name: "newPword",
  data() {
    return {
      signup: true,
      user: {
        pword: "",
        confirmPword: ""
      },
      passwordType: "password",
      showPwordIcon: "view",
      submitted: false,
      showPword: "Show password"
    };
  },
  validations: {
    user: {
      pword: {
        required,
        minLength: minLength(6)
      },
      confirmPword: {
        required,
        sameAsPassword: sameAs("pword")
      }
    }
  },
  methods: {
    switchVisibility() {
      this.passwordType =
        this.passwordType === "password" ? "text" : "password";
      this.showPwordIcon = this.showPwordIcon === "view" ? "hide" : "view";
      this.showPword =
        this.showPword === "Show password" ? "Hide password" : "Show password";
    },
    submitSuccess() {
      alert("SUCCESS!! :-)\n\n" + JSON.stringify(this.user));
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
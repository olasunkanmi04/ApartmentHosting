<template>
  <div class="signup">
    <div class="register__logo">
      <router-link to="/">
        <img src="../../assets/images/logo.png" alt class="img-fluid" />
      </router-link>
    </div>
    <h3 class="register__title">Reset password</h3>
    <form action class="signup__form" @submit.prevent="handleSubmit">
      <float-label class="mb-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          v-model="user.fgtEmail"
          class="form__input"
        />
        <div class="mt-2" v-if="submitted && $v.user.fgtEmail.$error">
          <div class="error" v-if="!$v.user.fgtEmail.required">Email is required</div>
          <div class="error" v-if="!$v.user.fgtEmail.email">Email is invalid</div>
        </div>
      </float-label>

      <router-link to="/register" class="login__fgtP">Oops! I remember my password now</router-link>
      <button type="submit" class="cta__btn">Submit</button>
    </form>
  </div>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";

export default {
  name: "fgtPword",
  data() {
    return {
      user: {
        fgtEmail: ""
      },
      submitted: false
    };
  },
  validations: {
    user: {
      fgtEmail: {
        required,
        email
      }
    }
  },
  methods: {
    handleSubmit(e) {
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      alert("SUCCESS!! :-)\n\n" + JSON.stringify(this.user));
    }
  }
};
</script>
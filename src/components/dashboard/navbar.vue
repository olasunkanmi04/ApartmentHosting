<template>
  <div>
    <b-navbar class="navbar__header space__navbar" id="header-navbar" toggleable="lg">
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
          <b-nav-item class="nav-item navbar__item active nav-link navbar__link" to="/spaces">Spaces</b-nav-item>
          <b-nav-item
            class="nav-item navbar__item nav-link navbar__link login"
            to="/company">Company</b-nav-item>
          <b-nav-item class="nav-item navbar__item nav-link navbar__link profile" to="/profile">
            Welcome,
            <span>Fiyin</span>
          </b-nav-item>

          <b-nav-item class="nav-item navbar__item user__navbar-picture">
            <img src="../../assets/images/boy.svg" alt="profile Picture" class="img-fluid"/>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
export default {};
</script>

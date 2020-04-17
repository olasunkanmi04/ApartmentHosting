<template>
  <section>
    <div class="navbar__wrap">
      <ul class="navbar__item">
        <li class="d-flex">
          <div class="sidebar__toggle">
            <button
              type="button"
              id="sidebarCollapse"
              class="btn sidebar__toggle-btn"
              @mouseover="openSidebar"
              @mouseleave="closeSidebar"
            >
              <svgicon icon="menu" class="icon sidebar__toggle-icon"></svgicon>
            </button>
          </div>
          <router-link to="/" class="navbar__logo">
            <img src="../../assets/images/logo.png" alt="spleet Logo" class="img-fluid" />
          </router-link>
        </li>
      </ul>
      <ul class="navbar__link-wrap">
        <li class="navbar__item-link">
          <a href="#">Space</a>
        </li>
        <li class="navbar__item-link">
          <a href="#">Company</a>
        </li>
        <li class="navbar__item-link mr-0">
          <a href="#" class="navbar__profile-wrap">
            <p class="mb-0 mr-3">
              Welcome,
              <span class="navbar__profile-name">{{profileName.toLowerCase()}}</span>
            </p>

            <div class="navbar__profile">
              <img src="../../assets/images/boy.svg" alt="profile Picture" class="img-fluid" />
            </div>
          </a>
        </li>
      </ul>
    </div>

    <div
      class="sidebar"
      :class="{sidebar__hide:!showSidebar}"
      @mouseover="openSidebar"
      @mouseleave="closeSidebar"
    >
      <ul class="list-unstyled components sidebar__wrap">
        <li class="navbar__item-link mr-0 sidebar__profile">
          <a href="#" class="navbar__profile-wrap">
            <div class="navbar__profile">
              <img src="../../assets/images/boy.svg" alt="profile Picture" class="img-fluid" />
            </div>
            <p v-show="showSidebar" class="mb-0 ml-3">
              Hi,
              <span class="navbar__profile-name ml-0">{{profileName.toLowerCase()}}</span>
            </p>
          </a>
        </li>

        <!-- <li class="sidebar__menu active">
          <a :style="showSidebar?'text-align:left;' : 'text-align:center;'" class="sidebar__link">
            <svgicon icon="home" class="sidebar__icon icon-home"></svgicon>
            <span v-show="showSidebar">Home</span>
          </a>
        </li>-->
        <li class="sidebar__menu">
          <router-link
            to="/dashboard"
            :style="showSidebar?'text-align:left;' : 'text-align:center;'"
            class="sidebar__link"
            exact-active-class="active"
          >
            <svgicon icon="listings" class="sidebar__icon icon-listings"></svgicon>
            <span v-show="showSidebar">Listings</span>
          </router-link>
        </li>
        <li class="sidebar__menu">
          <a :style="showSidebar?'text-align:left;' : 'text-align:center;'" class="sidebar__link">
            <svgicon icon="member" class="sidebar__icon icon-members"></svgicon>
            <span v-show="showSidebar">Members</span>
          </a>
          <ul class="sidebar__submenu">
            <li class="sidebar__submenu-list">
              <router-link to="/dashboard/bookings" exact-active-class="active">
                <span v-show="showSidebar">Bookings</span>
              </router-link>
            </li>
            <li class="sidebar__submenu-list">
              <router-link to="/dashboard/subscriptions" exact-active-class="active">
                <span v-show="showSidebar">Subscriptions</span>
              </router-link>
            </li>
          </ul>
        </li>
        <li class="sidebar__menu">
          <router-link
            to="/dashboard/payment"
            :style="showSidebar?'text-align:left;' : 'text-align:center;'"
            class="sidebar__link"
            exact-active-class="active"
          >
            <svgicon icon="payment" class="sidebar__icon icon-card"></svgicon>
            <span v-show="showSidebar">Payments</span>
          </router-link>
        </li>
        <li class="sidebar__menu">
          <a :style="showSidebar?'text-align:left;' : 'text-align:center;'" class="sidebar__link">
            <svgicon icon="profile" class="sidebar__icon icon-profile"></svgicon>
            <span v-show="showSidebar">Profile</span>
          </a>
        </li>
        <li class="sidebar__menu">
          <a :style="showSidebar?'text-align:left;' : 'text-align:center;'" class="sidebar__link">
            <svgicon icon="settings" class="sidebar__icon icon-settings"></svgicon>
            <span v-show="showSidebar">Settings</span>
          </a>
        </li>

        <li class="sidebar__menu logout">
          <a
            :style="showSidebar?'text-align:left;' : 'text-align:center;'"
            class="sidebar__link"
            @click="logOut"
          >
            <svgicon icon="logout" class="sidebar__icon"></svgicon>
            <span v-show="showSidebar">Logout</span>
          </a>
        </li>
      </ul>
    </div>

    <div class="dashboard__content">
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
name: "dashboardFrame";
export default {
  data() {
    return {
      showSidebar: false,
      profileName: ""
    };
  },
  methods: {
    logOut() {
      localStorage.removeItem("user");
      this.$router.push("/register");
    },
    openSidebar() {
      this.showSidebar = true;
    },
    closeSidebar() {
      this.showSidebar = false;
    }
  },
  created() {
    let user = JSON.parse(localStorage.getItem("user"));
    this.profileName = user.user.first_name;
  }
};
</script>

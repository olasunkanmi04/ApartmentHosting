<template>
  <div class="wrapper">
    <!--Sidebar-->
    <nav id="sidebar">
      <ul class="list-unstyled components sidebar__listing">
        <li class="sidebar__toggle">
          <button
            type="button"
            id="sidebarCollapse"
            class="btn sidebar__toggle-btn"
            @click="toggleSidebar"
          >
            <svgicon icon="menu-button" class="icon icon-list-menu"></svgicon>
          </button>
        </li>

        <li class="sidebar__menu active">
          <a>
            <svgicon icon="home" class="sidebar-icon icon-home"></svgicon>
            <span v-show="showSidebar">Home</span>
          </a>
        </li>
        <li class="sidebar__menu">
          <a to="/dashboardListing">
            <svgicon icon="listings" class="sidebar-icon icon-listings"></svgicon>
            <span v-show="showSidebar">Listings</span>
          </a>
        </li>
        <li class="sidebar__menu">
          <a>
            <svgicon icon="member" class="sidebar-icon icon-members"></svgicon>
            <span v-show="showSidebar">Members</span>
          </a>
        </li>
        <li class="sidebar__menu">
          <a>
            <svgicon icon="payment" class="sidebar-icon icon-card"></svgicon>
            <span v-show="showSidebar">Payments</span>
          </a>
        </li>
        <li class="sidebar__menu">
          <a>
            <svgicon icon="profile" class="sidebar-icon icon-profile"></svgicon>
            <span v-show="showSidebar">Profile</span>
          </a>
        </li>
        <li class="sidebar__menu">
          <a>
            <svgicon icon="settings" class="sidebar-icon icon-settings"></svgicon>

            <span v-show="showSidebar">Settings</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
name: "sidebar";
export default {
  data() {
    return {
      showSidebar: true
    };
  },
  methods: {
    toggleSidebar() {
      if (this.showSidebar == false) {
        this.showSidebar = true;
      } else {
        this.showSidebar = false;
      }
    }
  }
};
</script>

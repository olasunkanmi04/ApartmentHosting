<template>
  <div>
    <appNavbar></appNavbar>
  </div>
</template>
<script>
import Navbar from "./components/navbar-components/navbar";

export default {
  name: "home",
  components: {
    appNavbar: Navbar
  }
};
</script>
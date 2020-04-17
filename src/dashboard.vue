<template>
  <div>
    <appDashboardFrame></appDashboardFrame>
  </div>
</template>


<script>
import dashboardFrame from "../src/components/dashboard/dashboardFrame";

export default {
  name: "dashboard",
  components: {
    appDashboardFrame: dashboardFrame
  },
  data() {
    return {};
  }
};
</script>
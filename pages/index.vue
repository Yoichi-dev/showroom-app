<template>
  <div>
    <Info />
    <Event :eventList="eventList" :endFlg="false" />
  </div>
</template>

<script>
import axios from "axios";
import constants from "~/constants";

export default {
  async asyncData() {
    let res = await axios.get(constants.url.domain + constants.url.event.hold);
    return { eventList: res.data };
  },
  head() {
    return {
      title: "HOME",
    };
  },
};
</script>

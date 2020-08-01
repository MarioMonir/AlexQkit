import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import store from "./store";
import VueGoogleCharts from "vue-google-charts";
import { serverRoute } from "./data/routes";

Vue.use(VueGoogleCharts);

Vue.config.productionTip = false;

Vue.filter("gateName", function(value) {
  if (value[0] == "c") {
    let parts = value.split("_");
    let name = parts[1].split(".")[0];
    if (name.length > 4) {
      return name.substring(0, 3);
    }
    return name;
  } else {
    return value;
  }
});

new Vue({
  store,
  methods: {},
  render: (h) => h(App),

  mounted() {
    axios.get(serverRoute, { useCredentials: true }).then((res) => {
      window.console.log("Server Request responds  : " + res.data);
    });
  },
}).$mount("#app");

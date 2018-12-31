import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import App from "./App.vue";
import moment from "moment-timezone";
import VueMoment from "vue-moment";
import VCalendar from "v-calendar";
import "v-calendar/lib/v-calendar.min.css";

Vue.use(VueMoment, { moment });
Vue.use(VueAxios, axios);
Vue.use(VCalendar, {
	firstDayOfWeek: 2 // Monday
});
Vue.config.productionTip = false;

new Vue({
	render: h => h(App)
}).$mount("#app");

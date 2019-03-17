import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import App from "./App.vue";
import moment from "moment-timezone";
import VueMoment from "vue-moment";
import Vuex from "vuex";

Vue.use(VueMoment, { moment });
Vue.use(VueAxios, axios);
Vue.use(Vuex);
Vue.config.productionTip = false;

new Vue({
	render: h => h(App)
}).$mount("#app");

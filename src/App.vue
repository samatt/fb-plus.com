<template>
  <div id="app">  
    <h1> FB++</h1>
    <div> 
      Search through Facebook's acqusitions and patents for a range of days. Type in a range in the field below then click Go.
    </div> 
    <div id="calendar-container">
      <v-date-picker
        mode='range'
        popover-visibility="invisible"
        v-model='dateRange'>
      </v-date-picker>
      <button @click="getRange()"> Go</button>
    <div> 
      <span v-if="dateRange.start" class="dark-color">Start date: {{dateRange.end | moment("dddd, MMMM Do YYYY")}}. End date: </span>
      <span v-if="dateRange.end" class="dark-color"> {{dateRange.end | moment("dddd, MMMM Do YYYY")}} </span>
    </div>
    </div>
    <div id="timeline-container">
      <timeline timeline-theme="rgb(139,157,195)" >
        <div :class="year" v-for="(artifacts, year) in forTimeline">
        <timeline-title bg-color="#dfe3ee" >
          {{year}}
        </timeline-title>
         <timeline-item v-if="art.type !== 'posts'" v-for="art in artifacts">
          <span v-if="art.type === 'acquisitions'"> They bought {{art.company}}</span>
          <span v-if="art.type === 'patents'"> Patent #{{art.number}} for <a :href="` http://patft1.uspto.gov/netacgi/nph-Parser?patentnumber=${art.number}`" target=_blank class="dark-color"> {{art.title}} </a> was filed </span>
           on {{art.date | moment("dddd, MMMM Do YYYY")}}
        </timeline-item>
      </div>
      </timeline>
    </div>
    <Main />
  </div>
</template>

<script>
import Main from './components/Main.vue'
import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'
import {qs, groupArtifactsByYear, groupArtifactsFromRange  } from "./utils"
export default {
  name: 'app',
  components: {
    Main,
    Timeline,
    TimelineItem,
    TimelineTitle
  },
  data () {
    return {
      today: {},
      onDay: [],
      forTimeline: {},
      dateRange: {end: Date.now()},
      baseURI: 'https://api.fbplussss.com/artifacts/'
    }
  },
  mounted () {
    this.fetchToday()
  },
  methods: {
    getRange: function () {
      const range = {
        start_date: this.$moment(this.dateRange.start,).format( "YYYY-MM-DD"),
        end_date: this.$moment(this.dateRange.end,).format( "YYYY-MM-DD")
      }
      this.fetchRange(range)
    },
    fetchRange: function (range) {
      const query = `${this.baseURI}range?${qs(range)}`
      this.$http.get(query)
      .then((result) => {
        this.forTimeline = groupArtifactsFromRange(result.data)
      })
    },
    fetchToday: function () {
      this.$http.get(`${this.baseURI}/today`)
      .then((result) => {
        this.today = result.data
      })
    },
    fetchDay: function (dateFields) {
      const query = `${this.baseURI}/on?${qs({...dateFields})}`
      this.$http.get(query)
      .then((result) => {
        this.forTimeline = groupArtifactsByYear(result.data.artifacts)
      })
    }
  }
}
//
</script>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css?family=Roboto");
  $blue-darker: rgb(59,89,152);
  $blue-lighter: rgb(139,157,195);
  $blue-light: rgb(223,227,238);
  $white-dark: rgb(247,247,247);
  $white: rgb(255,255,255);
 body {
  margin-top: 60px;
  display: flex;
  align-items: left;
  flex-direction: column;
  background-color: $white-dark;
  color: $blue-darker;
  font-family: "Inconsolata", monospace;
  font-size: 1.2em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
#calendar-container {
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 10px;
  flex: 1;
}
#timeline-container {
  max-width: 80%;
  margin: auto;
  flex: 1;
  justify-content: space-evenly;
  background-color: $white;
  padding: 10px;
}
.timeline {
}
.timeline-item {
  font-family: "Inconsolata", monospace;
  color: $blue-darker;
  text-align: left;

}
.dark-color {
  color: $blue-darker
}
</style>

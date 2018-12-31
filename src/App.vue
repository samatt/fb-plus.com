<template>
  <div id="app">  
    <h1> FB++</h1>
    <div> 
      This website is a an interface for fb+ database. It lets you see a timeline of all the things facebook has done in a simple timeline.
      You can use this interface in a couple of ways.
    </div> 

    <div>
      You can look at what facebook has done on a given day
    </div>
    <div id="timeline-container">
      <timeline timeline-theme="rgb(139,157,195)" >
        <div :class="year" v-for="(artifacts, year) in forTimeline">
        <timeline-title bg-color="#dfe3ee" >
          {{year}}
        </timeline-title>
         <timeline-item v-for="art in artifacts">
          <span v-if="art.type === 'acquisitions'"> They bought {{art.company}}</span>
          <span v-if="art.type === 'patents'"> Patent #{{art.number}} for <a :href="` http://patft1.uspto.gov/netacgi/nph-Parser?patentnumber=${art.number}`" target=_blank class="patent-name"> {{art.title}} </a> was filed </span>
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
// no-unused-components
import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'
import {qs, groupBy} from "./utils"
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
      baseURI: 'https://api.fbplussss.com/artifacts/'
    }
  },
  mounted () {
    this.fetchDay({day:1})
  },
  methods: {
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
      const toSort = Object.entries(result.data.artifacts)
      const inter = {}
      for( let i in toSort ) {
        let [k, v] = toSort[i]
        inter[k] = groupBy(v, d => d.year)
      }
      this.forTimeline = Object.entries(inter).reduce((a, c) => {
        const [type, dateO] = c 
        for (const [ year, artifact] of Object.entries(dateO)){
          const types = artifact.map(d => {return{...d, type:type}})
          const collection = a[year]
          if(collection) {
           a[year] = a[year].concat(types)
          } else {
            a[year] = types
          } 
        }
        return a
      }, {})

      })
    }
  }
}
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

.patent-name {
  color: $blue-darker
}
</style>

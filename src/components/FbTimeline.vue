<template>
  <div id="timeline-container">
    <timeline timeline-theme="rgb(139,157,195)">
      <div :class="year" v-for="(artifacts, year) in artifacts">
        <timeline-title bg-color="#dfe3ee">
          {{ year }}
        </timeline-title>
        <timeline-item v-if="art.type !== 'posts'" v-for="art in artifacts">
          <span v-if="art.type === 'acquisitions'">
            They bought {{ art.company }}
          </span>
          <div class="item" v-if="art.type === 'patents'">
            Patent #{{ art.number }} for
            <a
              :href="
                ` http://patft1.uspto.gov/netacgi/nph-Parser?patentnumber=${
                  art.number
                }`
              "
              target="_blank"
              class="dark-color"
            >
              {{ art.title }}
            </a>
            was filed on {{ art.date | moment("dddd, MMMM Do YYYY") }}
          </div>
        </timeline-item>
      </div>
    </timeline>
  </div>
</template>

<script>
import { Timeline, TimelineItem, TimelineTitle } from "vue-cute-timeline";

export default {
  name: "FbTimeline",
  props: ["artifacts"],
  components: {
    Timeline,
    TimelineItem,
    TimelineTitle
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto");
$blue-darker: rgb(59, 89, 152);
$blue-lighter: rgb(139, 157, 195);
$blue-light: rgb(223, 227, 238);
$white-dark: rgb(247, 247, 247);
$white: rgb(255, 255, 255);

.item {
  background-color: $white-dark;
}

.timeline-item {
  flex-direction: column;
  font-family: "Inconsolata", monospace;
  color: $blue-darker;
  text-align: center;
}
.dark-color {
  color: $blue-darker;
}
</style>

<template>
  <div id="app">
    <div id="header">
      <h1>FB+ helps you connect.</h1>
      <h2>
        Remember that time Facebook showed blatant disregard for their users'
        consent, concerns, and sometimes their own safety?
      </h2>
      <h2><i>Which time?</i> you might ask. Good point.</h2>
      <p>
        Keeping track of Facebook's long history of poor choices can be
        overwhelming. That's where FB+ comes in.
      </p>
      <p>
        We've collected every patent filing, acquisition, legal action, and
        public controversy of Facebook's history into a browsable database.
        Never miss the opportunity to rue a bitter Facebook anniversary again!
        It's like an advent calendar of perpetually-rewarded corporate
        malfeasance.
      </p>
      <p>
        If you still deign to actually use Facebook, you can also install our
        browser extension to get daily reminders of these anniversaries in your
        news feed.
      </p>
    </div>
    <div id="main">
      <div id="mainh1">
        Browse By Date
        <form>
          <label>Start Date:</label><input type="Date" v-model="date.start" />
          <label>End Date:</label><input type="Date" v-model="date.end" />
          <br>
          <button @click="getRange()"type="button">Submit</button>
        </form>
        Or Try One of The Options Below:<br>
        <button type='button'>On This Day</button><button type='button'>Past Seven Days</button><button type='button'>Random Event</button><br>
        <i>
          🚨If you try to do the default range (start of FB till now) it will
          take a min🚨</i
        >

        <div></div>
        Filter By Event Type (not working yet🚫)
        <div></div>
        <ul>
        <li  v-for="(i, n) in this.narratives" class="filter">
           <span v-if="i.length > 1"><span :id = "i"> {{i}}</span> </span>
        </li>
        </ul>
      </div>
    </div>
    <Gallery :posts="posts" />
    <div id="footer">
      <p>
        <!-- We should probably put in some legal language to make sure that we don't
        get in trouble -->
      </p>
    </div>
  </div>
</template>

<script>
import Gallery from "./components/Gallery.vue";
// import { Timeline, TimelineItem, TimelineTitle } from "vue-cute-timeline";
import {
  qs,
  groupArtifactsByYear,
  groupArtifactsFromRange,
  getNarratives
} from "./utils";
export default {
  name: "app",
  components: {
    Gallery
    // Timeline,
    // TimelineItem,
    // TimelineTitle
  },
  data() {
    return {
      date: {
        start: "2004-02-04",
        end: this.today()
      },
      onDay: [],
      forTimeline: {},
      posts: [],
      patents:[],
      narratives: [],
      baseURI: "https://api.fbplussss.com/artifacts/"
    };
  },
  // mounted() {
  //   this.fetchToday();
  // },
  methods: {
    today: function() {
      return this.$moment(Date.now()).format("YYYY-MM-DD");
    },
    getRange: function() {
      const range = {
        start_date: this.$moment(this.date.start).format("YYYY-MM-DD"),
        end_date: this.$moment(this.date.end).format("YYYY-MM-DD")
      };
      this.fetchRange(range);
    },
    fetchRange: function(range) {
      const query = `${this.baseURI}range?${qs(range)}`;
      this.$http.get(query).then(result => {
        this.posts = result.data.posts;
        this.patents = result.data.patents;
        this.narratives = getNarratives(this.posts);
        this.forTimeline = groupArtifactsFromRange(result.data);
        console.log(result)
        this.$forceUpdate();
      });
    },
    fetchToday: function() {
      this.$http.get(`${this.baseURI}/today`).then(result => {
        this.today = result.data;
        this.posts = result.data.posts;
        this.narratives = getNarratives(this.posts);
        this.forTimeline = groupArtifactsByYear(result.data.artifacts);
      });
    },
    fetchDay: function(dateFields) {
      const query = `${this.baseURI}/on?${qs({ ...dateFields })}`;
      this.$http.get(query).then(result => {
        this.posts = result.data.posts;
        this.narratives = getNarratives(this.posts);
        this.forTimeline = groupArtifactsByYear(result.data.artifacts);
        this.$forceUpdate();
      });
    }
  }
};
</script>

<style lang="scss">

$screen-xs-min: 425px;  // Tiny phones
$screen-sm-min: 576px;  // Small tablets and large smartphones (landscape view)
$screen-md-min: 768px;  // Small tablets (portrait view)
$screen-lg-min: 992px;  // Tablets and small desktops
$screen-xl-min: 1200px; // Large tablets and desktops

// Mixins
@mixin xs { @media (max-width: #{$screen-xs-min}) {@content;} } // Tiny devices
@mixin sm { @media (max-width: #{$screen-sm-min}) {@content;} } // Small devices
@mixin md { @media (max-width: #{$screen-md-min}) {@content;} } // Medium devices
// @mixin lg { @media (min-width: #{$screen-lg-min}) {@content;} } // Large devices
// @mixin xl { @media (min-width: #{$screen-xl-min}) {@content;} } // Extra large devices

$fbred: #b24242;
$fblink: #993636;
$lightgray: #f7f7f7;
$gray: #4b4f56;
$headergray: rgb(245, 246, 247);
$backgroundgray: #e9ebee;

body {
  background-color: $backgroundgray;
  color: $gray;
  margin: 0 auto;
  font-family: sans-serif, Arial, "Helvetica";
}
a {
  color: $fblink;
  font-weight: 600;
}
h5 {
  color: #90949c;
}
#header {
  height: 70vh;
  background-color: $fbred;
  color: $gray;
  margin: 0 auto;
  padding: 60px;
  h1,
  h2,
  h3,
  h4,
  h5,
  p {
    color: white;
  }
  h1 {
    font-size: 52px;

    @include md {
    font-size: 24px;
    }
  }

}
li, .filter{
  margin: 5px;
  background-color: white;
  padding: 5px;
  color: $fbred;
  text-align: center;
  border: 1px solid #dddfe2;
  border-radius: 3px;
  list-style-type: none;
  display: inline;
  
  @include sm {
    display: block;
  }
  @include xs {
    display: block;
  }

}
button{
  font-size: 18px;
  margin: 5px;
  background-color: $fbred;
  color: white;
  border: 1px solid #dddfe2;
  border-radius: 3px;
}

#mainh1 {
  text-align:center;
  font-size: 20px;
  font-weight: 600;
  background-color: $headergray;
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 30px;
  margin-top: 20px;
  margin-left: 10px;
  margin-right: 10px;
  border: 1px solid #dddfe2;
  border-radius: 3px;
  form {
    margin-top: 3px;
    margin-bottom: 10px;
  }
  label {
    font-size: 11px;
    font-weight: 400;
  }
}
input[type="date"] {
  background-color: white;
  outline: none;
  border: 1px solid #dddfe2;
  border-radius: 3px;
  text-align:center;
  font-family: sans-serif, Arial, "Helvetica";
  font-size: 18px;
  margin: 5px;
}

input[type="date"]::-webkit-clear-button {
  font-size: 18px;
  height: 30px;
  position: relative;
}

input[type="date"]::-webkit-inner-spin-button {
  height: 28px;
  background-color:papayawhip;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  font-size: 15px;
}
</style>

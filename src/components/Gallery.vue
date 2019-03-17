/* eslint-disable */
<template>
	<div id="gallery">
		<div class="story" v-for="post in this.parsedPosts">
			<div class="hero"></div>
			<div class="text">
				<h1>{{ post.title }}</h1>
				<h4>{{ post.eventDate | moment("dddd, MMMM Do YYYY") }}</h4>
				<div v-html="blockToHtml(post.textBlocks)">
					{{ blockToHtml(post.textBlocks) }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { notionPostParser, blockToHtml } from "../utils";
export default {

	name: "Gallery",
	props: ["posts"],
	computed: {
		parsedPosts: function() {
			return this.posts
				.map(p => notionPostParser(p))
				.sort(function(a, b) {
					return new Date(b.eventDate) - new Date(a.eventDate);
				});
		}
	},
	methods: {
		parse(textData) {
			const textBlocks = textData.block.filter(
				b => v.value.type === "text"
			);
		},
		blockToHtml
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

$fblink: desaturate(#8b9dc3, 25%);

#gallery {
	background-color: white;
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	padding-top: 10px;
	margin-left: 10px;
	margin-right: 10px;
	border: 1px solid #dddfe2;
	border-radius: 3px;
	.story {
		background-color: white;
		border: 1px solid #dddfe2;
		border-radius: 3px;
		width: 25%;
		margin: 5px;

		@include xs {
			width: 95%;
		}
		@include sm {
			width: 90%;
		}
		@include md {
			width: 90%;
		}

		h1 {
			font-family: Georgia, serif;
			font-size: 22px;
			line-height: 24px;
			font-weight: 400;
		}
		p {
			font-family: Georgia, serif;
			font-size: 14px;
			line-height: 18px;
		}
		.hero {
			/*deal with this later–basically this is where we can add icons indicating type of event*/
			/*background-image:;
		background-size: cover;*/
			background-color: $fblink;
			height: 150px;
			border-bottom-color: rgba(0, 0, 0, 0.1);
		}
		.text {
			padding: 22px;
		}
	}
}
</style>

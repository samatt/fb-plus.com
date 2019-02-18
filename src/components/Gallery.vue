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
$fblink: #993636;
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
		width: 20%;
		margin: 5px;
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

---
layout: default
title: About
color: D45153
---

<script src="./assets/js/slider.js"></script>
<section>
<div class="page-content">
	<div class="presentation-content">
		<div>
		<div class="text-content">
			<h2><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> WHAT IS KEYCUBE ?</h2>
			Our objective is to foster collaboration around the kecent of a keyboard that have undergone a structural metamorphosis into the platonic solid that is a cube.
			<br>
			<br>
			A keycube facilitates and encourages the user to move around while typing, whether it's for text input in spatial computing environments, to maintain an active lifestyle, or simply to relish the joy of typing in various settings.
		</div>
		<button class="button-white">
			<span class="button-text" style="color: #{{ page.color }}">Read More</span>
			<i class="fa-solid fa-chevron-right" style="color: #{{ page.color }}"></i>
		</button>
		</div>
		<img src="./assets/img/cube.png">
	</div>

<div class="contributor-content">
<h2><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> CONTRIBUTORS</h2>

<div class="scroll-horizontal">

<div class="arrow left"><i class="fa-solid fa-chevron-left fa-3x picto" style="color: #{{ page.color }}"></i></div>

<div class="contributor-container">

{% for contributor in site.data.contributors %}

<div class="contributor">

{% if contributor.image %}
<img class="contributor-image" src="{{contributor.image}}"/>
{% else %}
<img class="contributor-image" src="./assets/img/contributors/no_picture.jpeg"/>
{% endif %}

<p class="contributor-name">{{contributor.name}}</p>
<p class="contributor-firstname">{{contributor.firstname}}</p>

<div class="contributor-network">

{% if contributor.url-linkedin %}
<a href="{{ contributor.url-linkedin }}" target="_blank">
<i class="fa-brands fa-linkedin fa-2x picto " style="color: #{{page.color}}"></i></a>
{% endif %}

{% if contributor.url-git %}
<a href="{{ contributor.url-git }}" target="_blank"><i class="fa-brands fa-github fa-2x picto" style="color: #{{page.color}}"></i></a>
{% endif %}

{% if contributor.url-personnal %}
<a href="{{ contributor.url-personnal }}" target="_blank"><i class="fa-solid fa-user fa-2x picto" style="color: #{{page.color}}"></i></a>
{% endif %}

</div>

</div>
{% endfor %}

</div>
<div class="arrow right"><i class="fa-solid fa-chevron-right fa-3x picto" style="color: #{{ page.color }}"></i></div>

</div>

</div>
</div>

</section>

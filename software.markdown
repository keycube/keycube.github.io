---
layout: default
title: Software
permalink: /software/
color: DC800F
---

<section>
<div class="citation" style="background-color: #{{page.color}}">
	<p>Tools, games, and other dedicated software for the keycubes.</p>	
</div>

{% for software in site.data.software %}
<div class = software>
	<div class = "description">
		<h2 style="text-transform : uppercase"><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> {{software.title}} </h2>
		<p> {{software.description}}</p>
		{% if software.category == "game" %}
		<a href="{{ software.lien }}" class="link">Play</a>
		{% elsif software.category == "tool" %}
		<a href="{{ software.lien }}" class="link">Download</a>
		{% endif %}
	</div>
	<div class = "img-container">
		<img src="{{ software.image }}" alt="{{ software.title }}">
	</div>
</div>
{% endfor %}


</section>
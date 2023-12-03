---
layout: default
title: Software
permalink: /software/
color: DC800F
---

<section>
<div class="citation" style="background-color: #{{page.color}}">
	<p>Tools, games, and other dedicated software for the keycubes</p>	
</div>

{% for software in site.data.software %}
<div class = software>
	<div class = "description">
		<h2 style="text-transform : uppercase"><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> {{software.title}} </h2>
		<p> {{software.description}}</p>
		<p style="color: #{{ page.color }}"> Key features</p> 
        <p> {{software.key-features}} </p>
		{% if software.category == "game" %}
		<a href="{{ software.lien }}" class="link"><p>Play</p></a>
		{% elsif software.category == "tool" %}
		<a href="{{ software.lien }}" class="link"><p>Download</p></a>
		{% endif %}
	</div>
	<div class = "img-container">
		<img src="{{ software.image }}" alt="{{ software.title }}">
		<div class = separator></div>
	</div>
	
</div>
{% endfor %}


</section>
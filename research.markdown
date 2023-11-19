---
layout: default
title: Research
permalink: /research/
color: 43AAD6
---

<section>

<div class="citation" style="background-color: #{{page.color}}">
	<p>Features of the keycube are informed by practical experiments, in-depth studies, and a body of published research.</p>	
</div>

<h2><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> PUBLISHED PAPERS </h2>

{% for research in site.data.research %}
<div class="published-paper">
<div class="color" style="background-color: #{{ page.color }}"></div>
<div class="info-published-paper">

{% if research.date %}
<p class="date" style="color: #{{ page.color }}">{{research.date}}</p>
{% else %}
<p class="date" style="color: #{{ page.color }}">XX-XX-XXXX</p>
{% endif %}

<p class="titre-author" >{{research.title}} - {{research.authors}}</p>

<p class="journal" style="color: #{{ page.color }}; border: 1px solid #{{ page.color }}">{{research.venue-journal}}</p>
</div>

<a href="{{research.url}}" target="_blank"><i class="fa-solid fa-chevron-right picto" style="color: #{{ page.color }}"></i></a>

</div>

{% endfor %}

</section>

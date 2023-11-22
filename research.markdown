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

{% assign sorted_researchs = site.data.research | sort: 'date' | reverse %}

{% for research in sorted_researchs %}
<a class="published-paper" href="{{research.url}}" target="_blank" >


{% if research.date %}
<p class="date" style="color: #{{ page.color }}">{{research.date}}</p>
{% else %}
<p class="date" style="color: #{{ page.color }}">XXXX</p>
{% endif %}

<div class="info-published-paper">
<p class="titre" >{{research.title}}</p>
<p class="author" >{{research.authors}}</p>
<p class="journal" style="color: #{{ page.color }};">{{research.venue-journal}}</p>
</div>

</a>

{% endfor %}

</section>

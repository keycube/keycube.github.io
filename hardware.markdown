---
layout : default
title: Hardware
permalink: /hardware/
color : F1D248
---

<section>

<div class="citation" style="background-color: #{{page.color}}">
	<p>Various flavors of keycube</p>	
</div>

  {% for hardware in site.data.hardware %}
  <div class = hardware>
        <div class = "description">
        <h2 style="text-transform : uppercase"><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> {{hardware.title}} </h2>
        <p>{{hardware.description}}</p>
        <p style="color: #{{ page.color }}"> Key features</p> 
        <p> {{hardware.key-features}} </p>
        <a href="{{hardware.git-link}}" class = "link"><p>Voir le projet</p> </a>
        </div>
        <div class = "img-container">
            <img src="{{ hardware.image }}" alt="{{ hardware.title }}">
            <div class = separator></div>
        </div>
    </div>
  {% endfor %}

</section>
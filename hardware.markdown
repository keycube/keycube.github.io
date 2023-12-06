---
layout: default
title: Hardware
permalink: /hardware/
color: F1D248  # Set the color variable for the page
---

<section>
    <!-- Hardware Citation Section -->
    <div class="citation" style="background-color: #{{page.color}}">
        <p>Various flavors of keycube</p>
    </div>
    <!-- Loop through Hardware Data -->
    {% for hardware in site.data.hardware %}
    <div class="hardware">
        <div class="description">
            <!-- Hardware Title and Description -->
            <h2 style="text-transform: uppercase"><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> {{hardware.title}} </h2>
            <p>{{hardware.description}}</p>
            <!-- Key Features of the Hardware -->
            <p style="color: #{{ page.color }}"> Key features</p>
            <p> {{hardware.key-features}} </p>
            <!-- Link to the Project on GitHub -->
            <a href="{{hardware.git-link}}" class="link"><p>Voir le projet</p> </a>
        </div>
        <!-- Hardware Image Container -->
        <div class="img-container">
            <img src="{{ hardware.image }}" alt="{{ hardware.title }}">
            <div class="separator"></div>
        </div>
    </div>
    {% endfor %}

</section>

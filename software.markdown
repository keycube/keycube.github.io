---
layout: default
title: Software
permalink: /software/
color: DC800F  # Set the color variable for the page
---

<section>
    <!-- Software Citation Section -->
    <div class="citation" style="background-color: #{{page.color}}">
        <p>Tools, games, and other dedicated software for the keycubes</p>
    </div>
    <!-- Loop through Software Data -->
    {% for software in site.data.software %}
    <div class="software">
        <div class="description">
            <!-- Software Title and Description -->
            <h2 style="text-transform: uppercase"><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> {{software.title}} </h2>
            <p> {{software.description}}</p>
            <!-- Key Features of the Software -->
            <p style="color: #{{ page.color }}"> Key features</p>
            <p> {{software.key-features}} </p>
            <!-- Play/Download Link based on Category -->
            {% if software.category == "game" %}
            <a href="{{ software.link }}" class="link"><p>Play</p></a>
            {% elsif software.category == "tool" %}
            <a href="{{ software.link }}" class="link"><p>Download</p></a>
            {% endif %}
        </div>
        <!-- Software Image Container -->
        <div class="img-container">
            <img src="{{ software.image }}" alt="{{ software.title }}">
            <div class="separator"></div>
        </div>
    </div>
    {% endfor %}

</section>

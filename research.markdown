---
layout: default
title: Research
permalink: /research/
color: 43AAD6  # Set the color variable for the page
---

<section>
    <!-- Research Citation Section -->
    <div class="citation" style="background-color: #{{page.color}}">
        <p>Features of the keycube are informed by practical experiments, in-depth studies, and a body of published research</p>
    </div>
    <!-- Published Papers Section -->
    <h2><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> PUBLISHED PAPERS </h2>
    {% assign sorted_researchs = site.data.research | sort: 'date' | reverse %}
    {% for research in sorted_researchs %}
    <a class="published-paper" href="{{research.url}}" target="_blank">
        {% if research.date %}
        <p class="date" style="color: #{{ page.color }}">{{research.date}}</p>
        {% else %}
        <p class="date" style="color: #{{ page.color }}">XXXX</p>
        {% endif %}
        <!-- Info for Each Published Paper -->
        <div class="info-published-paper">
            <p class="titre">{{research.title}}</p>
            <p class="author">{{research.authors}}</p>
            <p class="journal" style="color: #{{ page.color }};">{{research.venue-journal}}</p>
        </div>
    </a>
    {% endfor %}
</section>

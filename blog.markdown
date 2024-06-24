---
layout: default
title: Blog
permalink: /blog/
color: 319B7A  # Set the color variable for the page
---

<script src="{{ base.url | prepend: site.url }}/assets/js/blog-script.js"></script>

<section>
    <!-- Featured Posts Section -->
    <h2><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> FEATURED </h2>
    {% for post in site.posts %}
    {% if post.featuredPost == true %}
    <div class="featured-article">
        <!-- Featured Article Image Container -->
        <div class="img-container">
            <img src="{{ post.image }}" alt="{{ post.title }}">
        </div>
        <!-- Featured Article Information -->
        <div class="featured-article-infos">
            <p class="date" style="color : #{{page.color}}">{{ post.date | date: "%B %d, %Y" }}</p>
            <p class="title">{{ post.title }}</p>
            <!-- Categories of the Featured Post -->
            <div class="filtres-container">
                {% for category in post.categories %}
                <div class="categorie" style="color : #{{page.color}}">{{category}}</div>
                {% endfor %}
            </div>
            <p class="resume">{{post.resume }}</p>
            <!-- Read More Button -->
            <a href="{{ post.url }}" class="readMore-button">Read more</a>
        </div>
    </div>
    {% endif %}
    {% endfor %}
    <!-- Last Posted Posts Section -->
    <h2><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> LAST POSTED</h2>
    <!-- Category Filter Buttons -->
    <div class="category-filter">
        <button class="filter-button button-all" style="color: #{{ page.color }}; border: solid 1px #{{ page.color }}" data-category="Toutes les catégories">See all</button>
        <p class="text-filter" style="color: #{{ page.color }}">Or filter by</p>
        {% for category in site.categories %}
        {% capture category_name %}{{ category | first }}{% endcapture %}
        <button class="filter-button" style="color: #{{ page.color }}; border: solid 1px #{{ page.color }}" data-category="{{ category_name }}">{{ category_name }}</button>
        {% endfor %}
    </div>
    <!-- Articles Section -->
    <div class="articles">
        {% for post in site.posts %}
        <div class="article">
            <!-- Article Image Container -->
            <div class="img-container">
                <img src="{{ post.image }}" alt="{{ post.title }}">
            </div>
            <!-- Article Description -->
            <div class="description">
                <p class="date" style="color : #{{page.color}}">{{ post.date | date: "%B %d, %Y" }}</p>
                <p class="title">{{ post.title }}</p>
                <!-- Categories of the Article -->
                <div class="filtres-container">
                    {% for category in post.categories %}
                    <p class="categorie" style="color : #{{page.color}}">{{category}}</p>
                    {% endfor %}
                </div>
                <p class="resume">{{post.resume }}</p>
                <!-- Read More Button -->
                <a href="{{ post.url }}" class="readMore-button"><div>Read more</div></a>
            </div>
        </div>
        {% endfor %}
    </div>
</section>

---
# layout: page
layout : default
title: Blog
permalink: /blog/
color : 319B7A
---

<script src="{{ base.url | prepend: site.url }}/assets/js/blog-script.js"></script>

<section>

<h2><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> FEATURED </h2>

    {% for post in site.posts %}
    {% if post.featuredPost == true %}

    <div class="featured-article">
        <div class="img-container">
            <img src="{{ post.image }}" alt="{{ post.title }}">
        </div>
        <div class = "featured-article-infos">
        <p class="date" style="color : #{{page.color}}">{{ post.date | date: "%B %d, %Y" }}</p>
        <p class="title">{{ post.title }}</p>
        <div class ="filtres-container">
            {% for category in post.categories %}
            <p class="categorie" style="color : #{{page.color}}">{{category}}</p>
            {% endfor %}
        </div>
        <p class = resume>{{post.resume }}</p>
        <a href="{{ post.url }}" class="readMore-button">Read more</a>
        </div>
    </div>
    {% endif %}
    {% endfor %}


<h2><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> LAST POSTED</h2>

<div class="category-filter">
  <button class="filter-button button-all" style="color: #{{ page.color }}; border: solid 1px #{{ page.color }}" data-category="Toutes les catégories">See all</button>
  <p  class="text-filter" style="color: #{{ page.color }}">Or filter by:</p>
      {% capture uniqueCategories %}{% endcapture %}
  {% for post in site.posts %}
    {% for category in post.categories %}
      {% unless uniqueCategories contains category %}
        {% capture uniqueCategories %}{{ uniqueCategories }}{{ category }}{% endcapture %}
        <button class="filter-button" style="color: #{{ page.color }}; border: solid 1px #{{ page.color }}" data-category="{{ category }}">{{ category }}</button>
      {% endunless %}
    {% endfor %}
  {% endfor %}
</div>

<div class="articles">
    {% for post in site.posts %}
    <div class="article">
        <div class="img-container">
            <img src="{{ post.image }}" alt="{{ post.title }}">
        </div>
        <p class="date" style="color : #{{page.color}}">{{ post.date | date: "%B %d, %Y" }}</p>
        <p class="title">{{ post.title }}</p>
        <div class ="filtres-container">
            {% for category in post.categories %}
            <p class = "categorie" style="color : #{{page.color}}">{{category}}</p>
            {% endfor %}
        </div>
        <p class="resume">{{post.resume }}</p>
        <a href="{{ post.url }}" class="readMore-button">Read more</a>
    </div>
    {% endfor %}
</div>


</section>
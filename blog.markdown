---
# layout: page
layout : default
title: Blog
permalink: /blog/
color : 319B7A
---

<!-- <style>
    .filter-button {
        border : solid 0.2px {{page.color}};
        color : {{page.color}};
    }
</style> -->

<section>

<h2><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> FEATURED </h2>


<h2><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> LAST POSTED</h2>
<div class="category-filter">
  <button class="filter-button" data-category="Toutes les catégories">See all</button>
  <p> Or filter by : </p>
  <button class="filter-button"  style="color: #{{ page.color }}" data-category="Tools">Tools</button>
  <button class="filter-button" data-category="Games">Games</button>
  <button class="filter-button" data-category="Others">Others</button>
  <!-- Ajouter d'autres boutons pour chaque catégorie -->
</div>

<div class="articles">
    {% for post in site.posts %}
    <div class="article">
        <img src="{{ post.image }}" alt="{{ post.title }}">
        <p>{{ post.date | date: "%B %d, %Y" }}</p>
        <h2>{{ post.title }}</h2>
        <p>ici un court résumé</p>
        <a href="{{ post.url }}">Read more</a>
    </div>
    {% endfor %}
</div>


</section>
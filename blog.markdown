---
# layout: page
layout : default
title: Blog
permalink: /blog/
color : 319B7A
---

<section>

<h2><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> FEATURED </h2>


<h2><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> LAST POSTED</h2>


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
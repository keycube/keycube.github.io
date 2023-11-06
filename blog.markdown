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

<div class="articles>
    {% for post in site.posts %}
    <div class = article>
        <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
        <p>{{ post.date | date: "%B %d, %Y" }}</p>
        <p>{{ post.excerpt }}</p>
    </div>
    {% endfor %}
</div>


<!-- This is the base Jekyll theme. You can find out more info about customizing your Jekyll theme, as well as basic Jekyll usage documentation at [jekyllrb.com](https://jekyllrb.com/)

You can find the source code for Minima at GitHub:
[jekyll][jekyll-organization] /
[minima](https://github.com/jekyll/minima)

You can find the source code for Jekyll at GitHub:
[jekyll][jekyll-organization] /
[jekyll](https://github.com/jekyll/jekyll)


[jekyll-organization]: https://github.com/jekyll -->
</section>
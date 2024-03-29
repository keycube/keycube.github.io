---
layout: default
title: About
color: D45153  # Set the color variable for the page
---
<section>
    <div class="page-content">
        <div class="presentation-content">
            <div>
                <div class="text-content">
                    <!-- Section about KeyCube -->
                    <h2><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> WHAT IS KEYCUBE ?</h2>
                    <p>Our objective is to foster collaboration around the keycubes, essentially devices reminiscent of a keyboard that have undergone a structural metamorphosis into the platonic solid that is a cube.
                        <br>
                        <br>
                        A keycube facilitates and encourages the user to move around while typing, whether it's for text input in spatial computing environments, to maintain an active lifestyle, or simply to relish the joy of typing in various settings.</p>
                </div>
                <a href="https://github.com/keycube" target="_blank" class="button-white">
                    <span class="button-text" style="color: #{{ page.color }}">Read More</span>
                    <i class="fa-solid fa-chevron-right" style="color: #{{ page.color }}"></i>
                </a>
            </div>
            <img src="./assets/img/cube.png"> <!-- Image related to KeyCube -->
        </div>
        <div class="contributor-content">
            <!-- Section for Contributors -->
            <h2><i class="fa-solid fa-square" style="color: #{{ page.color }}"></i> CONTRIBUTORS</h2>
            <div class="contributor-container">
                {% assign sorted_contributors = site.data.contributors | sort: 'pseudo' %}
                {% for contributor in sorted_contributors %}
                <a href="{{contributor.url}}" target="_blank">
                    {% if contributor.image %}
                    <div class="contributor-profil" style="background-image: url('{{contributor.image}}');">
                        <p class="contributor-pseudo">{{contributor.pseudo}}</p>
                    </div>
                    {% else %}
                    <div class="contributor-profil" style="background-image: url('./assets/img/contributors/no_picture.jpeg');">
                        <p class="contributor-pseudo">{{contributor.pseudo}}</p>
                    </div>
                    {% endif %}
                </a>
                {% endfor %}
            </div>
        </div>
    </div>
</section>

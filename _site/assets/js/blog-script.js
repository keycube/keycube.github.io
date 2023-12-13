document.addEventListener('DOMContentLoaded', function() {
    // When the DOM is ready, run this function

    // get all filter buttons   
    var filterButtons = document.querySelectorAll('.filter-button');

    // get all articles
    var articles = document.querySelectorAll('.article');
    // filter articles by category
        function blogFilter(selectedCategories) {
  
            articles.forEach(function(article) {
                var filtersContainer = article.querySelector('.filtres-container');
                var categories = filtersContainer.querySelectorAll('p');
    
                if (selectedCategories.length === 0 || selectedCategories.includes('Toutes les catégories')) {
                    // display the article if See all is selected or if there are no categories selected
                    article.style.display = 'block';
                } else {
                    var showArticle = false;
                    
    
                    // check if the article has any of the selected categories
                    categories.forEach(function(category) {
                        if (selectedCategories.includes(category.textContent)) {
                            showArticle = true;
                        }
                    });
    
                    if (showArticle) {
                        article.style.display = 'block';
                    } else {
                        article.style.display = 'none';
                    }
                }
            });
        }

    // add event listeners to filter buttons
    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // deactive active class for all buttons
            filterButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });

            // activate the clicked button
            button.classList.add('active');

            // get the category of the clicked button
            var category = button.getAttribute('data-category');
            blogFilter(category);
        });
    });  //add event listeners to filter buttons
    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var category = button.getAttribute('data-category');
            blogFilter(category);
        });
    });

    // click on See all button when the page loads
    var seeAllButton = document.querySelector('.filter-button[data-category="Toutes les catégories"]');
    seeAllButton.click();

    // display all articles when the page loads
    blogFilter('Toutes les catégories');
});
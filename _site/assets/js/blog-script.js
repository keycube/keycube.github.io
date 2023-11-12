document.addEventListener('DOMContentLoaded', function() {
    // Lorsque le document est prêt

    // Récupère tous les boutons de filtre
    var filterButtons = document.querySelectorAll('.filter-button');

    // Récupère tous les articles
    var articles = document.querySelectorAll('.article');
    // Fonction pour filtrer les articles en fonction de la catégorie
        // Fonction pour filtrer les articles en fonction des catégories sélectionnées
        function blogFilter(selectedCategories) {
  
            articles.forEach(function(article) {
                var filtersContainer = article.querySelector('.filtres-container');
                var categories = filtersContainer.querySelectorAll('p');
    
                if (selectedCategories.length === 0 || selectedCategories.includes('Toutes les catégories')) {
                    // Affiche l'article si le bouton "See all" a été cliqué ou si aucune catégorie n'est sélectionnée
                    article.style.display = 'block';
                } else {
                    var showArticle = false;
                    
    
                    // Vérifie si l'article appartient à au moins l'une des catégories sélectionnées
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

    // Ajoute des écouteurs d'événements aux boutons de filtrage
    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Désactive la classe "active" pour tous les boutons
            filterButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });

            // Active la classe "active" pour le bouton actuellement cliqué
            button.classList.add('active');

            // Continuez avec votre logique de filtrage ici
            var category = button.getAttribute('data-category');
            blogFilter(category);
        });
    });    // Ajoute des écouteurs d'événements aux boutons de filtrage
    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var category = button.getAttribute('data-category');
            blogFilter(category);
        });
    });

    // Cliquez sur le bouton "See all" au chargement de la page
    var seeAllButton = document.querySelector('.filter-button[data-category="Toutes les catégories"]');
    seeAllButton.click();

    // Affiche tous les articles au chargement de la page
    blogFilter('Toutes les catégories');
});
document.addEventListener('DOMContentLoaded', function () {
	const container = document.querySelector('.contributor-container');
	const arrowLeft = document.querySelector('.arrow.left');
	const arrowRight = document.querySelector('.arrow.right');
  
	const contributorWidth = document.querySelector('.contributor').offsetWidth;
	const moveAmount = 100; // Ajustez cette valeur selon votre préférence de déplacement
  
	arrowLeft.addEventListener('click', function () {
	  container.scrollLeft -= moveAmount;
	});
  
	arrowRight.addEventListener('click', function () {
	  container.scrollLeft += moveAmount;
	});
  });
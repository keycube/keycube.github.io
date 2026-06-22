window.addEventListener('resize', function() {
    const html = document.documentElement;
    let isScrollable = html.scrollHeight > html.clientHeight;

    let isMobileDevice = window.matchMedia("(pointer:coarse) and (width <= 800px)").matches;

    if (!isMobileDevice && isScrollable)
        html.style += "scrollbar-gutter: stable;";
});
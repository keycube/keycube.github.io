const html = document.documentElement;
const isScrollable = html.scrollHeight > html.clientHeight;

const isMobileDevice = window.matchMedia("(pointer:coarse) and (width <= 800px)").matches;

if (!isMobileDevice && isScrollable)
    html.style += "scrollbar-gutter: stable;";
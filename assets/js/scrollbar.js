const html = document.documentElement;
const isScrollable = html.scrollHeight > html.clientHeight;

let isMobileDevice = window.matchMedia("(pointer:coarse) and (max-width: 575.98px)").matches;

if (!isMobileDevice && isScrollable)
    html.style += "scrollbar-gutter: stable;";
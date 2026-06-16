const html = document.documentElement;
const isScrollable = html.scrollHeight > html.clientHeight;

const isMobileDevice = window.matchMedia("(pointer:coarse)").matches;

if (!isMobileDevice && isScrollable)
    html.style += "scrollbar-gutter: stable;";
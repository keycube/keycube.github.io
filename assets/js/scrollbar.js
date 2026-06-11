const html = document.documentElement;
let isScrollable = html.scrollHeight > html.clientHeight;

let isMobileDevice = window.matchMedia("(pointer:coarse)").matches;

if (!isMobileDevice && isScrollable)
    html.style += "scrollbar-gutter: stable;";
const html = document.documentElement;
const isScrollable = html.scrollHeight > html.clientHeight;

if (isScrollable)
    html.style += "scrollbar-gutter: stable;";
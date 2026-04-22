from __future__ import annotations

import glob
import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "img" / "heatmap3d"
OUT_DIR.mkdir(parents=True, exist_ok=True)

AUTHOR = "Guy Junior Calvet"
PROJECT_URL = "https://keycube.org/heatmap3d/"
REPO_URL = "github.com/keycube/heatmap3d"

WIDTH = 4200
HEIGHT = 2550
MARGIN = 180
GAP = 70

BG = "#fbfbf9"
TEXT = "#111111"
MUTED = "#5b5b57"
LINE = "#d7d3ca"
CARD = "#ffffff"
ACCENT = "#d68b1c"
ACCENT_SOFT = "#f2e2c5"
BLUE_SOFT = "#eaf1fb"
GREEN_SOFT = "#edf5ea"
VIOLET_SOFT = "#f2edf7"


def font(size: int, bold: bool = False, black: bool = False) -> ImageFont.FreeTypeFont:
    if black:
        path = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
    elif bold:
        path = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
    else:
        path = "/System/Library/Fonts/Supplemental/Arial.ttf"
    return ImageFont.truetype(path, size=size)


def rounded_box(draw: ImageDraw.ImageDraw, box, radius=34, fill=CARD, outline=LINE, width=3):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, text_font, max_width: int) -> str:
    words = text.split()
    lines = []
    current = []
    for word in words:
        test = " ".join(current + [word])
        if draw.textlength(test, font=text_font) <= max_width or not current:
            current.append(word)
        else:
            lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    return "\n".join(lines)


def fit_image_cover(img: Image.Image, size: tuple[int, int], crop_box=None) -> Image.Image:
    if crop_box is not None:
        img = img.crop(crop_box)
    return ImageOps.fit(img, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))


def fit_image_contain(img: Image.Image, size: tuple[int, int], crop_box=None, background="#ffffff") -> Image.Image:
    if crop_box is not None:
        img = img.crop(crop_box)
    contained = ImageOps.contain(img, size, method=Image.Resampling.LANCZOS)
    frame = Image.new("RGB", size, background)
    offset = ((size[0] - contained.width) // 2, (size[1] - contained.height) // 2)
    frame.paste(contained, offset)
    return frame


def find_desktop_capture(time_suffix: str) -> Path:
    matches = sorted(glob.glob(str(Path.home() / "Desktop" / f"*{time_suffix}*.png")))
    if not matches:
        raise FileNotFoundError(f"Screenshot ending with {time_suffix} not found on Desktop")
    return Path(matches[0])


def paste_card_image(base: Image.Image, image_path: Path, box, crop_box, caption: str, bg_fill: str):
    x1, y1, x2, y2 = box
    draw = ImageDraw.Draw(base)
    rounded_box(draw, box, radius=36, fill=bg_fill)

    inner = 28
    caption_h = 86
    image_box = (x1 + inner, y1 + inner, x2 - inner, y2 - inner - caption_h)
    w = image_box[2] - image_box[0]
    h = image_box[3] - image_box[1]

    img = Image.open(image_path).convert("RGB")
    img = fit_image_contain(img, (w, h), crop_box=crop_box, background="#ffffff")
    base.paste(img, image_box[:2])

    caption_box = (x1 + inner, y2 - inner - caption_h + 6, x2 - inner, y2 - inner)
    rounded_box(draw, caption_box, radius=20, fill="#ffffff", outline="#e6e1d6", width=2)
    cap_font = font(34)
    cap_text = wrap_text(draw, caption, cap_font, caption_box[2] - caption_box[0] - 40)
    bbox = draw.multiline_textbbox((0, 0), cap_text, font=cap_font, spacing=6, align="center")
    tx = (caption_box[0] + caption_box[2] - (bbox[2] - bbox[0])) / 2
    ty = (caption_box[1] + caption_box[3] - (bbox[3] - bbox[1])) / 2 - 4
    draw.multiline_text((tx, ty), cap_text, font=cap_font, fill=TEXT, spacing=6, align="center")


def draw_stat_chip(draw: ImageDraw.ImageDraw, box, value: str, label: str):
    rounded_box(draw, box, radius=26, fill="#fffaf2", outline="#eadfca", width=2)
    x1, y1, x2, y2 = box
    draw.text((x1 + 26, y1 + 18), value, font=font(56, black=True), fill=ACCENT)
    draw.text((x1 + 26, y1 + 82), label, font=font(28, bold=True), fill=TEXT)


def draw_bullets(draw: ImageDraw.ImageDraw, top_left, width, items, bullet_fill=ACCENT, font_size=34, line_gap=20):
    x, y = top_left
    body_font = font(font_size)
    for item in items:
        draw.ellipse((x, y + 10, x + 16, y + 26), fill=bullet_fill)
        wrapped = wrap_text(draw, item, body_font, width - 42)
        draw.multiline_text((x + 34, y), wrapped, font=body_font, fill=TEXT, spacing=6)
        bbox = draw.multiline_textbbox((x + 34, y), wrapped, font=body_font, spacing=6)
        y = bbox[3] + line_gap


def draw_section_title(draw: ImageDraw.ImageDraw, x: int, y: int, title: str):
    draw.text((x, y), title, font=font(48, bold=True), fill=TEXT)
    draw.rounded_rectangle((x, y + 68, x + 112, y + 78), radius=5, fill=ACCENT)


def draw_list_panel(draw: ImageDraw.ImageDraw, box, title: str, items: list[str], fill="#fffaf2"):
    rounded_box(draw, box, radius=24, fill=fill, outline="#e7dfd1", width=2)
    x1, y1, x2, y2 = box
    draw.text((x1 + 30, y1 + 22), title, font=font(26, bold=True), fill=TEXT)
    draw.line((x1 + 24, y1 + 62, x2 - 24, y1 + 62), fill="#eee6d8", width=2)
    draw_bullets(
        draw,
        (x1 + 16, y1 + 68),
        x2 - x1 - 32,
        items,
        bullet_fill=ACCENT,
        font_size=21,
        line_gap=10,
    )


def draw_labeled_rows(draw: ImageDraw.ImageDraw, box, rows: list[tuple[str, str]]):
    x1, y1, x2, y2 = box
    inner_top = y1 + 18
    inner_bottom = y2 - 18
    row_h = (inner_bottom - inner_top) // len(rows)
    pill_w = 116
    pill_h = 34
    text_x = x1 + pill_w + 72
    for i, (label, value) in enumerate(rows):
        top = inner_top + i * row_h
        bottom = inner_bottom if i == len(rows) - 1 else top + row_h
        pill = (x1 + 10, top + 10, x1 + 10 + pill_w, top + 10 + pill_h)
        draw.rounded_rectangle(pill, radius=18, fill="#fff6e8", outline="#f0ddb7", width=1)
        draw.text((pill[0] + 12, pill[1] + 4), label, font=font(20, bold=True), fill=ACCENT)
        wrapped = wrap_text(draw, value, font(21), x2 - text_x - 16)
        draw.multiline_text((text_x, top + 4), wrapped, font=font(21), fill=TEXT, spacing=6)
        if i < len(rows) - 1:
            line_y = min(bottom - 10, top + 46)
            draw.line((text_x, line_y, x2 - 14, line_y), fill="#efe7d7", width=1)


def draw_feature_grid(draw: ImageDraw.ImageDraw, box, items: list[tuple[str, str]]):
    x1, y1, x2, y2 = box
    gap = 20
    col_w = (x2 - x1 - gap) // 2
    row_h = (y2 - y1 - gap) // 2
    positions = [
        (x1, y1, x1 + col_w, y1 + row_h),
        (x1 + col_w + gap, y1, x2, y1 + row_h),
        (x1, y1 + row_h + gap, x1 + col_w, y2),
        (x1 + col_w + gap, y1 + row_h + gap, x2, y2),
    ]
    for (title, body), card in zip(items, positions):
        rounded_box(draw, card, radius=24, fill="#fffaf2", outline="#eadfca", width=2)
        draw.text((card[0] + 22, card[1] + 14), title, font=font(22, bold=True), fill=TEXT)
        wrapped = wrap_text(draw, body, font(25), card[2] - card[0] - 44)
        draw.multiline_text((card[0] + 22, card[1] + 34), wrapped, font=font(25), fill=MUTED, spacing=5)


def main():
    hero_path = find_desktop_capture("02.32.10")
    total_path = find_desktop_capture("02.31.43")
    preferred_path = find_desktop_capture("02.31.34")
    aggregate_path = find_desktop_capture("02.31.17")
    logo_path = ROOT / "assets" / "img" / "k3logo.png"
    qr_path = Path("/tmp/heatmap3d-qr.png")

    if not qr_path.exists():
        raise FileNotFoundError("QR code image /tmp/heatmap3d-qr.png is missing")

    canvas = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle((0, 0, WIDTH, 24), radius=0, fill=ACCENT)
    for x in range(MARGIN, WIDTH - MARGIN, 440):
        draw.line((x, HEIGHT - 160, x, HEIGHT - 120), fill="#e8e3d8", width=2)

    title_font = font(164, black=True)
    subtitle_font = font(62, bold=True)
    author_font = font(45, bold=True)
    small_font = font(35)

    draw.text((MARGIN, 120), "HEATMAP 3D", font=title_font, fill=TEXT)
    draw.text((MARGIN, 300), "Affiche de présentation du module de visualisation 3D des études Keycube", font=subtitle_font, fill=TEXT)
    draw.text((MARGIN, 386), AUTHOR, font=author_font, fill=ACCENT)
    draw.text((MARGIN, 438), "Étudiant en 3e année | Baccalauréat en informatique-sciences des données et de l'intelligence d'affaires | UQAC", font=small_font, fill=MUTED)

    chip_y = 500
    chip_w = 320
    chip_h = 128
    chip_gap = 24
    chips = [
        ("31", "participants - Étude 1"),
        ("22", "participants - Étude 2"),
        ("77,4 %", "prise diagonale"),
        ("80", "touches visualisées"),
    ]
    for i, (value, label) in enumerate(chips):
        x = MARGIN + i * (chip_w + chip_gap)
        draw_stat_chip(draw, (x, chip_y, x + chip_w, chip_y + chip_h), value, label)

    qr_box = (WIDTH - MARGIN - 330, 120, WIDTH - MARGIN, 450)
    rounded_box(draw, qr_box, radius=32, fill=CARD)
    qr_img = Image.open(qr_path).convert("RGB").resize((230, 230), Image.Resampling.NEAREST)
    canvas.paste(qr_img, (qr_box[0] + 50, qr_box[1] + 26))
    draw.text((qr_box[0] + 36, qr_box[1] + 270), "QR vers la démo", font=font(28, bold=True), fill=TEXT)

    logo_box = (WIDTH - MARGIN - 520, 120, WIDTH - MARGIN - 360, 280)
    rounded_box(draw, logo_box, radius=32, fill=CARD)
    logo = Image.open(logo_path).convert("RGBA").resize((104, 104), Image.Resampling.LANCZOS)
    canvas.paste(logo, (logo_box[0] + 28, logo_box[1] + 22), mask=logo)

    hero_box = (MARGIN, 700, 2380, 1580)
    rounded_box(draw, hero_box, radius=40, fill=CARD)
    hero_crop = (620, 330, 2380, 1780)
    hero = fit_image_contain(
        Image.open(hero_path).convert("RGB"),
        (hero_box[2] - hero_box[0] - 40, hero_box[3] - hero_box[1] - 90),
        crop_box=hero_crop,
        background="#ffffff",
    )
    canvas.paste(hero, (hero_box[0] + 20, hero_box[1] + 20))
    draw.text((hero_box[0] + 28, hero_box[3] - 54), "Interface réelle du mode Accessibilité : sélection par main, doigt ou vue combinée.", font=font(30), fill=MUTED)

    col_x1 = 2450
    col_x2 = WIDTH - MARGIN

    summary_box = (col_x1, 690, col_x2, 994)
    rounded_box(draw, summary_box, radius=34, fill=CARD)
    draw_section_title(draw, summary_box[0] + 36, summary_box[1] + 28, "Résumé")
    summary_rows = [
        ("Objectif", "Visualiser les études keycube directement sur une représentation 3D de l'objet."),
        ("Problème", "Comparer rapidement préférences de doigts et accessibilité sans passer par des tableaux statiques."),
        ("Solution", "Deux modes : Préférence, par participant ou en vue agrégée, et Accessibilité, par doigt, par main ou au total."),
        ("Impact", "Explorer les 80 touches et mieux communiquer les résultats de recherche."),
    ]
    draw_labeled_rows(
        draw,
        (summary_box[0] + 44, summary_box[1] + 105, summary_box[2] - 42, summary_box[3] - 32),
        summary_rows,
    )

    points_box = (col_x1, 1006, col_x2, 1292)
    rounded_box(draw, points_box, radius=34, fill=CARD)
    draw_section_title(draw, points_box[0] + 36, points_box[1] + 28, "Points cles")
    point_cards = [
        ("Visualiseur 3D", "Cube interactif synchronisé avec les données des études."),
        ("Deux modes", "Préférence et Accessibilité."),
        ("Filtres fins", "Participant, face, main, doigt, total et doigt préféré."),
        ("Scores visibles", "Les valeurs sont affichées directement sur les 80 touches."),
    ]
    draw_feature_grid(draw, (points_box[0] + 34, points_box[1] + 114, points_box[2] - 34, points_box[3] - 26), point_cards)

    tools_box = (col_x1, 1308, col_x2, 1650)
    rounded_box(draw, tools_box, radius=34, fill=CARD)
    draw_section_title(draw, tools_box[0] + 36, tools_box[1] + 28, "Outils et logiciels")
    inner_gap = 26
    panel_top = tools_box[1] + 118
    panel_bottom = tools_box[3] - 34
    panel_mid = (tools_box[0] + tools_box[2]) // 2
    left_panel = (tools_box[0] + 28, panel_top, panel_mid - inner_gap // 2, panel_bottom)
    right_panel = (panel_mid + inner_gap // 2, panel_top, tools_box[2] - 28, panel_bottom)
    draw_list_panel(
        draw,
        left_panel,
        "Projet",
        ["Jekyll", "Three.js", "JavaScript, HTML, CSS", "Données CSV intégrées"],
        fill="#fffaf2",
    )
    draw_list_panel(
        draw,
        right_panel,
        "Affiche",
        ["Python + Pillow", "Captures d'écran du site", "Logo keycube", "QR code PNG vers la démo"],
        fill="#fbf8f1",
    )

    card_y = 1640
    card_h = 660
    card_w = (WIDTH - 2 * MARGIN - 2 * GAP) // 3
    total_crop = (700, 330, 2300, 1780)
    preferred_crop = (700, 330, 2300, 1780)
    aggregate_crop = (760, 310, 2240, 1780)

    paste_card_image(
        canvas,
        total_path,
        (MARGIN, card_y, MARGIN + card_w, card_y + card_h),
        total_crop,
        "Accessibilité combinée des 10 doigts et des 22 participants.",
        BLUE_SOFT,
    )
    paste_card_image(
        canvas,
        preferred_path,
        (MARGIN + card_w + GAP, card_y, MARGIN + 2 * card_w + GAP, card_y + card_h),
        preferred_crop,
        "Score d'accessibilité du doigt préféré pour chaque touche.",
        GREEN_SOFT,
    )
    paste_card_image(
        canvas,
        aggregate_path,
        (MARGIN + 2 * (card_w + GAP), card_y, MARGIN + 3 * card_w + 2 * GAP, card_y + card_h),
        aggregate_crop,
        "Vue agrégée : ratio du doigt dominant par touche sur 22 participants.",
        VIOLET_SOFT,
    )

    footer_y = HEIGHT - 120
    draw.line((MARGIN, footer_y, WIDTH - MARGIN, footer_y), fill=ACCENT, width=3)
    footer = (
        f"Dépôt : {REPO_URL}   |   Démo : {PROJECT_URL}"
    )
    footer_bbox = draw.textbbox((0, 0), footer, font=font(26))
    footer_x = (WIDTH - (footer_bbox[2] - footer_bbox[0])) / 2
    draw.text((footer_x, footer_y + 18), footer, font=font(26), fill=MUTED)

    jpg_path = OUT_DIR / "heatmap3d-poster-legal-fr.jpg"
    png_path = OUT_DIR / "heatmap3d-poster-legal-fr.png"
    canvas.save(jpg_path, quality=90, optimize=True, dpi=(300, 300))
    canvas.save(png_path, optimize=True, dpi=(300, 300))

    print(jpg_path)
    print(png_path)


if __name__ == "__main__":
    main()

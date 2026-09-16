from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)


def font(size, bold=False):
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/calibrib.ttf" if bold else "C:/Windows/Fonts/calibri.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue
    return ImageFont.load_default()


def wrap(draw, text, max_width, typeface):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw.textbbox((0, 0), trial, font=typeface)[2] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def rounded(draw, xy, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def product_image(filename, title, label, palette, motif):
    scale = 2
    w, h = 1200 * scale, 900 * scale
    img = Image.new("RGB", (w, h), palette["bg"])
    draw = ImageDraw.Draw(img)

    ink = (22, 24, 29)
    muted = (98, 108, 119)
    white = (255, 255, 255)
    line = palette["line"]
    primary = palette["primary"]
    secondary = palette["secondary"]
    accent = palette["accent"]

    rounded(draw, (70 * scale, 70 * scale, 1130 * scale, 830 * scale), 28 * scale, white, line, 2 * scale)
    rounded(draw, (105 * scale, 105 * scale, 1095 * scale, 170 * scale), 18 * scale, palette["soft"], None)
    draw.text((132 * scale, 124 * scale), "PromptlyPro", fill=ink, font=font(27 * scale, True))
    draw.text((880 * scale, 124 * scale), label.upper(), fill=primary, font=font(22 * scale, True))

    draw.text((132 * scale, 230 * scale), title, fill=ink, font=font(58 * scale, True))
    y = 312 * scale
    for line_text in wrap(draw, "AI-ready digital product pack for faster, cleaner, more profitable work.", 560 * scale, font(30 * scale)):
        draw.text((132 * scale, y), line_text, fill=muted, font=font(30 * scale))
        y += 42 * scale

    if motif == "resume":
        for offset, color in [(0, white), (32, palette["soft"]), (64, white)]:
            x0 = (650 + offset) * scale
            y0 = (255 + offset // 2) * scale
            rounded(draw, (x0, y0, x0 + 310 * scale, y0 + 430 * scale), 18 * scale, color, line, 2 * scale)
            draw.rectangle((x0 + 36 * scale, y0 + 52 * scale, x0 + 210 * scale, y0 + 70 * scale), fill=primary)
            for i in range(6):
                width = [220, 180, 240, 150, 210, 175][i] * scale
                draw.rectangle((x0 + 36 * scale, y0 + (116 + i * 44) * scale, x0 + 36 * scale + width, y0 + (132 + i * 44) * scale), fill=(210, 217, 214))
    elif motif == "prompts":
        for i in range(5):
            y0 = (268 + i * 75) * scale
            rounded(draw, (620 * scale, y0, 1045 * scale, y0 + 52 * scale), 16 * scale, white, line, 2 * scale)
            draw.ellipse((646 * scale, (y0 + 14 * scale), 672 * scale, (y0 + 40 * scale)), fill=[primary, secondary, accent, primary, secondary][i])
            draw.rectangle((695 * scale, y0 + 17 * scale, (1010 - i * 22) * scale, y0 + 29 * scale), fill=(204, 212, 218))
    elif motif == "business":
        rounded(draw, (632 * scale, 272 * scale, 1048 * scale, 660 * scale), 22 * scale, palette["soft"], line, 2 * scale)
        for i, height in enumerate([220, 150, 280, 190]):
            x = (690 + i * 78) * scale
            draw.rectangle((x, (600 - height) * scale, x + 42 * scale, 600 * scale), fill=[primary, secondary, accent, primary][i])
        draw.line((690 * scale, 600 * scale, 1008 * scale, 600 * scale), fill=ink, width=4 * scale)
    elif motif == "canva":
        for i, color in enumerate([primary, secondary, accent, palette["soft"]]):
            x0 = (625 + (i % 2) * 210) * scale
            y0 = (265 + (i // 2) * 205) * scale
            rounded(draw, (x0, y0, x0 + 175 * scale, y0 + 168 * scale), 20 * scale, color, None)
            draw.ellipse((x0 + 48 * scale, y0 + 38 * scale, x0 + 126 * scale, y0 + 116 * scale), fill=white)
    elif motif == "course":
        rounded(draw, (630 * scale, 278 * scale, 1050 * scale, 630 * scale), 24 * scale, white, line, 2 * scale)
        for i in range(4):
            y0 = (322 + i * 62) * scale
            draw.ellipse((675 * scale, y0, 710 * scale, y0 + 35 * scale), fill=[primary, secondary, accent, primary][i])
            draw.rectangle((735 * scale, y0 + 7 * scale, (980 - i * 28) * scale, y0 + 22 * scale), fill=(203, 211, 217))
        draw.polygon([(880 * scale, 560 * scale), (880 * scale, 655 * scale), (960 * scale, 607 * scale)], fill=primary)
    else:
        nodes = [(682, 330), (860, 270), (1008, 390), (816, 555), (1004, 610)]
        for a, b in zip(nodes, nodes[1:]):
            draw.line((a[0] * scale, a[1] * scale, b[0] * scale, b[1] * scale), fill=primary, width=8 * scale)
        for i, (x, y0) in enumerate(nodes):
            draw.ellipse((x * scale - 34 * scale, y0 * scale - 34 * scale, x * scale + 34 * scale, y0 * scale + 34 * scale), fill=[primary, secondary, accent, primary, secondary][i])

    for i, (label_text, color) in enumerate([("Templates", primary), ("Prompts", secondary), ("Guides", accent)]):
        x0 = (132 + i * 155) * scale
        rounded(draw, (x0, 710 * scale, x0 + 130 * scale, 760 * scale), 25 * scale, color, None)
        tw = draw.textbbox((0, 0), label_text, font=font(22 * scale, True))[2]
        draw.text((x0 + (130 * scale - tw) / 2, 725 * scale), label_text, fill=white, font=font(22 * scale, True))

    img = img.resize((1200, 900), Image.Resampling.LANCZOS)
    img.save(OUT / filename, quality=94)


def hero_image():
    scale = 2
    w, h = 1600 * scale, 1000 * scale
    img = Image.new("RGB", (w, h), (237, 245, 241))
    draw = ImageDraw.Draw(img)
    ink = (22, 24, 29)
    muted = (98, 108, 119)
    white = (255, 255, 255)
    green = (20, 122, 92)
    blue = (49, 86, 200)
    coral = (216, 81, 53)
    amber = (184, 124, 24)
    line = (207, 216, 213)

    rounded(draw, (95 * scale, 90 * scale, 1505 * scale, 910 * scale), 36 * scale, white, line, 2 * scale)
    rounded(draw, (130 * scale, 130 * scale, 1470 * scale, 210 * scale), 18 * scale, (246, 248, 245), None)
    draw.text((164 * scale, 153 * scale), "PromptlyPro marketplace", fill=ink, font=font(34 * scale, True))
    draw.text((1110 * scale, 154 * scale), "AI STORE OPS", fill=green, font=font(28 * scale, True))

    rounded(draw, (135 * scale, 250 * scale, 410 * scale, 830 * scale), 24 * scale, (246, 249, 247), line, 2 * scale)
    for i, label_text in enumerate(["Catalog", "AI Finder", "Prompt Studio", "Checkout", "Downloads"]):
        y = (295 + i * 75) * scale
        fill = green if i == 0 else (222, 229, 226)
        rounded(draw, (170 * scale, y, 372 * scale, y + 42 * scale), 18 * scale, fill, None)
        draw.text((190 * scale, y + 10 * scale), label_text, fill=white if i == 0 else muted, font=font(21 * scale, True))

    card_specs = [
        (470, 250, "Resume Kit", green),
        (785, 250, "Sales Prompts", blue),
        (1100, 250, "Automation", coral),
        (470, 545, "Canva Launch", amber),
        (785, 545, "Notion System", green),
        (1100, 545, "Course Builder", blue),
    ]
    for x, y, title, color in card_specs:
        rounded(draw, (x * scale, y * scale, (x + 255) * scale, (y + 230) * scale), 22 * scale, white, line, 2 * scale)
        rounded(draw, ((x + 24) * scale, (y + 24) * scale, (x + 231) * scale, (y + 118) * scale), 18 * scale, color, None)
        draw.text(((x + 24) * scale, (y + 142) * scale), title, fill=ink, font=font(25 * scale, True))
        draw.text(((x + 24) * scale, (y + 178) * scale), "AI-ready digital pack", fill=muted, font=font(20 * scale))
        draw.text(((x + 178) * scale, (y + 142) * scale), "$29+", fill=color, font=font(26 * scale, True))

    rounded(draw, (470 * scale, 805 * scale, 1355 * scale, 862 * scale), 24 * scale, (238, 245, 241), None)
    draw.text((502 * scale, 823 * scale), "Search, recommend, sell, unlock downloads, and connect real API keys when ready.", fill=ink, font=font(24 * scale, True))

    img = img.resize((1600, 1000), Image.Resampling.LANCZOS)
    img.save(OUT / "hero-dashboard.png", quality=94)


def favicon():
    size = 256
    img = Image.new("RGB", (size, size), (22, 24, 29))
    draw = ImageDraw.Draw(img)
    rounded(draw, (22, 22, 234, 234), 30, (20, 122, 92), None)
    draw.text((83, 52), "P", fill=(255, 255, 255), font=font(132, True))
    img.save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (128, 128), (256, 256)])


PALETTES = {
    "green": {"bg": (237, 245, 241), "soft": (223, 238, 232), "line": (204, 214, 211), "primary": (20, 122, 92), "secondary": (49, 86, 200), "accent": (216, 81, 53)},
    "blue": {"bg": (233, 237, 255), "soft": (221, 227, 252), "line": (198, 205, 226), "primary": (49, 86, 200), "secondary": (20, 122, 92), "accent": (216, 81, 53)},
    "coral": {"bg": (255, 240, 233), "soft": (255, 227, 215), "line": (227, 202, 193), "primary": (216, 81, 53), "secondary": (49, 86, 200), "accent": (184, 124, 24)},
    "amber": {"bg": (255, 245, 216), "soft": (249, 235, 194), "line": (224, 207, 160), "primary": (184, 124, 24), "secondary": (20, 122, 92), "accent": (49, 86, 200)},
    "cyan": {"bg": (233, 248, 251), "soft": (214, 239, 244), "line": (192, 216, 221), "primary": (23, 132, 153), "secondary": (20, 122, 92), "accent": (216, 81, 53)},
    "violet": {"bg": (241, 237, 255), "soft": (229, 222, 250), "line": (209, 201, 230), "primary": (101, 82, 185), "secondary": (20, 122, 92), "accent": (216, 81, 53)},
}


PRODUCTS = [
    ("career-launch-resume-kit.png", "Career Launch Resume Kit", "Resume Packs", "amber", "resume"),
    ("ai-sales-prompt-library.png", "AI Sales Prompt Library", "Prompt Packs", "blue", "prompts"),
    ("freelancer-proposal-vault.png", "Freelancer Proposal Vault", "Business Kits", "green", "business"),
    ("founder-operating-system.png", "Founder Operating System", "Notion Systems", "green", "business"),
    ("canva-social-launch-pack.png", "Canva Social Launch Pack", "Canva Templates", "coral", "canva"),
    ("small-business-automation-bundle.png", "Small Business Automation Bundle", "Automation Bundles", "cyan", "automation"),
    ("student-productivity-suite.png", "Student Productivity Suite", "Notion Systems", "violet", "business"),
    ("creator-course-builder.png", "Creator Course Builder", "Mini Courses", "blue", "course"),
    ("linkedin-personal-brand-kit.png", "LinkedIn Personal Brand Kit", "Business Kits", "coral", "canva"),
    ("finance-tracker-notion.png", "Finance Tracker Notion", "Notion Systems", "green", "business"),
    ("customer-support-ai-macro-pack.png", "Customer Support AI Macro Pack", "Prompt Packs", "blue", "prompts"),
    ("agency-client-onboarding-kit.png", "Agency Client Onboarding Kit", "Business Kits", "cyan", "automation"),
    ("product-default.png", "Custom Digital Product", "Admin Product", "green", "business"),
]


def main():
    favicon()
    hero_image()
    for filename, title, label, palette, motif in PRODUCTS:
        product_image(filename, title, label, PALETTES[palette], motif)
    print(f"Generated {len(PRODUCTS) + 1} image assets in {OUT}")


if __name__ == "__main__":
    main()

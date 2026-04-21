import coloraide

colors = {
    'primary': '#F97316',
    'primary_hover': '#EA580C',
    'dark_main': '#111827',
    'secondary_text': '#374151',
    'border': '#E5E7EB',
    'light_background': '#F9FAFB',
    'success': '#16A34A',
    'error': '#DC2626'
}

for name, hex_color in colors.items():
    color = coloraide.Color(hex_color)
    oklch = color.convert('oklch')
    l, c, h = oklch.coords()
    print(f'--{name.replace("_", "-")}: oklch({l:.3f} {c:.3f} {h:.1f});')
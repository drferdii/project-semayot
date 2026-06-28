from PIL import Image
img = Image.open('public/semayot/images/sema.png')
print('Mode:', img.mode, 'Size:', img.size)
if img.mode == 'RGBA':
    alpha = img.getchannel('A')
    transparent = sum(1 for p in alpha.getdata() if p < 255)
    total = alpha.size[0] * alpha.size[1]
    print('Transparent pixels: {0} / {1}'.format(transparent, total))
    w,h = img.size
    corners = [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]
    for x,y in corners:
        r,g,b,a = img.getpixel((x,y))
        print('Corner ({0},{1}): rgba({2},{3},{4},{5})'.format(x,y,r,g,b,a))
    cx, cy = w//2, h//2
    r,g,b,a = img.getpixel((cx,cy))
    print('Center ({0},{1}): rgba({2},{3},{4},{5})'.format(cx,cy,r,g,b,a))
    rgb = img.convert('RGB')
    white = sum(1 for p in rgb.getdata() if p == (255,255,255))
    print('Pure white pixels:', white)

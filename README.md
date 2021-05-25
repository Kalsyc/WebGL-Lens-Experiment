# WebGL-Lens-Experiment
A simple HTML5, CSS, VanillaJS and WebGL Webpage to explore blur and distortion effects of lenses

## Resources used
PixiJS (2D WebGL API): [Link](https://www.pixijs.com/)  
Pixi-Viewport (PixiJS Extension): [Link](https://github.com/davidfig/pixi-viewport)

## To run locally
1. Open up Safari
2. Disable Local File Restrictions under "Develop" Tab
3. Drag content.html into Safari

## To build file
1. Install globally these packages via npm: uglifyjs-folder, html-minifier, css-minify (Currently not in use)
2. Comment out the necessary script files in `content.html`
3. Go to the root folder and run `bash build.sh` on Terminal/Command Prompt

## Current Solution

Currently, the blur effect is achieved using 3 sprites of the same image:
1. Bottom layer - External Blurred image outside the ring/user's touch
2. Middle layer - Clear Image
3. Top layer - Blurred image that is masked by the quadrant/semi-circle shaped boundaries

The clear image is masked by `circle` which is overlayed by the top layer which is masked by the `semicircle` sprite. The images are found in `./images` and they are created via Adobe Illustrator. Since PixiJS uses the red channel as the alpha for the masking, the sprite/graphics object to be used as a mask for a sprite must contain some R value in the RGB channel.

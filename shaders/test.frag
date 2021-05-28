uniform sampler2D uSampler;
uniform float sigma;
varying vec2 vTextureCoord;
uniform float blurSize;
uniform float x_vec;
uniform float y_vec;

const float pi = 3.14159265;

const float numBlurPixelsPerSide = 4.0;

void main(void) {
  vec3 incrementalGaussian;
  vec2 blurMultiplyVec = vec2(x_vec, y_vec);
  incrementalGaussian.x = 1.0 / (sqrt(2.0 * pi) * sigma);
  incrementalGaussian.y = exp(-0.5 / (sigma * sigma));
  incrementalGaussian.z = incrementalGaussian.y * incrementalGaussian.y;

  vec4 avgValue = vec4(0.0, 0.0, 0.0, 0.0);
  float coefficientSum = 0.0;

  avgValue += texture2D(uSampler, vTextureCoord.st) * incrementalGaussian.x;
  coefficientSum += incrementalGaussian.x;
  incrementalGaussian.xy *= incrementalGaussian.yz;

  // Go through the remaining 8 vertical samples (4 on each side of the center)
  for (float i = 1.0; i <= numBlurPixelsPerSide; i++) { 
    avgValue += texture2D(uSampler, vTextureCoord.st - i * blurSize * 
                          blurMultiplyVec) * incrementalGaussian.x;         
    avgValue += texture2D(uSampler, vTextureCoord.st + i * blurSize * 
                          blurMultiplyVec) * incrementalGaussian.x;         
    coefficientSum += 2.0 * incrementalGaussian.x;
    incrementalGaussian.xy *= incrementalGaussian.yz;
  }
  avgValue.g = avgValue.r;
  avgValue.b = avgValue.r;

  gl_FragColor = (avgValue * texture2D(uSampler, vTextureCoord.st)) / coefficientSum;
}
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
  float gaussValuesFour[4];
  gaussValuesFour[0] = 0.028532;
  gaussValuesFour[1] = 0.067234;
  gaussValuesFour[2] = 0.124009;
  gaussValuesFour[3] = 0.179043;

  vec4 avgValue = vec4(0.0, 0.0, 0.0, 0.0);

  avgValue += texture2D(uSampler, vTextureCoord.st) * 0.202360;

  for (float i = 1.0; i <= numBlurPixelsPerSide; i++) { 
    avgValue += texture2D(uSampler, vTextureCoord.st - i * 0.0005 * blurMultiplyVec) * gaussValuesFour[int(i) - 1];   
    avgValue += texture2D(uSampler, vTextureCoord.st + i * 0.0005 * blurMultiplyVec) * gaussValuesFour[int(i) - 1]; 
  }
  gl_FragColor = avgValue / 1.0;
}
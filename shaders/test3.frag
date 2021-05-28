uniform float dim;
uniform float kernel;
uniform float min_sigma;
uniform float max_sigma;

varying vec2 vTextureCoord;
uniform vec4 dimensions;
uniform sampler2D uSampler;

const float pi = 3.14159265;
const float numBlurPixelsPerSide = 8.0;

float calculateWeight(float offset, float sd) {
  if (sd <= 0.000001) {
    sd = 0.000001;
  }
  float circle_denom = 1.0 / (sqrt(2.0 * pi * sd * sd));
  float expo = exp(-((offset * offset) / (2.0 * sd * sd)));
  float result = circle_denom * expo;
  if (result > 1.0) {
    return 1.0;
  } else {
    return result;
  }
}

void main(void) {
  vec3 incrementalGaussian;
  
  vec4 avgValue = vec4(0.0, 0.0, 0.0, 0.0);
  float sd = (max_sigma - min_sigma) * vTextureCoord.x;

  avgValue += texture2D(uSampler, vTextureCoord.st) * calculateWeight(0.0, sd);

  for (float i = 1.0; i <= numBlurPixelsPerSide; i++) {
    avgValue += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - i * dim)) * calculateWeight(i, sd);   
    avgValue += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + i * dim)) * calculateWeight(i, sd); 
  }
  gl_FragColor = avgValue;

}
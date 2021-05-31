uniform float pixelSize;
uniform float kernel;
uniform float min_sigma;
uniform float max_sigma;

varying vec2 vTextureCoord;
uniform vec4 dimensions;
uniform sampler2D uSampler;

const float pi = 3.14159265;
const float maxPixelsPerSide = 15.0;

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
  vec4 avgValue = vec4(0.0, 0.0, 0.0, 0.0);
  float sd = (max_sigma - min_sigma) * vTextureCoord.x;
  float remainder = 1.0;
  float current;
  for (float i = 1.0; i <= maxPixelsPerSide; i++) {
    if (i > kernel) {
      break;
    }
    current = calculateWeight(i, sd);
    avgValue += texture2D(uSampler, vec2(vTextureCoord.x - i * pixelSize, vTextureCoord.y)) * current;   
    avgValue += texture2D(uSampler, vec2(vTextureCoord.x + i * pixelSize, vTextureCoord.y)) * current;
    remainder -= current * 2.0;
  }
  avgValue +=  texture2D(uSampler, vTextureCoord.st) * remainder;
  gl_FragColor = avgValue;

}
uniform float uTime;
uniform vec3 uActiveColor;
uniform vec3 uMouse3D;

attribute vec3 aColor;
attribute float aRandom;

varying vec3 vColor;
varying vec2 vUv;
varying float vRandom;

void main() {
    vUv = uv;
    vRandom = aRandom;

    // Retrieve instance position from translation column of instanceMatrix
    vec3 instancePos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);

    // Calculate distance from instance position to the mouse in 3D world space
    float distToMouse = distance(instancePos.xy, uMouse3D.xy);

    // 1. Shift the entire field through the cursor color palette over time
    // We mix the original random particle color with the current active color
    vec3 shiftedColor = mix(aColor, uActiveColor, 0.45);

    // 2. Make nearby particles adopt the cursor color more strongly as they get pushed away
    if (uMouse3D.x > -999.0 && distToMouse < 6.0) {
        float adoptStrength = smoothstep(6.0, 0.0, distToMouse);
        vColor = mix(shiftedColor, uActiveColor, adoptStrength * 0.85);
    } else {
        vColor = shiftedColor;
    }

    // Apply slow GPU float/wave motion based on time
    vec3 pos = position;
    
    float waveX = sin(uTime * 0.5 + instancePos.y * 0.2 + aRandom * 5.0) * 0.15;
    float waveY = cos(uTime * 0.5 + instancePos.x * 0.2 + aRandom * 5.0) * 0.15;
    
    pos.x += waveX;
    pos.y += waveY;

    // Apply instancing transformations
    vec4 localPosition = instanceMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * localPosition;
}

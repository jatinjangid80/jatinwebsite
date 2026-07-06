varying vec3 vColor;
varying vec2 vUv;
varying float vRandom;

void main() {
    // Distance from the center of the particle coordinate space (0.5, 0.5)
    vec2 toCenter = vUv - vec2(0.5);
    float dist = length(toCenter);

    // Subtle glowing particle shape:
    // Core is solid and bright, outer glow is soft and transparent
    float core = smoothstep(0.12, 0.0, dist);
    float outerGlow = smoothstep(0.5, 0.0, dist);
    
    // Combine core intensity and soft halo glow
    float alpha = (core * 0.5 + outerGlow * 0.5) * 0.85;

    // Discard transparent edges to improve GPU performance and prevent visual overlapping issues
    if (alpha < 0.005) {
        discard;
    }

    gl_FragColor = vec4(vColor, alpha);
}

uniform float uTime;

varying vec2 vUv;
float PI = 3.141592653589793238;
void main()
{
    // vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    // gl_PointSize=100.*(1./-mvPosition.z);
    vUv=(uv-vec2(0.5))*0.9 + vec2(0.5);


    vec3 pos = position;

    //Bend img
    pos.y += sin(PI*uv.x)*0.1;
    pos.z += sin(PI*uv.x)*0.1;

    pos.y += sin(uTime)*0.02;
    vUv.y -= sin(uTime)*0.02;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
    
}
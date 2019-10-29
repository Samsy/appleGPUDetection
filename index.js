import * as THREE from 'three'

const w = 1
const h = 1

export default class WebGLTestShader {

	constructor(){


		this.renderer = new THREE.WebGLRenderer()

		this.camera   = new THREE.PerspectiveCamera( 50, 0.5, 0.0001, 1000 );

		let geo = new THREE.PlaneBufferGeometry(2,2)

		this.createMaterial()

		this.renderTarget = new THREE.WebGLRenderTarget( 1,1 , 
			{ minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.UnsignedByteType }
			 );

		this.mesh = new THREE.Mesh(geo, this.material )

		this.scene = new THREE.Scene()

		this.scene.add(this.mesh)

		var res = this.render()
		
		var isIphone7 = res[3] == 35
		
		var isIphone8 = res[3] == 0

	}

	render(){

		this.renderer.setRenderTarget(this.renderTarget)

		this.renderer.render(this.scene, this.camera)

		var read = new Uint8Array( 4 );

		this.renderer.readRenderTargetPixels( this.renderTarget, 0, 0, 1, 1, read );

		this.mesh.geometry.dispose()

		this.mesh.material.dispose()

		this.renderer.dispose()

		this.mesh.geometry = null

		this.mesh.material = null

		this.mesh = null

		this.renderer = null

		return read
	}

	createMaterial(){

		this.material = new THREE.ShaderMaterial({
		    // transparent: true,
		    depthTest: false,
		    depthWrite: false,
		    transparent: false,
		    side: 2,
		    uniforms: {
		       
		    },
		    vertexShader: `

		    	varying float vvv;
		        void main() {

		           vvv = 0.31622776601683794;
		           gl_Position = vec4( position.xy, 0.0,  1.0 );

		        }
		    `,
		    fragmentShader: `


		    uniform sampler2D map;
		   
		    uniform vec3 uColor;
		    varying vec2 vUv;
		    varying float vvv;

		    vec4 EncodeFloatRGBA( float v ) {
		      vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * v;
		      enc = fract(enc);
		      enc -= enc.yzww * vec4(1.0/255.0,1.0/255.0,1.0/255.0,0.0);
		      return enc;
		    }

		    void main() {

		      gl_FragColor = EncodeFloatRGBA(vvv);

		    }
		    `,

		})
	}
}


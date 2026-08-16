'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'

const VERT = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uRes;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p = p * 2.03 + vec3(0.7, 1.3, 2.1);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  vec2 p = vUv * aspect;
  vec2 m = uMouse * aspect;
  float t = uTime * 0.10;

  vec3 q = vec3(
    fbm(p * 1.1 + vec2(0.0, t * 0.6) + m * 0.9),
    fbm(p * 1.1 + vec2(5.2, t * 0.5) + m * 0.7 + 1.3),
    fbm(p * 1.1 + vec2(9.2, t * 0.4) + m * 0.5 + 2.7)
  );
  vec3 r = vec3(
    fbm(p * 1.05 + q.xy * 1.4 + vec2(1.7, 9.2)),
    fbm(p * 1.05 + q.yz * 1.4 + vec2(8.3, 2.8)),
    fbm(p * 1.05 + q.zx * 1.4 + vec2(3.1, 6.7))
  );
  float f = fbm(vec3(r.xy * 1.7 + vec2(t * 0.2, 0.0), r.z + t * 0.25));

  vec3 colPaper = vec3(0.961, 0.969, 0.973);
  vec3 colSage = vec3(0.282, 0.420, 0.345);
  vec3 colAmber = vec3(0.957, 0.722, 0.376);
  vec3 colInk = vec3(0.082, 0.137, 0.176);

  vec3 col = mix(colPaper, colSage, smoothstep(0.25, 0.6, f));
  col = mix(col, colAmber, smoothstep(0.5, 0.85, f) * 0.6);
  col = mix(col, colInk, smoothstep(0.78, 1.0, f) * 0.35);

  float vig = 1.0 - 0.28 * length((vUv - 0.5) * 1.15);
  col *= vig;

  gl_FragColor = vec4(col, 1.0);
}
`

export default function MeshBackground({
	className = '',
	fallback,
}: {
	className?: string
	fallback?: ReactNode
}) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [failed, setFailed] = useState(false)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		// WebGL доступен? (Arc/VM/превью-фреймы могут его блокировать)
		const probe = document.createElement('canvas')
		const supported = Boolean(probe.getContext('webgl2') || probe.getContext('webgl'))
		if (!supported) {
			console.warn('[MeshBackground] WebGL недоступен — использую fallback-фон')
			setFailed(true)
			return
		}

		let running = true
		let raf = 0
		let ro: ResizeObserver | null = null
		let gl: import('ogl').OGLRenderingContext | null = null

		try {
			const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

			const renderer = new Renderer({
				dpr: Math.min(window.devicePixelRatio || 1, 2),
				alpha: true,
				antialias: false,
			})
			gl = renderer.gl
			const canvas = gl.canvas as HTMLCanvasElement
			container.appendChild(canvas)
			canvas.style.position = 'absolute'
			canvas.style.inset = '0'
			canvas.style.width = '100%'
			canvas.style.height = '100%'
			canvas.style.pointerEvents = 'none'

			const geometry = new Triangle(gl)
			const program = new Program(gl, {
				vertex: VERT,
				fragment: FRAG,
				uniforms: {
					uTime: { value: 0 },
					uMouse: { value: [0.5, 0.5] },
					uRes: { value: [1, 1] },
				},
			})
			const mesh = new Mesh(gl, { geometry, program })

			const resize = () => {
				const w = container.clientWidth || 1
				const h = container.clientHeight || 1
				renderer.setSize(w, h)
				program.uniforms.uRes.value = [w, h]
			}
			resize()
			ro = new ResizeObserver(resize)
			ro.observe(container)

			const onPointer = (e: PointerEvent) => {
				const rect = container.getBoundingClientRect()
				program.uniforms.uMouse.value = [
					(e.clientX - rect.left) / rect.width,
					1 - (e.clientY - rect.top) / rect.height,
				]
			}
			window.addEventListener('pointermove', onPointer, { passive: true })

			const start = performance.now()
			const loop = (now: number) => {
				if (!running) return
				if (!reduced) program.uniforms.uTime.value = (now - start) / 1000
				gl!.clearColor(0, 0, 0, 0)
				gl!.clear(gl!.COLOR_BUFFER_BIT)
				renderer.render({ scene: mesh })
				raf = requestAnimationFrame(loop)
			}
			raf = requestAnimationFrame(loop)

			return () => {
				running = false
				cancelAnimationFrame(raf)
				window.removeEventListener('pointermove', onPointer)
				ro?.disconnect()
				;(gl?.canvas as HTMLCanvasElement | undefined)?.remove()
				gl?.getExtension('WEBGL_lose_context')?.loseContext()
			}
		} catch (err) {
			console.warn('[MeshBackground] WebGL init failed:', err)
			running = false
			cancelAnimationFrame(raf)
			ro?.disconnect()
			;(gl?.canvas as HTMLCanvasElement | undefined)?.remove()
			gl?.getExtension('WEBGL_lose_context')?.loseContext()
			setFailed(true)
			return () => {
				running = false
				cancelAnimationFrame(raf)
				ro?.disconnect()
				;(gl?.canvas as HTMLCanvasElement | undefined)?.remove()
				gl?.getExtension('WEBGL_lose_context')?.loseContext()
			}
		}
	}, [])

	return (
		<div ref={containerRef} className={`pointer-events-none absolute inset-0 ${className}`}>
			{failed && fallback}
		</div>
	)
}

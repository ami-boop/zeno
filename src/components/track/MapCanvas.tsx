'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Maximize2, Minimize2 } from 'lucide-react'
import type { LngLatBounds, Map as MapLibreMap, Marker } from 'maplibre-gl'
import type { BusTracking, LiveBusPosition, TrackingStop } from '@/lib/api-contracts'

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'
const MAPLIBRE_VERSION = '6.6.0'
const MAPLIBRE_CSS_URL = `https://cdn.jsdelivr.net/npm/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css`
const MAPLIBRE_JS_URL = `https://cdn.jsdelivr.net/npm/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.mjs`

type MapLibreNamespace = typeof import('maplibre-gl')

let maplibrePromise: Promise<MapLibreNamespace> | null = null

function loadMaplibre(): Promise<MapLibreNamespace> {
	if (!maplibrePromise) {
		maplibrePromise = import(
			/* webpackIgnore: true */
			/* turbopackIgnore: true */
			MAPLIBRE_JS_URL
		) as Promise<MapLibreNamespace>
		maplibrePromise.catch(() => {
			maplibrePromise = null
		})
		if (!document.querySelector(`link[data-maplibre="true"]`)) {
			const link = document.createElement('link')
			link.rel = 'stylesheet'
			link.href = MAPLIBRE_CSS_URL
			link.dataset.maplibre = 'true'
			document.head.appendChild(link)
		}
	}
	return maplibrePromise
}

const COLOR_ROUTE = '#486b58'
const COLOR_INK_SOFT = '#40515c'
const COLOR_LINE = '#dfe5e8'
const COLOR_STUDENT_BG = '#fdf3e0'
const COLOR_STUDENT_BORDER = '#b77a13'
const COLOR_STUDENT_TEXT = '#795313'
const COLOR_BUS = '#f4b860'

type Props = {
	tracking: BusTracking
	expanded?: boolean
	onToggleExpand?: () => void
}

type GeoStop = TrackingStop & { lat: number; lng: number }

const geoStops = (stops: TrackingStop[]): GeoStop[] =>
	stops
		.filter((stop): stop is GeoStop => stop.lat !== null && stop.lng !== null)
		.sort((a, b) => a.order - b.order)

function createStopMarker(stop: GeoStop, isStudent: boolean, yourStopLabel: string): HTMLElement {
	const wrapper = document.createElement('div')
	wrapper.style.display = 'flex'
	wrapper.style.flexDirection = 'column'
	wrapper.style.alignItems = 'center'
	wrapper.style.gap = '4px'
	wrapper.style.pointerEvents = 'auto'
	wrapper.style.cursor = 'default'

	const label = document.createElement('div')
	label.style.display = 'flex'
	label.style.alignItems = 'center'
	label.style.gap = '4px'
	label.style.padding = '3px 9px'
	label.style.borderRadius = '999px'
	label.style.backgroundColor = isStudent ? COLOR_STUDENT_BG : 'rgba(255, 255, 255, 0.95)'
	label.style.border = `1.5px solid ${isStudent ? COLOR_STUDENT_BORDER : COLOR_LINE}`
	label.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.18)'
	label.style.whiteSpace = 'nowrap'
	label.style.fontFamily = 'inherit'
	label.style.fontSize = '11px'
	label.style.fontWeight = '700'
	label.style.color = isStudent ? COLOR_STUDENT_TEXT : COLOR_INK_SOFT
	label.style.lineHeight = '1.2'

	const orderBadge = document.createElement('span')
	orderBadge.textContent = String(stop.order)
	orderBadge.style.display = 'inline-flex'
	orderBadge.style.alignItems = 'center'
	orderBadge.style.justifyContent = 'center'
	orderBadge.style.minWidth = '14px'
	orderBadge.style.height = '14px'
	orderBadge.style.borderRadius = '50%'
	orderBadge.style.fontSize = '9px'
	orderBadge.style.fontWeight = '800'
	orderBadge.style.color = '#ffffff'
	orderBadge.style.backgroundColor = isStudent ? COLOR_STUDENT_BORDER : COLOR_ROUTE

	const nameSpan = document.createElement('span')
	nameSpan.textContent = isStudent ? `${stop.name} · ${yourStopLabel}` : stop.name

	label.appendChild(orderBadge)
	label.appendChild(nameSpan)

	const dot = document.createElement('div')
	dot.style.width = isStudent ? '16px' : '12px'
	dot.style.height = isStudent ? '16px' : '12px'
	dot.style.borderRadius = '50%'
	dot.style.backgroundColor = isStudent ? COLOR_STUDENT_BORDER : '#ffffff'
	dot.style.border = `3px solid ${isStudent ? COLOR_STUDENT_BORDER : COLOR_ROUTE}`
	dot.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.25)'

	wrapper.appendChild(label)
	wrapper.appendChild(dot)
	return wrapper
}

function createBusMarker(): HTMLElement {
	const el = document.createElement('div')
	el.style.width = '36px'
	el.style.height = '36px'
	el.style.display = 'flex'
	el.style.alignItems = 'center'
	el.style.justifyContent = 'center'
	el.style.borderRadius = '50%'
	el.style.background = COLOR_BUS
	el.style.border = '2.5px solid #ffffff'
	el.style.boxShadow = '0 2px 10px rgba(21, 35, 45, 0.45)'
	el.innerHTML =
		'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#15232d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 L20 20 L12 15 L4 20 Z"/></svg>'
	return el
}

export default function MapCanvas({ tracking, expanded = false, onToggleExpand }: Props) {
	const t = useTranslations('Track')
	const containerRef = useRef<HTMLDivElement | null>(null)
	const mapRef = useRef<MapLibreMap | null>(null)
	const busMarkerRef = useRef<Marker | null>(null)
	const libRef = useRef<MapLibreNamespace | null>(null)
	const trackingRef = useRef(tracking)
	trackingRef.current = tracking
	const [failed, setFailed] = useState(false)

	function applyLiveMarker(maplibregl: MapLibreNamespace, map: MapLibreMap, live: LiveBusPosition) {
		const position: [number, number] = [live.lng, live.lat]

		if (!busMarkerRef.current) {
			busMarkerRef.current = new maplibregl.Marker({ element: createBusMarker(), anchor: 'center' })
				.setLngLat(position)
				.addTo(map)
			busMarkerRef.current.getElement().style.zIndex = '500'
		} else {
			busMarkerRef.current.setLngLat(position)
		}

		if (live.heading !== null) {
			busMarkerRef.current.setRotation(live.heading)
		}
	}

	const stopsKey = geoStops(tracking.stops)
		.map((stop) => stop.stopId)
		.join(',')
	const mapKey = `${tracking.trip.tripId}|${tracking.studentStopId ?? ''}|${stopsKey}|${
		tracking.path ? `${tracking.path.length}:${tracking.path[0][0].toFixed(4)}` : 'straight'
	}`

	useEffect(() => {
		const timer = setTimeout(() => mapRef.current?.resize(), 80)
		return () => clearTimeout(timer)
	}, [expanded])

	useEffect(() => {
		let cancelled = false
		const container = containerRef.current
		if (!container) return

		loadMaplibre()
			.then((maplibregl) => {
				if (cancelled || !containerRef.current || containerRef.current !== container) return

				libRef.current = maplibregl
				const current = trackingRef.current
				const stops = geoStops(current.stops)
				if (stops.length === 0) return

				const coordinates: [number, number][] = stops.map((stop) => [stop.lng, stop.lat])
				const lineCoordinates: [number, number][] =
					current.path && current.path.length >= 2 ? current.path : coordinates
				const bounds = coordinates.reduce(
					(acc: LngLatBounds, coord) => acc.extend(coord),
					new maplibregl.LngLatBounds(coordinates[0], coordinates[0]),
				)

				const map = new maplibregl.Map({
					container,
					style: STYLE_URL,
					bounds,
					fitBoundsOptions: { padding: 72 },
					attributionControl: { compact: true },
				})
				mapRef.current = map
				map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

				if (current.live) {
					applyLiveMarker(maplibregl, map, current.live)
				}

				map.on('load', () => {
					if (mapRef.current !== map) return
					if (lineCoordinates.length >= 2) {
						map.addSource('route-line', {
							type: 'geojson',
							data: {
								type: 'Feature',
								properties: {},
								geometry: { type: 'LineString', coordinates: lineCoordinates },
							},
						})
						map.addLayer({
							id: 'route-line-casing',
							type: 'line',
							source: 'route-line',
							layout: { 'line-join': 'round', 'line-cap': 'round' },
							paint: {
								'line-color': '#ffffff',
								'line-width': 8,
								'line-opacity': 0.85,
							},
						})
						map.addLayer({
							id: 'route-line-layer',
							type: 'line',
							source: 'route-line',
							layout: { 'line-join': 'round', 'line-cap': 'round' },
							paint: {
								'line-color': COLOR_ROUTE,
								'line-width': 4.5,
								'line-opacity': 0.9,
							},
						})
					}

					for (const stop of stops) {
						const isStudent = stop.stopId === current.studentStopId
						const marker = new maplibregl.Marker({
							element: createStopMarker(stop, isStudent, t('yourStop')),
							anchor: 'bottom',
						})
							.setLngLat([stop.lng, stop.lat])
							.addTo(map)
						if (isStudent) marker.getElement().style.zIndex = '400'
					}
				})
			})
			.catch(() => {
				if (!cancelled) setFailed(true)
			})

		return () => {
			cancelled = true
			busMarkerRef.current = null
			mapRef.current?.remove()
			mapRef.current = null
		}
	}, [mapKey, t])

	useEffect(() => {
		const live = tracking.live
		const map = mapRef.current
		const maplibregl = libRef.current

		if (!live || !map || !maplibregl) return

		applyLiveMarker(maplibregl, map, live)
	}, [tracking.live])

	if (failed) {
		return (
			<div className="flex h-[320px] w-full items-center justify-center rounded-zeno bg-zeno-paper-soft sm:h-[420px]">
				<p className="text-sm font-medium text-zeno-muted">{t('mapFailed')}</p>
			</div>
		)
	}

	const waitingForBus = !tracking.live

	return (
		<div className="relative flex min-h-0 flex-1 flex-col">
			<div
				ref={containerRef}
				dir="ltr"
				className={`w-full ${expanded ? 'min-h-0 flex-1' : 'h-[55vh] min-h-[320px] sm:h-[420px]'}`}
			/>
			{onToggleExpand ? (
				<button
					type="button"
					onClick={onToggleExpand}
					aria-label={expanded ? t('mapCollapse') : t('mapExpand')}
					className="zeno-focus absolute right-3 top-3 z-[600] flex size-9 items-center justify-center rounded-full border border-zeno-line bg-white/90 shadow-sm backdrop-blur-sm transition hover:bg-white"
				>
					{expanded ? <Minimize2 className="size-4 text-zeno-ink-soft" /> : <Maximize2 className="size-4 text-zeno-ink-soft" />}
				</button>
			) : null}
			{waitingForBus ? (
				<div
					dir="ltr"
					className="absolute left-3 top-3 z-[600] flex items-center gap-2 rounded-full border border-zeno-line bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm"
				>
					<span className="relative flex size-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zeno-amber opacity-70" />
						<span className="relative inline-flex size-2 rounded-full bg-zeno-amber" />
					</span>
					<span dir="auto" className="text-xs font-semibold text-zeno-ink-soft">
						{t('waitingForBus')}
					</span>
				</div>
			) : null}
		</div>
	)
}

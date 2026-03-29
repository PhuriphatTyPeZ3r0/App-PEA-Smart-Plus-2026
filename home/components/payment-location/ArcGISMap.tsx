"use client";

import { useEffect, useMemo, useRef } from "react";

declare global {
  interface Window {
    require?: (...args: unknown[]) => void;
    __arcgisLoadingPromise?: Promise<void>;
  }
}

type Marker = {
  id: string;
  lat: number;
  lon: number;
  iconUrl: string;
};

type Props = {
  center: { lat: number; lon: number; zoom?: number };
  markers: Marker[];
  userLocation?: { lat: number; lon: number } | null;
  filterLocation?: { lat: number; lon: number } | null;
  selectedMarkerId?: string | null;
  onMarkerClick?: (id: string) => void;
};

const MAP_SERVER_URL =
  "https://map.pea.co.th/arcgis/rest/services/PEA_VECTOR_CACHE/MapServer";

function loadArcGis(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (typeof (window as Window & { require?: unknown }).require === "function") return Promise.resolve();
  if (window.__arcgisLoadingPromise) return window.__arcgisLoadingPromise;

  window.__arcgisLoadingPromise = new Promise<void>((resolve, reject) => {
    const existingCss = document.querySelector<HTMLLinkElement>('link[data-arcgis-css="true"]');
    if (!existingCss) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://js.arcgis.com/4.31/esri/themes/light/main.css";
      css.dataset.arcgisCss = "true";
      document.head.appendChild(css);
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-arcgis-script="true"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("ArcGIS script failed")), {
        once: true,
      });
      return;
    }

    const nextScript = document.createElement("script");
    nextScript.src = "https://js.arcgis.com/4.31/";
    nextScript.async = true;
    nextScript.dataset.arcgisScript = "true";
    nextScript.onload = () => resolve();
    nextScript.onerror = () => reject(new Error("ArcGIS script failed"));
    document.body.appendChild(nextScript);
  });

  return window.__arcgisLoadingPromise;
}

function resolveIconUrl(iconUrl: string): string {
  if (typeof window === "undefined") return iconUrl;
  try {
    return new URL(iconUrl, window.location.origin).toString();
  } catch {
    return iconUrl;
  }
}

export default function ArcGISMap({
  center,
  markers,
  userLocation,
  filterLocation,
  selectedMarkerId,
  onMarkerClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<any>(null);
  const viewReadyRef = useRef<Promise<void> | null>(null);
  const modulesRef = useRef<any>(null);
  const serviceLayerRef = useRef<any>(null);
  const userLayerRef = useRef<any>(null);
  const filterLayerRef = useRef<any>(null);
  const onMarkerClickRef = useRef<typeof onMarkerClick>(onMarkerClick);
  const drawTokenRef = useRef(0);

  const markersKey = useMemo(
    () =>
      JSON.stringify(
        markers.map((marker) => ({
          id: marker.id,
          lat: marker.lat,
          lon: marker.lon,
          iconUrl: marker.iconUrl,
        })),
      ),
    [markers],
  );

  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  useEffect(() => {
    let destroyed = false;

    async function initialize() {
      await loadArcGis();
      if (destroyed || !containerRef.current || !window.require) return;

      window.require(
        [
          "esri/Map",
          "esri/views/MapView",
          "esri/Basemap",
          "esri/layers/TileLayer",
          "esri/layers/GraphicsLayer",
          "esri/Graphic",
          "esri/symbols/PictureMarkerSymbol",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/SimpleLineSymbol",
        ],
        (
          Map: any,
          MapView: any,
          Basemap: any,
          TileLayer: any,
          GraphicsLayer: any,
          Graphic: any,
          PictureMarkerSymbol: any,
          SimpleMarkerSymbol: any,
          SimpleLineSymbol: any,
        ) => {
          if (destroyed || !containerRef.current) return;

          modulesRef.current = {
            Graphic,
            PictureMarkerSymbol,
            SimpleMarkerSymbol,
            SimpleLineSymbol,
          };

          const tileLayer = new TileLayer({ url: MAP_SERVER_URL });
          const basemap = new Basemap({ baseLayers: [tileLayer] });
          const map = new Map({ basemap });

          const serviceLayer = new GraphicsLayer();
          const filterLayer = new GraphicsLayer();
          const userLayer = new GraphicsLayer();
          map.addMany([serviceLayer, filterLayer, userLayer]);

          serviceLayerRef.current = serviceLayer;
          filterLayerRef.current = filterLayer;
          userLayerRef.current = userLayer;

          const view = new MapView({
            container: containerRef.current,
            map,
            center: [center.lon, center.lat],
            zoom: center.zoom ?? 13,
            ui: { components: [] },
          });

          viewRef.current = view;
          viewReadyRef.current = view.when();

          view.on("click", async (event: any) => {
            const hit = await view.hitTest(event);
            const result = hit.results?.find((entry: any) => entry.graphic?.attributes?.markerId);
            const markerId = result?.graphic?.attributes?.markerId;
            if (markerId && onMarkerClickRef.current) {
              onMarkerClickRef.current(String(markerId));
            }
          });
        },
      );
    }

    initialize().catch((error) => {
      console.error("ArcGIS init error", error);
    });

    return () => {
      destroyed = true;
      drawTokenRef.current += 1;
      viewReadyRef.current = null;
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    const mods = modulesRef.current;
    const serviceLayer = serviceLayerRef.current;
    const userLayer = userLayerRef.current;
    const filterLayer = filterLayerRef.current;
    const viewReady = viewReadyRef.current;

    if (!view || !mods || !serviceLayer || !userLayer || !filterLayer || !viewReady) return;

    const { Graphic, PictureMarkerSymbol, SimpleMarkerSymbol, SimpleLineSymbol } = mods;
    const currentDrawToken = ++drawTokenRef.current;

    void (async () => {
      await viewReady;
      if (drawTokenRef.current !== currentDrawToken) return;

      serviceLayer.removeAll();
      userLayer.removeAll();
      filterLayer.removeAll();

      const serviceGraphics: any[] = [];

      markers.forEach((marker) => {
        const pointGeometry = {
          type: "point",
          longitude: marker.lon,
          latitude: marker.lat,
          spatialReference: { wkid: 4326 },
        };

        if (marker.id === selectedMarkerId) {
          serviceGraphics.push(
            new Graphic({
              geometry: pointGeometry,
              symbol: new SimpleMarkerSymbol({
                style: "circle",
                color: [255, 255, 255, 0.98],
                size: 40,
                outline: new SimpleLineSymbol({ color: "#7e22ce", width: 3 }),
              }),
              attributes: { markerId: marker.id, markerKind: "selected-ring" },
            }),
          );
        }

        serviceGraphics.push(
          new Graphic({
            geometry: pointGeometry,
            symbol: new PictureMarkerSymbol({
              url: resolveIconUrl(marker.iconUrl),
              width: marker.id === selectedMarkerId ? "24px" : "22px",
              height: marker.id === selectedMarkerId ? "24px" : "22px",
            }),
            attributes: { markerId: marker.id, markerKind: "icon" },
          }),
        );
      });

      if (serviceGraphics.length > 0) {
        serviceLayer.addMany(serviceGraphics);
      }

      if (filterLocation) {
        filterLayer.add(
          new Graphic({
            geometry: {
              type: "point",
              longitude: filterLocation.lon,
              latitude: filterLocation.lat,
              spatialReference: { wkid: 4326 },
            },
            symbol: new SimpleMarkerSymbol({
              style: "circle",
              color: "#f97316",
              size: 18,
              outline: new SimpleLineSymbol({ color: "#ffffff", width: 2 }),
            }),
          }),
        );
      }

      if (userLocation) {
        userLayer.addMany([
          new Graphic({
            geometry: {
              type: "point",
              longitude: userLocation.lon,
              latitude: userLocation.lat,
              spatialReference: { wkid: 4326 },
            },
            symbol: new SimpleMarkerSymbol({
              style: "circle",
              color: [37, 99, 235, 0.16],
              size: 34,
              outline: new SimpleLineSymbol({ color: [37, 99, 235, 0.3], width: 1.5 }),
            }),
          }),
          new Graphic({
            geometry: {
              type: "point",
              longitude: userLocation.lon,
              latitude: userLocation.lat,
              spatialReference: { wkid: 4326 },
            },
            symbol: new SimpleMarkerSymbol({
              style: "circle",
              color: "#2563eb",
              size: 14,
              outline: new SimpleLineSymbol({ color: "#ffffff", width: 3 }),
            }),
          }),
        ]);
      }
    })();
  }, [markersKey, userLocation, filterLocation, selectedMarkerId, markers]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.goTo({ center: [center.lon, center.lat], zoom: center.zoom ?? 13 }).catch(() => undefined);
  }, [center.lat, center.lon, center.zoom]);

  return <div ref={containerRef} className="payment-location-map h-full w-full" />;
}

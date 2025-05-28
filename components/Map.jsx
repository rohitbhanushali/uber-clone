import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import mapboxgl from "!mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Map({ pickup, dropoff }) {
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [75.8366318, 25.1389012],
            zoom: 3
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add markers and route when coordinates are available
        if (pickup && pickup.length === 2) {
            addMarker(map, pickup, 'pickup');
        }

        if (dropoff && dropoff.length === 2) {
            addMarker(map, dropoff, 'dropoff');
        }

        // Fit bounds when both coordinates are available
        if (pickup && pickup.length === 2 && dropoff && dropoff.length === 2) {
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend(pickup);
            bounds.extend(dropoff);
            map.fitBounds(bounds, {
                padding: 60,
                maxZoom: 15
            });

            // Add route between points
            addRoute(map, pickup, dropoff);
        }

        // Cleanup
        return () => map.remove();
    }, [pickup, dropoff]);

    const addMarker = (map, coordinates, type) => {
        const el = document.createElement('div');
        el.className = `marker ${type}`;
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundImage = `url(https://img.icons8.com/ios-filled/50/${type === 'pickup' ? '00ff00' : 'ff0000'}/marker.png)`;
        el.style.backgroundSize = 'cover';

        new mapboxgl.Marker(el)
            .setLngLat(coordinates)
            .addTo(map);
    };

    const addRoute = async (map, start, end) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
            );
            const data = await response.json();

            if (data.routes && data.routes[0]) {
                const route = data.routes[0].geometry;
                
                map.addSource('route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: route
                    }
                });

                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#3b82f6',
                        'line-width': 4
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    };

    return <Wrapper id="map"></Wrapper>;
}

const Wrapper = tw.div`
    flex-1 h-1/2
`;
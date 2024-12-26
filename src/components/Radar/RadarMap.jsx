import React from 'react';
import Radar from 'radar-sdk-js';

import 'radar-sdk-js/dist/radar.css';

class RadarMap extends React.Component {
    componentDidMount() {
        Radar.initialize('prj_live_pk_a33cf96acac92d57124a86d0b9f293b3d9c38d26');

        // create a map
        const map = Radar.ui.map({
            container: 'map',
            style: 'radar-default-v1',
            center: [74.15925, 33.77910],
            zoom: 10.24294,

        });

        // add a marker to the map
        Radar.ui.marker({ text: 'Radar HQ' })
            .setLngLat([74.09417, 33.76882])
            .addTo(map);
    }

    render() {
        return (
            <div id="map-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: '100vw', height: '100vh', position: 'relative' }}>
                <div id="map" style={{ height: '100%', position: 'relative', width: '90vw' }} />
            </div>
        );
    }
}

export default RadarMap;
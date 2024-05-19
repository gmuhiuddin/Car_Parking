import React from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function MapComponent({ longitude, latitude}) {
  return (
      <Map
      mapboxAccessToken="pk.eyJ1IjoiYmVuZWhta2UiLCJhIjoiY2plYTl6b3c2MHg5ODJxbGV4aXR4Z3p6YSJ9.d3jSAbsqSmpJwyVcp9iXbw"
      initialViewState={{
        longitude: longitude,
        latitude: latitude,
        zoom: 10
      }}
      style={{ width: '29em', height: '27em' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <Marker
        draggable={false}
        longitude={longitude} latitude={latitude} anchor="bottom" >
        <img height={30} src="https://images.ctfassets.net/3prze68gbwl1/assetglossary-17su9wok1ui0z7w/c4c4bdcdf0d0f86447d3efc450d1d081/map-marker.png" />
      </Marker>
    </Map>
  )
}

export default MapComponent;
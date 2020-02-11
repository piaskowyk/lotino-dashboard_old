import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import "../../style/info.css"
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

class MapComponent extends Component{
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,

      position: {
        lat: 50.1261338,
        lng: 19.7922355,
      },
      zoom: 13,
      search: ''
    };
  }
  
  componentDidMount() {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.on('zoomend', () => {
        this.setState({
          zoom: leafletMap.getZoom()
        });
    });
  }

  updatePosition = (e) => {
    this.props.onChange(e.target._latlng.lat, e.target._latlng.lng);
  }
  
  searchInput() {
    return fetch(
      "https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=pl&q=" + this.state.search, 
      {
        method: "GET"
      }
  )
  .then(response => response.json())
  .then(data => {
      if(data.length) {
        let positionData = data[0];
        this.props.onChange(positionData.lat, positionData.lon);
      }
  });
  }

  render() {
		const position = [this.props.value.lat, this.props.value.lon];
		
		return (
			<div className="inputGroup">
        <div className="inputTiele">Mapa</div>
				<div className="inputDescription">Wybierz lokalizacje swojej restauracji na mapie, przeciągnij znaczik na odpowiednią lokalizację</div>
        <div className="labelButton">
          <input
            type={`${typeof this.state.type === 'undefined' ? "text" : this.state.type}`}
            className="standardInput mapSearchInput"
            placeholder="Podaj adress"
            value={this.state.search}
            onChange={e => this.setState({search: e.target.value})}
          />
          <div className="standardBtn" onClick={() => this.searchInput()}><span>Szukaj</span></div>
        </div>

        <div className="mapHolder">
				<Map center={position} zoom={this.state.zoom} ref={m => { this.leafletMap = m; }}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={position}
          draggable={true}
          onDragend={(e) => this.updatePosition(e)}
        >
          <Popup>
            Lokalizacja Twojej restauracji
          </Popup>
        </Marker>
      </Map>
      </div>
			</div>
		);
  }
}
export default MapComponent;

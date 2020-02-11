import React, { Component } from "react";
import { Map, TileLayer} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "./../style/map_styles.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import "./../style/info.css"
import Name from "../components/info/StandartInput"
import Menu from "../components/info/Menu";
import Description from "../components/info/Description";
import Places from "../components/info/Places";
import axios from "axios";
import Cookies from 'js-cookie';
import { Redirect } from "react-router-dom";
import Previews from "../components/info/Previews"

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

class AddInfo extends Component {
    constructor(props) {
        super(props);
        this.state ={
            lat: 49.780990,
            lng: 22.768193,
            zoom: 10,
            name: "",
            address: "",
            desc: "",
            places: "",
            menu: "",
            updated: false,
        };
    }
    markers = [];

    removeExistingMarkers(){
        const map = this.leafletMap.leafletElement;
        this.markers.forEach(marker => {
            if (marker)
                map.removeLayer(marker);
        });
    }

    componentDidMount() {
        const map = this.leafletMap.leafletElement;
        const geocoder = L.Control.Geocoder.nominatim();
        let marker;

        map.on("click", e => {
          this.removeExistingMarkers();  
          geocoder.reverse(
            e.latlng,
            map.options.crs.scale(map.getZoom()),
            results => {
              var r = results[0];
              if (r) {
                  marker = L.marker(r.center)
                    .bindPopup(r.name)
                    .addTo(map)
                    .openPopup();
                  this.markers.push(marker);
                  this.setState({
                      lat: e.latlng.lat,
                      lon: e.latlng.lng,
                      address: r.name
                  }); 
              }
            }
          );
        });
    }

    // handleImg(e) {
    //     e.preventDefault();
    //     document.getElementById("preview").remove();
    //     let files = e.target.files;
    //     let output = document.getElementById("imgs");
    //     let parentDiv = document.createElement("div");
    //     parentDiv.setAttribute("id", "preview");
    //     parentDiv.setAttribute("class", "preview-div");
    //     output.insertBefore(parentDiv, null);
    //     output = parentDiv;
    //     for (var i = 0; i < files.length; i++) {
    //         let file = files[i];
    //         let reader = new FileReader();
    //         reader.addEventListener("load", function (event) {
    //             let picFile = event.target;
    //             let div = document.createElement("div");
    //             div.setAttribute("class", "image-container");
    //             div.innerHTML = "<img class='preview' src='" + picFile.result + "'" + "title='" + file.name + "'/>";
    //             output.insertBefore(div, null);
    //         });
    //         //Read the image
    //         reader.readAsDataURL(file);
    //     }
    // }

    handleAddressInput(e){
        const map = this.leafletMap.leafletElement;
        const geocoder = L.Control.Geocoder.nominatim();
        this.removeExistingMarkers();
        geocoder.geocode(e.target.value, results => {    
            map.options.crs.scale(map.getZoom());
            var r = results[0];
            if (r){  
                let marker = L.marker(r.center)
                    .bindPopup(r.name)
                    .addTo(map)
                    .openPopup();
                this.markers.push(marker);
            }
        });   
        this.setState({address : e.target.value});
    } 

    onSubmitHandler = (e) => {
        e.preventDefault();
         axios.post('https://lotino-dev.herokuapp.com/api/v1/restaurant_owner/restaurant/add/',{
            name: this.state.name,
            description: this.state.desc,
            lat: this.state.lat,
            lon: this.state.lng,
            address: this.state.address,
            menu: this.state.menu,
            max_places: this.state.places,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${Cookies.get('csrftoken')}`,
            },
        }).then(res=>{
            console.log(res);
            // this.props.history.push({
            //     pathname: '/dashboard/',
            //     state: {message: "Pomyślnie dodano informacje! Dziękujemy, że jesteście z nami."}
            // });
            this.setState({
                updated: true
            })
        }).catch(error=>{
            console.log(error);
            return (alert("Wystąpił nieoczekiwany błąd!\n"));
        });
    }
    
    render() {
        if (this.state.updated)
            return <Redirect to = "/dashboard/"/>
        const position = [this.state.lat, this.state.lng];
        return (
            <div className="main-container">
                <h3>Wprowadź dane o swojej restauracji:</h3>
                <form>
                    <Name name=""></Name>
                    <div className="row">
                        <div className="col-10">
                            <label htmlFor="addr">Adres:</label>
                        </div>
                        <div className="col-90">
                            <input className="input-info" id="addr" size="50" value={this.state.address} 
                                placeholder="Podaj adres lub wybierz punkt klikając na mapę..."
                                onChange={this.handleAddressInput.bind(this)}/> 
                        </div>    
                    </div>
                    <Map className="map" center={position} zoom={this.state.zoom}
                            ref={m => {
                                this.leafletMap = m;
                            }}>
                        <TileLayer
                            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"/>
                    </Map>
                    <Menu></Menu>     
                    <Description></Description>                
                    <Places places={0}></Places>
                    {/* <div className="row">
                        <div className="col-10">
                            <label htmlFor="photos">Zdjęcia:</label>
                        </div>
                        <div className="col-90" id="imgs">
                            <div className="previewComponent">
                                <input className="fileInput" 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e)=>this.handleImg(e)} multiple/>
                                <div className="imgPreview" id="preview">

                                </div>
                            </div>        
                        </div>
                    
                    </div> */}
                   <Previews></Previews>
                    <div className="row">
                        <input onClick={(e)=>this.onSubmitHandler(e)} 
                               className="submit" type="submit" value="Dodaj informacje"></input>
                    </div>

                </form>
               
            </div>  
        
        );
    }
}
export default AddInfo;
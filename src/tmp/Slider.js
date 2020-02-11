import React, { Component } from 'react'
import left_arrow from '../../imgs/left_arrow.png';
import right_arrow from '../../imgs/right_arrow.png';
import "../../style/slider.css"

export default class Slider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      images: [
        "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/aurora.jpg",
        "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/canyon.jpg",
        "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/city.jpg",
        "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/desert.jpg",
        "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/mountains.jpg",
        "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/redsky.jpg",
        "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/sandy-shores.jpg",
      ],
      currentIndex: 0,
      imagesGivenSize: 0
    }
  }

  componentWillMount(){
    this.setState({
      imagesGivenSize: this.state.images.length
    })
  }

  previous() {
    if(this.state.currentIndex === 0) {
      return this.setState({
        currentIndex: this.state.images.length - 1,
      })
    }
    this.setState(prevState => ({
      currentIndex: prevState.currentIndex - 1,
    }));
  }

  next(){
    if(this.state.currentIndex === this.state.images.length - 1) {
      return this.setState({
        currentIndex: 0,
      })
    }
    this.setState(prevState => ({
      currentIndex: prevState.currentIndex + 1,
    }));
  }

    handleImgInput(e) {
      e.preventDefault();
      let files = e.target.files;
      let images = this.state.images;
      while (images.length > this.state.imagesGivenSize){
          images.pop();
      }
      this.setState({
          images: images  
      })  
      for (var i = 0; i < files.length; i++) {
          let file = files[i];
          let reader = new FileReader();
          reader.addEventListener("load", function (event) {
              let picFile = event.target;
              images.push(picFile.result);
          });
          this.setState({
              images: images  
          })          
          reader.readAsDataURL(file);
      }
    }

  changeSlide(index){
    this.setState({
      currentIndex: index
    })
  }

  slideWidth = () => {
     return document.querySelector('.slide').clientWidth
  }

  render() {
    return (
      <div>
         <div className="slider">
            <div onClick={this.previous.bind(this)} className="left-arrow">
                <img src={left_arrow}/>
            </div>
            <div className="slider-wrapper">
              <div className="slide"> 
                <img className="preview" src={this.state.images[this.state.currentIndex]}/>
              </div>
            </div>
            <div onClick={this.next.bind(this)} className="right-arrow">
              <img src={right_arrow} />
            </div>
            <div className="indicators">
              <ul>
                  {this.state.images.map((image, index) => (
                  <li onClick={() => this.changeSlide(index)} 
                      className={this.state.currentIndex === index ? 'active' : 'unactive'}  
                      key={index}>{index + 1} </li>
                  ))}
              </ul>
            </div>
        </div>
            <div>Dodaj kolejne zdjęcia:
              <div>
                <input className="fileInput" type="file" accept="image/*" multiple
                       onChange={(e) => this.handleImgInput(e)}/>
                </div>                    
            </div>
        </div>

    );
  }
}
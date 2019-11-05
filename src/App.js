import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.width = 512;
    this.height = 512;
    this.image = new Image();
    this.state = {
      file1: '', //back
      file2: '', //front
      mouse: [0,0],
      rects: []
    }
  }
updateAnimationState() {
  this.setState(prevState => ({ angle: prevState.angle + 1 }));
  this.rAF = requestAnimationFrame(this.updateAnimationState);
}

drawImage (data, offset = [0, 0]) {
  if (! data) return
  const ctx = this.refs.canvas.getContext('2d');
  this.image.setAttribute('src', data)
  ctx.drawImage(this.image, offset[0], offset[1], 512, 512);
}

drawBGwindow (data, offset) {
  const ctx = this.refs.canvas.getContext('2d');
  this.image.setAttribute('src', data)
  ctx.drawImage(this.image, offset[0], offset[1], 50, 50,
                offset[0], offset[1], 50, 50
  );
}

drawImages() {
   if(! this.refs.canvas) return
   const ctx = this.refs.canvas.getContext('2d');
   ctx.clearRect(0, 0, 512, 512);

   this.drawImage(this.state.file1) //draw back

   //window.x = this.refs.canvas
   let bg = this.refs.canvas.toDataURL()

   this.drawImage(this.state.file2) //draw front

   this.state.rects
   .forEach((dimensions) => this.drawBGwindow(bg, dimensions)) //back

   this.drawBGwindow(bg, this.state.mouse) //back
 }

  moveRect = (e) => {
    var rect = e.target.getBoundingClientRect();
    this.setState({'mouse': [e.clientX - rect.left,e.clientY - rect.top]})
  }

  leaveRect = (e) => {
    var rect = e.target.getBoundingClientRect();
    let rects = this.state.rects
    let pos = [e.clientX - rect.left, e.clientY - rect.top]
    this.setState({'rects': rects.concat([pos]) })
  }

  handleChange = (event) => {
    let state = {}, id = event.target.id

    this.loadImage(event.target.files[0], (dataUrl) => {
      state[id] = dataUrl
      this.setState(state)
    })
  }

  loadImage(file, fn) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload =  (event) => {
        let dataUrl = event.target.result;
        //console.log(dataUrl)
        this.image.src = dataUrl;
        this.image.onload = function () {
            fn(dataUrl);
        };
    };
}

  render() {
    window.requestAnimationFrame(this.drawImages.bind(this))

    return (
      <div className="App">
        <header className="App-header">
        <input onChange={this.handleChange}  id="file1" type="file" value="" />
        <input onChange={this.handleChange} id="file2" type="file" value="" />

        <canvas width="500px"
                height="500px"
                ref="canvas"
                onMouseMove={this.moveRect}
                onMouseDown={this.leaveRect}
                ></canvas>
        </header>
      </div>
    );
  }

}

export default App;

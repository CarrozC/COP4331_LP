import React, {useState, useEffect, useRef} from "react"; 
import './LandingPage.css'; 

const VideoPlayer: React.FC = () => {

    return (
      <div>
        <video
          autoPlay
          muted
          loop
          id="background-video-1"
        >
          <source src="/videos/OnionFootage.mp4" type="video/mp4" />
        </video>
      </div>
    );
  };
  

export default VideoPlayer; 
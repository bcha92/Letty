import React from "react";
import styled from "styled-components";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import NoPreview from "./no-preview.jpeg";
// requires a loader

const ImageCarousel = ({images=[]}) => {
    return <CarouselWrap
        showArrows={true}
        width="400px"
        useKeyboardArrows={true}
        autoPlay={true}
        showThumbs={false}
    >
        {// Carousel Rendering for Property Images in Property Details
        // Still no way to adequately updload them and convert to Base64
        images.length === 0 ?
            <div>
            <img src={NoPreview} alt="no preview" style={{
                width: "300px"
            }} />
        </div> :
        images.map((image, index) =>
        <div key={`image_${index}`}>
            <img src={image} alt={`image_${index}`} style={{
                width: "400px"
            }} />
        </div>)}
    </CarouselWrap>
};

const CarouselWrap = styled(Carousel)`
    margin: 20px 0;
`;

export default ImageCarousel;
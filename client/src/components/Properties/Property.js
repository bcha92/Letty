import React from "react";
import { useParams } from "react-router";
import styled from "styled-components";

// Property Details Component
const PropertyDetail = () => {
    // Property ID parameter
    const { propertyId } = useParams();
    console.log(propertyId);

    return <PropertyWrapper>
        Property Detail
    </PropertyWrapper>
};

// Styled Copmonents
const PropertyWrapper = styled.div``;

export default PropertyDetail;
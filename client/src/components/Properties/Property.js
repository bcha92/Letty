import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";

// Error Page Import
import ErrorSplash from "../Error";

// Property Details Component
const PropertyDetail = ({ PORT }) => {
    // Property ID parameter
    const { propertyId } = useParams();

    // Get a Location in Detail
    const [property, setProperty] = useState(null);
    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch(PORT + `/properties/${propertyId}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                setLoaded(true);
            }
            setProperty(data);
        })}, [PORT, propertyId])

    console.log(property);

    return isLoaded ?
    <PropertyWrapper>
        <PropertyInfo>
            <h2>{property.data.name}</h2>
            <h3>
                {property.data.address}
                {property.data.suite.length !== 0 && ", " + property.data.suite}
            </h3>

            <p>Property ID: {property.data._id}</p>
            <p>Description: {property.data.description}</p>
            <p>Restrictions: {property.data.restrictions}</p>
        </PropertyInfo>
    </PropertyWrapper> :
    property === null ?
    <PropertyWrapper>
        <h2>Loading</h2>
    </PropertyWrapper> :
    <ErrorSplash />
};

// Styled Copmonents
const PropertyWrapper = styled.div`
    display: flex;
    flex-flow: column wrap;
`;

const PropertyInfo = styled(PropertyWrapper)`
    padding: 20px;
`;

export default PropertyDetail;
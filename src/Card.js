import React from 'react';

const Card = ({name, image}) => {
    return (
        <img src={image} alt={name}></img>
    )
}

export default Card;
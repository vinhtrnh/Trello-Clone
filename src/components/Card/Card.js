import React from "react";

import './Card.scss';

function Card(props) {
    const { card } = props
    return (
        <li className="cart-item">
            {card.cover && <img className="card-cover" src={card.cover} alt="card.title"></img>}
            {card.title}
        </li>
    )
}

export default Card
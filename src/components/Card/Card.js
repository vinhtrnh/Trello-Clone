import React from 'react'

import './Card.scss'

function Card(props) {
  const { card } = props
  return (
    <div className="cart-item">
      {card.cover && <img className="card-cover" draggable="false" src={card.cover} alt="card.title"></img>}
      {card.title}
    </div>
  )
}

export default Card
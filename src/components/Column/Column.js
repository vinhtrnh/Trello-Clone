import Card from 'components/Card/Card'
import React, { useCallback, useEffect, useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { applyDrag } from 'utilities/dragDrop'
import Dropdown from 'react-bootstrap/Dropdown'
import './Column.scss'
import { mapOrder } from 'utilities/sorts'
import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { Form } from 'react-bootstrap'
import { selectAllInlineText, saveContentAfterEnter } from 'utilities/contentEditable'

function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toggleshowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [columnTitle, setColumnTitle] = useState('')
  const handleColumnTitleChange = useCallback((e) => setColumnTitle(e.target.value), [])
  const handleColumnTitleBlur = () => {
    const newColumns = {
      ...column,
      title: columnTitle
    }
    onUpdateColumn(newColumns)
  }

  useEffect(( ) => {
    setColumnTitle(column.title)
  }, [column.title])

  const onConfirmModalAction = (type) => {

    if (type === 'MODAL_ACTION_CONFIRM') {
      const newColumns = {
        ...column,
        _destroy: true
      }
      onUpdateColumn(newColumns)
    }
    toggleshowConfirmModal()
  }


  return (
    <div className='column'>
      <header className='column-drag-handle'>

        <div className='column-title'>

          <Form.Control size="sm"
            type="text"
            placeholder="Enter Column Title..."
            className='title-content-editable app-title-content-editable'
            value={columnTitle}
            spellCheck="false"
            onClick={selectAllInlineText}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onKeyDown={saveContentAfterEnter}
            onMouseDown={e => e.preventDefault()}
            // onKeyDown={event => (event.key === 'Enter' ) && addNewColumn()}
          />
        </div>
        <div className='column-dropdown-action'>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" size="sm" className='dropdown-btn' />

            <Dropdown.Menu>
              <Dropdown.Item >Add Card... </Dropdown.Item>
              <Dropdown.Item onClick={toggleshowConfirmModal} >Remove Column...</Dropdown.Item>
              <Dropdown.Item >Move all cards in this column ( beta )</Dropdown.Item>
              <Dropdown.Item >Archive all cards ( beta )</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

      </header>

      <div className="card-list">

        <Container

          orientation="vertical"
          groupName="col"
          onDrop={dropResult => onCardDrop(column.id, dropResult )}
          getChildPayload={index => cards[index]}
          dragClass='card-ghost'
          dropClass='card-ghost-drop'
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'cards-drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >

          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}

        </Container>

      </div>
      <footer>
        <div className='footer-actions'>
          <i className='fa fa-plus icon'></i>Add new card
        </div>
      </footer>

      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title='Remove Column'
        content ={` Are you sure you want to remove <strong> ${column.title}</strong>.! <br> All related cards will also be removed !!!`}
      ></ConfirmModal>
    </div>


  )
}

export default Column
import Card from 'components/Card/Card'
import React, { useEffect, useState, useLayoutEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { applyDrag } from 'utilities/dragDrop'
import Dropdown from 'react-bootstrap/Dropdown'
import './Column.scss'
import { mapOrder } from 'utilities/sorts'
import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { Form, Button } from 'react-bootstrap'
import { selectAllInlineText, saveContentAfterEnter } from 'utilities/contentEditable'
import { cloneDeep } from 'lodash'
function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toggleshowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [columnTitle, setColumnTitle] = useState('')
  const handleColumnTitleChange = (e) => setColumnTitle(e.target.value)
  const handleColumnTitleBlur = () => {
    const newColumns = {
      ...column,
      title: columnTitle
    }
    onUpdateColumn(newColumns)
  }

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const newCardTextAreaRef = useRef(null)

  const [newCardTitle, setNewCardTitle] = useState('')
  const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value)

  useLayoutEffect(( ) => {
    setColumnTitle(column.title)
  }, [column.title])

  useLayoutEffect(() => {
    if (newCardTextAreaRef && newCardTextAreaRef.current) {
      newCardTextAreaRef.current.focus()

    }
  }, [openNewCardForm])

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

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextAreaRef.current.focus()
      newCardTextAreaRef.current.select()
      return
    }
    const newCardToAdd = {
      id: Math.random().toString(36).substr(2, 5), // random 5 characters, will remove when we implement call api,
      boardId: column.boardId,
      columnId: column.id,
      title: newCardTitle.trim(),
      cover: null
    }

    let newColumn = cloneDeep(column)

    newColumn.cards.push(newCardToAdd)
    newColumn.cardOrder.push(newCardToAdd.id)
    onUpdateColumn(newColumn)
    setNewCardTitle('')
    toggleOpenNewCardForm()
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
              <Dropdown.Item onClick={toggleOpenNewCardForm} >Add Card... </Dropdown.Item>
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


        {openNewCardForm &&
         <div className='add-new-card-area'>
           <Form.Control size="sm"
             as="textarea"
             row="3"
             placeholder="Enter a title for this card.."
             className='textarea-enter-new-card'
             ref={newCardTextAreaRef}
             value={newCardTitle}
             onChange={onNewCardTitleChange}
             onKeyDown={event => (event.key === 'Enter' ) && addNewCard()}
           />


         </div>}
      </div>

      <footer>
        {openNewCardForm &&
         <div className='add-new-card-actions'>

           <Button size="sm" variant="success" onClick={addNewCard} >Add card</Button>{' '}
           <span className='cancel-icon'>
             <i className='fa fa-trash icon' onClick={toggleOpenNewCardForm}></i>
           </span>

         </div>}
        {!openNewCardForm &&
        <div className='footer-actions' onClick={toggleOpenNewCardForm}>
          <i className='fa fa-plus icon'></i>Add new card
        </div>}
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
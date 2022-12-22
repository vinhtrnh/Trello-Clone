import React, { useState, useRef, useCallback, useLayoutEffect } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import Column from 'components/Column/Column'
import './BoardContent.scss'
import { initialData } from 'actions/initialData'
import { isEmpty } from 'lodash'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'
import { Container as BootStrapContainer, Row, Col, Form, Button } from 'react-bootstrap'


function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const openNewColumnInputRef = useRef(null)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  useLayoutEffect(() => {
    const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
    if (boardFromDB) {
      setBoard(boardFromDB)

      // sort column basic
      // boardFromDB.columns.sort((a, b) => {
      //     console.log(1, a)
      //     console.log(2, b)

      //     return boardFromDB.columnOrder.indexOf(a.id) - boardFromDB.columnOrder.indexOf(b.id)
      // })

      // set column and sort column by ulitity
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
    }
  }, [])
  useLayoutEffect(() => {
    if (openNewColumnInputRef && openNewColumnInputRef.current) {
      openNewColumnInputRef.current.focus()

    }
  }, [openNewColumnForm])

  const onNewColumnTitleChange = useCallback((e) => setNewColumnTitle(e.target.value), [])

  if (isEmpty(board)) {
    return <div className='not-found'> Board Not Found!</div>
  }
  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }
  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null ) {
      let newColumns = [...columns]
      let currentColumn = newColumns.find(c => c.id === columnId )

      currentColumn.cards = applyDrag( currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i.id)

      setColumns(newColumns)
    }

  }
  const onUpdateColumn = (newColumToUpdate) => {
    const columnIdToUpdate = newColumToUpdate.id

    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex(i => i.id === columnIdToUpdate)

    if (newColumToUpdate._destroy) {
      newColumns.splice(columnIndexToUpdate, 1)
    } else {
      newColumns.splice(columnIndexToUpdate, 1, newColumToUpdate )
    }
    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }

  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const addNewColumn = () => {
    if (!newColumnTitle) {
      openNewColumnInputRef.current.focus()
      openNewColumnInputRef.current.select()
      return

    }
    const newColumnToAdd = {
      id: Math.random().toString(36).substr(2, 5), // random 5 characters, will remove when we implement call api,
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: []
    }
    let newColumns = [...columns]
    newColumns.push(newColumnToAdd)
    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
    setNewColumnTitle('')
    toggleOpenNewColumnForm()
  }

  return (
    <div className='board-content'>

      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={index => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column column={column} onCardDrop={onCardDrop} onUpdateColumn={onUpdateColumn} />
          </Draggable>
        ))}

      </Container>
      <BootStrapContainer className='trello-container'>
        {!openNewColumnForm &&
          <Row>
            <Col className='add-new-column' onClick={toggleOpenNewColumnForm}>
              <i className='fa fa-plus icon'></i>Add new column
            </Col>
          </Row>
        }
        {openNewColumnForm &&
          <Row>
            <Col className='enter-new-column'>
              <Form.Control size="sm"
                type="text"
                placeholder="Enter Column Title..."
                className='input-enter-new-column'
                ref={openNewColumnInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                onKeyDown={event => (event.key === 'Enter' ) && addNewColumn()}
              />
              <Button size="sm" variant="success" onClick={addNewColumn}>Add Column</Button>{' '}
              <span onClick={toggleOpenNewColumnForm} className='cancel-new-column '>
                <i className='fa fa-trash icon'></i>
              </span>
            </Col>
          </Row>
        }


      </BootStrapContainer>

    </div>
  )
}
export default BoardContent
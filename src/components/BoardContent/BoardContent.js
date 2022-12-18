import React, { useState, useEffect } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import Column from 'components/Column/Column'
import './BoardContent.scss'
import { initialData } from 'actions/initialData'
import { isEmpty } from 'lodash'
import { mapOrder } from 'utilities/sorts'

function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])

  useEffect(() => {
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

  if (isEmpty(board)) {
    return <div className='not-found'> Board Not Found!</div>
  }
  const onColumnDrop = (dropResult) => {
    console.log(dropResult)
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
            <Column column={column} />
          </Draggable>
        ))}

      </Container>
    </div>
  )
}
export default BoardContent
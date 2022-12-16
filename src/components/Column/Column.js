import Task from "components/Task/Task";
import React from "react";

import './Column.scss';

function Column() {
    return (
        <div className='column'>
            <header>BrainStorm</header>
            <ul className="task-list">
                <Task />
                <li className="task-item">Add new item into column</li>
                <li className="task-item">Add new item into column</li>
                <li className="task-item">Add new item into column</li>
                <li className="task-item">Add new item into column</li>
            </ul>
            <footer>Add new card</footer>
        </div>


    )
}

export default Column
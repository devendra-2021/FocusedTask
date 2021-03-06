import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Emoji from 'components/Emoji';
import Stack from 'components/Stack';
import styles from './styles.module.css';
import classNames from 'classnames';
import InputText from 'components/InputText';
import keyCodes from 'utils/keyCodes';
import focusOn from 'utils/focusOn';

import {
  newTodo,
  pasteTasks,
  toggleTodo,
  updateTodoIdent,
  updateTodoText,
  removeTodo,
} from 'modules/task';

export default function TaskTodos() {
  const todos = useSelector(store => store.task.todos);
  const dispatch = useDispatch();

  return (
    <Stack.Column>
      {todos.map((todo, i) => (
        <Stack.Row
          key={todo.id}
          style={{ paddingLeft: 20 * (todo.ident || 0) }}
          onClick={() => focusOnTodoWithIndex(i)}>
          {todo.isCompleted ? (
            <Emoji
              emoji={'✅'}
              onClick={e => {
                e.stopPropagation();
                dispatch(toggleTodo(todo));
              }}
            />
          ) : (
            <div
              className={styles.checkbox}
              onClick={e => {
                e.stopPropagation();
                dispatch(toggleTodo(todo));
              }}
            />
          )}
          <InputText
            className={classNames(
              styles.input,
              todo.isCompleted && styles.completed,
            )}
            id={`todo-text-${i}`}
            type="text"
            autoFocus={true}
            value={todo.text}
            placeholder="..."
            onChange={e =>
              dispatch(updateTodoText({ id: todo.id, text: e.target.value }))
            }
            onPaste={e => {
              const clipboard = e.clipboardData.getData('Text');

              if (clipboard.indexOf('\n') === -1) {
                return;
              }

              e.preventDefault();

              dispatch(pasteTasks({ id: todo.id, clipboard }));
            }}
            onKeyDown={e => {
              if (e.target.value === '' && e.keyCode === keyCodes.backspace) {
                dispatch(removeTodo(todo));
                focusOnTodoWithIndex(i - 1);
              } else if (e.keyCode === keyCodes.enter) {
                dispatch(newTodo({ after: todo }));
              } else if (e.keyCode === keyCodes.esc) {
                e.target.blur();
              } else if (e.keyCode === keyCodes.up) {
                focusOnTodoWithIndex(i - 1);
              } else if (e.keyCode === keyCodes.down) {
                focusOnTodoWithIndex(i + 1);
              } else if (e.metaKey && e.keyCode === keyCodes['[']) {
                dispatch(updateTodoIdent({ id: todo.id, by: -1 }));
              } else if (e.metaKey && e.keyCode === keyCodes[']']) {
                dispatch(updateTodoIdent({ id: todo.id, by: 1 }));
              } else if (e.metaKey && e.keyCode === keyCodes.c) {
                dispatch(toggleTodo(todo));
              }
            }}
            onBlur={() => !todo.text && dispatch(removeTodo(todo))}
          />
        </Stack.Row>
      ))}
      <div className={styles.actions}>
        <button onClick={() => dispatch(newTodo())}>new task</button>
      </div>
    </Stack.Column>
  );
}

function focusOnTodoWithIndex(index) {
  focusOn(`todo-text-${index}`);
}

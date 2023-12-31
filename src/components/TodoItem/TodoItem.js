import { useEffect, useRef, useState } from 'react';
import {
  DeleteButton,
  TodoItemStyle,
  CheckButton,
  CheckDeleteButton,
  Date,
  ContentSpan,
  ContentInput,
  Button,
} from './TodoItemStyle';
import { todoStore, store } from '../../store';

const TodoItem = ({ todo }) => {
  const { checkTodos, toggleTodos, editTodos, completeTodos, removeTodos } = todoStore();
  const { isRemoveChecked } = store();

  const [todoValue, setTodoValue] = useState(todo.content);
  const inputRef = useRef(null);
  const editRef = useRef(null);

  // 할 일 수정
  const edit = () => {
    const trimmedValue = todoValue.trim().replaceAll(' ', '\u00a0');
    if (trimmedValue.replaceAll('\u00a0', '') === '') {
      alert('내용은 비어있을 수 없습니다.');
      setTodoValue('');
    } else {
      editTodos(todo.id, trimmedValue);
      setTodoValue(trimmedValue);
    }
  };

  // 할 일 수정 취소
  const cancelEdit = (e) => {
    toggleTodos(todo.id, false);
    setTodoValue(todo.content);
  };

  // Enter 키 입력 시 할 일 수정, ESC 키 입력 시 수정 취소
  const keyPressEdit = (e) => {
    if (e.key === 'Enter') {
      edit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // 할 일 삭제
  const remove = () => {
    let remind = `'${todo.date} / ${todo.content}' 삭제하시겠습니까?`;
    if (window.confirm(remind)) {
      removeTodos(todo.id);
    }
  };

  // 할 일 수정 창이 나오면 내용 입력창에 자동 focus
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    <>
      <TodoItemStyle check={todo.complete} selected={todo.selected}>
        <CheckButton check={todo.complete} onClick={() => completeTodos(todo.id)}>
          ✓
        </CheckButton>
        <Date>{todo.date}</Date>
        {!todo.selected ? (
          <ContentSpan
            check={todo.complete}
            onClick={isRemoveChecked ? null : () => toggleTodos(todo.id, true)}
          >
            {todo.complete ? todo.content + ' (완료)' : todo.content}
          </ContentSpan>
        ) : (
          <>
            <ContentInput
              placeholder="내용"
              autocomplete="off"
              ref={inputRef}
              type="text"
              value={todoValue}
              onChange={(e) => setTodoValue(e.target.value)}
              onKeyDown={keyPressEdit}
              onBlur={cancelEdit}
            />
            <Button btnColor="blue" onMouseDown={edit} type="button" ref={editRef}>
              수정
            </Button>
            <Button btnColor="red" onClick={cancelEdit} type="button">
              취소
            </Button>
          </>
        )}
        {isRemoveChecked ? (
          <CheckDeleteButton check={todo.checked} onClick={() => checkTodos(todo.id)}>
            ✓
          </CheckDeleteButton>
        ) : (
          <DeleteButton onClick={remove} type="button">
            삭제
          </DeleteButton>
        )}
      </TodoItemStyle>
    </>
  );
};

export default TodoItem;

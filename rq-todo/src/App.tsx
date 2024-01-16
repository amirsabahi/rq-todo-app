import React, {useRef} from 'react';
import { useQuery, QueryClientProvider, QueryClient, useMutation } from 'react-query';
import { getTodos, getTodo, Todo, updateTodo, deleteTodo, createTodo } from './lib/api';
import {ReactQueryDevtools} from 'react-query/devtools'

const queryClient = new QueryClient();

function TodoApp() {
  const queryKey = "todos"
  const {data:todos} = useQuery<Todo[]>(queryKey, getTodos,{
    initialData: []
  })
  const updateMutation = useMutation(updateTodo, {
    onSuccess: () => queryClient.invalidateQueries(queryKey)
  })
  const deleteMutation = useMutation(deleteTodo, {
    onSuccess: () => queryClient.invalidateQueries(queryKey)
  })
  const createMutation = useMutation(createTodo, {
    onSuccess: () => queryClient.invalidateQueries(queryKey)
  })
  const textRef = useRef<HTMLInputElement>(null);
  return (
    <div className="App">
      <div className="todos">
        {todos?.map((todo) => (
          <React.Fragment key={todo.id}>
            <div>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => {
                 updateMutation.mutate( {...todo, done: !todo.done });
                }}
              />
              <span>{todo.text}</span>
            </div>
            <button
              onClick={() => {
               deleteMutation.mutate(todo)
              }}
            >
              Delete
            </button>
          </React.Fragment>
        ))}
      </div>
      <div className="add">
        <input type="text" ref={textRef} />
        <button
          onClick={() => {
           createMutation.mutate(textRef.current!.value ?? "" );
           textRef.current!.value = ""
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
 function App() {
  return (<QueryClientProvider client={queryClient}>
    <TodoApp />
    <ReactQueryDevtools />
  </QueryClientProvider>)
 }

export default App;

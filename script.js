const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

const todos = [];

function updateProgress() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}% complete`;
}

function renderTodos() {
    todoList.innerHTML = '';
    if (todos.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item${todo.completed ? ' completed' : ''}`;

        const text = document.createElement('p');
        text.className = 'todo-text';
        text.textContent = todo.text;

        const actions = document.createElement('div');
        actions.className = 'todo-actions';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = todo.completed ? 'Undo' : 'Done';
        toggleButton.addEventListener('click', () => {
            todos[index].completed = !todos[index].completed;
            renderTodos();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            li.classList.add('removing');
            setTimeout(() => {
                todos.splice(index, 1);
                renderTodos();
            }, 180);
        });

        actions.append(toggleButton, deleteButton);
        li.append(text, actions);
        todoList.appendChild(li);
    });
    updateProgress();
}

todoForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = todoInput.value.trim();
    if (!value) return;

    todos.push({ text: value, completed: false });
    todoInput.value = '';
    renderTodos();
});

renderTodos();

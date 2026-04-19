const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const tabPersonal = document.getElementById('tab-personal');
const tabWork = document.getElementById('tab-work');
const tabOther = document.getElementById('tab-other');

const todos = {
    personal: [],
    work: [],
    other: []
};

let currentList = 'personal';

function updateProgress() {
    const list = todos[currentList];
    const total = list.length;
    const completed = list.filter(todo => todo.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}% complete`;
}

function renderTodos() {
    const list = todos[currentList];
    todoList.innerHTML = '';
    if (list.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    list.forEach((todo, index) => {
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
            todos[currentList][index].completed = !todos[currentList][index].completed;
            renderTodos();
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = todo.text;
            input.className = 'edit-input';
            text.replaceWith(input);
            input.focus();
            input.select();

            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.addEventListener('click', () => {
                const newText = input.value.trim();
                if (newText) {
                    todos[currentList][index].text = newText;
                }
                renderTodos();
            });

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.addEventListener('click', () => {
                renderTodos();
            });

            actions.innerHTML = '';
            actions.append(saveButton, cancelButton);

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveButton.click();
                } else if (e.key === 'Escape') {
                    cancelButton.click();
                }
            });
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            li.classList.add('removing');
            setTimeout(() => {
                todos[currentList].splice(index, 1);
                renderTodos();
            }, 180);
        });

        actions.append(toggleButton, editButton, deleteButton);
        li.append(text, actions);
        todoList.appendChild(li);
    });
    updateProgress();
}

function switchList(list) {
    currentList = list;
    tabPersonal.classList.toggle('active', list === 'personal');
    tabWork.classList.toggle('active', list === 'work');
    tabOther.classList.toggle('active', list === 'other');
    renderTodos();
}

tabPersonal.addEventListener('click', () => switchList('personal'));
tabWork.addEventListener('click', () => switchList('work'));
tabOther.addEventListener('click', () => switchList('other'));

todoForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = todoInput.value.trim();
    if (!value) return;

    todos[currentList].push({ text: value, completed: false });
    todoInput.value = '';
    renderTodos();
});

renderTodos();

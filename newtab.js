class TodoApp {
    constructor() {
        this.data = {
            tasks: [],
            studies: []
        };
        this.init();
    }

    init() {
        this.loadData().then(() => {
            this.setupEventListeners();
            this.updateDate();
            this.renderAll();
        });
    }

    setupEventListeners() {
        // 添加事项待办
        document.getElementById('addTaskTodoBtn').addEventListener('click', () => this.addTodo('tasks'));
        document.getElementById('newTaskTodo').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo('tasks');
        });

        // 添加学习待办
        document.getElementById('addStudyTodoBtn').addEventListener('click', () => this.addTodo('studies'));
        document.getElementById('newStudyTodo').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo('studies');
        });
        
        // 清除已完成
        document.getElementById('clearCompletedTasks').addEventListener('click', () => this.clearCompleted('tasks'));
        document.getElementById('clearCompletedStudies').addEventListener('click', () => this.clearCompleted('studies'));

        // 事件委托
        document.getElementById('taskList').addEventListener('change', (e) => this.handleListEvent(e, 'tasks'));
        document.getElementById('taskList').addEventListener('click', (e) => this.handleListEvent(e, 'tasks'));
        document.getElementById('studyList').addEventListener('change', (e) => this.handleListEvent(e, 'studies'));
        document.getElementById('studyList').addEventListener('click', (e) => this.handleListEvent(e, 'studies'));
    }
    
    handleListEvent(e, type) {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        const id = Number(item.getAttribute('data-id'));
        
        if (e.target.classList.contains('todo-checkbox') && e.type === 'change') {
            this.toggleTodo(id, type);
        } else if (e.target.classList.contains('todo-delete') && e.type === 'click') {
            this.deleteTodo(id, type);
        }
    }

    updateDate() {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('zh-CN', options);
    }

    addTodo(type) {
        const inputId = type === 'tasks' ? 'newTaskTodo' : 'newStudyTodo';
        const input = document.getElementById(inputId);
        const text = input.value.trim();
        
        if (text) {
            const todo = { id: Date.now(), text, completed: false, createdAt: new Date().toISOString() };
            this.data[type].push(todo);
            this.saveData();
            this.renderList(type);
            this.updateStats();
            input.value = '';
        }
    }

    toggleTodo(id, type) {
        const todo = this.data[type].find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveData();
            this.renderList(type);
            this.updateStats();
        }
    }

    deleteTodo(id, type) {
        this.data[type] = this.data[type].filter(t => t.id !== id);
        this.saveData();
        this.renderList(type);
        this.updateStats();
    }

    clearCompleted(type) {
        this.data[type] = this.data[type].filter(t => !t.completed);
        this.saveData();
        this.renderList(type);
        this.updateStats();
    }

    renderAll() {
        this.renderList('tasks');
        this.renderList('studies');
        this.updateStats();
    }

    renderList(type) {
        const listId = type === 'tasks' ? 'taskList' : 'studyList';
        const todoList = document.getElementById(listId);
        const todos = this.data[type];
        
        if (todos.length === 0) {
            todoList.innerHTML = `<div class="empty-state"><h3>列表为空</h3><p>从上方开始添加吧！</p></div>`;
            return;
        }

        todoList.innerHTML = todos
            .sort((a, b) => (a.completed !== b.completed) ? (a.completed ? 1 : -1) : (new Date(b.createdAt) - new Date(a.createdAt)))
            .map(todo => `
                <div class="todo-item" data-id="${todo.id}">
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.text)}</span>
                    <button class="todo-delete">删除</button>
                </div>
            `).join('');
    }

    updateStats() {
        const totalTasks = this.data.tasks.length;
        const completedTasks = this.data.tasks.filter(t => t.completed).length;
        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;

        const totalStudies = this.data.studies.length;
        const completedStudies = this.data.studies.filter(t => t.completed).length;
        document.getElementById('totalStudies').textContent = totalStudies;
        document.getElementById('completedStudies').textContent = completedStudies;
    }

    saveData() {
        chrome.storage.local.set({ todoData: this.data });
    }

    async loadData() {
        return new Promise(resolve => {
            chrome.storage.local.get(['todoData', 'todos'], (result) => {
                // 数据迁移：如果存在旧的todos数据，则迁移
                if (result.todos && Array.isArray(result.todos)) {
                    this.data.tasks = result.todos.map(t => ({...t, completed: !!t.completed}));
                    this.data.studies = [];
                    chrome.storage.local.remove('todos', () => {
                        this.saveData();
                        resolve();
                    });
                } else if (result.todoData) {
                    this.data = {
                        tasks: (result.todoData.tasks || []).map(t => ({...t, completed: !!t.completed})),
                        studies: (result.todoData.studies || []).map(t => ({...t, completed: !!t.completed})),
                    };
                    resolve();
                } else {
                    resolve();
                }
            });
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.todoData) {
        const todoApp = document.querySelector('todo-app');
        if (todoApp) {
            todoApp.data = changes.todoData.newValue || { tasks: [], studies: [] };
            todoApp.renderAll();
        }
    }
}); 
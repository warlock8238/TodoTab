class PopupApp {
    constructor() {
        this.todos = [];
        this.init();
    }

    init() {
        this.loadTodos();
        this.setupEventListeners();
        this.renderPreview();
        this.updateStats();
    }

    setupEventListeners() {
        // 快速添加待办
        document.getElementById('quickAddBtn').addEventListener('click', () => {
            this.quickAddTodo();
        });

        document.getElementById('quickTodo').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.quickAddTodo();
            }
        });

        // 打开新标签页
        document.getElementById('openNewTab').addEventListener('click', () => {
            chrome.tabs.create({ url: 'chrome://newtab' });
        });

        // 查看全部
        document.getElementById('viewAll').addEventListener('click', () => {
            chrome.tabs.create({ url: 'chrome://newtab' });
        });
    }

    quickAddTodo() {
        const input = document.getElementById('quickTodo');
        const text = input.value.trim();
        
        if (text) {
            const todo = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            this.todos.push(todo);
            this.saveTodos();
            this.renderPreview();
            this.updateStats();
            input.value = '';
            
            // 显示成功提示
            this.showNotification('待办已添加！');
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderPreview();
            this.updateStats();
        }
    }

    renderPreview() {
        const preview = document.getElementById('todoPreview');
        const pendingTodos = this.todos.filter(t => !t.completed).slice(0, 5);
        
        if (pendingTodos.length === 0) {
            preview.innerHTML = `
                <div class="empty-preview">
                    <div>✅</div>
                    <h3>太棒了！</h3>
                    <p>所有待办都已完成，继续保持！</p>
                </div>
            `;
            return;
        }

        preview.innerHTML = pendingTodos.map(todo => `
            <div class="todo-item-preview">
                <input type="checkbox" 
                       class="todo-checkbox-preview" 
                       onchange="popupApp.toggleTodo(${todo.id})">
                <span class="todo-text-preview">${this.escapeHtml(todo.text)}</span>
            </div>
        `).join('');
    }

    updateStats() {
        const pendingCount = this.todos.filter(t => !t.completed).length;
        document.getElementById('pendingCount').textContent = pendingCount;
    }

    saveTodos() {
        chrome.storage.local.set({ todos: this.todos });
    }

    loadTodos() {
        chrome.storage.local.get(['todos'], (result) => {
            this.todos = result.todos || [];
            this.renderPreview();
            this.updateStats();
        });
    }

    showNotification(message) {
        // 创建临时通知元素
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #28a745;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化弹出窗口应用
let popupApp;
document.addEventListener('DOMContentLoaded', () => {
    popupApp = new PopupApp();
});

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.todos) {
        popupApp.todos = changes.todos.newValue || [];
        popupApp.renderPreview();
        popupApp.updateStats();
    }
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 
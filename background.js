// 监听标签页更新事件
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // 当标签页完全加载完成时
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
        // 检查是否有待办事项需要提醒
        checkAndShowTodoReminder();
    }
});

// 监听标签页激活事件
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && !tab.url.startsWith('chrome://')) {
            checkAndShowTodoReminder();
        }
    });
});

// 检查并显示待办提醒
function checkAndShowTodoReminder() {
    chrome.storage.local.get(['todos', 'lastReminderDate'], (result) => {
        const todos = result.todos || [];
        const lastReminderDate = result.lastReminderDate;
        const today = new Date().toDateString();
        
        // 如果今天还没有提醒过，且有未完成的待办事项
        if (lastReminderDate !== today && todos.length > 0) {
            const pendingTodos = todos.filter(todo => !todo.completed);
            
            if (pendingTodos.length > 0) {
                showTodoNotification(pendingTodos);
                // 记录今天已经提醒过
                chrome.storage.local.set({ lastReminderDate: today });
            }
        }
    });
}

// 显示待办通知
function showTodoNotification(pendingTodos) {
    const count = pendingTodos.length;
    const message = count === 1 
        ? `你还有 1 个待办事项需要完成` 
        : `你还有 ${count} 个待办事项需要完成`;
    
    // 创建通知
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: '📝 待办提醒',
        message: message,
        priority: 1
    });
}

// 监听通知点击事件
chrome.notifications.onClicked.addListener((notificationId) => {
    // 点击通知时打开新标签页
    chrome.tabs.create({ url: 'chrome://newtab' });
});

// 监听插件安装事件
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // 插件首次安装时的初始化
        chrome.storage.local.set({
            todos: [],
            lastReminderDate: null
        });
        
        // 显示欢迎通知
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: '🎉 待办提醒助手已安装',
            message: '现在每次打开新标签页都会提醒你的待办事项！',
            priority: 1
        });
    }
});

// 监听来自弹出窗口的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTodoCount') {
        chrome.storage.local.get(['todos'], (result) => {
            const todos = result.todos || [];
            const pendingCount = todos.filter(todo => !todo.completed).length;
            sendResponse({ pendingCount });
        });
        return true; // 保持消息通道开放
    }
}); 
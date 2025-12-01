/**
 * UI 管理模块
 * 负责更新用户界面，包括情感提示文本和状态显示
 */

export class UIManager {
    constructor() {
        this.statusText = document.getElementById('status-text');
        this.hintText = document.getElementById('hint-text');
        this.currentState = 'searching'; // 初始状态：寻找
        this.init();
    }
    
    init() {
        this.updateStatus('searching');
    }
    
    /**
     * 更新状态文本
     * @param {string} state - 状态名称
     */
    updateStatus(state) {
        this.currentState = state;
        
        const statusMessages = {
            searching: {
                status: '状态：母亲在为孩子寻找一条路。',
                hint: '提示：旋转视角，也许断裂只是误会。'
            },
            aligning: {
                status: '状态：调整视角，寻找连接的可能。',
                hint: '提示：点击"情感视角对齐"，换个角度看世界。'
            },
            connected: {
                status: '状态：桥已连接，路在眼前。',
                hint: '提示：触发机关，让母亲为孩子引路。'
            },
            reunited: {
                status: '状态：母子重逢，共同前行。',
                hint: '提示：这一刻值得被记住，点击"保存此刻记忆"。'
            }
        };
        
        const message = statusMessages[state] || statusMessages.searching;
        
        if (this.statusText) {
            this.statusText.textContent = message.status;
        }
        
        if (this.hintText) {
            this.hintText.textContent = message.hint;
        }
    }
    
    /**
     * 根据场景状态自动更新 UI
     * @param {Object} sceneState - 场景状态对象
     */
    updateFromSceneState(sceneState) {
        const { bridgeAligned, bridgeTriggered, motherChildReunited } = sceneState;
        
        if (motherChildReunited) {
            this.updateStatus('reunited');
        } else if (bridgeTriggered) {
            this.updateStatus('connected');
        } else if (bridgeAligned) {
            this.updateStatus('aligning');
        } else {
            this.updateStatus('searching');
        }
    }
    
    /**
     * 显示临时提示消息
     * @param {string} message - 提示消息
     * @param {number} duration - 显示时长（毫秒）
     */
    showTemporaryMessage(message, duration = 3000) {
        // 可以创建一个临时的提示元素
        const tempHint = document.createElement('div');
        tempHint.textContent = message;
        tempHint.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 1000;
            pointer-events: none;
            font-size: 14px;
        `;
        document.body.appendChild(tempHint);
        
        setTimeout(() => {
            tempHint.style.opacity = '0';
            tempHint.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                document.body.removeChild(tempHint);
            }, 500);
        }, duration);
    }
    
    /**
     * 获取当前状态
     */
    getCurrentState() {
        return this.currentState;
    }
}


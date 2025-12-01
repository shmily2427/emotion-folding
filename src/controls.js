/**
 * 控制模块
 * 负责用户交互控制，包括 OrbitControls 和自定义按钮绑定
 */

export class ControlsManager {
    constructor(camera, renderer, sceneManager, cameraManager) {
        this.camera = camera;
        this.renderer = renderer;
        this.sceneManager = sceneManager;
        this.cameraManager = cameraManager;
        
        // 初始化 OrbitControls
        this.orbitControls = null;
        this.initOrbitControls();
        
        // 绑定 UI 按钮事件
        this.setupUIEvents();
    }
    
    /**
     * 初始化 OrbitControls（鼠标旋转和缩放）
     */
    initOrbitControls() {
        // 等待 THREE 和 OrbitControls 加载完成
        if (typeof THREE === 'undefined') {
            console.warn('THREE 未加载，将使用备用控制方案');
            this.setupBasicControls();
            return;
        }
        
        // 检查 OrbitControls 是否可用
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        } else {
            // 如果 OrbitControls 未定义，使用备用控制方案
            console.warn('OrbitControls 未找到，将使用备用控制方案');
            this.setupBasicControls();
            return;
        }
        
        // 配置控制参数
        this.orbitControls.enableDamping = true; // 启用阻尼（惯性效果）
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.enableZoom = true;
        this.orbitControls.enablePan = true;
        this.orbitControls.minDistance = 5;
        this.orbitControls.maxDistance = 50;
        
        // 设置旋转限制（可选）
        this.orbitControls.maxPolarAngle = Math.PI / 2; // 防止相机翻转到下方
        this.orbitControls.minPolarAngle = Math.PI / 6; // 限制最低角度
    }
    
    /**
     * 备用控制方案（如果 OrbitControls 不可用）
     */
    setupBasicControls() {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        this.renderer.domElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            // 简单的旋转控制
            const spherical = new THREE.Spherical();
            spherical.setFromVector3(this.camera.position);
            spherical.theta -= deltaX * 0.01;
            spherical.phi += deltaY * 0.01;
            spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
            
            this.camera.position.setFromSpherical(spherical);
            this.camera.lookAt(0, 0, 0);
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        this.renderer.domElement.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        this.renderer.domElement.addEventListener('wheel', (e) => {
            const delta = e.deltaY * 0.01;
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            this.camera.position.add(direction.multiplyScalar(delta));
        });
    }
    
    /**
     * 设置 UI 按钮事件绑定
     */
    setupUIEvents() {
        // 母亲视角按钮
        const btnMotherView = document.getElementById('btn-mother-view');
        if (btnMotherView) {
            btnMotherView.addEventListener('click', () => {
                this.switchToMotherView();
            });
        }
        
        // 孩子视角按钮
        const btnChildView = document.getElementById('btn-child-view');
        if (btnChildView) {
            btnChildView.addEventListener('click', () => {
                this.switchToChildView();
            });
        }
        
        // 情感视角对齐按钮
        const btnEmotionalView = document.getElementById('btn-emotional-view');
        if (btnEmotionalView) {
            btnEmotionalView.addEventListener('click', () => {
                this.switchToEmotionalView();
            });
        }
        
        // 触发机关按钮
        const btnTriggerBridge = document.getElementById('btn-trigger-bridge');
        if (btnTriggerBridge) {
            btnTriggerBridge.addEventListener('click', () => {
                this.triggerBridgeMechanism();
            });
        }
    }
    
    /**
     * 切换到母亲视角
     */
    switchToMotherView() {
        this.cameraManager.setPresetView('mother');
        // 暂时禁用 OrbitControls，让预设视角动画完成
        if (this.orbitControls) {
            this.orbitControls.enabled = false;
            setTimeout(() => {
                if (this.orbitControls) this.orbitControls.enabled = true;
            }, 2100); // 等待动画完成
        }
    }
    
    /**
     * 切换到孩子视角
     */
    switchToChildView() {
        this.cameraManager.setPresetView('child');
        if (this.orbitControls) {
            this.orbitControls.enabled = false;
            setTimeout(() => {
                if (this.orbitControls) this.orbitControls.enabled = true;
            }, 2100);
        }
    }
    
    /**
     * 切换到情感视角对齐
     */
    switchToEmotionalView() {
        this.cameraManager.setPresetView('emotional');
        // 设置桥为对齐状态
        this.sceneManager.setBridgeAligned(true);
        
        if (this.orbitControls) {
            this.orbitControls.enabled = false;
            setTimeout(() => {
                if (this.orbitControls) this.orbitControls.enabled = true;
            }, 2100);
        }
    }
    
    /**
     * 触发桥段机关
     */
    triggerBridgeMechanism() {
        // 检查是否处于情感视角对齐状态
        const isAligned = this.cameraManager.isNearEmotionalView(3.0);
        
        if (isAligned || this.sceneManager.bridge?.isAligned) {
            // 触发桥段移动
            this.sceneManager.triggerBridgeMovement();
        } else {
            // 提示用户需要先对齐视角
            console.log('请先切换到情感视角对齐');
        }
    }
    
    /**
     * 更新控制（在渲染循环中调用）
     */
    update() {
        if (this.orbitControls) {
            this.orbitControls.update();
        }
    }
    
    /**
     * 获取 OrbitControls 实例
     */
    getOrbitControls() {
        return this.orbitControls;
    }
}


/**
 * 主入口文件
 * 组合所有模块，完成初始化与渲染循环
 */

import { SceneManager } from './src/scene.js';
import { CameraManager } from './src/camera.js';
import { ControlsManager } from './src/controls.js';
import { ObjectsManager } from './src/objects.js';
import { LightingManager } from './src/lighting.js';
import { UIManager } from './src/ui.js';
import { ModelLoader } from './utils/loader.js';
import { saveCurrentView } from './utils/saveImage.js';

class App {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.sceneManager = null;
        this.cameraManager = null;
        this.controlsManager = null;
        this.objectsManager = null;
        this.lightingManager = null;
        this.uiManager = null;
        this.modelLoader = null;
        
        this.container = document.getElementById('canvas-container');
        
        this.init();
    }
    
    init() {
        // 1. 创建渲染器
        this.createRenderer();
        
        // 2. 创建场景管理器
        this.sceneManager = new SceneManager();
        this.scene = this.sceneManager.getScene();
        
        // 3. 创建相机管理器
        this.cameraManager = new CameraManager(this.container);
        this.camera = this.cameraManager.getCamera();
        
        // 4. 创建光照管理器
        this.lightingManager = new LightingManager(this.scene);
        this.lightingManager.setupShadows(this.renderer);
        
        // 5. 创建对象管理器
        this.objectsManager = new ObjectsManager(this.scene);
        
        // 6. 创建控制管理器
        this.controlsManager = new ControlsManager(
            this.camera,
            this.renderer,
            this.sceneManager,
            this.cameraManager
        );
        
        // 7. 创建 UI 管理器
        this.uiManager = new UIManager();
        
        // 8. 创建模型加载器
        this.modelLoader = new ModelLoader();
        
        // 9. 加载模型（如果存在）
        this.loadModels();
        
        // 10. 创建纹理对象
        this.objectsManager.createTexturedObject();
        
        // 11. 设置截图按钮事件
        this.setupSaveButton();
        
        // 12. 开始渲染循环
        this.animate();
        
        // 13. 处理窗口大小变化
        this.setupResize();
    }
    
    /**
     * 创建 WebGL 渲染器
     */
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
    }
    
    /**
     * 加载 3D 模型
     */
    loadModels() {
        if (!this.modelLoader.getLoader()) {
            console.warn('GLTFLoader 不可用，使用占位几何体');
            this.createPlaceholderModels();
            return;
        }
        
        // 尝试加载母亲模型
        this.modelLoader.load(
            './assets/models/mother.glb',
            (gltf) => {
                const model = gltf.scene;
                this.sceneManager.setMother(model);
                console.log('母亲模型加载成功');
            },
            null,
            () => {
                // 加载失败，使用占位几何体
                const placeholder = this.objectsManager.createPlaceholder('mother');
                this.sceneManager.setMother(placeholder);
                console.log('使用母亲占位模型');
            }
        );
        
        // 尝试加载孩子模型
        this.modelLoader.load(
            './assets/models/child.glb',
            (gltf) => {
                const model = gltf.scene;
                this.sceneManager.setChild(model);
                console.log('孩子模型加载成功');
            },
            null,
            () => {
                // 加载失败，使用占位几何体
                const placeholder = this.objectsManager.createPlaceholder('child');
                this.sceneManager.setChild(placeholder);
                console.log('使用孩子占位模型');
            }
        );
    }
    
    /**
     * 创建占位模型（当 glTF 模型不可用时）
     */
    createPlaceholderModels() {
        const motherPlaceholder = this.objectsManager.createPlaceholder('mother');
        const childPlaceholder = this.objectsManager.createPlaceholder('child');
        
        this.sceneManager.setMother(motherPlaceholder);
        this.sceneManager.setChild(childPlaceholder);
    }
    
    /**
     * 设置保存按钮事件
     */
    setupSaveButton() {
        const btnSaveMemory = document.getElementById('btn-save-memory');
        if (btnSaveMemory) {
            btnSaveMemory.addEventListener('click', () => {
                saveCurrentView(this.renderer);
                this.uiManager.showTemporaryMessage('记忆已保存', 2000);
            });
        }
    }
    
    /**
     * 处理窗口大小变化
     */
    setupResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    /**
     * 渲染循环
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 更新控制
        if (this.controlsManager) {
            this.controlsManager.update();
        }
        
        // 更新相机
        if (this.cameraManager) {
            this.cameraManager.update();
        }
        
        // 检查场景状态并更新 UI
        if (this.sceneManager && this.uiManager) {
            // 检查母子是否已会合（位置接近）
            let motherChildReunited = false;
            if (this.sceneManager.mother && this.sceneManager.child) {
                const distance = this.sceneManager.mother.position.distanceTo(
                    this.sceneManager.child.position
                );
                motherChildReunited = distance < 5; // 距离小于5时认为已会合
            }
            
            const sceneState = {
                bridgeAligned: this.sceneManager.bridge?.isAligned || false,
                bridgeTriggered: false, // 可以根据实际情况更新
                motherChildReunited: motherChildReunited
            };
            this.uiManager.updateFromSceneState(sceneState);
        }
        
        // 渲染场景
        this.renderer.render(this.scene, this.camera);
    }
}

// 当页面加载完成后初始化应用
function initApp() {
    // 等待 THREE 库加载完成
    if (window.THREE && window.THREE_LOADED) {
        console.log('初始化情境折影...');
        const app = new App();
        console.log('应用初始化完成');
    } else {
        // 如果 THREE 还未加载，等待事件
        window.addEventListener('three-loaded', () => {
            console.log('初始化情境折影...');
            const app = new App();
            console.log('应用初始化完成');
        }, { once: true });
        
        // 备用方案：延迟初始化
        setTimeout(() => {
            if (window.THREE) {
                console.log('初始化情境折影（延迟）...');
                const app = new App();
                console.log('应用初始化完成');
            } else {
                console.error('THREE.js 加载失败，请检查网络连接');
            }
        }, 2000);
    }
}

window.addEventListener('DOMContentLoaded', initApp);


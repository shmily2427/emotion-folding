/**
 * 相机管理模块
 * 负责创建和管理 Three.js 相机，包括预设视角和视角切换动画
 */

export class CameraManager {
    constructor(container) {
        this.container = container;
        this.camera = null;
        this.aspect = window.innerWidth / window.innerHeight;
        this.near = 0.1;
        this.far = 1000;
        
        // 预设视角配置
        this.presets = {
            mother: {
                position: new THREE.Vector3(-15, 8, 12),
                target: new THREE.Vector3(-12, 1, 0), // 看向母亲位置
                name: '母亲视角'
            },
            child: {
                position: new THREE.Vector3(15, 6, 10),
                target: new THREE.Vector3(12, 1, 0), // 看向孩子位置
                name: '孩子视角'
            },
            emotional: {
                // 情感视角对齐：特殊角度，让断桥在视觉上连接
                position: new THREE.Vector3(0, 5, 20),
                target: new THREE.Vector3(0, 0.5, 0), // 看向桥的中心
                name: '情感视角对齐'
            }
        };
        
        this.currentPreset = null;
        this.isAnimating = false;
        
        this.init();
        this.setupResize();
    }
    
    init() {
        // 创建透视相机
        this.camera = new THREE.PerspectiveCamera(
            50, // 视野角度
            this.aspect,
            this.near,
            this.far
        );
        
        // 设置初始视角（默认使用母亲视角）
        this.setPresetView('mother');
    }
    
    /**
     * 设置预设视角
     * @param {string} presetName - 预设名称：'mother', 'child', 'emotional'
     */
    setPresetView(presetName) {
        if (this.isAnimating) return;
        
        const preset = this.presets[presetName];
        if (!preset) {
            console.warn(`未知的预设视角: ${presetName}`);
            return;
        }
        
        this.currentPreset = presetName;
        this.isAnimating = true;
        
        // 使用 GSAP 或自写补间动画平滑切换视角
        this.animateToPosition(preset.position, preset.target, () => {
            this.isAnimating = false;
        });
    }
    
    /**
     * 动画切换到指定位置和目标点
     */
    animateToPosition(targetPosition, targetLookAt, onComplete) {
        const startPosition = this.camera.position.clone();
        const startTarget = this.getCameraLookAt();
        const duration = 2000; // 2秒动画
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数（ease-in-out）
            const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
            
            // 插值相机位置
            this.camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
            
            // 计算目标看向点
            const currentTarget = new THREE.Vector3().lerpVectors(startTarget, targetLookAt, easeProgress);
            this.camera.lookAt(currentTarget);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                if (onComplete) onComplete();
            }
        };
        
        animate();
    }
    
    /**
     * 获取相机当前看向的点（通过计算前方一定距离的点）
     */
    getCameraLookAt() {
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        return this.camera.position.clone().add(direction.multiplyScalar(10));
    }
    
    /**
     * 获取情感视角对齐的特殊角度
     * 这个角度会让断桥在屏幕投影上看似连接
     */
    getEmotionalViewAngle() {
        return this.presets.emotional;
    }
    
    /**
     * 检查当前视角是否接近情感对齐视角
     * 用于判断桥是否可以"通过"
     */
    isNearEmotionalView(threshold = 2.0) {
        const emotionalPos = this.presets.emotional.position;
        const currentPos = this.camera.position;
        const distance = currentPos.distanceTo(emotionalPos);
        return distance < threshold;
    }
    
    /**
     * 获取相机对象
     */
    getCamera() {
        return this.camera;
    }
    
    /**
     * 获取当前预设名称
     */
    getCurrentPreset() {
        return this.currentPreset;
    }
    
    /**
     * 处理窗口大小变化
     */
    setupResize() {
        window.addEventListener('resize', () => {
            this.aspect = window.innerWidth / window.innerHeight;
            this.camera.aspect = this.aspect;
            this.camera.updateProjectionMatrix();
        });
    }
    
    /**
     * 更新相机（在渲染循环中调用）
     */
    update() {
        // 可以在这里添加相机跟随、自动旋转等逻辑
    }
}


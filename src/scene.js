/**
 * 场景管理模块
 * 负责创建和管理 Three.js 场景，包括几何体、平台、桥梁等
 */

export class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.bridgeSegments = []; // 存储桥段，用于视错觉效果
        this.motherPlatform = null;
        this.childPlatform = null;
        this.bridge = null;
        this.mother = null;
        this.child = null;
        
        // 场景配置
        this.config = {
            fogColor: 0xf5f5f5,
            fogDensity: 0.015
        };
        
        this.init();
    }
    
    init() {
        // 设置场景背景色（柔和的灰白色）
        this.scene.background = new THREE.Color(0xf5f5f5);
        
        // 添加雾效果（增加空间层次感与"记忆感"）
        this.scene.fog = new THREE.FogExp2(this.config.fogColor, this.config.fogDensity);
        
        // 创建纪念碑谷式的平台和结构
        this.createPlatforms();
        this.createBridge();
        this.createStructures();
    }
    
    /**
     * 创建平台：母亲平台、孩子平台和中央平台
     */
    createPlatforms() {
        // 母亲所在平台（左侧，暖色调）
        const motherPlatformGeometry = new THREE.BoxGeometry(8, 0.5, 8);
        const motherPlatformMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffb6c1, // 暖粉色
            transparent: true,
            opacity: 0.9
        });
        this.motherPlatform = new THREE.Mesh(motherPlatformGeometry, motherPlatformMaterial);
        this.motherPlatform.position.set(-12, 0, 0);
        this.motherPlatform.receiveShadow = true;
        this.motherPlatform.castShadow = true;
        this.scene.add(this.motherPlatform);
        
        // 孩子所在平台（右侧，暖色调）
        const childPlatformGeometry = new THREE.BoxGeometry(8, 0.5, 8);
        const childPlatformMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffc0cb, // 浅粉色
            transparent: true,
            opacity: 0.9
        });
        this.childPlatform = new THREE.Mesh(childPlatformGeometry, childPlatformMaterial);
        this.childPlatform.position.set(12, 0, 0);
        this.childPlatform.receiveShadow = true;
        this.childPlatform.castShadow = true;
        this.scene.add(this.childPlatform);
        
        // 中央悬浮平台（中性色调，作为过渡）
        const centerPlatformGeometry = new THREE.BoxGeometry(6, 0.5, 6);
        const centerPlatformMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xd3d3d3, // 浅灰色
            transparent: true,
            opacity: 0.8
        });
        const centerPlatform = new THREE.Mesh(centerPlatformGeometry, centerPlatformMaterial);
        centerPlatform.position.set(0, 2, 0);
        centerPlatform.receiveShadow = true;
        this.scene.add(centerPlatform);
        
        // 背景平台（冷色调，代表距离）
        const backgroundPlatformGeometry = new THREE.BoxGeometry(10, 0.3, 10);
        const backgroundPlatformMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xb0c4de, // 淡蓝色
            transparent: true,
            opacity: 0.6
        });
        const backgroundPlatform = new THREE.Mesh(backgroundPlatformGeometry, backgroundPlatformMaterial);
        backgroundPlatform.position.set(0, -3, -15);
        backgroundPlatform.receiveShadow = true;
        this.scene.add(backgroundPlatform);
    }
    
    /**
     * 创建断桥结构（视错觉的核心）
     * 桥由两段组成，在特定视角下会看似连接
     */
    createBridge() {
        // 左桥段（从母亲平台延伸）
        const leftBridgeGeometry = new THREE.BoxGeometry(6, 0.3, 2);
        const bridgeMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xdda0dd, // 淡紫色
            transparent: true,
            opacity: 0.85
        });
        
        const leftBridge = new THREE.Mesh(leftBridgeGeometry, bridgeMaterial);
        leftBridge.position.set(-6, 0.5, 0);
        leftBridge.rotation.y = Math.PI / 2; // 旋转90度，使其横向
        leftBridge.castShadow = true;
        leftBridge.receiveShadow = true;
        this.scene.add(leftBridge);
        this.bridgeSegments.push(leftBridge);
        
        // 右桥段（从孩子平台延伸）
        const rightBridgeGeometry = new THREE.BoxGeometry(6, 0.3, 2);
        const rightBridge = new THREE.Mesh(rightBridgeGeometry, bridgeMaterial);
        rightBridge.position.set(6, 0.5, 0);
        rightBridge.rotation.y = Math.PI / 2;
        rightBridge.castShadow = true;
        rightBridge.receiveShadow = true;
        this.scene.add(rightBridge);
        this.bridgeSegments.push(rightBridge);
        
        // 存储桥段引用，用于后续的视错觉操作
        this.bridge = {
            left: leftBridge,
            right: rightBridge,
            isAligned: false // 是否处于对齐状态
        };
    }
    
    /**
     * 创建其他装饰性结构（纪念碑谷风格）
     */
    createStructures() {
        // 左侧装饰柱
        const leftPillarGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 8);
        const pillarMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffb6c1,
            transparent: true,
            opacity: 0.7
        });
        const leftPillar = new THREE.Mesh(leftPillarGeometry, pillarMaterial);
        leftPillar.position.set(-12, 2.5, -4);
        leftPillar.castShadow = true;
        this.scene.add(leftPillar);
        
        // 右侧装饰柱
        const rightPillar = new THREE.Mesh(leftPillarGeometry, pillarMaterial);
        rightPillar.position.set(12, 2.5, -4);
        rightPillar.castShadow = true;
        this.scene.add(rightPillar);
        
        // 悬浮立方体（纪念碑谷风格）
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        const cubeMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xadd8e6,
            transparent: true,
            opacity: 0.8
        });
        const floatingCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        floatingCube.position.set(0, 4, -8);
        floatingCube.castShadow = true;
        this.scene.add(floatingCube);
    }
    
    /**
     * 设置母亲角色模型
     */
    setMother(mesh) {
        if (this.mother) {
            this.scene.remove(this.mother);
        }
        this.mother = mesh;
        if (mesh) {
            mesh.position.set(-12, 1, 0);
            mesh.scale.set(0.5, 0.5, 0.5);
            mesh.castShadow = true;
            this.scene.add(mesh);
        }
    }
    
    /**
     * 设置孩子角色模型
     */
    setChild(mesh) {
        if (this.child) {
            this.scene.remove(this.child);
        }
        this.child = mesh;
        if (mesh) {
            mesh.position.set(12, 1, 0);
            mesh.scale.set(0.4, 0.4, 0.4);
            mesh.castShadow = true;
            this.scene.add(mesh);
        }
    }
    
    /**
     * 触发桥段移动（引路机关）
     * 当视角对齐时，轻微移动桥段以强化视觉错觉
     */
    triggerBridgeMovement() {
        if (!this.bridge) return;
        
        // 如果处于对齐状态，执行移动动画
        if (this.bridge.isAligned) {
            // 左桥段轻微前移
            const leftTargetZ = this.bridge.left.position.z + 0.3;
            // 右桥段轻微前移
            const rightTargetZ = this.bridge.right.position.z + 0.3;
            
            // 使用简单的补间动画（可以用 GSAP 或自写）
            this.animateBridgeSegment(this.bridge.left, { z: leftTargetZ });
            this.animateBridgeSegment(this.bridge.right, { z: rightTargetZ });
            
            // 触发母子会合动画
            this.triggerReunion();
        }
    }
    
    /**
     * 触发母子会合动画
     * 当桥对齐后，让母亲和孩子走向桥的中心会合
     */
    triggerReunion() {
        if (!this.mother || !this.child) return;
        
        // 母亲从左侧平台走向桥中心
        const motherTargetX = -2;
        this.animateCharacter(this.mother, { x: motherTargetX }, () => {
            // 会合完成
            console.log('母子会合完成');
        });
        
        // 孩子从右侧平台走向桥中心
        const childTargetX = 2;
        this.animateCharacter(this.child, { x: childTargetX });
    }
    
    /**
     * 角色移动动画
     */
    animateCharacter(character, target, onComplete) {
        const start = { ...character.position };
        const duration = 2000; // 2秒
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
            
            if (target.x !== undefined) character.position.x = start.x + (target.x - start.x) * easeProgress;
            if (target.y !== undefined) character.position.y = start.y + (target.y - start.y) * easeProgress;
            if (target.z !== undefined) character.position.z = start.z + (target.z - start.z) * easeProgress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (onComplete) onComplete();
            }
        };
        
        animate();
    }
    
    /**
     * 桥段动画辅助函数
     */
    animateBridgeSegment(segment, target) {
        const start = { ...segment.position };
        const duration = 1000; // 1秒
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI); // 缓动函数
            
            if (target.x !== undefined) segment.position.x = start.x + (target.x - start.x) * easeProgress;
            if (target.y !== undefined) segment.position.y = start.y + (target.y - start.y) * easeProgress;
            if (target.z !== undefined) segment.position.z = start.z + (target.z - start.z) * easeProgress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    /**
     * 设置桥的对齐状态
     */
    setBridgeAligned(aligned) {
        if (this.bridge) {
            this.bridge.isAligned = aligned;
        }
    }
    
    /**
     * 获取场景对象
     */
    getScene() {
        return this.scene;
    }
    
    /**
     * 从配置文件加载场景（可选功能）
     */
    loadFromConfig(config) {
        // 这里可以实现从 JSON 文件读取场景配置
        // 暂时使用默认配置
    }
}


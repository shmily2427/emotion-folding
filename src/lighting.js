/**
 * 光照管理模块
 * 负责创建和管理场景中的光源，包括环境光、点光源和阴影设置
 */

export class LightingManager {
    constructor(scene) {
        this.scene = scene;
        this.lights = [];
        this.init();
    }
    
    init() {
        // 1. 环境光（整体柔化场景，使画面有"纪念碑谷式"的温柔感）
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);
        
        // 2. 暖色点光源（代表"亲密/情感之光"，靠近母子所在区域）
        const warmLight = new THREE.PointLight(0xffb6c1, 1.2, 30);
        warmLight.position.set(-8, 6, 5);
        warmLight.castShadow = true;
        // 阴影设置
        warmLight.shadow.mapSize.width = 2048;
        warmLight.shadow.mapSize.height = 2048;
        warmLight.shadow.camera.near = 0.5;
        warmLight.shadow.camera.far = 50;
        warmLight.shadow.radius = 8; // 柔和阴影
        this.scene.add(warmLight);
        this.lights.push(warmLight);
        
        // 3. 冷色点光源（代表"距离/未知"，照在远端平台或背景）
        const coolLight = new THREE.PointLight(0xadd8e6, 0.8, 35);
        coolLight.position.set(8, 5, -10);
        coolLight.castShadow = true;
        coolLight.shadow.mapSize.width = 2048;
        coolLight.shadow.mapSize.height = 2048;
        coolLight.shadow.camera.near = 0.5;
        coolLight.shadow.camera.far = 50;
        coolLight.shadow.radius = 8;
        this.scene.add(coolLight);
        this.lights.push(coolLight);
        
        // 4. 补充光源（从上方照射，增加整体亮度）
        const topLight = new THREE.DirectionalLight(0xffffff, 0.3);
        topLight.position.set(0, 15, 0);
        topLight.castShadow = true;
        topLight.shadow.mapSize.width = 2048;
        topLight.shadow.mapSize.height = 2048;
        topLight.shadow.camera.left = -20;
        topLight.shadow.camera.right = 20;
        topLight.shadow.camera.top = 20;
        topLight.shadow.camera.bottom = -20;
        this.scene.add(topLight);
        this.lights.push(topLight);
    }
    
    /**
     * 配置渲染器的阴影设置
     * @param {THREE.WebGLRenderer} renderer - Three.js 渲染器
     */
    setupShadows(renderer) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 柔和阴影
    }
    
    /**
     * 调整光源强度（可用于情感表达）
     * @param {string} lightType - 'warm' 或 'cool'
     * @param {number} intensity - 强度值
     */
    setLightIntensity(lightType, intensity) {
        if (lightType === 'warm') {
            // 找到暖色光源并调整
            const warmLight = this.lights.find(light => light.color.getHex() === 0xffb6c1);
            if (warmLight) {
                warmLight.intensity = intensity;
            }
        } else if (lightType === 'cool') {
            // 找到冷色光源并调整
            const coolLight = this.lights.find(light => light.color.getHex() === 0xadd8e6);
            if (coolLight) {
                coolLight.intensity = intensity;
            }
        }
    }
    
    /**
     * 获取所有光源
     */
    getLights() {
        return this.lights;
    }
    
    /**
     * 添加额外的点光源
     * @param {THREE.Vector3} position - 光源位置
     * @param {number} color - 颜色（十六进制）
     * @param {number} intensity - 强度
     * @param {number} distance - 照射距离
     */
    addPointLight(position, color, intensity = 1, distance = 30) {
        const light = new THREE.PointLight(color, intensity, distance);
        light.position.copy(position);
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        this.scene.add(light);
        this.lights.push(light);
        return light;
    }
}


/**
 * 对象管理模块
 * 负责创建几何体、加载 glTF 模型等
 */

export class ObjectsManager {
    constructor(scene) {
        this.scene = scene;
        this.models = {
            mother: null,
            child: null
        };
    }
    
    /**
     * 创建简单的占位几何体（当模型未加载时使用）
     */
    createPlaceholder(type) {
        let geometry, material, mesh;
        
        if (type === 'mother') {
            // 母亲占位：稍高的圆柱体
            geometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8);
            material = new THREE.MeshPhongMaterial({ 
                color: 0xffb6c1,
                transparent: true,
                opacity: 0.9
            });
        } else if (type === 'child') {
            // 孩子占位：稍小的圆柱体
            geometry = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 8);
            material = new THREE.MeshPhongMaterial({ 
                color: 0xffc0cb,
                transparent: true,
                opacity: 0.9
            });
        } else {
            // 默认占位
            geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
            material = new THREE.MeshPhongMaterial({ color: 0x888888 });
        }
        
        mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        return mesh;
    }
    
    /**
     * 加载 glTF 模型
     * @param {THREE.GLTFLoader} loader - GLTFLoader 实例
     * @param {string} path - 模型文件路径
     * @param {string} type - 'mother' 或 'child'
     * @param {Function} onLoad - 加载成功回调
     * @param {Function} onError - 加载失败回调
     */
    loadModel(loader, path, type, onLoad, onError) {
        loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        // 确保材质支持阴影
                        if (child.material) {
                            child.material.needsUpdate = true;
                        }
                    }
                });
                
                this.models[type] = model;
                if (onLoad) onLoad(model, type);
            },
            (progress) => {
                // 加载进度
                const percent = (progress.loaded / progress.total) * 100;
                console.log(`加载 ${type} 模型: ${percent.toFixed(2)}%`);
            },
            (error) => {
                console.error(`加载 ${type} 模型失败:`, error);
                // 如果加载失败，使用占位几何体
                const placeholder = this.createPlaceholder(type);
                this.models[type] = placeholder;
                if (onError) onError(error);
            }
        );
    }
    
    /**
     * 创建带纹理的物体（记忆之石平台）
     */
    createTexturedObject() {
        // 创建一个简单的纹理（可以使用 TextureLoader 加载外部纹理）
        const geometry = new THREE.BoxGeometry(3, 0.3, 3);
        
        // 如果没有外部纹理，创建一个程序化纹理
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // 绘制简单的抽象纹理（暗示记忆）
        const gradient = ctx.createLinearGradient(0, 0, 256, 256);
        gradient.addColorStop(0, '#ffb6c1');
        gradient.addColorStop(0.5, '#dda0dd');
        gradient.addColorStop(1, '#add8e6');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        // 添加一些图案
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * 256, Math.random() * 256, 20, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        
        const material = new THREE.MeshPhongMaterial({ 
            map: texture,
            transparent: true,
            opacity: 0.85
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 1.5, -5);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        
        this.scene.add(mesh);
        return mesh;
    }
    
    /**
     * 获取模型
     */
    getModel(type) {
        return this.models[type];
    }
    
    /**
     * 检查模型是否已加载
     */
    isModelLoaded(type) {
        return this.models[type] !== null;
    }
}


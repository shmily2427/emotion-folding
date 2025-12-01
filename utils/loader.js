/**
 * 模型加载工具模块
 * 负责加载 glTF 模型文件
 */

export class ModelLoader {
    constructor() {
        this.loader = null;
        this.initLoader();
    }
    
    /**
     * 初始化 GLTFLoader
     */
    initLoader() {
        // 等待 THREE 加载完成
        if (typeof THREE === 'undefined') {
            console.warn('THREE 未加载，模型加载功能可能不可用');
            return;
        }
        
        // 检查 GLTFLoader 是否可用
        if (THREE.GLTFLoader) {
            this.loader = new THREE.GLTFLoader();
        } else {
            console.warn('GLTFLoader 未找到，模型加载功能可能不可用');
            // 延迟重试（等待脚本加载）
            setTimeout(() => {
                if (THREE.GLTFLoader) {
                    this.loader = new THREE.GLTFLoader();
                    console.log('GLTFLoader 已加载');
                }
            }, 1000);
        }
    }
    
    /**
     * 加载 glTF 模型
     * @param {string} path - 模型文件路径
     * @param {Function} onLoad - 加载成功回调
     * @param {Function} onProgress - 加载进度回调
     * @param {Function} onError - 加载失败回调
     */
    load(path, onLoad, onProgress, onError) {
        if (!this.loader) {
            console.error('GLTFLoader 未初始化');
            if (onError) onError(new Error('GLTFLoader 未初始化'));
            return;
        }
        
        this.loader.load(
            path,
            (gltf) => {
                if (onLoad) onLoad(gltf);
            },
            (progress) => {
                if (onProgress) onProgress(progress);
            },
            (error) => {
                console.error('模型加载失败:', error);
                if (onError) onError(error);
            }
        );
    }
    
    /**
     * 获取 GLTFLoader 实例
     */
    getLoader() {
        return this.loader;
    }
}


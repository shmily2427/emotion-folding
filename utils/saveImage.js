/**
 * 场景图像输出工具模块
 * 负责将当前渲染场景保存为图像文件
 */

/**
 * 保存当前视图为 PNG 图像
 * @param {THREE.WebGLRenderer} renderer - Three.js 渲染器
 * @param {string} filename - 保存的文件名（可选，默认为时间戳）
 */
export function saveCurrentView(renderer, filename = null) {
    if (!renderer || !renderer.domElement) {
        console.error('渲染器或渲染器 DOM 元素不存在');
        return;
    }
    
    try {
        // 获取渲染画布的 Data URL
        const dataURL = renderer.domElement.toDataURL('image/png');
        
        // 生成文件名（如果没有提供）
        if (!filename) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            filename = `情境折影-${timestamp}.png`;
        }
        
        // 创建下载链接
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = filename;
        link.style.display = 'none';
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        
        // 清理
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);
        
        console.log(`场景已保存为: ${filename}`);
        return filename;
    } catch (error) {
        console.error('保存图像失败:', error);
        return null;
    }
}

/**
 * 保存当前视图为 JPEG 图像（可选功能）
 * @param {THREE.WebGLRenderer} renderer - Three.js 渲染器
 * @param {string} filename - 保存的文件名
 * @param {number} quality - JPEG 质量（0-1，默认 0.9）
 */
export function saveCurrentViewAsJPG(renderer, filename = null, quality = 0.9) {
    if (!renderer || !renderer.domElement) {
        console.error('渲染器或渲染器 DOM 元素不存在');
        return;
    }
    
    try {
        const dataURL = renderer.domElement.toDataURL('image/jpeg', quality);
        
        if (!filename) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            filename = `情境折影-${timestamp}.jpg`;
        }
        
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);
        
        console.log(`场景已保存为: ${filename}`);
        return filename;
    } catch (error) {
        console.error('保存图像失败:', error);
        return null;
    }
}


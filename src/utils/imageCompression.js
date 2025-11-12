/**
 * 图片压缩工具函数
 */

/**
 * 压缩图片文件
 * @param {File} file - 原始图片文件
 * @param {Object} options - 压缩选项
 * @param {number} options.maxWidth - 最大宽度 (默认: 400)
 * @param {number} options.maxHeight - 最大高度 (默认: 400)
 * @param {number} options.quality - 压缩质量 0-1 (默认: 0.8)
 * @param {number} options.maxSizeKB - 最大文件大小 KB (默认: 500)
 * @returns {Promise<string>} 压缩后的 base64 数据 URL
 */
export const compressImage = (file, options = {}) => {
  const {
    maxWidth = 400,
    maxHeight = 400,
    quality = 0.8,
    maxSizeKB = 500
  } = options

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      try {
        // 计算压缩后的尺寸
        let { width, height } = calculateCompressedDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight
        )

        // 设置 canvas 尺寸
        canvas.width = width
        canvas.height = height

        // 绘制压缩后的图片
        ctx.drawImage(img, 0, 0, width, height)

        // 转换为 base64
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality)

        // 如果文件仍然太大，降低质量重试
        let currentQuality = quality
        while (getBase64SizeKB(compressedDataUrl) > maxSizeKB && currentQuality > 0.1) {
          currentQuality -= 0.1
          compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality)
        }

        // 如果仍然太大，减小尺寸重试
        while (getBase64SizeKB(compressedDataUrl) > maxSizeKB && width > 100 && height > 100) {
          width = Math.floor(width * 0.9)
          height = Math.floor(height * 0.9)
          
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          compressedDataUrl = canvas.toDataURL('image/jpeg', Math.max(currentQuality, 0.3))
        }

        resolve(compressedDataUrl)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    // 创建图片 URL
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target.result
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    reader.readAsDataURL(file)
  })
}

/**
 * 计算压缩后的图片尺寸
 * @param {number} originalWidth - 原始宽度
 * @param {number} originalHeight - 原始高度
 * @param {number} maxWidth - 最大宽度
 * @param {number} maxHeight - 最大高度
 * @returns {Object} 压缩后的尺寸
 */
const calculateCompressedDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
  let width = originalWidth
  let height = originalHeight

  // 如果图片比最大尺寸小，直接返回原尺寸
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height }
  }

  // 计算缩放比例
  const widthRatio = maxWidth / width
  const heightRatio = maxHeight / height
  const ratio = Math.min(widthRatio, heightRatio)

  return {
    width: Math.floor(width * ratio),
    height: Math.floor(height * ratio)
  }
}

/**
 * 获取 base64 字符串的大小 (KB)
 * @param {string} base64String - base64 字符串
 * @returns {number} 大小 (KB)
 */
const getBase64SizeKB = (base64String) => {
  // base64 字符串长度 * 3/4 得到字节数，然后转换为 KB
  return (base64String.length * 3 / 4) / 1024
}

/**
 * 验证图片文件
 * @param {File} file - 图片文件
 * @param {Object} options - 验证选项
 * @param {number} options.maxSizeMB - 最大文件大小 MB (默认: 10)
 * @param {Array} options.allowedTypes - 允许的文件类型 (默认: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
 * @returns {Object} 验证结果
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSizeMB = 10,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  } = options

  const result = {
    valid: true,
    errors: []
  }

  // 检查文件类型
  if (!allowedTypes.includes(file.type)) {
    result.valid = false
    result.errors.push(`不支持的文件类型。支持的类型: ${allowedTypes.join(', ')}`)
  }

  // 检查文件大小
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    result.valid = false
    result.errors.push(`文件大小不能超过 ${maxSizeMB}MB`)
  }

  return result
}

/**
 * 获取图片文件信息
 * @param {File} file - 图片文件
 * @returns {Object} 文件信息
 */
export const getImageFileInfo = (file) => {
  return {
    name: file.name,
    size: file.size,
    sizeKB: Math.round(file.size / 1024),
    sizeMB: Math.round(file.size / (1024 * 1024) * 100) / 100,
    type: file.type,
    lastModified: file.lastModified
  }
}

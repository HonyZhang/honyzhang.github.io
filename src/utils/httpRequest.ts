interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    headers?: Record<string, string>
    body?: any
    params?: Record<string, any>
    timeout?: number
}

// 通用请求封装函数
export const httpRequest = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
    const {method = 'GET', headers = {}, body, params, timeout = 5000} = options

    // 如果是 GET 请求，并且有 params 参数，拼接到 URL 上
    if (method === 'GET' && params) {
        const queryString = new URLSearchParams(params).toString()
        url += `?${queryString}`
    }

    // 处理超时机制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const encodedUrl = import.meta.env.MODE === 'production' ? `https://api.allorigins.win/get?url=${encodeURIComponent(url)}` : url

    try {
        const response = await fetch(encodedUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: method !== 'GET' ? JSON.stringify(body) : null,
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // 处理生产和开发模式下不同的返回结果
        const data = await response.json()

        if (import.meta.env.MODE === 'production') {
            // 在生产模式下，需要解析 allorigins 的内容
            return JSON.parse(data.contents) as T
        } else {
            // 在开发模式下，直接返回原始 JSON
            return data as T
        }
    } catch (error) {
        console.error('请求失败:', error)
        throw error
    }
}

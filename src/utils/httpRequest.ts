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

    try {
        const response = await fetch(url, {
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

        return await response.json() as T // 使用泛型 <T> 强制转换返回值
    } catch (error) {
        console.error('请求失败:', error)
        throw error
    }
}

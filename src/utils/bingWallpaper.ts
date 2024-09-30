// 随机生成 idx 参数，用于请求不同日期的壁纸
const getRandomIdx = (): number => {
    // 随机生成过去 0 到 7 天的 idx 值，0 代表今天
    return Math.floor(Math.random() * 8)
}

// 获取 Bing 每日壁纸的函数
export const fetchBingWallpaper = async (): Promise<string | null> => {
    const randomIdx = getRandomIdx() // 每次获取不同的 idx 值
    try {
        const response = await fetch(`api/HPImageArchive.aspx?format=js&idx=${randomIdx}&n=1&mkt=zh-CN`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // 拼接完整的 URL
        const imageUrl = `https://www.bing.com${data.images[0].url}`
        return imageUrl
    } catch (error) {
        console.error('获取 Bing 壁纸失败:', error)
        return null
    }
}

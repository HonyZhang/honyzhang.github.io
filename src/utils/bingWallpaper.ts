export const fetchBingWallpaper = async (): Promise<string | null> => {
    const randomIdx = Math.floor(Math.random() * 8)

    // 通过环境变量获取 API 地址
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/HPImageArchive.aspx?format=js&idx=${randomIdx}&n=1&mkt=zh-CN`

    try {
        const response = await fetch(apiUrl)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return `https://www.bing.com${data.images[0].url}`
    } catch (error) {
        console.error('获取 Bing 壁纸失败:', error)
        return null
    }
}

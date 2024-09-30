import {getWallpaperData} from '@/api/wallpaperApi.ts'

export const getSingleWallpaper = async (): Promise<string | null> => {

    try {
        const response = await getWallpaperData()
        if (!response) {
            console.error('获取 Bing 壁纸数据失败')
            return null
        }
        return `${import.meta.env.VITE_WALLPAPER_API_URL}${response.images[0]?.url}` || null
    } catch (error) {
        console.error('获取 Bing 壁纸失败:', error)
        return null
    }
}

export const getWallpaperFromCache = async (): Promise<string | null> => {
    let wallpaperList: string[] = JSON.parse(localStorage.getItem('bingWallpaperList') || '[]')
    if (!wallpaperList || wallpaperList.length === 0) {
        try {
            const response = await getWallpaperData({n: 8})
            if (!response) {
                console.error('获取 Bing 壁纸数据失败')
                return null
            }
            console.log('获取 Bing 壁纸数据成功:', response)
            wallpaperList = response.images.map((item) => {
                return `${import.meta.env.VITE_WALLPAPER_API_URL}${item.url}`
            })
            localStorage.setItem('bingWallpaperList', JSON.stringify(wallpaperList))
        } catch (error) {
            console.error('获取 Bing 壁纸失败:', error)
            return null
        }
    }
    if (!wallpaperList || wallpaperList.length === 0) {
        return null
    }
    return wallpaperList[Math.floor(Math.random() * wallpaperList.length)]
}

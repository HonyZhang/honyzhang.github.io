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

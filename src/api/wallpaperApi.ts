import {httpRequest} from '@/utils/httpRequest'
import {BingWallpaperOptions, BingWallpaperResponse} from '@/api/types'

const BaseUrl = import.meta.env.VITE_WALLPAPER_API_URL

export const getWallpaperData = async (
    options: BingWallpaperOptions = {}
): Promise<BingWallpaperResponse | null> => {
    const defaultOptions = {
        format: 'js',
        idx: Math.floor(Math.random() * 8), // 默认随机获取过去 0 到 7 天的壁纸
        n: 1,
        mkt: 'zh-CN'
    }

    // 合并默认参数和传入的参数
    const requestParams = {...defaultOptions, ...options}

    try {
        // 使用 GET 请求获取壁纸数据
        return await httpRequest<BingWallpaperResponse>(`${BaseUrl}/HPImageArchive.aspx`, {
            method: 'GET',
            params: requestParams
        })
    } catch (error) {
        console.error('获取 Bing 壁纸失败:', error)
        return null
    }
}
export interface BingWallpaperOptions {
    format?: string
    idx?: number
    n?: number
    mkt?: string
}

// Bing API 返回的数据结构
interface BingImage {
    startdate: string
    fullstartdate: string
    enddate: string
    url: string
    urlbase: string
    copyright: string
    copyrightlink: string
    title: string
    quiz: string
    wp: boolean
    hsh: string
    drk: number
    top: number
    bot: number
    hs: Array<any>
}

interface BingTooltips {
    loading: string
    previous: string
    next: string
    walle: string
    walls: string
}

// 完整的 Bing API 响应接口
export interface BingWallpaperResponse {
    images: BingImage[]
    tooltips: BingTooltips
}
<template>
    <div class="right-container">
        <section class="right-container__about">
            <h1 class="right-container__profile-name">张翔</h1>
            <Card class="right-container__profile-infos">
                <div class="right-container__profile-info">
                    <i class="iconfont icon-xingbienan1"></i>
                    一个有点想法的前端攻城狮
                </div>
            </Card>
        </section>
        <section class="right-container__contacts">
            <Card class="right-container__contact" @click="jumpToGithub">
                <i class="iconfont icon-GitHub"></i>
                <div class="text">GitHub</div>
            </Card>
            <Card class="right-container__contact" @click="copyEmail">
                <i class="iconfont icon-email"></i>
                <div class="text">邮箱</div>
            </Card>
            <Card class="right-container__contact" @click="showWechat=true">
                <i class="iconfont icon-weixin"></i>
                <div class="text">微信</div>
            </Card>
            <el-dialog
                    v-model="showWechat"
                    width="500"
                    class="wechat-dialog"
            >
                <img class="wechat-img" src="/weixin.jpg"/>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button type="primary" @click="showWechat = false">
                            OK
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </section>

        <section class="right-container__projects-container">
            <div class="right-container__projects_title">个人项目</div>
            <div ref="projectsContainer" class="right-container__projects" @scroll="handleScroll">
                <div ref="projectsLeftArrow" class="right-container__projects-arrow left-arrow"
                     @click="scrollProjectsLeft">
                    <el-icon size="48px" color="white">
                        <DArrowLeft/>
                    </el-icon>
                </div>
                <Card v-for="project in projects" :key="project.name" class="right-container__project-item"
                      @click="jumpToProject(project.url)">
                    <div class="right-container__project-item-title">{{ project.name }}</div>
                    <div class="right-container__project-item-info">{{ project.desc }}</div>
                </Card>
                <div ref="projectsRightArrow" class="right-container__projects-arrow right-arrow"
                     @click="scrollProjectsRight">
                    <el-icon size="48px" color="white">
                        <DArrowRight/>
                    </el-icon>
                </div>
            </div>
        </section>

        <section class="right-container__blogs-container">
            <div class="right-container__blogs_title">技术博客</div>
            <Card ref="blogsContainer" class="right-container__blogs">
                <el-scrollbar>
                    <ul class="right-container__blogs-list">
                        <li v-for="(blog, index) in blogs" :key="index" class="right-container__blog-item"
                            @click="navigateToBlog(blog.componentName)">
                            <h3 class="right-container__blog-item-title">{{ blog.title }}</h3>
                            <p class="right-container__blog-item-summary">{{ blog.summary }}</p>
                            <span class="right-container__blog-item-date">{{ blog.date }}</span>
                        </li>
                    </ul>
                </el-scrollbar>
            </Card>
        </section>
    </div>
</template>
<script setup lang="ts">

import Card from '@/components/Card.vue'
import {ElMessage} from 'element-plus'
import {onMounted, onUnmounted, ref} from 'vue'
import {DArrowLeft, DArrowRight} from '@element-plus/icons-vue'
import {useRouter} from 'vue-router'

defineOptions({name: 'RightContainer'})

const projects = [
    {
        name: 'Hony UI',
        desc: '使用vue3.0开发的一套高质量的UI组件库',
        url: 'https://github.com/HonyZhang/hony-ui'
    },
    {
        name: 'vue-element-admin',
        desc: '基于vue3.0和element-plus的后台管理系统模板',
        url: 'https://github.com/HonyZhang/vue-element-admin'
    },
    {
        name: 'vue-admin-template',
        desc: '基于vue3.0和element-plus的后台管理系统模板',
        url: 'https://github.com/HonyZhang/vue-admin-template'
    },
    {
        name: 'vue-element-admin',
        desc: '基于vue3.0和element-plus的后台管理系统模板',
        url: 'https://github.com/HonyZhang/vue-admin-template'
    },
    {
        name: 'vue-admin-template',
        desc: '基于vue3.0和element-plus的后台管理系统模板',
        url: 'https://github.com/HonyZhang/vue-admin-template'
    },
    {
        name: 'vue-element-admin',
        desc: '基于vue3.0和element-plus的后台管理系统模板',
        url: 'https://github.com/HonyZhang/vue-admin-template'
    }
]
const blogs = [
    {
        title: 'UI组件库Hony UI结构搭建',
        summary: '使用vue3.0和vite, 从0到1搭建一个高质量的UI组件库',
        date: '2024-10-10',
        componentName: 'CreateUILib'
    },
    {
        title: 'Vue3组件库全局注册时类型声明',
        summary: 'Vue3组件库全局注册后，功能正常，但是缺少全局类型声明，导致代码提示不友好，本文介绍如何在全局注册时添加类型声明',
        date: '2024-10-11',
        componentName: 'LibGlobalTypeError'
    },
    {
        title: 'Vue3组件库本地调试最佳实践',
        summary: '组件库在开发过程中，需要本地调试，本文介绍如何在本地调试时，使用最佳实践',
        date: '2024-10-11',
        componentName: 'LibDev'
    },
    {
        title: 'HONY UI 组件库新增横向滚动组件HonyHorizontalScroll',
        summary: '新增组件，实现横向滚动效果',
        date: '2024-10-12',
        componentName: 'HorizontalScroll'
    },
    {
        title: '组件库的按需导入',
        summary: '参考element-plus的按需导入方案，实现组件库的按需导入',
        date: '2024-10-30',
        componentName: 'LibImport'
    },
    {
        title: '同时支持全局注册和自动按需导入的解决方案',
        summary: '组件库同时支持全局注册和自动按需导入的解决方案',
        date: '2024-10-30',
        componentName: 'TypeScriptForImport'
    },
    {
        title: '自定义打包',
        summary: '使用gulp对组件库进行自定义打包，实现更加丰富的功能',
        date: '2024-11-20',
        componentName: 'GulpBuild'
    },
    {
        title: 'Vue3.0+Element-Plus 后台管理系统模板',
        summary: '基于vue3.0和element-plus的后台管理系统模板',
        date: '2021-11-25',
        url: 'https://github.com/HonyZhang/vue-admin-template'
    },
    {
        title: 'Vue3.0+Element-Plus 后台管理系统模板',
        summary: '基于vue3.0和element-plus的后台管理系统模板',
        date: '2021-11-25',
        url: 'https://github.com/HonyZhang/vue-admin-template'
    },
    {
        title: 'Vue3.0+Element-Plus 后台管理系统模板',
        summary: '基于vue3.0和element-plus的后台管理系统模板',
        date: '2021-11-25',
        url: 'https://github.com/HonyZhang/vue-admin-template'
    },
    {
        title: 'Vue3.0+Element-Plus 后台管理系统模板',
        summary: '基于vue3.0和element-plus的后台管理系统模板',
        date: '2021-11-25',
        url: 'https://github.com/HonyZhang/vue-admin-template'
    }
]
const projectsContainer = ref<HTMLElement | null>(null);
const projectsLeftArrow = ref<HTMLElement | null>(null);
const projectsRightArrow = ref<HTMLElement | null>(null);
const router = useRouter();

const jumpToGithub = () => {
    window.open('https://github.com/HonyZhang')
}

const copyEmail = () => {
    const email = '1946525733@qq.com'
    const input = document.createElement('input')
    input.value = email
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    ElMessage({
        message: '邮箱已复制到粘贴板',
        type: 'success'
    })
}

const showWechat = ref(false)

const jumpToProject = (url: string) => {
    window.open(url)
}

// 检查是否需要显示箭头的逻辑
const updateArrowsVisibility = () => {
    if (projectsContainer.value) {
        const canScroll = projectsContainer.value.scrollWidth > projectsContainer.value.clientWidth;

        if (canScroll) {
            // 如果可以滚动，显示左右箭头
            if (projectsLeftArrow.value) projectsLeftArrow.value.style.display = 'block';
            if (projectsRightArrow.value) projectsRightArrow.value.style.display = 'block';
        } else {
            // 如果不需要滚动，隐藏左右箭头
            if (projectsLeftArrow.value) projectsLeftArrow.value.style.display = 'none';
            if (projectsRightArrow.value) projectsRightArrow.value.style.display = 'none';
        }
    }
};

const navigateToBlog = (componentName: string = 'NotFound') => {
    router.push({name: 'Blogs', params: {componentName}})
}

// 处理滚动时箭头的显示和隐藏
const handleScroll = () => {
    if (projectsContainer.value && projectsLeftArrow.value && projectsRightArrow.value) {
        const maxScrollLeft = projectsContainer.value.scrollWidth - projectsContainer.value.clientWidth;

        // 如果滚动到了最左边，隐藏左箭头
        if (projectsContainer.value.scrollLeft <= 0) {
            projectsLeftArrow.value.style.display = 'none';
        } else {
            projectsLeftArrow.value.style.display = 'block';
        }

        // 如果滚动到了最右边，隐藏右箭头
        if (projectsContainer.value.scrollLeft >= maxScrollLeft) {
            projectsRightArrow.value.style.display = 'none';
        } else {
            projectsRightArrow.value.style.display = 'block';
        }
    }
};

// 点击左箭头进行横向左滚动
const scrollProjectsLeft = () => {
    if (projectsContainer.value) {
        projectsContainer.value.scrollBy({left: -272, behavior: 'smooth'});
    }
};

// 点击右箭头进行横向右滚动
const scrollProjectsRight = () => {
    if (projectsContainer.value) {
        projectsContainer.value.scrollBy({left: 272, behavior: 'smooth'});
    }
};

// 鼠标滚轮控制横向滚动
const handleWheel = (event: WheelEvent) => {
    event.preventDefault(); // 阻止默认的纵向滚动
    if (projectsContainer.value) {
        // 将滚动增量应用于 scrollLeft，确保类型安全
        const scrollAmount = Math.sign(event.deltaY) * 60; // 自定义滚动速度
        projectsContainer.value.scrollLeft += scrollAmount;
    }
};


// 在组件挂载时初始化箭头状态
onMounted(() => {
    updateArrowsVisibility();

    if (projectsContainer.value) {
        projectsContainer.value.addEventListener('wheel', handleWheel); // 绑定滚轮事件
    }

    // 监听窗口大小变化，重新计算是否需要显示箭头
    window.addEventListener('resize', updateArrowsVisibility);
});

// 清除监听器，防止内存泄漏
onUnmounted(() => {
    if (projectsContainer.value) {
        projectsContainer.value.removeEventListener('wheel', handleWheel); // 移除滚轮事件
    }
    window.removeEventListener('resize', updateArrowsVisibility);
});
</script>
<style lang="scss" scoped>
.right-container {
  width: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  margin: 1rem;

  &__about {
    display: flex;
    align-items: flex-end;
  }

  &__profile-name {
    font-size: 3rem;
    color: rgb(238, 238, 238);
    margin: 0;
    padding: 0;
    line-height: 80px;
  }

  &__profile-infos {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-size: 16px;
    color: rgb(238, 238, 238);
    height: 40px;
    padding: 0 1rem;
    margin: 0 0 1rem 1rem;
  }

  &__profile-info {
    display: flex;
    align-items: center;
    line-height: 30px;
    height: 40px;

    .iconfont {
      margin-right: 0.5rem;
      font-size: 20px;
      color: rgb(238, 238, 238);
    }
  }

  &__contacts {
    display: flex;

    :deep(.wechat-dialog .el-dialog__body) {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 200px;
      }
    }
  }

  &__contact {
    display: flex;
    align-items: center;
    margin-right: 1rem;
    font-size: 16px;
    cursor: pointer;
    padding: 0.5rem;

    .iconfont {
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease-in-out;
    }

    .text {
      display: none;
    }

    &:hover {
      .iconfont {
        margin-right: 1rem;
      }

      .text {
        display: flex;
      }
    }
  }

  &__projects-container {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    position: relative;

    :deep(.el-scrollbar__thumb) {
      background: #fff;
    }
  }

  &__projects_title {
    font-size: 20px;
    color: rgb(238, 238, 238);
  }

  &__projects {
    display: flex;
    overflow-x: scroll;
    overflow-y: hidden;
    scrollbar-width: none; /* 对 Firefox 有效，隐藏滚动条 */

    &::-webkit-scrollbar {
      display: none; /* 对 Chrome、Safari 有效，隐藏滚动条 */
    }

    margin: 0 2rem;
  }

  &__projects-arrow {
    position: absolute;
    top: calc(50% + 1rem);
    transform: translateY(-50%);
    font-size: 1rem;
    color: #333;
    cursor: pointer;
    z-index: 10;
    display: none; /* 默认不显示 */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease; /* 添加平滑的缩放过渡效果 */

    /* 添加闪烁动画 */
    @keyframes blink {
      0% {
        opacity: 0.5;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.5;
      }
    }

    &.left-arrow {
      left: -1rem;
      animation: blink 1.5s infinite; /* 1.5秒的闪烁动画 */
    }

    /* 当鼠标悬停时，箭头放大 */
    &:hover {
      transform: translateY(-50%) scale(1.2); /* 鼠标悬停时，放大1.2倍 */
    }

    &.right-arrow {
      right: -1rem;
      animation: blink 1.5s infinite; /* 1.5秒的闪烁动画 */
    }
  }

  &__project-item {
    height: 100px;
    flex: 0 0 240px;
    display: flex;
    flex-direction: column;
    margin: 0.5rem;
    cursor: pointer;
  }

  &__project-item-title {
    font-size: 18px;
    color: rgb(238, 238, 238);
    margin-bottom: 0.5rem;
  }

  &__project-item-info {
    flex: 0;
    font-size: 14px;
    color: rgb(238, 238, 238);
    margin-bottom: 0.5rem;
  }

  &__blogs-container {
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
    overflow: hidden;
  }

  &__blogs_title {
    font-size: 20px;
    color: rgb(238, 238, 238);
  }

  &__blogs {
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;
    overflow: hidden;

    :deep(.el-scrollbar__thumb) {
      background-color: #fff;
      opacity: 0.5;
    }
  }

  &__blogs-list {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__blog-item {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0 0 0.5rem;
    cursor: pointer;

    &:not(:last-child) {
      border-bottom: 1px solid rgb(238, 238, 238);
    }

    &-title {
      margin: 8px 0;
      font-size: 16px;
    }

    &-summary {
      margin: 0 0 4px 0;
      font-size: 14px;
    }


  }
}
</style>

<template>
    <div class="right-container">
        <h1 class="right-container__profile-name">张翔</h1>
        <Card class="right-container__profile-infos">
            <div class="right-container__profile-info">
                <i class="iconfont icon-xingbienan1"></i>
                前端开发工程师
            </div>
            <div class="right-container__profile-info">
                <i class="iconfont icon-miaoshu"></i>
                一个有点想法的攻城狮
            </div>
        </Card>
        <div class="right-container__contacts">
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
        </div>

        <div class="right-container__projects-container">
            <div class="right-container__projects_title">个人项目</div>
            <el-scrollbar>
                <div class="right-container__projects">
                    <Card v-for="project in projects" :key="project.name" class="right-container__project-item">
                        <div class="right-container__project-item-title">{{ project.name }}</div>
                        <div class="right-container__project-item-info">{{ project.desc }}</div>
                    </Card>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>
<script setup lang="ts">

import Card from '@/components/Card.vue'
import {ElMessage} from 'element-plus'
import {ref} from 'vue'

defineOptions({name: 'RightContainer'})

const projects = [
    {
        name: 'vue-admin-template',
        desc: '基于vue3.0和element-plus的后台管理系统模板'
    },
    {
        name: 'vue-element-admin',
        desc: '基于vue3.0和element-plus的后台管理系统模板'
    },
    {
        name: 'vue-admin-template',
        desc: '基于vue3.0和element-plus的后台管理系统模板'
    },
    {
        name: 'vue-element-admin',
        desc: '基于vue3.0和element-plus的后台管理系统模板'
    },
    {
        name: 'vue-admin-template',
        desc: '基于vue3.0和element-plus的后台管理系统模板'
    },
    {
        name: 'vue-element-admin',
        desc: '基于vue3.0和element-plus的后台管理系统模板'
    }
]

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
</script>
<style lang="scss" scoped>
.right-container {
  width: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  margin: 1rem;

  &__profile-name {
    font-size: 4rem;
    color: rgb(238, 238, 238);
  }

  &__profile-infos {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-size: 18px;
    color: rgb(238, 238, 238);
  }

  &__profile-info {
    display: flex;
    align-items: center;

    .iconfont {
      margin-right: 1rem;
      font-size: 24px;
      color: rgb(238, 238, 238);
    }
  }

  &__contacts {
    display: flex;
    margin-top: 1rem;

    :deep(.wechat-dialog .el-dialog__body) {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 400px;
      }
    }
  }

  &__contact {
    display: flex;
    align-items: center;
    margin-right: 1rem;
    font-size: 18px;
    cursor: pointer;

    .iconfont {
      font-size: 28px;
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

    :deep(.el-scrollbar__thumb){
      background: #000;
    }
  }

  &__projects_title {
    font-size: 24px;
    color: rgb(238, 238, 238);
    margin-bottom: 1rem;
  }

  &__projects {
    display: flex;
  }

  &__project-item {
    flex: 0 0 240px;
    display: flex;
    flex-direction: column;
    margin: 1rem;
  }
}
</style>

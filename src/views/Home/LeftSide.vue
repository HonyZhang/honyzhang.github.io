<template>
    <el-scrollbar ref="leftSideRef" class="left-side">
        <div class="left-side__profile-avatar">
            <Avatar :src="avatarSrc"></Avatar>
        </div>
        <Card class="left-side__profile-infos">
            <div class="left-side__profile-info">
                <i class="left-side__profile-info-icon iconfont icon-nianling"></i>
                29岁
            </div>
            <div class="left-side__profile-info">
                <el-icon :size="20" class="left-side__profile-info-icon">
                    <LocationInformation/>
                </el-icon>
                四川省成都市
            </div>
        </Card>
        <Card class="left-side__work-experiences">
            <el-timeline size="large">
                <el-timeline-item
                        v-for="activity in activities"
                        :key="activity.timestamp"
                        :timestamp="activity.timestamp"
                        :type="activity.type"
                >
                    <div class="left-side__work-experiences-item-content">{{ activity.content }}</div>
                </el-timeline-item>
            </el-timeline>
        </Card>
        <Card class="left-side__work-skills">
            <div class="left-side__work-skills-title">技能</div>
            <div class="left-side__work-skills-tags">
                <el-tooltip
                        v-for="skillTag in skillTags"
                        effect="light"
                        :content="skillTag.name"
                >
                    <i :class="`iconfont ${skillTag.icon}`"></i>
                </el-tooltip>
            </div>
        </Card>
    </el-scrollbar>
</template>
<script setup lang="ts">

import {ElIcon, ElScrollbar} from 'element-plus'
import Avatar from '@/components/Avatar.vue'
import Card from '@/components/Card.vue'
import {LocationInformation} from '@element-plus/icons-vue'
import {ref} from 'vue'

defineOptions({name: 'LeftSide'})

interface LeftSideProps {
    avatarSrc: string;
}

const activities = [
    {
        content: '邦辰信息科技有限公司',
        timestamp: '2024-08',
        type: 'primary'
    },
    {
        content: 'Share Creators',
        timestamp: '2024-04'
    },
    {
        content: '中兴通讯',
        timestamp: '2021-12'
    },
    {
        content: '招银网络科技有限公司',
        timestamp: '2018-06'
    },
    {
        content: '东北大学毕业',
        timestamp: '2017-07'
    }
]

const skillTags = [
    {
        name: 'HTML5',
        icon: 'icon-HTML'
    },
    {
        name: 'CSS',
        icon: 'icon-css'
    },
    {
        name: 'JasvaScript',
        icon: 'icon-JavaScript'
    },
    {
        name: 'TypeScript',
        icon: 'icon-typescript'
    },
    {
        name: 'Vue',
        icon: 'icon-Vue'
    },
    {
        name: 'ElementUI',
        icon: 'icon-ElementUI'
    },
    {
        name: 'element-plus',
        icon: 'icon-element-plus'
    },
    {
        name: 'WebPack',
        icon: 'icon-webpack'
    },
    {
        name: 'Webstorm',
        icon: 'icon-Webstorm'
    },
    {
        name: 'VsCode',
        icon: 'icon-vscode'
    }
]

const leftSideRef = ref<typeof ElScrollbar | null>(null);

defineProps<LeftSideProps>();

</script>
<style lang="scss" scoped>
.left-side {
  display: flex;
  flex: 0 0 260px;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 2rem 1rem;

  &__profile-avatar {
    margin: 0 auto;

    @include responsive-width((
            small: 120px,
            medium: 160px,
            large: 200px,
            xlarge: 200px
    ))
  }

  &__profile-infos {
    width: 100%;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
  }

  &__profile-info {
    display: flex;
    align-items: center;
    font-size: 16px;

    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }

  &__profile-info-icon {
    color: white;
    margin-right: 0.5rem;
  }

  &__profile-tags {
    margin-top: 1rem;
  }

  &__work-experiences {
    width: 100%;
    margin-top: 1rem;

    :deep(.el-timeline) {
      padding-left: 0;

      .el-timeline-item__timestamp {
        color: white;
        font-size: 14px;
      }
    }
  }

  &__work-experiences-item-content {
    font-size: 16px;
    font-weight: bold;
    color: white;
  }

  &__work-skills {
    width: 100%;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;

    &-title {
      font-size: 18px;
      font-weight: bold;
      color: white;
    }

    &-tags {
      margin-top: 1rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      justify-items: center;
      gap: 0.5rem;

      .iconfont {
        font-size: 30px;
        cursor: pointer;
      }
    }
  }
}
</style>

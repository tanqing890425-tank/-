import anxingrongCover from '../assets/projects/covers/anxingrong.webp'
import cheyouhuaCover from '../assets/projects/covers/cheyouhua.webp'
import meiwenCover from '../assets/projects/covers/meiwen.webp'
import taoleCover from '../assets/projects/covers/taole.webp'
import xichaichaiCover from '../assets/projects/covers/xichaichai.webp'
import { projects } from './portfolio'
import { withBasePath } from '../utils/siteUrl'

const covers = [anxingrongCover, cheyouhuaCover, meiwenCover, taoleCover, xichaichaiCover]

export const projectGallery = projects.map((project, index) => ({
  ...project,
  galleryId: `${project.id}-overview`,
  image: covers[index],
  detailHref: withBasePath(`/work/${project.id}`),
  alt: `${project.title}项目封面`,
}))

export const workProjectGallery = projectGallery

import { projects } from './portfolio'
import { stripBasePath } from '../utils/siteUrl'
import anxingrongHero from '../assets/projects/details/anxingrong.webp'
import cheyouhuaHero from '../assets/projects/details/cheyouhua.webp'
import meiwenHero from '../assets/projects/details/meiwen.webp'
import taoleHero from '../assets/projects/details/taole.webp'
import xichaichaiHero from '../assets/projects/details/xichaichai.webp'
import anxingrongContent1 from '../assets/projects/details/anxingrong/1.webp'
import anxingrongContent2 from '../assets/projects/details/anxingrong/2.webp'
import anxingrongContent3 from '../assets/projects/details/anxingrong/3.webp'
import anxingrongContent4 from '../assets/projects/details/anxingrong/4.webp'
import anxingrongContent5 from '../assets/projects/details/anxingrong/5.webp'
import anxingrongContent6 from '../assets/projects/details/anxingrong/6.webp'
import anxingrongContent7 from '../assets/projects/details/anxingrong/7.webp'
import anxingrongContent8 from '../assets/projects/details/anxingrong/8.webp'
import anxingrongContent9 from '../assets/projects/details/anxingrong/9.webp'
import cheyouhuaContent1 from '../assets/projects/details/cheyouhua/1.webp'
import cheyouhuaContent2 from '../assets/projects/details/cheyouhua/2.webp'
import cheyouhuaContent3 from '../assets/projects/details/cheyouhua/3.webp'
import cheyouhuaContent4 from '../assets/projects/details/cheyouhua/4.webp'
import cheyouhuaContent5 from '../assets/projects/details/cheyouhua/5.webp'
import cheyouhuaContent6 from '../assets/projects/details/cheyouhua/6.webp'
import meiwenContent1 from '../assets/projects/details/meiwen/1.webp'
import meiwenContent2 from '../assets/projects/details/meiwen/2.webp'
import meiwenContent3 from '../assets/projects/details/meiwen/3.webp'
import meiwenContent4 from '../assets/projects/details/meiwen/4.webp'
import meiwenContent5 from '../assets/projects/details/meiwen/5.webp'
import meiwenContent6 from '../assets/projects/details/meiwen/6.webp'
import meiwenContent7 from '../assets/projects/details/meiwen/7.webp'
import meiwenContent8 from '../assets/projects/details/meiwen/8.webp'
import meiwenContent9 from '../assets/projects/details/meiwen/9.webp'
import taoleContent1 from '../assets/projects/details/taole/1.webp'
import taoleContent2 from '../assets/projects/details/taole/2.webp'
import taoleContent3 from '../assets/projects/details/taole/3.webp'
import taoleContent4 from '../assets/projects/details/taole/4.webp'
import taoleContent5 from '../assets/projects/details/taole/5.webp'
import taoleContent6 from '../assets/projects/details/taole/6.webp'
import xichaichaiContent1 from '../assets/projects/details/xichaichai/1.webp'
import xichaichaiContent2 from '../assets/projects/details/xichaichai/2.webp'
import xichaichaiContent3 from '../assets/projects/details/xichaichai/3.webp'

const anxingrongImages = [
  { image: anxingrongContent1, alt: '安星融项目内容图 1', width: 4200, height: 5115 },
  { image: anxingrongContent2, alt: '安星融项目内容图 2', width: 4200, height: 4800 },
  { image: anxingrongContent3, alt: '安星融项目内容图 3', width: 4200, height: 3357 },
  { image: anxingrongContent4, alt: '安星融项目内容图 4', width: 4200, height: 6582 },
  { image: anxingrongContent5, alt: '安星融项目内容图 5', width: 4200, height: 9180 },
  { image: anxingrongContent6, alt: '安星融项目内容图 6', width: 4200, height: 3069 },
  { image: anxingrongContent7, alt: '安星融项目内容图 7', width: 4200, height: 6594 },
  { image: anxingrongContent8, alt: '安星融项目内容图 8', width: 4200, height: 3150 },
  { image: anxingrongContent9, alt: '安星融项目内容图 9', width: 4200, height: 1500 },
]

const cheyouhuaImages = [
  { image: cheyouhuaContent1, alt: '车友花项目内容图 1', width: 4200, height: 3207 },
  { image: cheyouhuaContent2, alt: '车友花项目内容图 2', width: 4200, height: 2667 },
  { image: cheyouhuaContent3, alt: '车友花项目内容图 3', width: 4200, height: 2991 },
  { image: cheyouhuaContent4, alt: '车友花项目内容图 4', width: 4200, height: 7110 },
  { image: cheyouhuaContent5, alt: '车友花项目内容图 5', width: 4200, height: 8502 },
  { image: cheyouhuaContent6, alt: '车友花项目内容图 6', width: 4200, height: 2274 },
]

const meiwenImages = [
  { image: meiwenContent1, alt: '魅纹项目内容图 1', width: 4200, height: 9975 },
  { image: meiwenContent2, alt: '魅纹项目内容图 2', width: 4200, height: 3243 },
  { image: meiwenContent3, alt: '魅纹项目内容图 3', width: 4200, height: 2364 },
  { image: meiwenContent4, alt: '魅纹项目内容图 4', width: 4200, height: 9279 },
  { image: meiwenContent5, alt: '魅纹项目内容图 5', width: 4200, height: 11136 },
  { image: meiwenContent6, alt: '魅纹项目内容图 6', width: 4200, height: 14892 },
  { image: meiwenContent7, alt: '魅纹项目内容图 7', width: 4200, height: 4650 },
  { image: meiwenContent8, alt: '魅纹项目内容图 8', width: 4200, height: 2148 },
  { image: meiwenContent9, alt: '魅纹项目内容图 9', width: 4200, height: 2220 },
]

const taoleImages = [
  { image: taoleContent1, alt: '桃乐项目内容图 1', width: 4200, height: 4620 },
  { image: taoleContent2, alt: '桃乐项目内容图 2', width: 4200, height: 4620 },
  { image: taoleContent3, alt: '桃乐项目内容图 3', width: 4200, height: 4614 },
  { image: taoleContent4, alt: '桃乐项目内容图 4', width: 4200, height: 9426 },
  { image: taoleContent5, alt: '桃乐项目内容图 5', width: 4200, height: 9639 },
  { image: taoleContent6, alt: '桃乐项目内容图 6', width: 4200, height: 1020 },
]

const xichaichaiImages = [
  { image: xichaichaiContent1, alt: '喜拆拆项目内容图 1', width: 4200, height: 3330 },
  { image: xichaichaiContent2, alt: '喜拆拆项目内容图 2', width: 4200, height: 10062 },
  { image: xichaichaiContent3, alt: '喜拆拆项目内容图 3', width: 4200, height: 11880 },
]

const detailMedia = {
  anxingrong: {
    cover: { image: anxingrongHero, alt: '安星融项目头图' },
    images: anxingrongImages,
  },
  cheyouhua: {
    cover: { image: cheyouhuaHero, alt: '车友花项目头图' },
    images: cheyouhuaImages,
  },
  meiwen: {
    cover: { image: meiwenHero, alt: '魅纹项目头图' },
    images: meiwenImages,
  },
  taole: {
    cover: { image: taoleHero, alt: '桃乐项目头图' },
    images: taoleImages,
  },
  xichaichai: {
    cover: { image: xichaichaiHero, alt: '喜拆拆项目头图' },
    images: xichaichaiImages,
  },
}

export const projectDetails = projects.map((project) => ({
  ...project,
  ...detailMedia[project.id],
}))

const legacyProjectIds = {
  finance: 'anxingrong',
  social: 'taole',
  commerce: 'xichaichai',
}

export function findProjectDetail(pathname, baseUrl = import.meta.env.BASE_URL) {
  const match = /^\/work\/([^/]+)(?:\/index\.html|\/)?$/.exec(stripBasePath(pathname, baseUrl))
  if (!match) return undefined

  const projectId = legacyProjectIds[match[1]] ?? match[1]
  return projectDetails.find((project) => project.id === projectId)
}

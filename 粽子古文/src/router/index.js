import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import TYindex from '@/pages/TYindex'
import MyMistakes from '@/pages/MyMistakes'
import ReadArticle from '@/pages/ReadArticle'
import ShangXi from '@/pages/ShangXi'
import Listen from '@/pages/Listen'
import Learn from '@/pages/Learn'
import Ceshi from '@/pages/Ceshi'
import BeforeLearn from '@/pages/BeforeLearn'
import Weekend from '@/pages/Weekend'
import Signup from '@/pages/Signup'
import Invite from '@/pages/SaleInvite'
import ThreeLevel from '@/pages/ThreeLevel'
import Purchase from '@/pages/Purchase'
import ToPingtuan from '@/pages/ToPingtuan'
import Pingtuan from '@/pages/Pingtuan'
import Laugh from '@/pages/Laugh'
import TabIndex from '@/pages/TabIndex'
import EditMine from '@/pages/EditMine'
import BottomNav from '@/components/BottomNav'
import AppHeader from '@/components/AppHeader'
import Exercise from '@/pages/Exercise'
import ExerciseForWeekend from '@/pages/ExerciseForWeekend'
import Share from '@/pages/Share'
import Daka from '@/pages/Daka'
import CalendarForM from '@/pages/CalendarForM'
import TythreeLevel from '@/pages/TythreeLevel'
import Guwen from '@/pages/Guwen'
import Sunday from '@/pages/Sunday'
import Resign from '@/pages/Resign'
import VipPurchase from '@/pages/VipPurchase'
import RelationShip from '@/pages/RelationShip'
import WithDraw from '@/pages/WithDraw'
import AddTeacher from '@/pages/AddTeacher'
import UserCenter from '@/pages/UserCenter'
import ExerciseForUs from '@/pages/ExerciseForUs'
import PurchaseChoose from '@/pages/PurchaseChoose'
import Introduce from '@/pages/Introduce'
import Rule from '@/pages/Rule'
import Compare from '@/pages/Compare'
import TYBeforeLearn from '@/pages/TYBeforeLearn'
import PurchaseChoose2 from '@/pages/PurchaseChoose2'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/ThreeLevel',
      name: 'ThreeLevel',
      component: ThreeLevel
    },
    {
      path: '/Laugh',
      name: 'Laugh',
      component: Laugh
    },
    {
      path: '/MyMistakes',
      name: 'MyMistakes',
      component: MyMistakes
    },
    {
      path: '/Listen',
      name: 'Listen',
      component: Listen
    },
    {
      path: '/Learn',
      name: 'Learn',
      component: Learn
    },
    {
      path: '/Purchase',
      name: 'Purchase',
      component: Purchase
    },
    {
      path: '/BeforeLearn',
      name: 'BeforeLearn',
      component: BeforeLearn
    },
    {
      path: '/Exercise',
      name: 'Exercise',
      component: Exercise
    },
    {
      path: '/Ceshi',
      name: 'Ceshi',
      component: Ceshi
    },
    {
      path: '/ExerciseForWeekend',
      name: 'ExerciseForWeekend',
      component: ExerciseForWeekend
    },
    {
      path: '/ReadArticle',
      name: 'ReadArticle',
      component: ReadArticle
    },
    {
      path: '/Share',
      name: 'Share',
      component: Share
    },
    {
      path: '/CalendarForM',
      name: 'CalendarForM',
      component: CalendarForM
    },
    {
      path: '/Daka',
      name: 'Daka',
      component: Daka
    },
    {
      path: '/ShangXi',
      name: 'ShangXi',
      component: ShangXi
    },
    {
      path: '/TYindex',
      name: 'TYindex',
      component: TYindex
    },
    {
      path: '/Signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/TythreeLevel',
      name: 'TythreeLevel',
      component: TythreeLevel
    },
    {
      path: '/Weekend',
      name: 'Weekend',
      component: Weekend
    },
    {
      path: '/TabIndex',
      name: 'TabIndex',
      component: TabIndex
    },
    {
      path: '/Guwen',
      name: 'Guwen',
      component: Guwen
    },
    {
      path: '/Sunday',
      name: 'Sunday',
      component: Sunday
    },
    {
      path: '/Resign',
      name: 'Resign',
      component: Resign
    },
    {
      path: '/Invite',
      name: 'Invite',
      component: Invite
    },
    {
      path: '/VipPurchase',
      name: 'VipPurchase',
      component: VipPurchase
    },
    {
      path: '/EditMine',
      name: 'EditMine',
      component: EditMine
    },
    {
      path: '/RelationShip',
      name: 'RelationShip',
      component: RelationShip
    },
    {
      path: '/WithDraw',
      name: 'WithDraw',
      component: WithDraw
    },
    {
      path: '/AddTeacher',
      name: 'AddTeacher',
      component: AddTeacher
    },
    {
      path: '/ToPingtuan',
      name: 'ToPingtuan',
      component: ToPingtuan
    },
    {
      path: '/Pingtuan',
      name: 'Pingtuan',
      component: Pingtuan
    },
    {
      path: '/UserCenter',
      name: 'UserCenter',
      component: UserCenter
    },
    {
      path: '/ExerciseForUs',
      name: 'ExerciseForUs',
      component: ExerciseForUs
    },
    {
      path: '/PurchaseChoose',
      name: 'PurchaseChoose',
      component: PurchaseChoose
    },
    {
      path: '/PurchaseChoose2',
      name: 'PurchaseChoose2',
      component: PurchaseChoose2
    },
    {
      path: '/Rule',
      name: 'Rule',
      component: Rule
    },
    {
      path: '/Introduce',
      name: 'Introduce',
      component: Introduce
    },
    {
      path: '/Compare',
      name: 'Compare',
      component: Compare
    },{
      path: '/TYBeforeLearn',
      name: 'TYBeforeLearn',
      component: TYBeforeLearn
    }
  ]
})

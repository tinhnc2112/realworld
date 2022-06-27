import YourFeed from '~/components/Layout/components/YourFeed';
import Home from '~/pages/Home';
import Login from '~/pages/login';
import Register from '~/pages/register';
import Profile from '~/components/Layout/components/Profile';
import Editor from '~/components/Layout/components/Editor';
import Setting from '~/components/Layout/components/Setting';
import Article from '~/components/Layout/components/Article';
import { account } from '~/components/common/common';

export const publicRoutes = [
   { path: '/', component: Home },
   { path: '/login', component: Login },
   { path: '/register', component: Register },
];

export const privateRoutes = [
   { path: '/your_feed', component: YourFeed },
   { path: `/profile`, component: Profile },
   { path: '/editor', component: Editor },
   { path: '/setting', component: Setting },
   { path: '/article', component: Article },
];

import {
    Users3IconStandard,
    PhoneControllerIconStandard,
    SettingsIconStandard,
    Icon2,
  } from '@/controller/common/icons';
  import Trophy from '@/controller/assets/trophy.png';
  import { HandleMobile, HandleTV } from './handle/handle';
import { DashboardMobile, DashboardTV } from './dashboard/dashboard';
import { InvitationMobile, InvitationTV } from './invitation/invitation';
import { UnlockMobile, UnlockTV } from './unlock/unlock';
import { SocialControllerMobile, SocialControllerTV } from './social-controller/social-controller';


  export const profilePageRight = [
    {
      Icon: PhoneControllerIconStandard,
      Label: 'Controller',
      Sub: '',
    },
    {
      Icon: Users3IconStandard,
      Label: 'Friends',
      Sub: <Icon2 />,
    },
    {
      Icon: Trophy,
      Label: 'Achievements',
      Sub: '5 / 12',
      isInteractive: true,
    },
    {
      Icon: SettingsIconStandard,
      Label: 'Setting',
      Sub: '',
    },
  ];


 export const Pages = {
    'create-handle-mobile': HandleMobile,
    'create-handle-tv': HandleTV,
    'finding-achievement-mobile': DashboardMobile,
    'finding-achievement-tv': DashboardTV,
    'friend-invitation-mobile': InvitationMobile,
    'friend-invitation-tv': InvitationTV,
    'unlocking-achievement-mobile': UnlockMobile,
    'unlocking-achievement-tv': UnlockTV,
    'social-on-controller-mobile': SocialControllerMobile,
    'social-on-controller-tv': SocialControllerTV,
  };
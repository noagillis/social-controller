import { inGameNavIcons } from '@/tv/common/icons';

import { HandleTV, HandleMobile } from './handle/handle';
import { DashboardTV, DashboardMobile } from './dashboard/dashboard';
import { InvitationMobile, InvitationTV } from './invitation/invitation';
import { UnlockMobile, UnlockTV } from './unlock/unlock';
import { SocialControllerMobile, SocialControllerTV } from './social-controller/social-controller';
import FIFAMainMenu from './social-controller/fifa-main-menu';

export const SUB_MENUS = [
  {
    label: 'Back',
    icon: inGameNavIcons.BackIconStandard,
    isActive: true,
  },
  {
    label: 'Profile',
    icon: inGameNavIcons.ProfileIcon,
  },
  {
    label: 'Friends',
    icon: inGameNavIcons.Users3IconStandard,
  },
  {
    label: 'Controllers',
    icon: inGameNavIcons.PhoneControllerIconStandard,
    isActive: true,
  },
  {
    label: 'Achievements',
    icon: inGameNavIcons.TrophyIconStandard,
    isActive: true,
  },
  {
    label: 'Notification',
    icon: inGameNavIcons.BellIconStandard,
  },
  {
    label: 'Settings',
    icon: inGameNavIcons.SettingsIconStandard,
  },
  {
    label: 'Exit',
    icon: inGameNavIcons.XIconStandard,
    isActive: true,
  },
];

export const Pages = {
  'create-handle-mobile': {
    component: HandleMobile,
    focus: ['game-dp', 'screen-scan', 'screen-scan-phone', ''],
  },
  'finding-achievement-mobile': {
    component: DashboardMobile,
    focus: ['in-game-mid', 'screen-pause', 'screen-pause-mobile'],
  },
  'friend-invitation-mobile': {
    component: InvitationMobile,
    focus: ['', 'screen-pause', 'screen-pause-mobile'],
  },
  'unlocking-achievement-mobile': {
    component: UnlockMobile,
    focus: ['', 'screen-pause', 'screen-pause-mobile'],
  },
  'create-handle-tv': {
    component: HandleTV,
    focus: ['game-dp', 'screen-scan', 'game-handle-save', ''],
  },

  'finding-achievement-tv': {
    component: DashboardTV,
    focus: ['in-game-mid', '', 'screen-pause', 'game-dp'],
  },

  'friend-invitation-tv': {
    component: InvitationTV,
    focus: ['', '', 'screen-pause', '', 'game-dp'],
  },

  'unlocking-achievement-tv': {
    component: UnlockTV,
    focus: ['', '', 'screen-pause', '', 'game-dp'],
  },

  'social-on-controller-mobile': {
    component: SocialControllerMobile,
    focus: ['fifa-landing', 'controller-connect-back'],
  },

  'social-on-controller-tv': {
    component: SocialControllerTV,
    focus: ['fifa-landing', 'controller-connect-back'],
  },

  'fifa-main-menu-mobile': {
    component: FIFAMainMenu,
    focus: ['fifa-main-menu'],
  },

  'fifa-main-menu-tv': {
    component: FIFAMainMenu,
    focus: ['fifa-main-menu'],
  },

};

export const pageIds = Object.keys(Pages);

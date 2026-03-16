const game_tab_ids = ['oxenfree', 'infernax', 'link', 'gone', 'three'];
const dp_img_ids = ['dp-1', 'dp-2-0', 'dp-2-1'];
const game_play_ids = ['game-start','game-1','game-2','game-3'];
const game_ed_ids = ['tv', 'mobile', 'how_tv', 'how_mobile'];
const flows_ids = [
  'screen-pause',
  'create-handle-input',
  'create-handle-mobile',
  'create-handle-qrcode',
  'invitation-toast-player',
  'dashboard-controllers',
  'mobile-achievements',
  'achievement-card-0',
  'achievement-card-1',
  'achievement-card-2',
  'achievement-card-3',
  'achievement-card-4',
  'achievement-card-unlocked',
];
const generateUrls = (path, ids, suffix) =>
  ids.map((id) => `${import.meta.env.BASE_URL}${path}/${id}${suffix}`);

export const images_games = [
  ...generateUrls('images/flows', flows_ids, '.png'),
  ...generateUrls('images/games-dp', dp_img_ids, '.png'),
  ...generateUrls('gameTab', game_tab_ids, '_billboard.png'),
  ...generateUrls('gameTabEd', game_ed_ids, '_boxart.png'),
  ...generateUrls('gameTabEd', game_ed_ids, '_card.png'),
  ...generateUrls('gameTab', game_tab_ids, '_uba.jpg'),
  ...generateUrls('gameTab', game_tab_ids, '_logo.png'),
  `${import.meta.env.BASE_URL}gameTab/oxenfree_billboard.png`,
];

const games_ed_video = [...generateUrls('videos', game_play_ids, '.mp4'), ...generateUrls('gameTabEd', game_ed_ids, '.mp4')]
export const video_games = games_ed_video;

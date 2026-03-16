//MVP Vars

const TOPNAV_MARGIN_H = 45;
const TOPNAV_MARGIN_V = 19;
const TOPNAV_HEIGHT = 56;

const HEADING_H = 35;
const HEADING_GAP = 8;
const HEADING_H_TOTAL = HEADING_H + HEADING_GAP;

const BOTTOM_INFO_H = 106; //
const BOTTOM_INFO_H_CW = 71;

const ROW_GAP = 35; //replaced by xd-settings
export const TITLE_GAP = 12; //title gaps

const CARDS = {
  l: {
    borderRadius: 20,
    height: 509,
    width: 1190,
  },
  m: {
    borderRadius: 16,
    height: 376,
    width: 232,
    width_open: 672,
  },
  cw: {
    borderRadius: 8,
    height: 195,
    width: 332,
  },
  game: {
    height: 376,
    width: 376,
    width_open: 672,
    borderRadius: 16,
  },
};

export const ROWS_MVP = {
  l: {
    rowComponent: 'RowL',
    cardStyle: CARDS.l,
    rowHeight: CARDS.l.height,
    headingH: 0,
    baseClass: 'mvp__row_l',
    size: 'l',
  },
  cw: {
    rowComponent: 'RowCW',
    cardStyle: CARDS.cw,
    rowHeight: CARDS.cw.height + BOTTOM_INFO_H_CW,
    headingH: HEADING_H_TOTAL,
    size: 'xs',
  },
  m: {
    rowComponent: 'RowM',
    cardStyle: CARDS.m,
    rowHeight: CARDS.m.height + BOTTOM_INFO_H,
    headingH: HEADING_H_TOTAL,
    size: 'm',
  },
  top10: {
    rowComponent: 'RowM',
    cardStyle: CARDS.m,
    rowHeight: CARDS.m.height + BOTTOM_INFO_H,
    headingH: HEADING_H_TOTAL,
    size: 'm',
  },
  game: {
    rowComponent: 'RowGameM',
    cardStyle: CARDS.game,
    rowHeight: CARDS.game.height + BOTTOM_INFO_H,
    headingH: HEADING_H_TOTAL,
    isBeta: true,
    size: 'm',
  },
};

export const GAME_DP_LAYOUT = [
  {
    rowIndex: 0,
    cardStyle: {
      borderRadius: 0,
      height: 575,
      width: 1190,
    },
    rowHeight: 575,
    headingH: 0,
    rowId: 'row_game_dp_l',
    rowComponent: 'GameDPRowL',
  },
  {
    rowIndex: 1,
    cardStyle: {
      borderRadius: 16,
      height: 290,
      width: 1190,
    },
    rowHeight: 290,
    headingH: 0,
    rowId: 'row_game_dp_meta',
    rowComponent: 'GameDPRowMeta',
  },
  {
    rowIndex: 2,
    ...ROWS_MVP.m,
    rowHeight: CARDS.m.height,
    rowId: 'row_game_dp_achievements',
    rowComponent: 'GamesRowAchievements',
  },
  {
    rowIndex: 3,
    cardStyle: {
      borderRadius: 16,
      height: 288,
      width: 840,
    },
    headingH: HEADING_H_TOTAL,
    rowHeight: 288,
    rowId: 'row_game_dp_update',
    rowComponent: 'GameDPRowUpdate',
  },
  {
    rowIndex: 4,
    ...ROWS_MVP.m,
    rowId: 'row_game_m_ed',
    rowComponent: 'GamesRowM',
  },
  {
    rowIndex: 5,
    ...ROWS_MVP.game,
    rowId: 'row_game_dp_square',
    rowComponent: 'GamesRowSquare',
  },
];

export const MVP_VARS = {
  '--gap': `${TITLE_GAP}px`,
  '--sectionGap': `${ROW_GAP}px`,
  '--navMarginH': `${TOPNAV_MARGIN_H}px`,
  '--navHeightTotal': `${TOPNAV_MARGIN_V * 2 + TOPNAV_HEIGHT}px`,
  '--headingH': `${HEADING_H}px`,
  '--headingBottom': `${HEADING_GAP}px`,
  '--bottomInfoH': `${BOTTOM_INFO_H}px`,
};

export const mapStyleM = (mediumHeight, mediumBorderRadius) => {
  return {
    height: mediumHeight,
    width: mediumHeight * (29 / 47),
    width_open: mediumHeight * (84 / 47),
    borderRadius: mediumBorderRadius,
  };
};

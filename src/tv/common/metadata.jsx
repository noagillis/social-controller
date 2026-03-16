import classNames from 'classnames';
import { useDataContext } from '@/contexts/data';
import { secondsToTime } from '@/tv/utils/math';

import './metadata.scss';

const MetaTagsGameEd = ({ titleObj }) => {
  return (
    <div className='metatags flex-col'>
      <p className='subtitle-heavy'>{titleObj?.title}</p>
      <p className='body-standard foreground-subtle'>
        {titleObj?.shortSynopsis}
      </p>
    </div>
  );
};

const MetaTagsGame = ({ titleObj }) => {
  const gameType =
    titleObj?.type === 'MobileGame' ? 'Mobile Game' : 'Game on TV';
  const gameGenre = titleObj?.genres?.[0] || 'Action';
  const gameCert = titleObj?.certificationRating || 'All Ages';

  return (
    <p className={`metatags body-small-heavy foreground`}>
      <span>{gameType}</span>
      <span>{gameGenre}</span>

      <MetaCert cert={gameCert} />
    </p>
  );
};

const MetaTags = ({ titleObj, className }) => {
  const { i18n } = useDataContext();
  const fontSize = className || 'white ';
  const type = titleObj?.type || 'Show';

  return (
    <p className={`${fontSize} metatags body-small-heavy foreground`}>
      <span>{titleObj?.genres?.[0]}</span>
      <span>{titleObj?.latestYear || '2023'}</span>

      {type === 'Show' ? (
        <span> {titleObj?.numSeasonsLabel} </span>
      ) : (
        <span> {secondsToTime(titleObj?.runtimeSec || 8294, i18n)} </span>
      )}

      {titleObj?.certificationRating && (
        <MetaCert cert={titleObj?.certificationRating} />
      )}
    </p>
  );
};

const MetaCert = ({ cert }) => {
  return <span className='meta meta__cert'>{cert}</span>;
};

const Synopsis = ({ className, titleObj }) => {
  return (
    <p
      className={classNames(
        'white-t70 body-standard meta__synopsis',
        className
      )}
    >
      {titleObj?.shortSynopsis || 'Synopsis'}
    </p>
  );
};

const Supplemental = ({ meta, tagline_backup }) => {
  const tagline = meta?.tagline || tagline_backup;

  return tagline ? <p className='meta__tagline'>{tagline}</p> : '';
};

export {
  MetaTags,
  MetaTagsGame,
  MetaTagsGameEd,
  Synopsis,
  Supplemental,
  MetaCert,
};

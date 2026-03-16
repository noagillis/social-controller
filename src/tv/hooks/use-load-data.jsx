import { useEffect, useState } from 'react';
import { prefetchImages, prefetchAssets } from '@netflix-internal/xd-utils';
import { images_games, video_games } from '@/tv/pages/page-asset-list';

export default function useLoadData() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [status, setStatus] = useState('');

  const fetchGameData = async () => {
    setStatus('Loading game data');
    setIsLoading(true);

    try {
      const _games = await fetch(`/jsons/gameTab.json`);
      const _lolomo = await fetch(`/jsons/gameTabLolomo.json`);

      const gameLolomos = await _lolomo.json();
      const gameTitles = await _games.json();

      await prefetchImages(images_games);
      prefetchAssets(video_games);

      setData({
        gameLolomos,
        gameTitles,
      });
    } catch (error) {
      setStatus(`Error fetching game data`);
      console.error('Error fetching game data:', error);
    } finally {
      console.log('fetched game data');
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  // Effect to handle completion of data loading
  useEffect(() => {
    setIsLoading(false);
  }, [data]);

  return { isLoading, data, status };
}

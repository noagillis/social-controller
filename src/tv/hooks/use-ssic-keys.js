import { useOnReceiveMessage } from './use-on-receive-message';
import { useSetFocus, useProcessKey } from '@please/lrud';


export default function useSSICKeys(key, callback) {
  const processKey = useProcessKey();
  const setFocus = useSetFocus();
  

  useOnReceiveMessage('buttonPress', (data) => {
    // console.log(data);
    if (data?.button === 'A') {
      processKey.select();
    } else if (data?.button === 'B') {
      processKey.back();
    } else if (data?.button === 'Right') {
      processKey.right();
    } else if (data?.button === 'Left') {
      processKey.left();
    } else if (data?.button === 'Up') {
      processKey.up();
    } else if (data?.button === 'Down') {
      processKey.down();
    } else if (data?.button === 'Submit') {
      setFocus('game-handle-save');
    }

    if (key && data?.button === key) {
      callback();
    }
  });


  useOnReceiveMessage('textInput', (data) => {
    if (key ==='textInput') {
      callback(data);
    }

  });
}
import { useState } from 'react';
import { useSSICKeys } from '../../hooks/use-ssic-keys';

export function ControllerConnectedScreen() {
  const [mostRecentAction, setMostRecentAction] = useState({
    type: '',
    data: null,
  });

  // We use this eventType to keep track of button presses and text inputs.
  // Note: there's nothing special about the event name "buttonPress".
  // It's just the name that we chose to use whenever a controller button is pressed.
  // Likewise, the `data` can be anything that you want to send over!

  useSSICKeys('all', (data) => {
    setMostRecentAction(data);
  });

  return (
    <div className="flex-col-center sidebarItem">
      <p className="heading--s">
        {mostRecentAction.data
          ? `${mostRecentAction.type}: ${mostRecentAction.data}`
          : `Waiting for action...`}
      </p>
    </div>
  );
}

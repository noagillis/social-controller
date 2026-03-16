import { useState, useEffect, useRef } from 'react';
import { useDataContext } from '@/contexts/data';

import {
  CircleCheckmarkIconSmall,
  RefreshIconStandard,
} from '../../common/icons';
import ButtonWrapper from '../../common/button-wrapper';
import ScreenWrapper from '../../common/screen-wrapper';
import SSICTopNav from '../../common/ssic-topnav';
import { useSendMessage } from '../../hooks/use-send-message';
import { useGetMessage } from '../../hooks/use-get-message';
import { generateRandomGameHandle } from '@/tv/utils/math';

import classNames from 'classnames';

export const InputModalMobile = () => {
  const { profileData, setProfileData } = useDataContext();

  const sendMessage = useSendMessage();

  useEffect(() => {
    sendMessage('textInput', { text: profileData });
  }, [sendMessage, profileData]);

  const handleInputChange = (e) => {
    setProfileData(e.target.value);
  };

  return (
    <ScreenWrapper>
      <SSICTopNav backAction='B' />
      <div className={`ssic-handle controller-screen__body`}>
        <div className='ssic-handle__content flex-col-center'>
          <p className='ssic-handle__title subheader-standard-heavy'>
            Create your game handle
          </p>

          <p className='ssic-handle__subtitle body-standard'>
            This unique name is how you will appear to others across Netflix
            games. You can change or edit your game handle anytime.
          </p>

          <div className='ssic-handle__input'>
            <label htmlFor='game-handle' className='caption'>
              Game Handle
            </label>
            <input
              type='text'
              id='game-handle'
              className='body-standard'
              value={profileData}
              onChange={handleInputChange}
              maxLength='15'
            />
            <ButtonWrapper
              onClick={() => setProfileData(generateRandomGameHandle())}
            >
              <RefreshIconStandard />
            </ButtonWrapper>
          </div>

          <p className='legal'>
            {profileData?.length > 0 && (
              <>
                <CircleCheckmarkIconSmall />
                Available
              </>
            )}
          </p>
          <ButtonWrapper className='button -primary full-width' action='A'>
            <p className='body-standard-heavy'>Save</p>
          </ButtonWrapper>
          <ButtonWrapper className='button -tertiary full-width'>
            <p className='body-standard-heavy'> Learn More</p>
          </ButtonWrapper>
        </div>
      </div>
    </ScreenWrapper>
  );
};

export const InputModalTV = () => {
  const { inputFocus } = useGetMessage();

  const { profileData, setProfileData } = useDataContext();
  const [isOnInput, setIsOnInput] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setIsOnInput(inputFocus);
  }, [inputFocus]);

  const sendMessage = useSendMessage();

  useEffect(() => {
    sendMessage('textInput', { text: profileData });
  }, [sendMessage]);

  const onCloseInput = () => {
    sendMessage('buttonPress', { button: 'Submit' });
  };

  const handleInputChange = (e) => {
    setProfileData(e.target.value);
    sendMessage('textInput', { text: e.target.value });
  };

  useEffect(() => {
    if (!inputRef.current) return;

    if (isOnInput) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  }, [isOnInput]);

  return (
    <div
      className={classNames(`ssic-handle -tv flex-center`, {
        isOnInput: isOnInput,
      })}
    >
      <div className='ssic-handle__content flex-col'>
        <div className='ssic-handle__bg screen' onClick={onCloseInput} />
        <p className='ssic-handle__title subheader-standard-heavy'>
          Create your game handle
        </p>
        <div className='ssic-handle__input'>
          <input
            ref={inputRef}
            type='text'
            id='game-handle'
            className='body-standard'
            value={profileData}
            onChange={handleInputChange}
            onBlur={onCloseInput}
            maxLength='15'
            autoFocus={true}
          />
        </div>
      </div>
    </div>
  );
};

import { ChevronLeftIconStandard, Logo } from './icons';
import ButtonWrapper from './button-wrapper';
import './ssic-topnav.scss';

const SSICTopNav = ({
  onBack = () => {},
  backAction = '',
  backLabel = '',
  children,
}) => {
  return (
    <div className='controller-screen__topnav'>
      <ButtonWrapper
        className='topnav-item -left'
        action={backAction}
        onClick={onBack}
      >
        <ChevronLeftIconStandard className='backIcon' />
        <span className='subheader-standard-heavy'>{backLabel}</span>
      </ButtonWrapper>
      <div className='topnav-item -center'>
        <Logo className='logo' />
      </div>
      <div className='topnav-item -right'>{children}</div>
    </div>
  );
};

export default SSICTopNav;

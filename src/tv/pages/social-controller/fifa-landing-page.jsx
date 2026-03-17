import { FocusNode } from '@please/lrud';

const fifaLandingImg = import.meta.env.BASE_URL + 'images/FIFA-landing-page.jpg';

export default function FIFALandingPage({ onNext, onBack }) {
  return (
    <FocusNode focusId={'fifa-landing'} onSelected={onNext} onBack={onBack}>
      <div className='fifa-landing-page'>
        <img
          src={fifaLandingImg}
          alt='FIFA Landing Page'
          className='fifa-landing-img'
        />
      </div>
    </FocusNode>
  );
}

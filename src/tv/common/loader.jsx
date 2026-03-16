import './loader.scss';

export default function Loader({ label }) {
  return (
    <div className={'loader'}>
      <img
        className='loader__spinner'
        src={import.meta.env.BASE_URL + 'images/loader.png'}
        alt='loader'
      />
      <p className='caption'>{label}</p>
    </div>
  );
}

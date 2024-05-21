import { Link } from 'react-router-dom';

function Header() {
  function ReturnHome() {
    return (
      <div className="m-8">
        <Link to={'/top'}>
          <img
            src="../src/images/Home.png"
            className="text-black w-[46.88px] h-[40.62]"
          />
        </Link>
      </div>
    );
  }

  return (
    <>
      <ReturnHome />
    </>
  );
}

export default Header;

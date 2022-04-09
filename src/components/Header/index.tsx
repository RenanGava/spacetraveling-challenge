import Link from 'next/link';
import style from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={style.container}>
      <div>
        <Link href="/">
          <a>
            <img src="./images/logo.svg" alt="" />
          </a>
        </Link>
      </div>
    </header>
  );
}

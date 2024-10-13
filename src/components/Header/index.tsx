import { useEffect, useState } from 'react';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

import Link from 'next/link';
import styles from './styles.module.scss';

export function Header() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const formattedDate = format(new Date(), 'EEEEEE, d MMMM', {
      locale: ptBR,
    });
    setCurrentDate(formattedDate);
  }, []);

  return (
    <header className={styles.headerConteiner}>
      <Link href='/'>
        <img src="/logo.svg" alt="Podcastr" />
      </Link>

      <p>O melhor para você ouvir, sempre!!</p>

      <span>{currentDate}</span>
    </header>
  );
}

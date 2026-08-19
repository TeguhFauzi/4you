import Link from 'next/link';
import styles from './ServiceCard.module.css';
interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}
export default function ServiceCard({ id, name, description, price, imageUrl }: ServiceCardProps) {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
  return (
    <Link href={`/layanan/${id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={name} className={styles.image} />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.iconBox}>
            <span className={styles.iconPlaceholder}>{name.charAt(0)}</span>
          </div>
          <h3 className={styles.title}>{name}</h3>
        </div>
        <p className={styles.description}>{description}</p>
        <p className={styles.price}>Mulai <span className={styles.priceHighlight}>{formattedPrice}</span></p>
      </div>
    </Link>
  );
}
